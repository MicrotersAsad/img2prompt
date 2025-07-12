import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    console.log('API: Starting prompt enhancement...');

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

    const enhancementData = await request.json();
    console.log('API: Received enhancement data:', enhancementData);

    const {
      originalPrompt,
      enhancementStyle = 'professional',
      targetPlatform = 'midjourney',
      enhancementLevel = 'moderate',
      includeArtStyles = true,
      includeTechnicalParams = true,
      includeComposition = true,
      customKeywords = []
    } = enhancementData;

    if (!originalPrompt || !originalPrompt.trim()) {
      return NextResponse.json(
        { success: false, message: 'Original prompt is required' },
        { status: 400 }
      );
    }

    // Validate enhancement settings
    validateEnhancementSettings({
      enhancementStyle,
      targetPlatform,
      enhancementLevel
    });

    // Enhance the prompt using AI
    const enhancedPrompt = await enhancePromptWithAI({
      originalPrompt: originalPrompt.trim(),
      enhancementStyle,
      targetPlatform,
      enhancementLevel,
      includeArtStyles,
      includeTechnicalParams,
      includeComposition,
      customKeywords
    });

    // Update user's enhancement usage in the users collection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $inc: { 'subscription.promptsUsed': 1 }, // Increment the 'promptsUsed' by 1
        $set: { updatedAt: new Date() } // Update the last updated time
      }
    );

    console.log('API: Successfully updated user usage');

    // Return the enhanced prompt and updated usage
    return NextResponse.json({
      success: true,
      enhancedPrompt,
      usage: {
        used: subscription.promptsUsed + 1,
        limit: subscription.promptsLimit,
        plan: subscription.plan
      }
    });

  } catch (error) {
    console.error('API: Prompt enhancement error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to enhance prompt: ' + error.message 
      },
      { status: 500 }
    );
  }
}

// AI-powered prompt enhancement function
async function enhancePromptWithAI({
  originalPrompt,
  enhancementStyle,
  targetPlatform,
  enhancementLevel,
  includeArtStyles,
  includeTechnicalParams,
  includeComposition,
  customKeywords
}) {
  // Build the enhancement prompt based on settings
  const enhancementPrompt = buildEnhancementPrompt({
    originalPrompt,
    enhancementStyle,
    targetPlatform,
    enhancementLevel,
    includeArtStyles,
    includeTechnicalParams,
    includeComposition,
    customKeywords
  });

  // Use Azure OpenAI or OpenAI to enhance the prompt
  const enhancedPrompt = await callAIForEnhancement(enhancementPrompt);
  
  return enhancedPrompt;
}

// Build the AI enhancement prompt
function buildEnhancementPrompt({
  originalPrompt,
  enhancementStyle,
  targetPlatform,
  enhancementLevel,
  includeArtStyles,
  includeTechnicalParams,
  includeComposition,
  customKeywords
}) {
  const platformInstructions = getPlatformInstructions(targetPlatform);
  const styleInstructions = getStyleInstructions(enhancementStyle);
  const levelInstructions = getLevelInstructions(enhancementLevel);

  let enhancementPrompt = `You are an expert AI prompt engineer. Your task is to enhance the following basic prompt into a professional, detailed prompt that will generate better AI-generated images.

ORIGINAL PROMPT: "${originalPrompt}"

ENHANCEMENT REQUIREMENTS:
- Target Platform: ${targetPlatform}
- Enhancement Style: ${enhancementStyle}
- Enhancement Level: ${enhancementLevel}

PLATFORM-SPECIFIC INSTRUCTIONS:
${platformInstructions}

STYLE INSTRUCTIONS:
${styleInstructions}

LEVEL INSTRUCTIONS:
${levelInstructions}

ENHANCEMENT OPTIONS:`;

  if (includeArtStyles) {
    enhancementPrompt += `\n- Include relevant art styles, mediums, and artistic techniques`;
  }

  if (includeTechnicalParams) {
    enhancementPrompt += `\n- Include technical parameters like camera settings, lighting, composition`;
  }

  if (includeComposition) {
    enhancementPrompt += `\n- Include composition and framing suggestions`;
  }

  if (customKeywords.length > 0) {
    enhancementPrompt += `\n- Incorporate these custom keywords naturally: ${customKeywords.join(', ')}`;
  }

  enhancementPrompt += `

IMPORTANT RULES:
1. Maintain the core subject and concept of the original prompt
2. Make the enhanced prompt natural and readable
3. Don't use excessive technical jargon unless appropriate
4. Focus on visual elements that will improve the final image
5. Keep the enhanced prompt concise but detailed (aim for 2-4 sentences)

Please provide ONLY the enhanced prompt, no explanation or additional text:`;

  return enhancementPrompt;
}

