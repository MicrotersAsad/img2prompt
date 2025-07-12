
import { Suspense } from 'react';

import ImgPromptGenerator from '@/components/ImgPromptGenerator';
import Layout from '@/components/Layout';
export const metadata = {
  title: 'AI Image Generator – Create Stunning Visuals from Text Prompts',
  description: 'Transform your ideas into beautiful images with our AI Image Generator. Generate unique visuals from text prompts in seconds.',
  keywords: [
    'AI image generator',
    'text to image',
    'prompt to image',
    'AI art',
    'image creation'
  ],
  openGraph: {
    title: 'AI Image Generator – Create Stunning Visuals',
    description: 'Use our AI-powered image generator to bring your text prompts to life with high-quality visuals.',
    url: 'https://yourwebsite.com/image-generator',
    siteName: 'YourWebsiteName',
    images: [
      {
        url: 'https://yourwebsite.com/og-image-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Generator Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Generator – Create Stunning Visuals',
    description: 'Generate one-of-a-kind images from your text prompts with our AI-powered tool.',
    images: ['https://yourwebsite.com/twitter-image-generator.jpg'],
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
    canonical: 'http://img2prompt.net/image-prompt-generator',
  },
};


export default async function Page() {

  return (
    <Layout>


    <Suspense fallback={<div>Loading...</div>}>
      <ImgPromptGenerator  />
    </Suspense>
        </Layout>
  );
}