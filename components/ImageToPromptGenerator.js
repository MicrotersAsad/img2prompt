"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Loader2, Copy, Check, AlertCircle, Sparkles, Lock, Globe, Camera, Palette, Wand2, Zap, Clipboard, Link2, MessageSquareText, Lightbulb, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';
import Herosection from "./Heresection"
// Image Preview Component
const ImagePreview = ({ imagePreview, resetUpload }) => (
  <div className="relative bg-black/20 rounded-lg p-2 border border-white/10 h-64 flex items-center justify-center overflow-hidden">
    <img
      src={imagePreview}
      alt="Preview"
      className="max-h-full max-w-full object-contain rounded-lg"
    />
    <button
      onClick={resetUpload}
      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all shadow-lg z-10"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);




const ImageToPromptGenerator = ({authLoading }) => {
  const { user} = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState(null);
  const [language, setLanguage] = useState('english');
  const [promptTarget, setPromptTarget] = useState('general');
  const [sceneStyle, setSceneStyle] = useState('general');
  const [wordCount, setWordCount] = useState(150);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');

  const fileInputRef = useRef(null);
  const pasteAreaRef = useRef(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || 
             localStorage.getItem('token') || 
             localStorage.getItem('authToken');
    }
    return null;
  };

  useEffect(() => {
    if (user?.subscription) {
      setUsage({
        used: user.subscription.promptsUsed || 0,
        limit: user.subscription.promptsLimit || 10,
        plan: user.subscription.plan || 'free'
      });
    }
  }, [user]);

  const hasReachedLimit = () => {
    if (!user || !usage) return false;
    if (usage.plan === 'lifetime') return false;
    return usage.used >= usage.limit;
  };

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸', native: 'English' },
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { value: 'french', label: 'French', flag: '🇫🇷', native: 'Français' },
    { value: 'german', label: 'German', flag: '🇩🇪', native: 'Deutsch' },
    { value: 'italian', label: 'Italian', flag: '🇮🇹', native: 'Italiano' },
    { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹', native: 'Português' },
    { value: 'russian', label: 'Russian', flag: '🇷🇺', native: 'Русский' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { value: 'korean', label: 'Korean', flag: '🇰🇷', native: '한국어' },
    { value: 'chinese', label: 'Chinese', flag: '🇨🇳', native: '中文' },
    { value: 'arabic', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { value: 'hindi', label: 'Hindi', flag: '🇮🇳', native: 'हिंदी' },
    { value: 'bengali', label: 'Bengali', flag: '🇧🇩', native: 'বাংলা' },
    { value: 'urdu', label: 'Urdu', flag: '🇵🇰', native: 'اردو' },
    { value: 'turkish', label: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
    { value: 'dutch', label: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
    { value: 'swedish', label: 'Swedish', flag: '🇸🇪', native: 'Svenska' },
    { value: 'polish', label: 'Polish', flag: '🇵🇱', native: 'Polski' },
    { value: 'vietnamese', label: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
    { value: 'thai', label: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  ];

  const promptTargets = [
    { id: 'general', label: 'General', icon: Globe, color: 'from-blue-500 to-blue-600', description: 'Universal AI prompts' },
    { id: 'midjourney', label: 'Midjourney', icon: Camera, color: 'from-purple-500 to-purple-600', description: 'Optimized for Midjourney' },
    { id: 'dalle', label: 'DALL-E 3', icon: Palette, color: 'from-green-500 to-green-600', description: 'OpenAI DALL-E format' },
    { id: 'stable', label: 'Stable Diffusion', icon: Wand2, color: 'from-orange-500 to-orange-600', description: 'SD model prompts' },
    { id: 'flux', label: 'Flux', icon: Zap, color: 'from-pink-500 to-pink-600', description: 'Flux AI prompts' },
  ];

  const sceneStyles = [
    { id: 'general', label: 'General', icon: Globe, description: 'Any type of content' },
    { id: 'portrait', label: 'Portrait/Character', icon: Camera, description: 'People and characters' },
    { id: 'landscape', label: 'Landscape/Scene', icon: Sparkles, description: 'Nature and environments' },
    { id: 'object', label: 'Object/Product', icon: Palette, description: 'Items and products' },
    { id: 'artistic', label: 'Artistic', icon: Wand2, description: 'Abstract and creative' },
  ];

  useEffect(() => {
    const handleGlobalPaste = async (e) => {
      if (uploadMethod !== 'paste') return;
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageSelect(file);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [uploadMethod]);

  useEffect(() => {
    if (uploadMethod === 'paste' && pasteAreaRef.current) {
      setTimeout(() => {
        pasteAreaRef.current?.focus();
      }, 100);
    }
  }, [uploadMethod]);

  const handleImageSelect = (file) => {
    setError('');
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file only');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setSelectedImage(file);
    setGeneratedPrompt('');
  };

  const handleImageUrl = () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }
    setImagePreview(imageUrl);
    setSelectedImage({ url: imageUrl });
    setGeneratedPrompt('');
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const generatePrompt = async () => {
    if (!user) {
      setError('Please sign in to generate prompts');
      return;
    }

    if (hasReachedLimit()) {
      setError('You have reached your prompt generation limit. Please upgrade your plan.');
      return;
    }

    if (!selectedImage && !imagePreview) {
      setError('Please upload an image first');
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

      console.log('User:', user);
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');

      let imageData;
      if (selectedImage?.url) {
        imageData = selectedImage.url;
      } else {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      const systemPrompt = `You are an AI that analyzes images and creates detailed, creative prompts for ${promptTarget.toUpperCase()} AI model in ${language}. The prompt should be approximately ${wordCount} words, optimized for ${sceneStyle} style. Provide rich descriptions including style, composition, lighting, colors, mood, and technical details.`;

      console.log('Sending request...');
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageData,
          systemPrompt,
        }),
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

  const resetUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedPrompt('');
    setError('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      <Herosection/>
      <div className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
      

        {/* Usage Display */}
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

        <div className={`grid gap-6 ${generatedPrompt ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Input Image Section */}
            <div  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
  style={{ height: '600px' }} >
              <h2 className="text-xl font-semibold text-white mb-2">Input Image</h2>
              <p className="text-purple-200 text-sm mb-4">Upload an image, paste from clipboard, or provide an image URL</p>
              
              {/* Upload Method Toggle */}
              <div className="flex bg-black/20 rounded-lg p-1 mb-4">
                <button
                  onClick={() => { setUploadMethod('file'); resetUpload(); }}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${
                    uploadMethod === 'file' 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => { setUploadMethod('paste'); resetUpload(); }}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${
                    uploadMethod === 'paste' 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Clipboard className="w-4 h-4 inline mr-2" />
                  Paste Image
                </button>
                <button
                  onClick={() => { setUploadMethod('url'); resetUpload(); }}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${
                    uploadMethod === 'url' 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Link2 className="w-4 h-4 inline mr-2" />
                  Image URL
                </button>
              </div>

              {/* Upload Area */}
              {uploadMethod === 'file' ? (
                !imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer h-64 flex flex-col items-center justify-center ${
                      isDragging 
                        ? 'border-purple-400 bg-purple-500/20' 
                        : 'border-purple-300/50 hover:border-purple-400 bg-black/20'
                    }` }style={{ height: '350px' }}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-white mb-2">
                      Click or tap to upload an image
                    </p>
                    <p className="text-sm text-purple-200">
                      Drag and drop an image here (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <ImagePreview imagePreview={imagePreview} resetUpload={resetUpload} />
                )
              ) : uploadMethod === 'paste' ? (
                !imagePreview ? (
                  <div
                    ref={pasteAreaRef}
                    tabIndex={0}
                    className="border-2 border-dashed border-purple-300/50 rounded-xl p-8 text-center bg-black/20 hover:border-purple-400 transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 h-64 flex flex-col items-center justify-center"
                    onPaste={async (e) => {
                      const items = e.clipboardData?.items;
                      if (!items) return;

                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.type.indexOf('image') !== -1) {
                          e.preventDefault();
                          const file = item.getAsFile();
                          if (file) {
                            handleImageSelect(file);
                          }
                          break;
                        }
                      }
                    }}
                    onClick={() => pasteAreaRef.current?.focus()}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clipboard className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-white mb-2">
                      Paste Image from Clipboard
                    </p>
                    <p className="text-sm text-purple-200 mb-2">
                      Copy an image (Ctrl+C) and paste it here (Ctrl+V)
                    </p>
                    <p className="text-xs text-purple-300 mb-2">
                      Works with screenshots, copied images from browsers, etc.
                    </p>
                    <p className="text-xs text-green-300">
                      💡 Click here first, then paste your image
                    </p>
                  </div>
                ) : (
                  <ImagePreview imagePreview={imagePreview} resetUpload={resetUpload} />
                )
              ) : (
                <div className="space-y-4 h-64 flex flex-col justify-center">
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full p-4 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    />
                    <Link2 className="absolute right-3 top-4 w-5 h-5 text-purple-300" />
                  </div>
                  <button
                    onClick={handleImageUrl}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                  >
                    Load Image from URL
                  </button>
                  {imagePreview && (
                    <ImagePreview imagePreview={imagePreview} resetUpload={resetUpload} />
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Output Language</h3>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value} className="bg-gray-800">
                        {lang.flag} {lang.label} ({lang.native})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Word Count</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={wordCount}
                      onChange={(e) => setWordCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-purple-200">
                      <span>Brief (50)</span>
                      <span className="font-medium text-white">≈ {wordCount} words</span>
                      <span>Detailed (300)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Prompt Target</h3>
                  <p className="text-sm text-purple-200 mb-4">Select the AI platform you're generating prompts for</p>
                  
                  <div className="relative">
                    <select
                      value={promptTarget}
                      onChange={(e) => setPromptTarget(e.target.value)}
                      className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                    >
                      {promptTargets.map((target) => (
                        <option key={target.id} value={target.id} className="bg-gray-800 text-white">
                          {target.label} - {target.description}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {promptTarget && (
                    <div className="mt-4 p-3 bg-black/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center">
                        {(() => {
                          const selectedTarget = promptTargets.find(t => t.id === promptTarget);
                          if (!selectedTarget) return null;
                          return (
                            <>
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedTarget.color} flex items-center justify-center mr-3`}>
                                <selectedTarget.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white font-medium text-sm">{selectedTarget.label}</div>
                                <div className="text-xs text-purple-200">{selectedTarget.description}</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Scene/Style</h3>
                  <p className="text-sm text-purple-200 mb-4">Choose the type of content to optimize your prompt</p>
                  
                  <div className="relative">
                    <select
                      value={sceneStyle}
                      onChange={(e) => setSceneStyle(e.target.value)}
                      className="w-full p-3 bg-black/20 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                    >
                      {sceneStyles.map((style) => (
                        <option key={style.id} value={style.id} className="bg-gray-800 text-white">
                          {style.label} - {style.description}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {sceneStyle && (
                    <div className="mt-4 p-3 bg-black/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center">
                        {(() => {
                          const selectedStyle = sceneStyles.find(s => s.id === sceneStyle);
                          if (!selectedStyle) return null;
                          return (
                            <>
                              <selectedStyle.icon className="w-6 h-6 text-purple-300 mr-3" />
                              <div>
                                <div className="text-white font-medium text-sm">{selectedStyle.label}</div>
                                <div className="text-xs text-purple-200">{selectedStyle.description}</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePrompt}
              disabled={isGenerating || !imagePreview || !user || hasReachedLimit()}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] ${
                isGenerating || !imagePreview || !user || hasReachedLimit()
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Image...
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
                  Generate Prompt
                </>
              )}
            </button>
          </div>

          {/* Right Column - Output (Only show when prompt is generated) */}
          {generatedPrompt && (
            <div className="space-y-6">
              {/* Generated Prompt */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Generated Prompt</h2>
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
                </div>

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
                    <strong className="text-blue-300">Pro Tip:</strong> Click the copy button to copy the entire prompt to your clipboard. You can then paste it directly into your AI art generator.
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display (when no prompt generated) */}
        {error && !generatedPrompt && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Placeholder states when no prompt generated */}
        {!generatedPrompt && user && !hasReachedLimit() && (
          <div className="mt-6 text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-lg font-medium text-white mb-2">Ready to Generate</h3>
            <p className="text-purple-200">Upload an image and click generate to create your AI prompt...</p>
          </div>
        )}

        {!user && !generatedPrompt && (
          <div className="mt-6 text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Sign in Required</h3>
            <p className="text-purple-200 mb-6 max-w-sm mx-auto">Please sign in to generate AI prompts from your images</p>
            <div className="space-y-3">
              <button className="block w-full max-w-xs mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]">
                Sign In
              </button>
              <button className="block w-full max-w-xs mx-auto border-2 border-purple-400 text-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-400/20 transition-all">
                Create Account
              </button>
            </div>
          </div>
        )}

        {hasReachedLimit() && user && !generatedPrompt && (
          <div className="mt-6 text-center py-12">
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
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ImageToPromptGenerator;