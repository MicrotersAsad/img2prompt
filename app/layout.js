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
          {/* <WhatsAppButton/> */}
          <a
  href="https://wa.me/8801234567890?text=Hi!%20I%20need%20help"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
>
 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 32 32" fill="currentColor">
    <path d="M16.001 3.2C9.076 3.2 3.2 9.076 3.2 16.001a12.732 12.732 0 001.768 6.487l-1.841 6.73 6.885-1.806a12.716 12.716 0 005.989 1.527c6.926 0 12.8-5.876 12.8-12.8S22.926 3.2 16.001 3.2zM16 27.2c-2.01 0-3.964-.535-5.68-1.55l-.408-.238-4.082 1.066 1.091-3.982-.264-.411A10.558 10.558 0 015.6 16.001C5.6 10.8 10.8 5.6 16.001 5.6S26.4 10.8 26.4 16s-4.8 11.2-10.4 11.2zm5.165-8.207c-.283-.141-1.677-.83-1.938-.923s-.45-.141-.638.141c-.189.283-.73.923-.894 1.112-.165.188-.33.212-.614.071-.283-.142-1.194-.439-2.275-1.398-.84-.748-1.405-1.674-1.57-1.957-.165-.283-.018-.436.124-.577.127-.126.283-.33.424-.495.142-.165.189-.283.283-.472.095-.189.047-.354-.024-.495s-.638-1.541-.875-2.111c-.23-.552-.463-.476-.638-.485-.165-.007-.354-.009-.544-.009s-.495.071-.754.354c-.26.283-.993.97-.993 2.366s1.017 2.744 1.159 2.933c.142.188 1.996 3.053 4.844 4.276.678.291 1.206.465 1.617.595.679.217 1.296.187 1.783.114.544-.08 1.677-.685 1.916-1.35.236-.665.236-1.236.165-1.35-.07-.118-.26-.189-.544-.33z" />
  </svg>
</a>

          {children}
        </I18nProvider>
      </body>
    </html>
  );
}