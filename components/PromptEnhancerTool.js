"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  AlertCircle, 
  Loader2, 
  Settings,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';

const PromptEnhancerTool = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(null);
  
  // Enhancement settings
  const [enhancementStyle, setEnhancementStyle] = useState('professional');
  const [targetPlatform, setTargetPlatform] = useState('midjourney');
  const [enhancementLevel, setEnhancementLevel] = useState('moderate');
  const [includeArtStyles, setIncludeArtStyles] = useState(true);
  const [includeTechnicalParams, setIncludeTechnicalParams] = useState(true);
  const [includeComposition, setIncludeComposition] = useState(true);
  const [customKeywords, setCustomKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  
  // UI States
  const [showSettings, setShowSettings] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || 
             localStorage.getItem('token') || 
             localStorage.getItem('authToken');
    }
    return null;
  };

  // Set usage from user data
  useEffect(() => {
    if (user?.subscription) {
      setUsage({
        used: user.subscription.enhancementsUsed || 0,
        limit: user.subscription.enhancementsLimit || 10,
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

  // Enhancement styles
  const enhancementStyles = [
    { 
      value: 'professional', 
      label: 'Professional', 
      description: 'Clean, polished, and business-appropriate enhancements' 
    },
    { 
      value: 'creative', 
      label: 'Creative', 
      description: 'Artistic and imaginative with bold visual elements' 
    },
    { 
      value: 'photorealistic', 
      label: 'Photorealistic', 
      description: 'Camera and photography focused enhancements' 
    },
    { 
      value: 'artistic', 
      label: 'Artistic', 
      description: 'Traditional art styles and mediums' 
    },
    { 
      value: 'minimal', 
      label: 'Minimal', 
      description: 'Clean, simple, and focused enhancements' 
    }
  ];

  // Target platforms
  const platforms = [
    { value: 'midjourney', label: 'Midjourney', icon: '🎨' },
    { value: 'dalle', label: 'DALL-E 3', icon: '🤖' },
    { value: 'stable-diffusion', label: 'Stable Diffusion', icon: '🔥' },
    { value: 'leonardo', label: 'Leonardo AI', icon: '🎭' },
    { value: 'firefly', label: 'Adobe Firefly', icon: '✨' },
    { value: 'general', label: 'General Purpose', icon: '🔧' }
  ];

  // Enhancement levels
  const enhancementLevels = [
    { value: 'light', label: 'Light', description: 'Subtle improvements' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced enhancement' },
    { value: 'heavy', label: 'Heavy', description: 'Comprehensive transformation' }
  ];

  // Sample prompts for quick testing
  const samplePrompts = [
    "A cat sitting on a table",
    "Beautiful landscape with mountains",
    "Portrait of a woman",
    "Modern city at night",
    "Vintage car on a road",
    "Abstract art with colors"
  ];

  // Add custom keyword
  const addCustomKeyword = () => {
    if (newKeyword.trim() && !customKeywords.includes(newKeyword.trim())) {
      setCustomKeywords([...customKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  // Remove custom keyword
  const removeCustomKeyword = (keyword) => {
    setCustomKeywords(customKeywords.filter(k => k !== keyword));
  };

  // Enhance prompt function
  const enhancePrompt = async () => {
    if (!user) {
      setError('Please sign in to enhance prompts');
      return;
    }

    if (hasReachedLimit()) {
      setError('You have reached your prompt enhancement limit. Please upgrade your plan.');
      return;
    }

    if (!originalPrompt.trim()) {
      setError('Please enter a prompt to enhance');
      return;
    }

    setIsEnhancing(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please sign in again.');
        setIsEnhancing(false);
        return;
      }

      const response = await fetch('/api/prompts/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalPrompt: originalPrompt.trim(),
          enhancementStyle,
          targetPlatform,
          enhancementLevel,
          includeArtStyles,
          includeTechnicalParams,
          includeComposition,
          customKeywords
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to enhance prompt');
      }

      if (data.success) {
        setEnhancedPrompt(data.enhancedPrompt);
        setShowComparison(true);
        // Update usage
        setUsage(prev => ({
          ...prev,
          used: data.usage.used
        }));
      } else {
        setError(data.message || 'Failed to enhance prompt');
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Copy enhanced prompt
  const copyEnhancedPrompt = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle sample prompt selection
  const handleSamplePromptClick = (sample) => {
    setOriginalPrompt(sample);
    setShowComparison(false);
    setEnhancedPrompt('');
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-400 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>

  
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
   

      <div className="max-w-7xl mx-auto p-4">
        <div>
                <h1 className="text-2xl font-bold text-white">AI Prompt Enhancer</h1>
                <p className="text-orange-200 text-sm">Transform basic prompts into professional AI instructions</p>
              </div>
        {/* Usage Display */}
        {user && usage && (
          <div className="mb-6 bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-xl p-4 border border-orange-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-orange-200 text-sm">
                  Enhancements Used: {usage.used} / {usage.limit}
                </p>
                <div className="w-48 bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${
                      hasReachedLimit() 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{ 
                      width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-orange-200 text-sm capitalize">{usage.plan} Plan</p>
                {hasReachedLimit() && (
                  <p className="text-red-400 text-xs">Limit Reached</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Input & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Original Prompt</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-all border border-orange-500/30 text-sm"
                >
                  <Settings className="w-4 h-4 text-orange-300" />
                  <span className="text-orange-300">Settings</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  placeholder="Enter your basic prompt here... (e.g., 'A cat sitting on a table')"
                  className="w-full h-32 p-4 bg-black/20 border border-orange-300/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-orange-300 resize-none"
                />

                {/* Sample Prompts */}
                <div>
                  <h3 className="text-sm font-medium text-orange-200 mb-2">Try These Sample Prompts:</h3>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => handleSamplePromptClick(sample)}
                        className="px-3 py-1 text-xs bg-orange-500/20 text-orange-200 rounded-full hover:bg-orange-500/30 transition-all border border-orange-500/30"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhancement Settings - Collapsible */}
                {showSettings && (
                  <div className="border-t border-white/20 pt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-300" />
                      Enhancement Settings
                    </h3>

                    {/* Enhancement Style */}
                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-2">
                        Enhancement Style
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {enhancementStyles.map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setEnhancementStyle(style.value)}
                            className={`p-3 rounded-lg border transition-all text-left text-sm ${
                              enhancementStyle === style.value
                                ? 'border-orange-400 bg-orange-500/20'
                                : 'border-white/20 hover:border-orange-300 bg-black/20'
                            }`}
                          >
                            <div className="font-medium text-white">{style.label}</div>
                            <div className="text-xs text-orange-200">{style.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Platform */}
                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-2">
                        Target Platform
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {platforms.map((platform) => (
                          <button
                            key={platform.value}
                            onClick={() => setTargetPlatform(platform.value)}
                            className={`p-3 rounded-lg border transition-all text-center text-sm ${
                              targetPlatform === platform.value
                                ? 'border-orange-400 bg-orange-500/20'
                                : 'border-white/20 hover:border-orange-300 bg-black/20'
                            }`}
                          >
                            <div className="text-lg mb-1">{platform.icon}</div>
                            <div className="font-medium text-white text-xs">{platform.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enhancement Level */}
                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-2">
                        Enhancement Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {enhancementLevels.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setEnhancementLevel(level.value)}
                            className={`p-3 rounded-lg border transition-all text-center text-sm ${
                              enhancementLevel === level.value
                                ? 'border-orange-400 bg-orange-500/20'
                                : 'border-white/20 hover:border-orange-300 bg-black/20'
                            }`}
                          >
                            <div className="font-medium text-white">{level.label}</div>
                            <div className="text-xs text-orange-200">{level.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Enhancement Options */}
                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-2">
                        Enhancement Options
                      </label>
                      <div className="space-y-2">
                        {[
                          { key: 'includeArtStyles', label: 'Include Art Styles', state: includeArtStyles, setState: setIncludeArtStyles },
                          { key: 'includeTechnicalParams', label: 'Include Technical Parameters', state: includeTechnicalParams, setState: setIncludeTechnicalParams },
                          { key: 'includeComposition', label: 'Include Composition Tips', state: includeComposition, setState: setIncludeComposition }
                        ].map((option) => (
                          <button
                            key={option.key}
                            onClick={() => option.setState(!option.state)}
                            className={`w-full p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                              option.state
                                ? 'border-orange-400 bg-orange-500/20'
                                : 'border-white/20 hover:border-orange-300 bg-black/20'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              option.state ? 'border-orange-400 bg-orange-500' : 'border-gray-400'
                            }`}>
                              {option.state && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-white text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-2">
                        Custom Keywords
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add custom keyword..."
                            className="flex-1 p-2 bg-black/20 border border-orange-300/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-orange-300 text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomKeyword()}
                          />
                          <button
                            onClick={addCustomKeyword}
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-all border border-orange-500/30 text-sm"
                          >
                            <Plus className="w-4 h-4 text-orange-300" />
                          </button>
                        </div>
                        {customKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {customKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-200 rounded-full text-sm border border-orange-500/30"
                              >
                                {keyword}
                                <button
                                  onClick={() => removeCustomKeyword(keyword)}
                                  className="hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={enhancePrompt}
                    disabled={isEnhancing || !originalPrompt.trim() || !user || hasReachedLimit()}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] ${
                      isEnhancing || !originalPrompt.trim() || !user || hasReachedLimit()
                        ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                        : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isEnhancing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enhancing...
                      </>
                    ) : !user ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Please Sign In
                      </>
                    ) : hasReachedLimit() ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Limit Reached
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Enhance Prompt
                      </>
                    )}
                  </button>

                  {enhancedPrompt && (
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-all border border-blue-500/30 flex items-center gap-2"
                    >
                      {showComparison ? <EyeOff className="w-5 h-5 text-blue-300" /> : <Eye className="w-5 h-5 text-blue-300" />}
                      <span className="text-blue-300 font-medium">
                        {showComparison ? 'Hide' : 'Show'} Comparison
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Prompt Result */}
            {enhancedPrompt && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Enhanced Prompt</h2>
                  <button
                    onClick={copyEnhancedPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all border border-green-500/30"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-green-300" />
                        <span className="text-green-300">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <p className="text-white leading-relaxed">{enhancedPrompt}</p>
                </div>

                {/* Enhancement Summary */}
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg border border-orange-500/30">
                  <div className="text-sm text-orange-200">
                    <strong className="text-orange-300">Enhancement Applied:</strong> {enhancementStyles.find(s => s.value === enhancementStyle)?.label} style for {platforms.find(p => p.value === targetPlatform)?.label} ({enhancementLevel} level)
                  </div>
                </div>
              </div>
            )}

            {/* Comparison View */}
            {showComparison && enhancedPrompt && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">Before & After Comparison</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Original Prompt</h3>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-white text-sm">{originalPrompt}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Enhanced Prompt</h3>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-white text-sm">{enhancedPrompt}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tips & Info */}
          <div className="space-y-6">
            {/* Enhancement Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Enhancement Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Be Specific</h4>
                    <p className="text-orange-200 text-xs">Start with clear, specific descriptions rather than vague terms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Choose Your Platform</h4>
                    <p className="text-orange-200 text-xs">Different AI models work better with different prompt styles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Iterate</h4>
                    <p className="text-orange-200 text-xs">Try different enhancement levels to find what works best</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform-Specific Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Platform Guide</h3>
              <div className="space-y-3">
                {platforms.slice(0, 4).map((platform) => (
                  <div key={platform.value} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                    <span className="text-lg">{platform.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{platform.label}</h4>
                      <p className="text-orange-200 text-xs">
                        {platform.value === 'midjourney' && 'Loves detailed descriptions and art styles'}
                        {platform.value === 'dalle' && 'Best with natural language descriptions'}
                        {platform.value === 'stable-diffusion' && 'Great with technical parameters'}
                        {platform.value === 'leonardo' && 'Excellent for character and scene prompts'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enhancements */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Enhancements</h3>
              <div className="space-y-2">
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-orange-200 text-sm">Your enhanced prompts will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
      </Layout>
  );
};

export default PromptEnhancerTool;