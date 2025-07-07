// components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  className = '',
  navbarProps = {},
  footerProps = {} 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 ${className}`}>
      {/* Global Navbar - SSR Safe */}
      {showNavbar && <Navbar {...navbarProps} />}
      
      {/* Main Content */}
      <main className={showNavbar ? 'pt-16' : ''}>
        {children}
      </main>
      
      {/* Global Footer - SSR Safe */}
      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

export default Layout;