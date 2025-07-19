'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react'; // Make sure ArrowRight is imported
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black/40 py-12 px-4">
      {/* CTA Section - Re-added as requested */}
      <section >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('ctaTitle', 'Ready to Transform Your Images?')}
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            {t('ctaDescription', 'Join thousands of creators who are already using AI Prompt Studio to enhance their creative workflow')}
          </p>
          <Link href="/auth/register" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center">
            {t('getStarted', 'Get Started')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto mt-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-lg font-bold text-white">{t('title')}</span>
            </div>
            <p className="text-purple-200 text-sm">
              {t('footerDescription', 'Your AI Prompt Studio helps you generate creative prompts effortlessly.')}
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('product', 'Product')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t('pricing', 'Pricing')}
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  {t('features', 'Features')}
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white transition-colors">
                  {t('api', 'API')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('company', 'Company')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('about', 'About Us')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t('blog', 'Blog')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contact', 'Contact')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('support', 'Support')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  {t('helpCenter', 'Help Center')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t('privacyPolicy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-condition" className="hover:text-white transition-colors">
                  {t('termsOfService', 'Terms & Conditions')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-purple-500/30 mt-8 pt-8 text-center">
          <p className="text-purple-200 text-sm">
            © 2024 {t('title', 'AI Prompt Studio')}. {t('allRightsReserved', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;