// app/api/payment/manual-submit/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('=== Manual Payment Submission ===');
    
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

    // Get request data
    const body = await request.json();
    const { 
      plan, 
      amount, 
      payment_method, 
      sender_number, 
      transaction_id, 
      billing_cycle 
    } = body;

    // Validate required fields
    if (!plan || !amount || !payment_method || !sender_number || !transaction_id) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required'
      }, { status: 400 });
    }

    // Get user data
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    let userId = decoded.userId;
    let user = null;
    
    // Find user with different ID formats
    user = await db.collection('users').findOne({ _id: userId });
    if (!user && typeof userId === 'string') {
      try {
        user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      } catch (err) {
        console.log('ObjectId conversion failed:', err.message);
      }
    }
    if (!user) {
      user = await db.collection('users').findOne({ _id: userId.toString() });
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Check for duplicate transaction ID
    const existingPayment = await db.collection('manual_payments').findOne({
      transaction_id: transaction_id
    });

    if (existingPayment) {
      return NextResponse.json({
        success: false,
        message: 'This transaction ID has already been submitted'
      }, { status: 400 });
    }

    // Generate unique payment reference
    const payment_ref = `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store manual payment details
    const manualPayment = {
      payment_reference: payment_ref,
      user_id: user._id,
      user_email: user.email,
      user_name: user.name,
      
      // Plan details
      plan: plan,
      amount: parseFloat(amount),
      currency: 'BDT',
      billing_cycle: billing_cycle || 'monthly',
      
      // Payment details
      payment_method: payment_method,
      sender_number: sender_number,
      transaction_id: transaction_id,
      
      // Status
      status: 'pending', // pending, approved, rejected
      submitted_at: new Date(),
      verified_at: null,
      verified_by: null,
      admin_notes: '',
      
      // Metadata
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    };

    await db.collection('manual_payments').insertOne(manualPayment);
    
    console.log('Manual payment submitted:', {
      payment_ref,
      user: user.email,
      plan,
      amount,
      method: payment_method,
      transaction_id
    });

    // Send notification email to admin (optional)
    // You can add email notification logic here

    return NextResponse.json({
      success: true,
      message: 'Payment details submitted successfully',
      payment_reference: payment_ref,
      status: 'pending'
    });

  } catch (error) {
    console.error('Manual payment submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

