
import { Suspense } from 'react';

import PromptEnhancerTool from '@/components/PromptEnhancerTool';

// SEO Metadata configuration
export const metadata = {
  title: 'AI Prompt Enhancer – Optimize Your Prompts for Smarter AI Outputs',
  description: 'Refine and supercharge your text prompts with our AI Prompt Enhancer. Get clearer, more effective prompts for image generation, copywriting, chatbots, and more.',
  keywords: [
    'AI prompt enhancer',
    'prompt optimization',
    'text prompt improvement',
    'AI prompt refining',
    'better AI outputs'
  ],
  openGraph: {
    title: 'AI Prompt Enhancer – Optimize Your AI Prompts',
    description: 'Use our AI-powered prompt enhancer to craft precise, high-impact prompts in seconds.',
    url: 'https://yourwebsite.com/prompt-enhancer',
    siteName: 'YourWebsiteName',
    images: [
      {
        url: 'https://yourwebsite.com/og-prompt-enhancer.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Enhancer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Enhancer – Optimize Your AI Prompts',
    description: 'Elevate your AI interactions with our prompt enhancer—get sharper, clearer prompts every time.',
    images: ['https://yourwebsite.com/twitter-prompt-enhancer.jpg'],
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
    canonical: 'http://img2prompt.net/prompt-enhancer',
  },
};

export default async function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptEnhancerTool  />
    </Suspense>
  );
}