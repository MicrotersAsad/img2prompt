// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import I18nProvider from '../components/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Prompt Studio - Transform Images into Professional AI Prompts',
  description: 'Generate detailed AI prompts from your images using Azure OpenAI. Perfect for Midjourney, DALL-E, and other AI image generators.',
  keywords: 'AI prompts, image to prompt, Azure OpenAI, Midjourney, DALL-E, AI image generation',
  authors: [{ name: 'AI Prompt Studio' }],
  creator: 'AI Prompt Studio',
  publisher: 'AI Prompt Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aiprompt.studio'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Prompt Studio - Transform Images into Professional AI Prompts',
    description: 'Generate detailed AI prompts from your images using Azure OpenAI. Perfect for Midjourney, DALL-E, and other AI image generators.',
    url: 'https://aiprompt.studio',
    siteName: 'AI Prompt Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Studio - Transform Images into Professional AI Prompts',
    description: 'Generate detailed AI prompts from your images using Azure OpenAI.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}