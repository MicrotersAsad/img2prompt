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

    const { imageData } = await request.json();

    // Azure OpenAI Configuration
    const AZURE_CONFIG = {
      apiKey: process.env.AZURE_OPENAI_KEY,
      endpoint: process.env.AZURE_ENDPOINT,
      deploymentName: process.env.DEPLOYMENT_NAME,
      apiVersion: '2024-12-01-preview'
    };

    // Make request to Azure OpenAI
    const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`;

    const messages = [
      {
        role: "system",
        content: "You are an AI that analyzes images and creates detailed, creative prompts that could be used to generate similar images with AI image generation tools. Provide rich descriptions including style, composition, lighting, colors, mood, and technical details."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and create a detailed AI image generation prompt that captures its essence, style, composition, and all visual elements. Be specific about colors, lighting, mood, artistic style, and any notable details."
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
        max_tokens: 500,
        temperature: 0.7,
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
    console.error('Prompt generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}