// Platform-specific instructions
function getPlatformInstructions(platform) {
  const instructions = {
    'midjourney': `
- Use descriptive, natural language
- Include art styles and artistic references
- Add aspect ratios and quality parameters where appropriate
- Use comma-separated keywords effectively
- Consider --v 6 parameter optimizations`,

    'dalle': `
- Use clear, natural language descriptions
- Focus on detailed visual descriptions
- Avoid technical photography terms
- Emphasize composition and scene details
- Keep descriptions conversational but precise`,

    'stable-diffusion': `
- Use detailed, technical descriptions
- Include specific art styles and mediums
- Add technical parameters and modifiers
- Use parentheses for emphasis where needed
- Consider negative prompts implications`,

    'leonardo': `
- Focus on character and scene descriptions
- Include artistic styles and rendering techniques
- Add mood and atmosphere descriptions
- Consider model-specific optimizations
- Use detailed visual elements`,

    'firefly': `
- Use Adobe-style descriptive language
- Focus on professional design elements
- Include color palettes and design principles
- Add commercial and artistic styling
- Consider brand-safe enhancements`,

    'general': `
- Use versatile, platform-agnostic descriptions
- Focus on universal visual elements
- Include broadly compatible technical terms
- Maintain flexibility for different AI models
- Emphasize core visual concepts`
  };

  return instructions[platform] || instructions['general'];
}

// Style-specific instructions
function getStyleInstructions(style) {
  const instructions = {
    'professional': `
- Use business-appropriate, polished language
- Include professional photography and design terms
- Focus on clean, high-quality visual elements
- Add commercial-grade technical specifications`,

    'creative': `
- Use imaginative, artistic language
- Include bold visual elements and creative concepts
- Add unconventional artistic techniques
- Encourage experimental and unique approaches`,

    'photorealistic': `
- Focus on camera and photography terminology
- Include specific lens, lighting, and exposure details
- Add realistic textures and material descriptions
- Emphasize lifelike qualities and natural elements`,

    'artistic': `
- Include traditional and digital art techniques
- Add specific artistic mediums and styles
- Focus on color theory and composition principles
- Include art historical references where appropriate`,

    'minimal': `
- Use clean, simple language
- Focus on essential visual elements only
- Avoid excessive technical details
- Emphasize clarity and simplicity`
  };

  return instructions[style] || instructions['professional'];
}

// Level-specific instructions
function getLevelInstructions(level) {
  const instructions = {
    'light': `
- Make subtle improvements to clarity and detail
- Add 1-2 key descriptive elements
- Keep close to the original prompt structure
- Focus on essential enhancements only`,

    'moderate': `
- Add significant detail and professional terminology
- Include 3-5 key enhancement elements
- Balance original concept with new details
- Provide good enhancement without overwhelming`,

    'heavy': `
- Completely transform into professional-grade prompt
- Add extensive detail and technical specifications
- Include multiple enhancement categories
- Create comprehensive, detailed descriptions`
  };

  return instructions[level] || instructions['moderate'];
}

// Call AI service for enhancement
async function callAIForEnhancement(enhancementPrompt) {
  const AZURE_CONFIG = {
    apiKey: process.env.AZURE_OPENAI_KEY,
    endpoint: process.env.AZURE_ENDPOINT,
    deploymentName: process.env.CHAT_DEPLOYMENT_NAME || 'gpt-4', // Your GPT-4 deployment name
    apiVersion: '2024-02-01'
  };

  if (!AZURE_CONFIG.apiKey || !AZURE_CONFIG.endpoint) {
    throw new Error('Azure OpenAI configuration missing');
  }

  const url = `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': AZURE_CONFIG.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI prompt engineer specializing in creating high-quality prompts for AI image generation. You enhance basic prompts into professional, detailed instructions that produce better visual results.'
        },
        {
          role: 'user',
          content: enhancementPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Azure OpenAI error:', errorData);
    throw new Error(errorData.error?.message || `Azure API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
