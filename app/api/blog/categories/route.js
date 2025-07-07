// api/blog/categories/route.js - GET & POST categories
import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    const categories = await db.collection('categories')
      .find({ status: 'active' })
      .sort({ name: 1 })
      .toArray();

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

    const { name, description, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Check if slug already exists
    const existing = await db.collection('categories').findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    const category = await db.collection('categories').insertOne({
      name,
      description: description || '',
      slug,
      status: 'active',
      createdAt: new Date(),
      createdBy: user._id
    });

    return NextResponse.json({
      success: true,
      category: {
        _id: category.insertedId,
        name,
        description,
        slug,
        status: 'active',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}

