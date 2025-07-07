import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/auth';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
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

    const { payment_id, reason } = await request.json();

    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Check admin access
    const adminUser = await db.collection('users').findOne({ _id: decoded.userId });
    if (!adminUser || (!adminUser.isAdmin && adminUser.email !== 'shoesizeconvert@gmail.com')) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get payment details
    const payment = await db.collection('manual_payments').findOne({ 
      _id: new ObjectId(payment_id) 
    });

    if (!payment) {
      return NextResponse.json({
        success: false,
        message: 'Payment not found'
      }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({
        success: false,
        message: 'Payment already processed'
      }, { status: 400 });
    }

    // Update payment status
    await db.collection('manual_payments').updateOne(
      { _id: new ObjectId(payment_id) },
      {
        $set: {
          status: 'rejected',
          verified_at: new Date(),
          verified_by: adminUser.email,
          admin_notes: reason || 'Payment rejected'
        }
      }
    );

    console.log('Payment rejected:', {
      payment_id,
      user_id: payment.user_id,
      reason,
      rejected_by: adminUser.email
    });

    return NextResponse.json({
      success: true,
      message: 'Payment rejected successfully'
    });

  } catch (error) {
    console.error('Payment rejection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}