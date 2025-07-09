'use client';

import React from 'react';
import { Sparkles, Zap, Shield, Globe, ArrowRight, Star, Users, Clock, Video, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import ImageToPromptGenerator from '../components/ImageToPromptGenerator';
import ImgPromptGenerator from '../components/ImgPromptGenerator';
import PromptToImageGenerator from '../components/PromptToImage';
import Veo3Generator from '../components/Veo3Generator';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <ImageToPromptGenerator/>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
              {t('title')}
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register" className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center">
              {t('startCreating')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/pricing" className="border-2 border-purple-400 text-purple-200 px-8 py-4 rounded-xl font-semibold hover:bg-purple-400 hover:text-white transition-all">
              {t('viewPricing')}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-purple-200">{t('promptsGenerated')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">500+</div>
              <div className="text-purple-200">{t('happyUsers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-purple-200">{t('uptime')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main AI Tool Section */}
    <section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white mb-4">
        {t('aiPromptGenerators', 'AI Prompt Generators')}
      </h2>
      <p className="text-purple-200 text-lg max-w-2xl mx-auto">
        {t('toolsDescription', 'Choose from our powerful AI tools to create professional prompts for different platforms')}
      </p>
    </div>

    {/* Tools Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {/* Image to Prompt Tool */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
            Image to Prompt
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Upload any image and get detailed, professional prompts. Perfect for recreating styles, analyzing compositions, or generating similar content.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            AI Powered Analysis
          </div>
          <div>
           <Link  className="flex items-center text-blue-300 font-small" href="img-to-prompt">Try Now
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg></Link>
          </div>
        </div>
      </div>

      {/* Prompt to Image Tool */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
            Prompt to Image
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Transform your ideas into stunning visuals with Azure DALL-E 3. Create professional-quality images from detailed text descriptions.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Azure OpenAI DALL-E 3
          </div>
            <Link  className="flex items-center text-blue-300 font-small" href="prompt-to-image">Try Now
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg></Link>
        </div>
      </div>

      {/* Smart Prompt Generator */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-green-300 transition-colors">
            Smart Prompt Generator
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Generate optimized prompts for any AI model. Get suggestions, enhance your ideas, and create prompts that produce better results.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Multi-Platform Support
          </div>
           <Link  className="flex items-center text-blue-300 font-small" href="image-prompt-generator">Try Now
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg></Link>
        </div>
      </div>

      {/* Video to Prompt Tool */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition-colors">
            Video to Prompt
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Extract detailed prompts from video content. Analyze scenes, movements, and styles to create comprehensive text descriptions.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
            Coming Soon
          </div>
          <div className="flex items-center text-red-300 font-medium">
            Preview
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Audio to Prompt Tool */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
            Audio to Prompt
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Convert audio descriptions, music, and sounds into visual prompts. Perfect for creating mood-based imagery from audio content.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
            Coming Soon
          </div>
          <div className="flex items-center text-indigo-300 font-medium">
            Preview
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Prompt Enhancer Tool */}
      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white group-hover:text-yellow-300 transition-colors">
            Prompt Enhancer
          </h3>
        </div>
        <p className="text-purple-200 mb-6 leading-relaxed">
          Take your basic prompts to the next level. Add style keywords, improve clarity, and optimize for better AI generation results.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-purple-300">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            AI Enhancement
          </div>
           <Link  className="flex items-center text-blue-300 font-small" href="prompt-enhancer">Try Now
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg></Link>
        </div>
      </div>
    </div>

    {/* Client-side Interactive Components */}
    <div className="text-center mb-8">
      <span className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full shadow-lg">
        {t('poweredBy')}
      </span>
    </div>
    
    {/* These components can be client-side since they need interactivity */}
    {/* <ImageToPromptGenerator />
    <ImgPromptGenerator/>
    <PromptToImageGenerator /> */}
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('powerfulFeatures')}
            </h2>
            <p className="text-purple-200 text-lg">
              {t('featuresDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('lightningFast')}</h3>
              <p className="text-purple-200">{t('lightningFastDesc')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('securePrivate')}</h3>
              <p className="text-purple-200">{t('securePrivateDesc')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Globe className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('globalAccess')}</h3>
              <p className="text-purple-200">{t('globalAccessDesc')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Users className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('teamCollaboration')}</h3>
              <p className="text-purple-200">{t('teamCollaborationDesc')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Clock className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('support247')}</h3>
              <p className="text-purple-200">{t('support247Desc')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{t('premiumQuality')}</h3>
              <p className="text-purple-200">{t('premiumQualityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('userTestimonials', 'What Our Users Say')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-200 mb-4">
                {t('testimonial1', 'This tool has revolutionized my workflow. The prompts are incredibly detailed and accurate!')}
              </p>
              <div className="text-white font-semibold">{t('user1Name', 'Sarah Ahmed')}</div>
              <div className="text-purple-300 text-sm">{t('user1Title', 'Digital Artist')}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-200 mb-4">
                {t('testimonial2', 'Perfect for my design agency. We save hours of work with these AI-generated prompts.')}
              </p>
              <div className="text-white font-semibold">{t('user2Name', 'Rafiq Hassan')}</div>
              <div className="text-purple-300 text-sm">{t('user2Title', 'Creative Director')}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-200 mb-4">
                {t('testimonial3', 'The Veo3 generator creates amazing video prompts. Quality is outstanding!')}
              </p>
              <div className="text-white font-semibold">{t('user3Name', 'Fatima Khan')}</div>
              <div className="text-purple-300 text-sm">{t('user3Title', 'Content Creator')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('ctaTitle', 'Ready to Transform Your Images?')}
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            {t('ctaDescription', 'Join thousands of creators who are already using AI Prompt Studio to enhance their creative workflow')}
          </p>
          <Link href="/auth/register" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center">
            {t('getStarted')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}