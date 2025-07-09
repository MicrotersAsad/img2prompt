'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Loader2, Copy, Check, AlertCircle, Lock, Globe, Camera, Palette, Wand2, Zap, Monitor, Smartphone, PaintBucket, Sun, Moon, Flame, Snowflake, TreePine, Building, User, Crown, Rocket, Heart, Star, Music } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ImgPromptGenerator = ({authLoading }) => {
  const [concept, setConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(null);
  const {user}=useAuth()
  // Settings
  const [artStyle, setArtStyle] = useState('realistic');
  const [mood, setMood] = useState('neutral');
  const [lighting, setLighting] = useState('natural');
  const [composition, setComposition] = useState('centered');
  const [colorScheme, setColorScheme] = useState('vibrant');
  const [promptTarget, setPromptTarget] = useState('general');
  const [language, setLanguage] = useState('english');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [isCompact, setIsCompact] = useState(false);

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

  const artStyles = [
    { id: 'realistic', label: 'Realistic', icon: Camera, description: 'Photorealistic style' },
    { id: 'digital_art', label: 'Digital Art', icon: Monitor, description: 'Modern digital artwork' },
    { id: 'oil_painting', label: 'Oil Painting', icon: PaintBucket, description: 'Classic oil painting style' },
    { id: 'watercolor', label: 'Watercolor', icon: Palette, description: 'Watercolor painting style' },
    { id: 'anime', label: 'Anime', icon: Star, description: 'Japanese anime style' },
    { id: 'cartoon', label: 'Cartoon', icon: Heart, description: 'Cartoon illustration' },
    { id: 'concept_art', label: 'Concept Art', icon: Lightbulb, description: 'Game/movie concept art' },
    { id: 'surreal', label: 'Surreal', icon: Sparkles, description: 'Surrealistic art style' },
  ];

  const moods = [
    { id: 'neutral', label: 'Neutral', icon: Sun, color: 'from-gray-500 to-gray-600' },
    { id: 'happy', label: 'Happy', icon: Sun, color: 'from-yellow-500 to-orange-500' },
    { id: 'mysterious', label: 'Mysterious', icon: Moon, color: 'from-purple-500 to-indigo-600' },
    { id: 'dramatic', label: 'Dramatic', icon: Flame, color: 'from-red-500 to-red-600' },
    { id: 'peaceful', label: 'Peaceful', icon: TreePine, color: 'from-green-500 to-green-600' },
    { id: 'energetic', label: 'Energetic', icon: Zap, color: 'from-pink-500 to-purple-600' },
    { id: 'melancholy', label: 'Melancholy', icon: Snowflake, color: 'from-blue-500 to-blue-600' },
    { id: 'epic', label: 'Epic', icon: Crown, color: 'from-amber-500 to-yellow-600' },
  ];

  const lightingOptions = [
    { id: 'natural', label: 'Natural Light', description: 'Soft natural lighting' },
    { id: 'golden_hour', label: 'Golden Hour', description: 'Warm sunset/sunrise light' },
    { id: 'dramatic', label: 'Dramatic', description: 'High contrast lighting' },
    { id: 'soft', label: 'Soft', description: 'Diffused soft lighting' },
    { id: 'neon', label: 'Neon', description: 'Colorful neon lights' },
    { id: 'cinematic', label: 'Cinematic', description: 'Movie-like lighting' },
    { id: 'studio', label: 'Studio', description: 'Professional studio lighting' },
    { id: 'ambient', label: 'Ambient', description: 'Atmospheric ambient light' },
  ];

  const compositions = [
    { id: 'centered', label: 'Centered', description: 'Subject in center' },
    { id: 'rule_of_thirds', label: 'Rule of Thirds', description: 'Following photography rule' },
    { id: 'close_up', label: 'Close-up', description: 'Tight framing' },
    { id: 'wide_shot', label: 'Wide Shot', description: 'Broad view' },
    { id: 'bird_eye', label: 'Bird\'s Eye', description: 'Top-down view' },
    { id: 'low_angle', label: 'Low Angle', description: 'Looking up perspective' },
    { id: 'portrait', label: 'Portrait', description: 'Vertical orientation' },
    { id: 'landscape', label: 'Landscape', description: 'Horizontal orientation' },
  ];

  const colorSchemes = [
    { id: 'vibrant', label: 'Vibrant', description: 'Bright, saturated colors' },
    { id: 'muted', label: 'Muted', description: 'Soft, desaturated tones' },
    { id: 'monochrome', label: 'Monochrome', description: 'Single color variations' },
    { id: 'warm', label: 'Warm', description: 'Red, orange, yellow tones' },
    { id: 'cool', label: 'Cool', description: 'Blue, green, purple tones' },
    { id: 'pastel', label: 'Pastel', description: 'Light, soft colors' },
    { id: 'dark', label: 'Dark', description: 'Deep, rich colors' },
    { id: 'neon', label: 'Neon', description: 'Electric, glowing colors' },
  ];

  const promptTargets = [
    { id: 'general', label: 'General', icon: Globe, color: 'from-blue-500 to-blue-600', description: 'Universal AI prompts' },
    { id: 'midjourney', label: 'Midjourney', icon: Camera, color: 'from-purple-500 to-purple-600', description: 'Optimized for Midjourney' },
    { id: 'dalle', label: 'DALL-E 3', icon: Palette, color: 'from-green-500 to-green-600', description: 'OpenAI DALL-E format' },
    { id: 'stable', label: 'Stable Diffusion', icon: Wand2, color: 'from-orange-500 to-orange-600', description: 'SD model prompts' },
    { id: 'flux', label: 'Flux', icon: Zap, color: 'from-pink-500 to-pink-600', description: 'Flux AI prompts' },
  ];

  const languages = [
    { value: 'english', label: 'English', flag: '�YTE' },
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'german', label: 'German', flag: '🇩🇪' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  ];

  const detailLevels = [
    { id: 'basic', label: 'Basic', description: 'Simple, concise prompt' },
    { id: 'medium', label: 'Medium', description: 'Balanced detail level' },
    { id: 'detailed', label: 'Detailed', description: 'Rich, comprehensive prompt' },
    { id: 'ultra', label: 'Ultra Detailed', description: 'Maximum detail and specificity' },
  ];

  const conceptSuggestions = [
    'Futuristic city skyline',
    'Magical forest with glowing trees',
    'Steampunk airship in the clouds',
    'Ancient dragon guarding treasure',
    'Cyberpunk street at night',
    'Peaceful mountain lake at sunrise',
    'Robot and human friendship',
    'Underwater palace with mermaids',
    'Space station orbiting Earth',
    'Medieval castle on a cliff',
    'Phoenix rising from ashes',
    'Alien marketplace on distant planet'
  ];

  const generatePrompt = async () => {
    if (!user) {
      setError('Please sign in to generate prompts');
      return;
    }

    if (hasReachedLimit()) {
      setError('You have reached your prompt generation limit. Please upgrade your plan.');
      return;
    }

    if (!concept.trim()) {
      setError('Please enter a concept first');
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

      const promptData = {
        concept: concept.trim(),
        artStyle,
        mood,
        lighting,
        composition,
        colorScheme,
        promptTarget,
        language,
        detailLevel
      };

      console.log('Generating prompt with data:', promptData);

      const response = await fetch('/api/prompts/generate-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promptData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate prompt');
      }

      if (data.success) {
        setGeneratedPrompt(data.prompt);
        setUsage(prev => ({
          ...prev,
          used: data.usage.used
        }));
      } else {
        setError(data.message || 'Failed to generate prompt');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    setConcept(suggestion);
  };

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
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
     
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {user && usage && (
          <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-200 text-sm">
                  Prompts Used: {usage.used} / {usage.limit}
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

        <div className={`grid gap-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-1'}`}>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-2">Enter Your Concept</h2>
              <p className="text-purple-200 text-sm mb-4">Describe what you want to create (e.g., "a magical forest with glowing trees")</p>
              
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your concept here..."
                className="w-full h-24 p-4 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 resize-none"
              />

              <div className="mt-4">
                <h3 className="text-sm font-medium text-purple-200 mb-2">Quick Suggestions:</h3>
                <div className="flex flex-wrap gap-2">
                  {conceptSuggestions.slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 text-xs bg-purple-500/20 text-purple-200 rounded-full hover:bg-purple-500/30 transition-all border border-purple-500/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
  {/* Art Style Section */}
<div>
  {/* Art Style and Mood & Atmosphere Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Art Style</h3>
      <select
        value={artStyle}
        onChange={(e) => setArtStyle(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {artStyles.map((style) => (
          <option key={style.id} value={style.id} className="bg-gray-800">
            {style.label} - {style.description}
          </option>
        ))}
      </select>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Mood & Atmosphere</h3>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {moods.map((moodOption) => (
          <option key={moodOption.id} value={moodOption.id} className="bg-gray-800">
            {moodOption.label}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Lighting and Composition Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Lighting</h3>
      <select
        value={lighting}
        onChange={(e) => setLighting(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {lightingOptions.map((option) => (
          <option key={option.id} value={option.id} className="bg-gray-800">
            {option.label} - {option.description}
          </option>
        ))}
      </select>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Composition</h3>
      <select
        value={composition}
        onChange={(e) => setComposition(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {compositions.map((comp) => (
          <option key={comp.id} value={comp.id} className="bg-gray-800">
            {comp.label} - {comp.description}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Color Scheme and Target Platform Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Color Scheme</h3>
      <select
        value={colorScheme}
        onChange={(e) => setColorScheme(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {colorSchemes.map((scheme) => (
          <option key={scheme.id} value={scheme.id} className="bg-gray-800">
            {scheme.label} - {scheme.description}
          </option>
        ))}
      </select>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Target Platform</h3>
      <select
        value={promptTarget}
        onChange={(e) => setPromptTarget(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {promptTargets.map((target) => (
          <option key={target.id} value={target.id} className="bg-gray-800">
            {target.label} - {target.description}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Language and Detail Level Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Language</h3>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value} className="bg-gray-800">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-3">Detail Level</h3>
      <select
        value={detailLevel}
        onChange={(e) => setDetailLevel(e.target.value)}
        className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
      >
        {detailLevels.map((level) => (
          <option key={level.id} value={level.id} className="bg-gray-800">
            {level.label} - {level.description}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
</div>
            <button
              onClick={generatePrompt}
              disabled={isGenerating || !concept.trim() || !user || hasReachedLimit()}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] ${
                isGenerating || !concept.trim() || !user || hasReachedLimit()
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Your Prompt...
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
                  Generate Image Prompt
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Generated Prompt</h2>
                {generatedPrompt && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-all border border-white/20"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-purple-300" />
                        <span className="text-white">Copy Prompt</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {!user && !generatedPrompt && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Sign in Required</h3>
                  <p className="text-purple-200 mb-6 max-w-sm mx-auto">Please sign in to generate AI image prompts from your concepts</p>
                  <div className="space-y-3">
                    <button className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]">
                      Sign In
                    </button>
                    <button className="block w-full border-2 border-purple-400 text-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-400/20 transition-all">
                      Create Account
                    </button>
                  </div>
                </div>
              )}

              {hasReachedLimit() && user && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Limit Reached</h3>
                  <p className="text-purple-200 mb-6 max-w-sm mx-auto">You've reached your {usage?.plan} plan limit. Upgrade to continue generating prompts.</p>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]">
                    Upgrade Plan
                  </button>
                </div>
              )}

              {generatedPrompt ? (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {generatedPrompt}
                    </p>
                  </div>
                  {usage && (
                    <div className="text-sm text-purple-200 bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                      <strong className="text-blue-300">Usage:</strong> {usage.used} of {usage.limit} prompts used ({usage.plan} plan)
                    </div>
                  )}
                  <div className="text-sm text-purple-200 bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                    <strong className="text-blue-300">Pro Tip:</strong> Copy this prompt and paste it into your favorite AI image generator like Midjourney, DALL-E, or Stable Diffusion.
                  </div>
                </div>
              ) : user && !hasReachedLimit() && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Create</h3>
                  <p className="text-purple-200">Enter your concept and customize the settings to generate your perfect image prompt...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgPromptGenerator;