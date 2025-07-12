
import { Suspense } from 'react';

import ImageToPromptGenerator from '@/components/ImageToPromptGenerator';
import Layout from '@/components/Layout';


export const metadata = {
  title: 'Image to Prompt Generator – Convert Images into Descriptive Prompts',
  description: 'Transform your images into detailed text prompts with our Image to Prompt Generator. Effortlessly create descriptions for any image to power your AI-driven creative tools.',
  keywords: [
    'image to prompt',
    'AI prompt generation',
    'image description',
    'image-to-text',
    'visual-to-prompt'
  ],
  openGraph: {
    title: 'Image to Prompt Generator – Convert Images into Descriptive Prompts',
    description: 'Use our Image to Prompt Generator to turn any image into a detailed text prompt for creative AI tools.',
    url: 'https://yourwebsite.com/image-to-prompt-generator',
    siteName: 'YourWebsiteName',
    images: [
      {
        url: 'https://yourwebsite.com/og-image-to-prompt.jpg',
        width: 1200,
        height: 630,
        alt: 'Image to Prompt Generator Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Prompt Generator – Convert Images into Descriptive Prompts',
    description: 'Easily generate AI-compatible text prompts from your images with our tool.',
    images: ['https://yourwebsite.com/twitter-image-to-prompt.jpg'],
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
  alternates: {
    canonical: 'https://yourwebsite.com/image-to-prompt-generator',
  },
};

export default async function Page() {

  return (
    <Layout>


    <Suspense fallback={<div>Loading...</div>}>
      <ImageToPromptGenerator  />
    </Suspense>
        </Layout>
  );
}