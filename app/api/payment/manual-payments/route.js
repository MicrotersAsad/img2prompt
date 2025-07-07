import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    console.log('=== Admin Manual Payments API ===');
    
    // Authorization check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header');
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('❌ Invalid token');
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('✅ Token verified, userId:', decoded.userId);

    // Database connection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Find user with different ID formats
    let userId = decoded.userId;
    let user = null;
    
    // Try different ways to find user
    try {
      if (typeof userId === 'string') {
        user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      } else {
        user = await db.collection('users').findOne({ _id: userId });
      }
    } catch (err) {
      // If ObjectId conversion fails, try as string
      user = await db.collection('users').findOne({ _id: userId.toString() });
    }

    console.log('User found:', !!user);
    console.log('User email:', user?.email);

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is admin
    const isAdmin = user.isAdmin || user.email === 'shoesizeconvert@gmail.com';
    console.log('Is admin:', isAdmin);
    
    if (!isAdmin) {
      console.log('❌ Admin access required');
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all manual payments
    console.log('📊 Fetching manual payments...');
    const payments = await db.collection('manual_payments')
      .find({})
      .sort({ submitted_at: -1 })
      .toArray();

    console.log('✅ Found payments:', payments.length);

    return NextResponse.json({
      success: true,
      payments: payments,
      count: payments.length
    });

  } catch (error) {
    console.error('❌ Admin manual payments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}