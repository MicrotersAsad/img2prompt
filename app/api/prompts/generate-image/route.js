// app/api/images/generate-azure/route.js
import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
  try {
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

    const imageData = await request.json();
    console.log('API: Received image data:', imageData);

    const {
      prompt,
      size = '1024x1024',
      style = 'vivid',
      quality = 'standard',
      n = 1
    } = imageData;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate settings
    validateImageSettings(size, style, quality, n);

    // Generate images with Azure OpenAI DALL-E 3
    const generatedImages = await generateWithAzureDALLE(prompt, size, style, quality, n);

    // Update user's image usage without saving generation in DB
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $inc: { 'subscription.promptsUsed': generatedImages.length },
        $set: { updatedAt: new Date() }
      }
    );

    console.log('API: Successfully generated images:', generatedImages.length);

    return NextResponse.json({
      success: true,
      images: generatedImages,
      usage: {
        used: subscription.promptsUsed + generatedImages.length,
        limit: subscription.promptsLimit,
        plan: subscription.plan
      }
    });

  } catch (error) {
    console.error('API: Azure image generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate image: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// Azure OpenAI DALL-E 3 Image Generation
async function generateWithAzureDALLE(prompt, size, style, quality, n) {
  const AZURE_CONFIG = {
    apiKey: process.env.AZURE_OPENAI_KEY,
    endpoint: process.env.AZURE_ENDPOINT,
    deploymentName: process.env.DALLE_DEPLOYMENT_NAME || 'dall-e-3', // Your DALL-E 3 deployment name
    apiVersion: '2024-02-01' // API version for DALL-E
  };

  if (!AZURE_CONFIG.apiKey || !AZURE_CONFIG.endpoint) {
    throw new Error('Azure OpenAI configuration missing');
  }

  // Construct Azure OpenAI DALL-E endpoint
  const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/images/generations?api-version=${AZURE_CONFIG.apiVersion}`;

  const requestBody = {
    prompt: prompt,
    n: n,
    size: size,
    quality: quality,
    style: style
  };
  console.log(requestBody);

  console.log('Azure DALL-E 3 request:', {
    url: url.replace(AZURE_CONFIG.apiKey, '[REDACTED]'),
    body: requestBody
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_CONFIG.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Azure DALL-E 3 error:', errorData);
    throw new Error(errorData.error?.message || `Azure API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Azure DALL-E 3 response:', data);
  
  return data.data.map((image, index) => ({
    url: image.url,
    model: 'azure-dall-e-3',
    prompt: prompt,
    settings: { size, style, quality },
    index: index,
    revised_prompt: image.revised_prompt || prompt // DALL-E 3 often revises prompts
  }));
}

// Helper function to get image limits based on plan
function getImageLimit(plan) {
  switch (plan) {
    case 'free': return 5;
    case 'basic': return 50;
    case 'pro': return 200;
    case 'lifetime': return 999999;
    default: return 5;
  }
}

// Helper function to validate image settings for Azure DALL-E 3
function validateImageSettings(size, style, quality, n) {
  const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
  const validStyles = ['vivid', 'natural'];
  const validQualities = ['standard', 'hd'];

  if (!validSizes.includes(size)) {
    throw new Error(`Invalid size: ${size}. Valid sizes: ${validSizes.join(', ')}`);
  }

  if (!validStyles.includes(style)) {
    throw new Error(`Invalid style: ${style}. Valid styles: ${validStyles.join(', ')}`);
  }

  if (!validQualities.includes(quality)) {
    throw new Error(`Invalid quality: ${quality}. Valid qualities: ${validQualities.join(', ')}`);
  }

  if (n < 1 || n > 4) {
    throw new Error('Number of images must be between 1 and 4');
  }

  return true;
}
