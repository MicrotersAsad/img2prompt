// app/api/payment/s/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
  try {
    // Authorization check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Get user's manual payments
    const payments = await db.collection('manual_payments')
      .find({ user_id: decoded.userId })
      .sort({ submitted_at: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      payments: payments
    });

  } catch (error) {
    console.error('Manual payment status error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}