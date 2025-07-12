import { Suspense } from 'react';
// import { Metadata } from 'next'; // Removed TypeScript type import for JS compatibility
import PromptToImageGenerator from '@/components/PromptToImage';
import Layout from '@/components/Layout';

// SEO Metadata configuration
export const metadata = {
  title: 'AI Image Generator - Create Stunning Visuals from Text Prompts',
  description: 'Transform your ideas into images with our AI-powered prompt-to-image generator. Create unique visuals effortlessly.',
  keywords: ['AI image generator', 'prompt to image', 'text to image', 'AI art', 'image creation tool'],
  openGraph: {
    title: 'AI Image Generator - Create Stunning Visuals',
    description: 'Use our AI tool to generate beautiful images from text prompts in seconds.',
    url: 'https://yourwebsite.com/image-generator', // Replace with actual URL
    siteName: 'YourWebsiteName', // Replace with actual site name
    images: [
      {
        url: 'https://yourwebsite.com/og-image.jpg', // Replace with actual image URL
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
    title: 'AI Image Generator - Create Stunning Visuals',
    description: 'Generate unique images from text prompts with our AI-powered tool.',
    images: ['https://yourwebsite.com/twitter-image.jpg'], // Replace with actual image URL
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
    canonical: 'http://img2prompt.net/prompt-to-image', // Replace with actual URL
  },
};

export default async function Page() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <PromptToImageGenerator />
      </Suspense>
      
    </Layout>
  );
}