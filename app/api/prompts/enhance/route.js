import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

// ✅ Enhancement settings validator
function validateEnhancementSettings({ enhancementStyle, targetPlatform, enhancementLevel }) {
  const validStyles = ['professional', 'creative', 'photorealistic', 'artistic', 'minimal'];
  const validPlatforms = ['midjourney', 'dalle', 'stable-diffusion', 'leonardo', 'firefly', 'general'];
  const validLevels = ['light', 'moderate', 'heavy'];

  if (!validStyles.includes(enhancementStyle)) {
    throw new Error(`Invalid enhancement style: ${enhancementStyle}`);
  }

  if (!validPlatforms.includes(targetPlatform)) {
    throw new Error(`Invalid target platform: ${targetPlatform}`);
  }

  if (!validLevels.includes(enhancementLevel)) {
    throw new Error(`Invalid enhancement level: ${enhancementLevel}`);
  }
}

export async function POST(request) {
  try {
    console.log('API: Starting prompt enhancement...');

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid authentication token' }, { status: 401 });
    }

    const { subscription } = user;
    if (
      (subscription.plan === 'free' && subscription.promptsUsed >= subscription.promptsLimit) ||
      (subscription.plan !== 'lifetime' && subscription.promptsUsed >= subscription.promptsLimit)
    ) {
      return NextResponse.json(
        { success: false, message: 'Prompt limit reached. Please upgrade your plan.' },
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
      return NextResponse.json({ success: false, message: 'Original prompt is required' }, { status: 400 });
    }

    // ✅ Validate enhancement settings
    validateEnhancementSettings({
      enhancementStyle,
      targetPlatform,
      enhancementLevel
    });

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

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $inc: { 'subscription.promptsUsed': 1 },
        $set: { updatedAt: new Date() }
      }
    );

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
      { success: false, message: 'Failed to enhance prompt: ' + error.message },
      { status: 500 }
    );
  }
}

// 🔧 Enhance the prompt using AI
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

  const enhancedPrompt = await callAIForEnhancement(enhancementPrompt);
  return enhancedPrompt;
}

// 🔧 Build the AI enhancement prompt
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

// 🎯 Platform-specific instructions
function getPlatformInstructions(platform) {
  const instructions = {
    'midjourney': `- Use descriptive, natural language\n- Include art styles and artistic references\n- Add aspect ratios and quality parameters\n- Use comma-separated keywords effectively\n- Consider --v 6 parameter optimizations`,
    'dalle': `- Use clear, natural language descriptions\n- Focus on detailed visual descriptions\n- Avoid technical photography terms\n- Emphasize composition and scene details`,
    'stable-diffusion': `- Use detailed, technical descriptions\n- Include specific art styles and mediums\n- Add technical parameters and modifiers\n- Use parentheses for emphasis where needed`,
    'leonardo': `- Focus on character and scene descriptions\n- Include artistic styles and rendering techniques\n- Add mood and atmosphere descriptions`,
    'firefly': `- Use Adobe-style descriptive language\n- Focus on professional design elements\n- Include color palettes and design principles`,
    'general': `- Use versatile, platform-agnostic descriptions\n- Focus on universal visual elements\n- Include broadly compatible technical terms`
  };
  return instructions[platform] || instructions['general'];
}

// 🎨 Style-specific instructions
function getStyleInstructions(style) {
  const instructions = {
    'professional': `- Use business-appropriate, polished language\n- Include professional photography and design terms\n- Focus on clean, high-quality visual elements`,
    'creative': `- Use imaginative, artistic language\n- Include bold visual elements and creative concepts`,
    'photorealistic': `- Focus on camera and photography terminology\n- Include specific lens, lighting, and exposure details`,
    'artistic': `- Include traditional and digital art techniques\n- Add specific artistic mediums and styles`,
    'minimal': `- Use clean, simple language\n- Focus on essential visual elements only`
  };
  return instructions[style] || instructions['professional'];
}

// 📈 Level-specific instructions
function getLevelInstructions(level) {
  const instructions = {
    'light': `- Make subtle improvements to clarity and detail\n- Add 1-2 key descriptive elements`,
    'moderate': `- Add significant detail and professional terminology\n- Include 3-5 key enhancement elements`,
    'heavy': `- Completely transform into professional-grade prompt\n- Add extensive detail and technical specifications`
  };
  return instructions[level] || instructions['moderate'];
}

// 🤖 Call the AI (Azure OpenAI or OpenAI API)
async function callAIForEnhancement(enhancementPrompt) {
  const AZURE_CONFIG = {
    apiKey: process.env.AZURE_OPENAI_KEY,
    endpoint: process.env.AZURE_ENDPOINT,
    deploymentName: process.env.CHAT_DEPLOYMENT_NAME || 'gpt-4',
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
          content: 'You are an expert AI prompt engineer specializing in creating high-quality prompts for AI image generation.'
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
