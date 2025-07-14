// components/Footer.js
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black/40 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-lg font-bold text-white">{t('title')}</span>
            </div>
            <p className="text-purple-200 text-sm">
              {t('footerDescription')}
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('product')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white transition-colors">
                  {t('api')}
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
            <h4 className="text-white font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contact')}
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
            <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-condition" className="hover:text-white transition-colors">
                  {t('termsOfService')}
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
            © 2024 {t('title')}. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;