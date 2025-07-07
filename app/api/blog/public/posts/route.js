// api/blog/public/posts/route.js - Public posts endpoint
import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;
    const search = searchParams.get('search');

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Build query - only published posts
    let query = { status: 'published' };
    
    if (category) {
      query.categoryId = new ObjectId(category);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Get posts with category information
    const posts = await db.collection('posts').aggregate([
      { $match: query },
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
          excerpt: 1,
          featuredImage: 1,
          publishedAt: 1,
          views: 1,
          'category.name': 1,
          'category.slug': 1,
          'author.name': 1
        }
      },
      { $sort: { publishedAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray();

    const total = await db.collection('posts').countDocuments(query);

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}