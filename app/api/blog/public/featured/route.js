import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Get most viewed posts as featured
    const featuredPosts = await db.collection('posts').aggregate([
      { $match: { status: 'published' } },
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
      { $sort: { views: -1, publishedAt: -1 } },
      { $limit: 4 }
    ]).toArray();

    return NextResponse.json({
      success: true,
      posts: featuredPosts
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured posts' },
      { status: 500 }
    );
  }
}