// components/LanguageSwitcher.js
'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get initial language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('language') || 'en';
    setCurrentLang(savedLang);
    
    // Change i18n language if different from saved
    if (i18n && i18n.changeLanguage && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleLanguage = () => {
    if (!isClient || !i18n || typeof i18n.changeLanguage !== 'function') {
      console.error('i18n not ready or changeLanguage not available');
      return;
    }

    const newLang = currentLang === 'en' ? 'bn' : 'en';
    
    try {
      i18n.changeLanguage(newLang);
      setCurrentLang(newLang);
      localStorage.setItem('language', newLang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Don't render on server or if client not ready
  if (!isClient) {
    return (
      <div className="flex items-center gap-2 text-purple-200">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">English</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors focus:outline-none"
      title="Switch Language"
      type="button"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {currentLang === 'en' ? 'বাংলা' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;