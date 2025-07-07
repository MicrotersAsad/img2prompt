// api/blog/categories/[id]/route.js - UPDATE & DELETE category
import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../../lib/auth';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

    const { name, description, slug, status } = await request.json();
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Check if slug already exists (excluding current category)
    if (slug) {
      const existing = await db.collection('categories').findOne({ 
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
      updatedAt: new Date(),
      updatedBy: user._id
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (slug) updateData.slug = slug;
    if (status) updateData.status = status;

    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
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

    // Check if category has posts
    const postsCount = await db.collection('posts').countDocuments({ 
      categoryId: new ObjectId(id) 
    });

    if (postsCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    const result = await db.collection('categories').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}