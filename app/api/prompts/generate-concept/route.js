// app/api/prompts/generate-concept/route.js
import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    console.log('API: Starting concept prompt generation...');
    
    // Get token from Authorization header
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
        { success: false, message: 'Invalid authentication token' },
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

    const promptData = await request.json();
    console.log('API: Received prompt data:', promptData);

    const {
      concept,
      artStyle,
      mood,
      lighting,
      composition,
      colorScheme,
      promptTarget,
      language,
      detailLevel
    } = promptData;

    if (!concept || !concept.trim()) {
      return NextResponse.json(
        { success: false, message: 'Concept is required' },
        { status: 400 }
      );
    }

    // Create system prompt based on settings
    const systemPrompt = createSystemPrompt({
      artStyle,
      mood,
      lighting,
      composition,
      colorScheme,
      promptTarget,
      language,
      detailLevel
    });

    // Azure OpenAI Configuration
    const AZURE_CONFIG = {
      apiKey: process.env.AZURE_OPENAI_KEY,
      endpoint: process.env.AZURE_ENDPOINT,
      deploymentName: process.env.DEPLOYMENT_NAME,
      apiVersion: '2024-12-01-preview'
    };

    const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Create a detailed image generation prompt for this concept: "${concept}"`
      }
    ];

    console.log('API: Sending request to Azure OpenAI...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': AZURE_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: getMaxTokens(detailLevel),
        temperature: 0.8,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Azure error:', errorData);
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
      type: 'concept',
      concept: concept,
      settings: promptData,
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
    console.error('API: Concept prompt generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate prompt: ' + error.message 
      },
      { status: 500 }
    );
  }
}

function createSystemPrompt({
  artStyle,
  mood,
  lighting,
  composition,
  colorScheme,
  promptTarget,
  language,
  detailLevel
}) {
  const styleDescriptions = {
    realistic: "photorealistic, high quality, detailed",
    digital_art: "digital art, concept art, highly detailed",
    oil_painting: "oil painting, classical art style, painterly",
    watercolor: "watercolor painting, soft blended colors",
    anime: "anime style, Japanese animation, clean lines",
    cartoon: "cartoon illustration, stylized, colorful",
    concept_art: "concept art, professional illustration",
    surreal: "surreal art, dreamlike, imaginative"
  };

  const moodDescriptions = {
    neutral: "balanced mood",
    happy: "joyful, uplifting, cheerful atmosphere",
    mysterious: "mysterious, enigmatic, intriguing mood",
    dramatic: "dramatic, intense, powerful atmosphere",
    peaceful: "peaceful, serene, calming mood",
    energetic: "energetic, dynamic, vibrant atmosphere",
    melancholy: "melancholic, contemplative, subdued mood",
    epic: "epic, grand, awe-inspiring atmosphere"
  };

  const lightingDescriptions = {
    natural: "natural lighting, soft shadows",
    golden_hour: "golden hour lighting, warm glow",
    dramatic: "dramatic lighting, high contrast",
    soft: "soft diffused lighting",
    neon: "neon lighting, colorful glows",
    cinematic: "cinematic lighting, professional",
    studio: "studio lighting, well-lit",
    ambient: "ambient lighting, atmospheric"
  };

  const colorDescriptions = {
    vibrant: "vibrant colors, high saturation",
    muted: "muted colors, desaturated palette",
    monochrome: "monochromatic color scheme",
    warm: "warm color palette, reds oranges yellows",
    cool: "cool color palette, blues greens purples",
    pastel: "pastel colors, soft tones",
    dark: "dark color palette, rich deep colors",
    neon: "neon colors, electric bright tones"
  };

  const targetSpecific = {
    midjourney: "highly detailed, 8K resolution, award-winning photography style",
    dalle: "clear detailed description, photorealistic style",
    stable: "highly detailed, professional photography, intricate details",
    flux: "ultra-detailed, high-quality render, professional lighting",
    general: "high quality, detailed, professional"
  };

  const detailInstructions = {
    basic: "Create a concise, clear prompt focusing on the main elements.",
    medium: "Create a balanced prompt with good detail and artistic direction.",
    detailed: "Create a comprehensive prompt with rich details, technical specifications, and artistic elements.",
    ultra: "Create an extremely detailed prompt with specific technical details, camera settings, artistic techniques, and comprehensive visual descriptions."
  };

  return `You are an expert AI image prompt creator specializing in ${promptTarget.toUpperCase()} prompts. Create a detailed image generation prompt in ${language} language.

STYLE REQUIREMENTS:
- Art Style: ${styleDescriptions[artStyle] || artStyle}
- Mood: ${moodDescriptions[mood] || mood}  
- Lighting: ${lightingDescriptions[lighting] || lighting}
- Composition: ${composition} composition
- Colors: ${colorDescriptions[colorScheme] || colorScheme}

TECHNICAL REQUIREMENTS:
- Platform: ${promptTarget.toUpperCase()}
- Platform-specific elements: ${targetSpecific[promptTarget]}
- Detail level: ${detailInstructions[detailLevel]}

INSTRUCTIONS:
1. Start with the main subject/concept
2. Add detailed visual descriptions
3. Include the specified art style, mood, and lighting
4. Mention composition and color scheme
5. Add technical quality indicators
6. ${promptTarget === 'midjourney' ? 'End with aspect ratio and parameters if relevant' : ''}
7. Use ${language} language for the output
8. Make it optimized for ${promptTarget.toUpperCase()} AI model

The prompt should be comprehensive yet clear, focusing on visual elements that will produce the best results in ${promptTarget.toUpperCase()}.`;
}

function getMaxTokens(detailLevel) {
  switch (detailLevel) {
    case 'basic': return 150;
    case 'medium': return 300;
    case 'detailed': return 500;
    case 'ultra': return 800;
    default: return 300;
  }
}