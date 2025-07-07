import { NextResponse } from 'next/server';
import { getUserFromToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

    console.log('Fetching prompts for user:', user._id);

    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Convert user._id to ObjectId if it's a string
    const userId = typeof user._id === 'string' ? new ObjectId(user._id) : user._id;
    
    console.log('Querying with userId:', userId);
    
    // Query prompts collection
    const prompts = await db.collection('prompts')
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    console.log('Found prompts:', prompts.length);
    console.log('Sample prompt:', prompts[0]);

    return NextResponse.json({
      success: true,
      prompts: prompts
    });

  } catch (error) {
    console.error('Prompt history fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch prompt history' },
      { status: 500 }
    );
  }
}