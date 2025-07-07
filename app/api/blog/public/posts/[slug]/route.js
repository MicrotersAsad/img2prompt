import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// api/blog/public/posts/[slug]/route.js - Single post by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const client = await clientPromise
    const db = client.db('imgtoprompt');

    const post = await db.collection('posts').aggregate([
      { 
        $match: { 
          slug: slug,
          status: 'published'
        } 
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] },
          author: { $arrayElemAt: ['$author', 0] }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          content: 1,
          excerpt: 1,
          featuredImage: 1,
          publishedAt: 1,
          views: 1,
          'category.name': 1,
          'category.slug': 1,
          'author.name': 1,
          'author.email': 1
        }
      }
    ]).toArray();

    if (post.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await db.collection('posts').updateOne(
      { slug: slug },
      { $inc: { views: 1 } }
    );

    // Get related posts
    const relatedPosts = await db.collection('posts').aggregate([
      { 
        $match: { 
          categoryId: post[0].category._id,
          slug: { $ne: slug },
          status: 'published'
        } 
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $addFields: {
          category: { $arrayElemAt: ['$category', 0] }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          excerpt: 1,
          featuredImage: 1,
          publishedAt: 1,
          'category.name': 1,
          'category.slug': 1
        }
      },
      { $sort: { publishedAt: -1 } },
      { $limit: 3 }
    ]).toArray();

    return NextResponse.json({
      success: true,
      post: post[0],
      relatedPosts
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}