export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    const post = await db.collection('posts').aggregate([
      { $match: { _id: new ObjectId(id) } },
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
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    return NextResponse.json({
      success: true,
      post: post[0]
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
      status,
      publishedAt 
    } = await request.json();
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Check if slug already exists (excluding current post)
    if (slug) {
      const existing = await db.collection('posts').findOne({ 
        slug, 
        _id: { $ne: new ObjectId(id) } 
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (categoryId) updateData.categoryId = new ObjectId(categoryId);
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (status) {
      updateData.status = status;
      if (status === 'published' && publishedAt) {
        updateData.publishedAt = new Date(publishedAt);
      } else if (status === 'published' && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    const result = await db.collection('posts').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
