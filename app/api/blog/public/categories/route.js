import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Get categories with post counts
    const categories = await db.collection('categories').aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'posts',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$categoryId', '$$categoryId'] },
                    { $eq: ['$status', 'published'] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'postCount'
        }
      },
      {
        $addFields: {
          postCount: { 
            $ifNull: [{ $arrayElemAt: ['$postCount.count', 0] }, 0] 
          }
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          postCount: 1
        }
      },
      { $sort: { name: 1 } }
    ]).toArray();

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
