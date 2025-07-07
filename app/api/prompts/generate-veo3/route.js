import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    // Get token from Authorization header (sent from frontend localStorage)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Check subscription limits
    const { subscription } = user;
    if (subscription.plan === 'free' && subscription.promptsUsed >= subscription.promptsLimit) {
      return NextResponse.json(
        { success: false, message: 'Free tier limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    if (subscription.plan !== 'lifetime' && subscription.promptsUsed >= subscription.promptsLimit) {
      return NextResponse.json(
        { success: false, message: 'Monthly limit reached. Please upgrade or wait for next billing cycle.' },
        { status: 403 }
      );
    }

    const { imageData, promptType } = await request.json();

    // Azure OpenAI Configuration
    const AZURE_CONFIG = {
      apiKey: process.env.AZURE_OPENAI_KEY,
      endpoint: process.env.AZURE_ENDPOINT,
      deploymentName: process.env.DEPLOYMENT_NAME,
      apiVersion: '2024-12-01-preview'
    };

    // Style-specific prompts for Veo3
    const stylePrompts = {
      cinematic: "Create a cinematic video prompt for Veo3 that captures dramatic lighting, camera movements, and film-like composition. Focus on storytelling elements, mood, and visual narrative.",
      documentary: "Generate a documentary-style video prompt for Veo3 with realistic, natural lighting and authentic human moments. Emphasize real-world settings and genuine emotions.",
      commercial: "Develop a commercial video prompt for Veo3 with professional lighting, clean composition, and product-focused cinematography. Include marketing-friendly visual elements.",
      artistic: "Create an artistic and experimental video prompt for Veo3 with creative camera angles, unique visual effects, and avant-garde aesthetics. Push creative boundaries.",
      animation: "Generate an animated video prompt for Veo3 with stylized visuals, smooth motion, and animation-specific techniques. Consider cartoon or 3D animation styles."
    };

    // Make request to Azure OpenAI
    const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`;

    const messages = [
      {
        role: "system",
        content: `You are an AI specialized in creating video prompts for Veo3, Google's advanced video generation model. ${stylePrompts[promptType]} Analyze the provided image and create a detailed video prompt that describes camera movements, lighting, timing, scene progression, and visual effects. Include specific technical details like shot types, transitions, and duration suggestions. Make the prompt optimized for Veo3's capabilities.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and create a detailed Veo3 video prompt in ${promptType} style. Include: 1) Scene description and setting, 2) Camera movements and angles, 3) Lighting and mood, 4) Action and motion details, 5) Duration and pacing, 6) Visual effects or transitions, 7) Audio/music suggestions. Make it specific and actionable for Veo3 video generation.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageData
            }
          }
        ]
      }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': AZURE_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 800,
        temperature: 0.8,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content;

    // Update user's prompt usage
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $inc: { 'subscription.promptsUsed': 1 },
        $set: { updatedAt: new Date() }
      }
    );

    // Save prompt to history
    await db.collection('prompts').insertOne({
      userId: user._id,
      prompt: generatedPrompt,
      type: 'veo3',
      style: promptType,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
      usage: {
        used: subscription.promptsUsed + 1,
        limit: subscription.promptsLimit,
        plan: subscription.plan
      }
    });

  } catch (error) {
    console.error('Veo3 prompt generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate Veo3 prompt' },
      { status: 500 }
    );
  }
}