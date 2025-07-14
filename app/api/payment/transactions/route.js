import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Authorization check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Authorization required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Check if user is admin
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user || (!user.isAdmin && user.email !== 'shoesizeconvert@gmail.com')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Fetch transactions with user and order details
    const transactions = await db.collection('transactions').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'orders',
          localField: 'order_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          transaction_id: 1,
          user_id: 1,
          user_name: '$user.name',
          user_email: '$user.email',
          customer_phone: 1,
          amount: 1,
          currency: 1,
          plan: 1,
          billing_cycle: 1,
          order_id: 1,
          order: 1,
          status: 1,
          payment_provider: 1,
          created_at: 1,
          updated_at: 1,
        },
      },
    ]).toArray();

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}