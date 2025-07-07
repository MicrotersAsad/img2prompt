'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Shield, Globe, ArrowRight, Star, Users, Clock, Video, Image as ImageIcon, User } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ImageToPromptGenerator from '../components/ImageToPromptGenerator';
import Veo3Generator from '../components/Veo3Generator';
import LanguageSwitcher from '../components/LanguageSwitcher';
import '../lib/i18n';

export default function HomePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('image-to-prompt');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setIsLoggedIn(true);
              setUser(data.user);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-2" />
              <span className="text-xl font-bold text-white">{t('title')}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
                {t('home')}
              </Link>
              <Link href="/blog" className="text-white hover:text-yellow-400 transition-colors">
                {t('blog')}
              </Link>
              <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors">
                {t('contact')}
              </Link>
              
              {/* Conditional rendering based on login status */}
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="flex items-center text-white hover:text-yellow-400 transition-colors">
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-purple-200 text-sm">
                      Welcome, {user?.name || 'User'}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="text-white hover:text-yellow-400 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/auth/login" className="text-white hover:text-yellow-400 transition-colors">
                  {t('signIn')}
                </Link>
              )}
              
              <LanguageSwitcher />
              
              {!isLoggedIn && (
                <Link href="/pricing" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  {t('getStarted')}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              ) : (
                <Link href="/auth/login" className="text-white hover:text-yellow-400 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

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
            {isLoggedIn ? (
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <Link href="/auth/register" className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center">
                {t('startCreating')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}
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
              AI Prompt Generators
            </h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Choose from our powerful AI tools to create professional prompts for different platforms
            </p>
          </div>

          {/* Tool Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-2 border border-purple-500/20">
              <button
                onClick={() => setActiveTab('image-to-prompt')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'image-to-prompt'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                {t('imageToPrompt')}
              </button>
              <button
                onClick={() => setActiveTab('veo3-generator')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'veo3-generator'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <Video className="w-5 h-5" />
                {t('veo3Generator')}
              </button>
            </div>
          </div>

          {/* Tool Description */}
          <div className="text-center mb-8">
            <p className="text-purple-200 text-lg">
              {activeTab === 'image-to-prompt' ? t('transformImages') : t('generateVideoPrompts')}
            </p>
            <span className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full shadow-lg">
              {t('poweredBy')}
            </span>
          </div>
          
          {/* Active Tool */}
          {activeTab === 'image-to-prompt' ? <ImageToPromptGenerator /> : <Veo3Generator />}
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
              What Our Users Say
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
                "This tool has revolutionized my workflow. The prompts are incredibly detailed and accurate!"
              </p>
              <div className="text-white font-semibold">Sarah Ahmed</div>
              <div className="text-purple-300 text-sm">Digital Artist</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-200 mb-4">
                "Perfect for my design agency. We save hours of work with these AI-generated prompts."
              </p>
              <div className="text-white font-semibold">Rafiq Hassan</div>
              <div className="text-purple-300 text-sm">Creative Director</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-200 mb-4">
                The Veo3 generator creates amazing video prompts. Quality is outstanding!
              </p>
              <div className="text-white font-semibold">Fatima Khan</div>
              <div className="text-purple-300 text-sm">Content Creator</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Images?
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Join thousands of creators who are already using AI Prompt Studio to enhance their creative workflow
          </p>
          {isLoggedIn ? (
            <Link href="/dashboard" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center">
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          ) : (
            <Link href="/auth/register" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center">
              {t('getStarted')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-lg font-bold text-white">{t('title')}</span>
              </div>
              <p className="text-purple-200 text-sm">
                {t('footerDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t('product')}</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition-colors">{t('pricing')}</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">{t('features')}</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">{t('api')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t('company')}</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">{t('blog')}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">{t('helpCenter')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">{t('termsOfService')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/30 mt-8 pt-8 text-center">
            <p className="text-purple-200 text-sm">
              © 2024 {t('title')}. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}