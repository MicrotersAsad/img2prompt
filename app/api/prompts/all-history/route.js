// Create this file: /api/prompts/all-history/route.js

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserFromToken } from '@/lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.email !== 'shoesizeconvert@gmail.com') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin fetching all prompts');

    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Get all prompts with user information
    const prompts = await db.collection('prompts').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ['$userInfo.name', 0] },
          userEmail: { $arrayElemAt: ['$userInfo.email', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          prompt: 1,
          type: 1,
          style: 1,
          createdAt: 1,
          userName: 1,
          userEmail: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 100 // Limit to latest 100 prompts
      }
    ]).toArray();

    console.log('Found prompts for admin:', prompts.length);

    return NextResponse.json({
      success: true,
      prompts: prompts
    });

  } catch (error) {
    console.error('Admin prompt history fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch prompt history' },
      { status: 500 }
    );
  }
}