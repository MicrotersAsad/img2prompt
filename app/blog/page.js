// app/blog/page.js
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import BlogFilter from './BlogFilter';

// Mock data function for development
function getMockPosts() {
  return [
    {
      id: '1',
      title: 'Getting Started with AI Prompt Engineering',
      excerpt: 'Learn the fundamentals of creating effective prompts for AI models and boost your creative workflow.',
      category: 'Tutorials',
      author: 'John Doe',
      date: '2024-01-15',
      readTime: '5 min read',
      image: '/blog/prompt-engineering.jpg'
    },
    {
      id: '2',
      title: '10 Creative AI Workflow Tips',
      excerpt: 'Discover advanced techniques to streamline your creative process using AI tools and automation.',
      category: 'Tips',
      author: 'Jane Smith',
      date: '2024-01-10',
      readTime: '8 min read',
      image: '/blog/workflow-tips.jpg'
    },
    {
      id: '3',
      title: 'The Future of AI in Creative Industries',
      excerpt: 'Explore how artificial intelligence is transforming creative workflows and what it means for professionals.',
      category: 'AI',
      author: 'Mike Johnson',
      date: '2024-01-05',
      readTime: '12 min read',
      image: '/blog/ai-future.jpg'
    }
  ];
}

// Metadata for SEO
export const metadata = {
  title: 'Blog - AI Prompt Studio',
  description: 'Latest insights, tips, and tutorials about AI prompt generation and creative workflows',
};

// Main Server Component
export default async function BlogPage() {
  // Fetch data server-side
  let blogPosts = [];
  let categories = ['All'];

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log('API Base URL:', API_BASE_URL);
    
    // Fetch blog posts - using the correct endpoint
    const postRes = await fetch(`${API_BASE_URL}/api/blog/public/posts`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Fetching blog posts from:', `${API_BASE_URL}/api/blog/public/posts`);
    
    if (postRes.ok) {
      const postData = await postRes.json();
      console.log('Posts API response:', postData);
      
      if (postData.success && postData.posts) {
        // Transform the data to match frontend expectations
        blogPosts = postData.posts.map(post => ({
          id: post._id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category?.name || 'Uncategorized',
          author: post.author?.name || 'Unknown Author',
          date: post.publishedAt,
          readTime: `${Math.ceil((post.excerpt?.length || 100) / 200)} min read`, // Estimate reading time
          image: post.featuredImage || '/default-image.jpg'
        }));
      }
    } else {
      console.error('Blog posts API response:', postRes.status, postRes.statusText);
    }

    // Fetch categories - using the correct endpoint
    const categoryRes = await fetch(`${API_BASE_URL}/api/blog/public/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (categoryRes.ok) {
      const categoryData = await categoryRes.json();
      console.log('Categories API response:', categoryData);
      
      if (categoryData.success && categoryData.categories) {
        // Transform categories data
        const categoryNames = categoryData.categories.map(cat => cat.name);
        categories = ['All', ...categoryNames];
      }
    } else {
      console.error('Categories API response:', categoryRes.status, categoryRes.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    // For development, you can add some mock data
    if (process.env.NODE_ENV === 'development') {
      blogPosts = getMockPosts();
      categories = ['All', 'AI', 'Tutorials', 'Tips', 'Workflows'];
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 mb-4">
              AI Prompt Studio Blog
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Insights, tutorials, and the latest trends in AI-powered creative workflows
            </p>
          </div>
        </section>

        {/* Pass data to client component for filtering */}
        <BlogFilter initialPosts={blogPosts} categories={categories} />
      </div>
    </Layout>
  );
}