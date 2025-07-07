// app/blog/[slug]/page.js
import React from 'react';
import { Calendar, User, ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout';

// Generate metadata dynamically
export async function generateMetadata({ params }) {
    console.log(``, '🔍 Generating metadata for post:', params.slug);
    
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://img2prompt-three.vercel.app';
    const res = await fetch(`${API_BASE_URL}/api/blog/public/posts/${params.slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Post Not Found - AI Prompt Studio',
        description: 'The requested blog post could not be found.',
      };
    }

    const data = await res.json();
    const post = data.success ? data.post : null;

    if (!post) {
      return {
        title: 'Post Not Found - AI Prompt Studio',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: `${post.title} - AI Prompt Studio Blog`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author?.name || 'AI Prompt Studio'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'AI Prompt Studio Blog',
      description: 'Latest insights about AI and creative workflows',
    };
  }
}

// Main component
export default async function BlogPostPage({ params }) {
  console.log('🔍 Single post page - slug:', params.slug);

  let post = null;
  let relatedPosts = [];

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://img2prompt-three.vercel.app';
    
    // Fetch single post by slug
    console.log('📖 Fetching post:', `${API_BASE_URL}/api/blog/public/posts/${params.slug}`);
    const postRes = await fetch(`${API_BASE_URL}/api/blog/public/posts/${params.slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📖 Post response status:', postRes.status);

    if (postRes.ok) {
      const postData = await postRes.json();
      console.log('📖 Post API response:', postData);

      if (postData.success && postData.post) {
        post = {
          id: postData.post._id,
          title: postData.post.title,
          content: postData.post.content,
          excerpt: postData.post.excerpt,
          category: postData.post.category?.name || 'Uncategorized',
          author: postData.post.author?.name || 'Unknown Author',
          date: postData.post.publishedAt,
          views: postData.post.views || 0,
          readTime: `${Math.ceil((postData.post.content?.length || 1000) / 1000)} min read`,
          image: postData.post.featuredImage || '/default-image.jpg',
          slug: postData.post.slug
        };

        // Fetch related posts from the same category
        if (postData.post.categoryId) {
          const relatedRes = await fetch(
            `${API_BASE_URL}/api/blog/public/posts?category=${postData.post.categoryId}&limit=3`,
            {
              cache: 'no-store',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            if (relatedData.success && relatedData.posts) {
              relatedPosts = relatedData.posts
                .filter(p => p._id !== postData.post._id) // Exclude current post
                .slice(0, 3)
                .map(p => ({
                  id: p._id,
                  title: p.title,
                  excerpt: p.excerpt,
                  category: p.category?.name || 'Uncategorized',
                  author: p.author?.name || 'Unknown',
                  date: p.publishedAt,
                  image: p.featuredImage || '/default-image.jpg',
                  slug: p.slug
                }));
            }
          }
        }
      }
    }

    // If post not found, show 404
    if (!post) {
      console.log('❌ Post not found for slug:', params.slug);
      notFound();
    }

  } catch (error) {
    console.error('💥 Error fetching post:', error);
    notFound();
  }

  return (
    <Layout>
      <article className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link 
              href="/blog" 
              className="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Category badge */}
            <div className="mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-purple-300 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-purple-200 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Featured Image */}
        {/* {post.image && post.image !== '/default-image.jpg' && (
          <section className="px-4 mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  
                />
              </div>
            </div>
          </section>
        )} */}

        {/* Content */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg prose-invert prose-purple max-w-none"
              style={{
                '--tw-prose-body': 'rgb(196 181 253)',
                '--tw-prose-headings': 'rgb(255 255 255)',
                '--tw-prose-links': 'rgb(147 197 253)',
                '--tw-prose-strong': 'rgb(255 255 255)',
                '--tw-prose-code': 'rgb(196 181 253)',
                '--tw-prose-quotes': 'rgb(196 181 253)',
              }}
              dangerouslySetInnerHTML={{ 
                __html: post.content || '<p>Content not available.</p>' 
              }}
            />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-4 pb-20">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all hover:transform hover:scale-105"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-image.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-purple-300 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{relatedPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-purple-300 hover:text-white transition-colors font-medium"
                      >
                        Read More
                        <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}