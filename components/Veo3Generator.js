'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Loader2, Copy, Check, AlertCircle, Sparkles, Lock, Play } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const Veo3Generator = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [promptType, setPromptType] = useState('cinematic');
  const fileInputRef = useRef(null);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const response = await fetch('/api/auth/me');
  //     const data = await response.json();
  //     if (data.success) {
  //       setUser(data.user);
  //     }
  //   } catch (error) {
  //     console.error('Auth check error:', error);
  //   }
  // };

  const promptTypes = [
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-style dramatic scenes' },
    { id: 'documentary', name: 'Documentary', description: 'Realistic documentary style' },
    { id: 'commercial', name: 'Commercial', description: 'Professional advertising style' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and experimental' },
    { id: 'animation', name: 'Animation', description: 'Animated video style' }
  ];

  const handleImageSelect = (file) => {
    setError('');
    
    if (!file.type.startsWith('image/')) {
      setError(t('imageFileOnly'));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(t('fileSizeLimit'));
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const generateVeo3Prompt = async () => {
    if (!user) {
      setError(t('signInToGenerate'));
      return;
    }

    if (!selectedImage) {
      setError(t('uploadImageFirst'));
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
          const response = await fetch('/api/prompts/generate-veo3', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Image,
              promptType: promptType
            }),
          });

          const data = await response.json();

          if (data.success) {
            setGeneratedPrompt(data.prompt);
            setUser(prev => ({
              ...prev,
              subscription: {
                ...prev.subscription,
                promptsUsed: data.usage.used
              }
            }));
          } else {
            setError(data.message);
          }
        } catch (err) {
          console.error('Error generating Veo3 prompt:', err);
          setError(t('failedToGenerate'));
        } finally {
          setIsGenerating(false);
        }
      };

      reader.readAsDataURL(selectedImage);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read the image file. Please try again.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Subscription Overlay */}
      {!user && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
          <div className="text-center p-8">
            <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">{t('signInRequired')}</h3>
            <p className="text-purple-200 mb-6 max-w-md">
              {t('createFreeAccount')}
            </p>
            <div className="space-y-3">
              <Link href="/auth/register" className="block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105">
                {t('createAccount')}
              </Link>
              <Link href="/auth/login" className="block border-2 border-purple-400 text-purple-200 px-8 py-3 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all">
                {t('signIn')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Usage Limit Warning */}
      {user && user.subscription.plan !== 'lifetime' && user.subscription.promptsUsed >= user.subscription.promptsLimit && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">{t('limitReached')}</h3>
            <p className="text-purple-200 mb-6 max-w-md">
              {t('limitReachedDesc')}
            </p>
            <Link href="/pricing" className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-block">
              {t('upgradePlan')}
            </Link>
          </div>
        </div>
      )}

      {/* Usage Display */}
      {user && (
        <div className="mb-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-200 text-sm">
                {t('promptsUsed')}: {user.subscription.promptsUsed} / {user.subscription.promptsLimit}
              </p>
              <div className="w-48 bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ 
                    width: `${Math.min((user.subscription.promptsUsed / user.subscription.promptsLimit) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm capitalize">{user.subscription.plan} Plan</p>
              <Link href="/dashboard" className="text-yellow-400 hover:underline text-sm">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Type Selection */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Video Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {promptTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPromptType(type.id)}
              className={`p-3 rounded-lg border transition-all text-left ${
                promptType === type.id
                  ? 'border-purple-400 bg-purple-500/20 text-white'
                  : 'border-gray-600 bg-gray-800/50 text-purple-200 hover:border-purple-500'
              }`}
            >
              <div className="font-medium text-sm">{type.name}</div>
              <div className="text-xs opacity-75">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Card with gradient border */}
      <div className="relative p-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-3xl">
        <div className="bg-gray-900 rounded-3xl p-8">
          {/* Upload Area */}
          {!imagePreview ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging 
                  ? 'border-purple-400 bg-purple-900/30' 
                  : 'border-gray-600 hover:border-purple-500 bg-gray-800/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files[0])}
                className="hidden"
                id="veo3-file-upload"
              />
              <label htmlFor="veo3-file-upload" className="cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl font-medium text-white mb-2">
                  {t('clickToUpload')}
                </p>
                <p className="text-sm text-gray-400">
                  {t('dragAndDrop')}
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative bg-gray-800 rounded-lg p-2">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <button
                  onClick={resetUpload}
                  className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-full hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Generated Prompt */}
              {generatedPrompt && (
                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg p-6 relative border border-purple-500/30">
                  <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3 text-lg flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Generated Veo3 Video Prompt:
                  </h3>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white transition-colors bg-purple-800/50 rounded-lg"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={imagePreview ? generateVeo3Prompt : () => fileInputRef.current?.click()}
            disabled={isGenerating || !user || (user && user.subscription.plan !== 'lifetime' && user.subscription.promptsUsed >= user.subscription.promptsLimit)}
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] ${
              isGenerating || !user || (user && user.subscription.plan !== 'lifetime' && user.subscription.promptsUsed >= user.subscription.promptsLimit)
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-xl hover:shadow-2xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Veo3 Prompt...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                {imagePreview ? 'Generate Veo3 Prompt' : t('selectImage')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Veo3Generator;