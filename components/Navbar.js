// components/Navbar.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Settings, 
  History, 
  ChevronDown, 
  Menu, 
  X,
  Wand2,
  Image,
  Zap,
  Video,
  Mic,
  Palette,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { t, ready } = useTranslation();
  const { user, logout } = useAuth(); // Get logout function from useAuth
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);

  // SSR hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setShowToolsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClient]);

  // Tools data
  const tools = [
    {
      name: 'Image to Prompt',
      description: 'Convert images into detailed prompts',
      icon: Image,
      href: 'image-to-prompt',
      color: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      name: 'Prompt to Image',
      description: 'Generate images from text prompts',
      icon: Sparkles,
      href: 'prompt-to-image',
      color: 'from-purple-500 to-pink-500',
      available: true
    },
    {
      name: 'Prompt Enhancer',
      description: 'Enhance and optimize your prompts',
      icon: Wand2,
      href: 'prompt-enhancer',
      color: 'from-yellow-500 to-orange-500',
      available: true
    },
    {
      name: 'Smart Generator',
      description: 'AI-powered prompt generation',
      icon: Zap,
      href: 'smart-generator',
      color: 'from-green-500 to-emerald-500',
      available: true
    },
    {
      name: 'Video to Prompt',
      description: 'Extract prompts from videos',
      icon: Video,
      href: 'video-to-prompt',
      color: 'from-red-500 to-orange-500',
      available: false
    },
    {
      name: 'Audio to Prompt',
      description: 'Convert audio to visual prompts',
      icon: Mic,
      href: 'audio-to-prompt',
      color: 'from-indigo-500 to-purple-600',
      available: false
    }
  ];

  const handleLogout = () => {
    if (!isClient) return;
    
    // Use the logout function from useAuth hook
    if (logout) {
      logout(); // This will redirect to login page
    } else {
      // Fallback method
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      window.location.href = '/auth/login'; // Changed to login page
    }
    
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const closeToolsDropdown = () => {
    setShowToolsDropdown(false);
  };

  // Safe translation function with fallbacks
  const safeT = (key, fallback) => {
    if (!ready || !isClient) return fallback;
    try {
      return t(key) || fallback;
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-2" />
            <span className="text-xl font-bold text-white">
              {safeT('title', 'AI Prompt Studio')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
              {safeT('home', 'Home')}
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors focus:outline-none"
              >
              
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Tools Dropdown Menu */}
              {showToolsDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden">
                  <div className="p-4 border-b border-purple-500/30">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-300" />
                      AI Tools
                    </h3>
                    <p className="text-purple-200 text-xs mt-1">Professional AI prompt tools</p>
                  </div>
                  
                  <div className="py-2">
                    {tools.map((tool, index) => {
                      const IconComponent = tool.icon;
                      return (
                        <Link
                          key={index}
                          href={tool.available ? tool.href : '#'}
                          className={`group flex items-center px-4 py-3 transition-all ${
                            tool.available 
                              ? 'hover:bg-purple-800/50 text-white' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={tool.available ? closeToolsDropdown : (e) => e.preventDefault()}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r ${tool.color} ${!tool.available && 'opacity-50 grayscale'}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{tool.name}</h4>
                              {!tool.available && (
                                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-purple-200 mt-0.5">{tool.description}</p>
                          </div>
                          {tool.available && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronDown className="w-4 h-4 text-purple-300 -rotate-90" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="p-4 border-t border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                    <Link
                      href="/tools"
                      className="block text-center text-sm text-purple-200 hover:text-white transition-colors"
                      onClick={closeToolsDropdown}
                    >
                      View All Tools →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="text-white hover:text-yellow-400 transition-colors">
              {safeT('blog', 'Blog')}
            </Link>
            <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors">
              {safeT('contact', 'Contact')}
            </Link>
            <Link href="/pricing" className="text-white hover:text-yellow-400 transition-colors">
              Pricing
            </Link>

            {/* Language Switcher - only show on client */}
            {isClient && <LanguageSwitcher />}

            {/* User Authentication Section - SSR Safe */}
            {isClient && user ? (
              // Logged in user dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-purple-500/30 overflow-hidden">
                    <div className="px-4 py-3 border-b border-purple-500/30">
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <p className="text-purple-200 text-xs">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-purple-200 hover:bg-purple-800/50 hover:text-white transition-colors"
                        onClick={closeDropdown}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard?tab=history"
                        className="flex items-center px-4 py-2 text-purple-200 hover:bg-purple-800/50 hover:text-white transition-colors"
                        onClick={closeDropdown}
                      >
                        <History className="w-4 h-4 mr-3" />
                        History
                      </Link>
                      
                      <Link
                        href="/dashboard?tab=settings"
                        className="flex items-center px-4 py-2 text-purple-200 hover:bg-purple-800/50 hover:text-white transition-colors"
                        onClick={closeDropdown}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <hr className="border-purple-500/30 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isClient ? (
              // Not logged in - show login/register buttons
              <>
                
                <Link 
                  href="/auth/register" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  {safeT('getStarted', 'Get Started')}
                </Link>
              </>
            ) : (
              // SSR/Loading state - show placeholder
              <div className="flex items-center space-x-4">
                <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-50"></div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:text-yellow-400 transition-colors focus:outline-none"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-lg rounded-lg mt-2 border border-purple-500/30">
              <Link 
                href="/" 
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                onClick={closeMobileMenu}
              >
                {safeT('home', 'Home')}
              </Link>

              {/* Mobile Tools Section */}
              <div className="px-3 py-2">
                <h3 className="text-purple-200 font-semibold text-sm mb-2 flex items-center gap-2">
                 
                  Tools
                </h3>
                <div className="space-y-1 ml-2">
                  {tools.map((tool, index) => {
                    const IconComponent = tool.icon;
                    return (
                      <Link
                        key={index}
                        href={tool.available ? tool.href : '#'}
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                          tool.available 
                            ? 'text-white hover:bg-purple-800/50' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={tool.available ? closeMobileMenu : (e) => e.preventDefault()}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r ${tool.color} ${!tool.available && 'opacity-50 grayscale'}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{tool.name}</span>
                            {!tool.available && (
                              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
                                Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link 
                href="/blog" 
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                onClick={closeMobileMenu}
              >
                {safeT('blog', 'Blog')}
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                onClick={closeMobileMenu}
              >
                {safeT('contact', 'Contact')}
              </Link>
              <Link 
                href="/pricing" 
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>

              {isClient && user ? (
                // Mobile user menu
                <>
                  <div className="px-3 py-2 border-t border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        <p className="text-purple-200 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-purple-200 hover:text-white transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/dashboard?tab=history"
                    className="flex items-center px-3 py-2 text-purple-200 hover:text-white transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <History className="w-4 h-4 mr-3" />
                    History
                  </Link>
                  
                  <Link
                    href="/dashboard?tab=settings"
                    className="flex items-center px-3 py-2 text-purple-200 hover:text-white transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-red-300 hover:text-red-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </>
              ) : isClient ? (
                // Mobile not logged in
                <div className="px-3 py-2 border-t border-purple-500/30 space-y-2">
                  <Link 
                    href="/auth/login" 
                    className="block text-white hover:text-yellow-400 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {safeT('signIn', 'Sign In')}
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                    onClick={closeMobileMenu}
                  >
                    {safeT('getStarted', 'Get Started')}
                  </Link>
                </div>
              ) : (
                // Mobile loading state
                <div className="px-3 py-2 border-t border-purple-500/30">
                  <div className="w-full h-8 bg-gray-700 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;