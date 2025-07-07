// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Authorization header থেকে token নিন
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or invalid format');
      return NextResponse.json(
        { success: false, message: 'Authorization header missing' },
        { status: 401 }
      );
    }

    // Bearer token থেকে token extract করুন
    const token = authHeader.substring(7); // "Bearer " remove করুন
    
    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { success: false, message: 'Token missing' },
        { status: 401 }
      );
    }

    // Token verify করুন
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('Invalid token');
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Database থেকে user data fetch করুন
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // userId string হলে ObjectId তে convert করুন
    let userId = decoded.userId;
    if (typeof userId === 'string') {
      userId = new ObjectId(userId);
    }
    
    const user = await db.collection('users').findOne({ _id: userId });
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Password field remove করুন response থেকে
    const { password, ...userWithoutPassword } = user;
    
    console.log('User authenticated successfully:', user.email);
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}