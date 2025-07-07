// api/blog/posts/route.js - GET & POST posts
import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Build query
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }
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
          content: 1,
          featuredImage: 1,
          status: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          views: 1,
          'category.name': 1,
          'category.slug': 1,
          'author.name': 1,
          'author.email': 1
        }
      },
      { $sort: { createdAt: -1 } },
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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user || user.email !== 'shoesizeconvert@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      categoryId, 
      featuredImage,
      status = 'draft',
      publishedAt 
    } = await request.json();

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Title, slug, content, and category are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Check if slug already exists
    const existing = await db.collection('posts').findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await db.collection('categories').findOne({ 
      _id: new ObjectId(categoryId) 
    });
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 400 }
      );
    }

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      categoryId: new ObjectId(categoryId),
      authorId: user._id,
      featuredImage: featuredImage || '',
      status,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (status === 'published') {
      postData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    const result = await db.collection('posts').insertOne(postData);

    return NextResponse.json({
      success: true,
      post: {
        _id: result.insertedId,
        ...postData
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
}
