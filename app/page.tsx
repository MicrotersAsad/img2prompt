// app/page.js - Homepage with Translation Support
'use client';

import React from 'react';
import { Sparkles, Zap, Shield, Globe, ArrowRight, Star, Users, Clock, Video, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import ImageToPromptGenerator from '../components/ImageToPromptGenerator';
import Veo3Generator from '../components/Veo3Generator';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout>
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

          {/* Client-side Interactive Components */}
          <div className="text-center mb-8">
            <span className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full shadow-lg">
              {t('poweredBy')}
            </span>
          </div>
          
          {/* These components can be client-side since they need interactivity */}
          <ImageToPromptGenerator />
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