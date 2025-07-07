'use client';

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogFilter({ initialPosts, categories }) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === 'All'
      ? initialPosts
      : initialPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      {/* Categories */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  category === selectedCategory
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-purple-200">No blog posts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all hover:transform hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || '/default-image.jpg'}
                      alt={post.title}
                      width={400}
                      height={192}
                       className="w-full h-auto max-h-96 object-contain"
                      onError={(e) => {
                        e.target.src = '/default-image.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-purple-300 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date ? new Date(post.date).toLocaleDateString() : 'No date'}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post?.slug}`}
                      className="inline-flex items-center text-purple-300 hover:text-white transition-colors font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}