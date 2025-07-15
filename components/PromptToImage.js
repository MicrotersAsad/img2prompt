"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Copy, Check, AlertCircle, Lock, Download, RefreshCw, Settings, Palette, X, Save, Sparkles, User, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // Import your useAuth hook
import Layout from './Layout';

const PromptToImageGenerator = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(null);

  // Settings
  const [imageSize, setImageSize] = useState('1024x1024');
  const [imageStyle, setImageStyle] = useState('vivid');
  const [quality, setQuality] = useState('standard');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [isCompact, setIsCompact] = useState(false);

  // Modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState(null);
  // Temporary settings for modal (only applied when saved)
  const [tempImageSize, setTempImageSize] = useState(imageSize);
  const [tempImageStyle, setTempImageStyle] = useState(imageStyle);
  const [tempQuality, setTempQuality] = useState(quality);
  const [tempNumberOfImages, setTempNumberOfImages] = useState(numberOfImages);

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || 
             localStorage.getItem('token') || 
             localStorage.getItem('authToken');
    }
    return null;
  };

  // Set usage from user data when user changes
  useEffect(() => {
    if (user?.subscription) {
      setUsage({
        used: user.subscription.promptsUsed || 0,
        limit: user.subscription.promptsLimit || 10,
        plan: user.subscription.plan || 'free'
      });
    }
  }, [user]);

  // Check if user has reached their limit
  const hasReachedLimit = () => {
    if (!user || !usage) return false;
    if (usage.plan === 'lifetime') return false;
    return usage.used >= usage.limit;
  };

  // Define image sizes
  const imageSizes = [
    // Square (1:1)
    { value: '1024x1024', label: '1024×1024 (Square)', ratio: '1:1', category: 'Square' },
    { value: '512x512', label: '512×512 (Small Square)', ratio: '1:1', category: 'Square' },
    
    // Landscape (16:9)
    { value: '1792x1024', label: '1792×1024 (Landscape)', ratio: '16:9', category: 'Landscape' },
    { value: '1344x768', label: '1344×768 (Medium Landscape)', ratio: '16:9', category: 'Landscape' },
    
    // Portrait (9:16)
    { value: '1024x1792', label: '1024×1792 (Portrait)', ratio: '9:16', category: 'Portrait' },
    { value: '768x1344', label: '768×1344 (Medium Portrait)', ratio: '9:16', category: 'Portrait' },
    
    // Classic (4:3)
    { value: '1152x896', label: '1152×896 (Classic)', ratio: '4:3', category: 'Classic' },
    { value: '896x1152', label: '896×1152 (Classic Portrait)', ratio: '4:3', category: 'Classic' },
    
    // Photo (3:2)
    { value: '1216x832', label: '1216×832 (Photo)', ratio: '3:2', category: 'Photo' },
    { value: '832x1216', label: '832×1216 (Photo Portrait)', ratio: '3:2', category: 'Photo' }
  ];

  // Define image styles
  const imageStyles = [
    { value: 'vivid', label: 'Vivid', description: 'Hyper-real and dramatic images' },
    { value: 'natural', label: 'Natural', description: 'More natural, less hyper-real images' }
  ];

  // Define quality options
  const qualityOptions = [
    { value: 'standard', label: 'Standard', description: 'Good quality, faster generation' },
    { value: 'hd', label: 'HD', description: 'Higher quality, slower generation' }
  ];

  const generateImage = async () => {
    if (!user) {
      setError('Please sign in to generate images');
      return;
    }

    if (hasReachedLimit()) {
      setError('You have reached your image generation limit. Please upgrade your plan.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please sign in again.');
        setIsGenerating(false);
        return;
      }

      console.log('Generating image with prompt:', prompt);

      const response = await fetch('/api/prompts/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size: imageSize,
          style: imageStyle,
          quality: quality,
          n: numberOfImages
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate image');
      }

      if (data.success) {
        setGeneratedImages(data.images);  // Store the images in state
        setSelectedImage(data.images[0]);  // Select the first generated image
        // Update local usage state
        setUsage(prev => ({
          ...prev,
          used: data.usage.used
        }));
      } else {
        setError(data.message || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
    // FAQ data
const faqs = [
  {
    question: 'What is the Prompt to Image Generator?',
    answer: 'It’s a tool that turns your written description into AI-generated images. Just enter a prompt, customize the style, and generate an image using platforms like Midjourney, DALL·E, or Stable Diffusion.'
  },
  {
    question: 'Do I need an account to use this tool?',
    answer: 'Yes, signing in is required to generate images. This lets us track your usage and apply your subscription limits appropriately.'
  },
  {
    question: 'What are the usage limits?',
    answer: 'Limits depend on your plan — Free, Pro, or Lifetime. Free users get a limited number of generations per month. Upgrade for more.'
  },
  {
    question: 'Can I use the tool with any image generation platform?',
    answer: 'Yes. The tool supports prompt formats for Midjourney, DALL·E, Stable Diffusion, Leonardo, Firefly, and more.'
  },
  {
    question: 'How do I get better image results?',
    answer: 'Use detailed prompts and experiment with styles like photorealistic or artistic. Try adding lighting, mood, or composition settings for improved results.'
  },
  {
    question: 'What happens when I reach my image generation limit?',
    answer: 'You’ll need to upgrade your plan or wait for your next billing cycle. Lifetime users enjoy unlimited generation access.'
  }
];

    const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
const openSettingsModal = () => {
  // Copy the current settings into temporary states
  setTempImageSize(imageSize);
  setTempImageStyle(imageStyle);
  setTempQuality(quality);
  setTempNumberOfImages(numberOfImages);
  setShowSettingsModal(true);
};

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `azure-generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download image');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
  };

  const regenerateImage = () => {
    if (prompt.trim()) {
      generateImage();
    }
  };
console.log(generateImage);

  // Get current settings summary for display
  const getSettingsSummary = () => {
    const selectedSize = imageSizes.find(size => size.value === imageSize);
    return {
      size: selectedSize?.label || imageSize,
      ratio: selectedSize?.ratio || '',
      style: imageStyles.find(s => s.value === imageStyle)?.label || imageStyle,
      quality: qualityOptions.find(q => q.value === quality)?.label || quality,
      number: numberOfImages
    };
  };

  const settings = getSettingsSummary();

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-semibold text-white mb-4 flex items-center justify-center gap-2 text-center">
    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" aria-hidden="true" />
    Prompt to Image Generator
  </h1>
          {/* Usage Display */}
          {user && usage && (
            <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-200 text-sm">
                    Images Generated: {usage.used} / {usage.limit}
                  </p>
                  <div className="w-48 bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        hasReachedLimit() 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ 
                        width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 text-sm capitalize">{usage.plan} Plan</p>
                  {hasReachedLimit() && (
                    <p className="text-red-400 text-xs">Limit Reached</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-2">Enter Your Prompt</h2>
              <p className="text-purple-200 text-sm mb-4">Describe the image you want to create</p>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A beautiful landscape with mountains and a lake at sunset, photorealistic, highly detailed..."
                  className="w-full h-32 p-4 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-all border border-white/20 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-purple-300" />
                        <span className="text-white">Copy</span>
                      </>
                    )}
                  </button>
                  {generatedImages.length > 0 && (
                    <button
                      onClick={regenerateImage}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all border border-blue-500/30 text-sm"
                    >
                      <RefreshCw className={`w-4 h-4 text-blue-300 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span className="text-blue-300">Regenerate</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all border border-purple-500/30 text-sm"
                  >
                    <Settings className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-300">Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim() || !user || hasReachedLimit()}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] ${
                isGenerating || !prompt.trim() || !user || hasReachedLimit()
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating with Azure DALL-E 3...
                </>
              ) : !user ? (
                <>
                  <Lock className="w-6 h-6" />
                  Please Sign In
                </>
              ) : hasReachedLimit() ? (
                <>
                  <AlertCircle className="w-6 h-6" />
                  Limit Reached
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Right Column - Generated Images */}
          {generatedImages.length > 0 && (
  <div className="space-y-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Generated Images</h2>
        {selectedImage && (
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all border border-green-500/30"
          >
            <Download className="w-4 h-4 text-green-300" />
            <span className="text-green-300">Download</span>
          </button>
        )}
      </div>

      {/* Display the selected image or first generated image if none selected */}
    <div className="bg-black/20 rounded-lg p-2 border border-white/10 mb-4">
  <div className="flex justify-center items-center">
    <img
      src={selectedImage ? selectedImage.url : generatedImages[0].url}
      alt="Generated Image"
      className="w-1/2 rounded-lg"
    />
  </div>
</div>


      {/* Image Thumbnails */}
      {generatedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {generatedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage?.url === image.url
                  ? 'border-purple-400'
                  : 'border-white/20 hover:border-purple-300'
              }`}
            >
              <img
                src={image.url}
                alt={`Generated ${index + 1}`}
                className="w-52 h-52 aspect-square object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      <div className="text-sm text-purple-200 bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
     
        <strong className="text-blue-300"> Size:</strong> {imageSize} |
        <strong className="text-blue-300"> Style:</strong> {imageStyle} |
        <strong className="text-blue-300"> Quality:</strong> {quality}
      </div>

      {usage && (
        <div className="text-sm text-purple-200 bg-green-500/20 p-3 rounded-lg border border-green-500/30">
          <strong className="text-green-300">Usage:</strong> {usage.used} of {usage.limit} images used ({usage.plan} plan)
        </div>
      )}
    </div>
  </div>
)}
    {/* How to Use Section */}
{/* How to Use Section */}
<div className="mb-10 mt-10">
  <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2 text-center">
    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" aria-hidden="true" />
    How to Use the Prompt to Image Generator
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Step 1 */}
    <div className="bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-5 h-5 text-purple-400 animate-bounce" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">Step 1: Sign In & Enter Prompt</h3>
      </div>
      <ol className="list-decimal list-inside space-y-3 text-purple-200 text-sm">
        <li>
          <span className="font-medium text-white">Sign In</span>: Log in or register to access the tool.
        </li>
        <li>
          <span className="font-medium text-white">Enter a Prompt</span>: Describe the image you want to generate (e.g., "a cat wearing sunglasses in Times Square").
        </li>
      </ol>
    </div>

    {/* Step 2 */}
    <div className="bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-pink-400 animate-spin-slow" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">Step 2: Customize Settings</h3>
      </div>
      <ol className="list-decimal list-inside space-y-3 text-purple-200 text-sm">
        <li>
          <span className="font-medium text-white">Select Style</span>: Choose between styles like photorealistic, artistic, minimal, or surreal.
        </li>
        <li>
          <span className="font-medium text-white">Adjust Options</span>: Include mood, lighting, composition, and custom keywords.
        </li>
      </ol>
    </div>

    {/* Step 3 */}
    <div className="bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        <Copy className="w-5 h-5 text-green-400 animate-bounce" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">Step 3: Generate & Use Image</h3>
      </div>
      <ol className="list-decimal list-inside space-y-3 text-purple-200 text-sm">
        <li>
          <span className="font-medium text-white">Generate</span>: Click “Generate Image” to convert your prompt into an image.
        </li>
        <li>
          <span className="font-medium text-white">Download or Copy</span>: Save the image or copy the prompt to reuse in other tools.
        </li>
      </ol>
      <p className="mt-3 text-purple-200 text-sm flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-400 animate-pulse" aria-hidden="true" />
        <strong>Tip:</strong> Try different styles to find your favorite result!
      </p>
    </div>
  </div>
</div>

        {/* FAQ Section */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold text-white text-center mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-purple-300/30 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 flex justify-between items-center text-left text-white hover:bg-purple-500/10 transition-all"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-300" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-black/20 text-purple-200 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>

        {showSettingsModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-purple-300" />
          <h2 className="text-2xl font-bold text-white">Azure DALL-E 3 Settings</h2>
        </div>
        <button
          onClick={() => setShowSettingsModal(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Image Size & Ratio */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Image Size & Ratio</h3>
          <select
            value={tempImageSize}
            onChange={(e) => setTempImageSize(e.target.value)}
            className="w-full p-3 rounded-lg border bg-black/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {imageSizes.map((size) => (
              <option className="bg-black/20 text-white hover:bg-purple-500 hover:text-white" key={size.value} value={size.value}>
                {size.label} ({size.ratio} ratio)
              </option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Style</h3>
          <select
            value={tempImageStyle}
            onChange={(e) => setTempImageStyle(e.target.value)}
            className="w-full p-3 rounded-lg border bg-black/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {imageStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label} - {style.description}
              </option>
            ))}
          </select>
        </div>

        {/* Quality */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quality</h3>
          <select
            value={tempQuality}
            onChange={(e) => setTempQuality(e.target.value)}
            className="w-full p-3 rounded-lg border bg-black/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {qualityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>

      
      </div>

      {/* Modal Actions */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-white/20">
        <button
          onClick={() => setShowSettingsModal(false)}
          className="flex-1 py-3 px-6 rounded-lg border border-gray-400 text-gray-300 hover:bg-gray-700/20 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            // Save settings to main state
            setImageSize(tempImageSize);
            setImageStyle(tempImageStyle);
            setQuality(tempQuality);
            setNumberOfImages(tempNumberOfImages);
            setShowSettingsModal(false);
          }}
          className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>

  </div>
)}

      </div>
   
  );
};

export default PromptToImageGenerator;
