// app/api/admin/manual-payments/approve/route.js
import { NextResponse } from 'next/server';

import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

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

    const { payment_id } = await request.json();

    if (!payment_id) {
      return NextResponse.json(
        { success: false, message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    // Check admin access - Fix: Use ObjectId for user lookup
    const adminUser = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    
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

    // Validate required payment fields
    if (!payment.plan) {
      return NextResponse.json({
        success: false,
        message: 'Payment plan is missing'
      }, { status: 400 });
    }

    if (!payment.user_id) {
      return NextResponse.json({
        success: false,
        message: 'Payment user ID is missing'
      }, { status: 400 });
    }

    console.log('Processing payment approval for:', {
      payment_id,
      plan: payment.plan,
      user_id: payment.user_id,
      billing_cycle: payment.billing_cycle,
      amount: payment.amount
    });

    // Update payment status
    await db.collection('manual_payments').updateOne(
      { _id: new ObjectId(payment_id) },
      {
        $set: {
          status: 'approved',
          verified_at: new Date(),
          verified_by: adminUser.email,
          admin_notes: 'Payment approved by admin'
        }
      }
    );

    // Determine prompts limit based on plan
    let promptsLimit = 50; // Default for starter/free
    let planName = 'starter';
    
    // Normalize plan name for comparison - with better validation
    const normalizedPlan = (payment.plan || '').toLowerCase().trim();
    
    if (!normalizedPlan) {
      console.error('Empty plan detected, using default starter plan');
      planName = 'starter';
      promptsLimit = 50;
    } else if (normalizedPlan.includes('professional') || normalizedPlan.includes('pro')) {
      promptsLimit = 500;
      planName = 'professional';
    } else if (normalizedPlan.includes('lifetime') || normalizedPlan.includes('deal')) {
      promptsLimit = 999999;
      planName = 'lifetime';
    } else if (normalizedPlan.includes('starter')) {
      promptsLimit = 50;
      planName = 'starter';
    } else {
      // Handle unknown plans
      console.warn('Unknown plan detected:', payment.plan, '- using starter as fallback');
      planName = 'starter';
      promptsLimit = 50;
    }

    console.log('Plan mapping result:', {
      original_plan: payment.plan,
      normalized_plan: normalizedPlan,
      final_plan_name: planName,
      prompts_limit: promptsLimit
    });

    // Calculate expiration date
    let expirationDate = null;
    const billingCycle = payment.billing_cycle || 'monthly'; // Default to monthly if missing
    
    if (billingCycle !== 'lifetime') {
      const now = new Date();
      if (billingCycle === 'yearly') {
        expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      } else { // Default to monthly for any other value
        expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    console.log('Expiration calculation:', {
      billing_cycle: billingCycle,
      expiration_date: expirationDate
    });

    // Update user subscription - Fix: Handle user_id properly
    let userId;
    try {
      if (typeof payment.user_id === 'string') {
        userId = new ObjectId(payment.user_id);
      } else if (payment.user_id instanceof ObjectId) {
        userId = payment.user_id;
      } else {
        throw new Error('Invalid user_id format');
      }
    } catch (userIdError) {
      console.error('Error processing user_id:', payment.user_id, userIdError);
      return NextResponse.json({
        success: false,
        message: 'Invalid user ID in payment record'
      }, { status: 400 });
    }

    const subscriptionUpdate = {
      subscription: {
        plan: planName,
        status: 'active',
        promptsUsed: 0,
        promptsLimit: promptsLimit,
        billing_cycle: billingCycle,
        activated_at: new Date(),
        expires_at: expirationDate,
        payment_reference: payment.payment_reference || payment._id.toString()
      },
      updated_at: new Date()
    };

    console.log('Updating user subscription:', {
      user_id: userId,
      subscription_update: subscriptionUpdate
    });

    const userUpdateResult = await db.collection('users').updateOne(
      { _id: userId },
      { $set: subscriptionUpdate }
    );

    if (userUpdateResult.matchedCount === 0) {
      console.error('User not found for subscription update:', userId);
      return NextResponse.json({
        success: false,
        message: 'User not found for subscription update'
      }, { status: 404 });
    }

    console.log('User subscription updated successfully:', {
      matched_count: userUpdateResult.matchedCount,
      modified_count: userUpdateResult.modifiedCount
    });

    // Log successful approval
    console.log('Payment approved successfully:', {
      payment_id,
      user_id: payment.user_id,
      user_email: payment.user_email,
      plan: payment.plan,
      amount: payment.amount,
      billing_cycle: payment.billing_cycle,
      prompts_limit: promptsLimit,
      approved_by: adminUser.email,
      approved_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Payment approved successfully',
      data: {
        payment_id,
        plan: planName,
        prompts_limit: promptsLimit,
        billing_cycle: billingCycle,
        expires_at: expirationDate
      }
    });

  } catch (error) {
    console.error('Payment approval error:', error);
    
    // Provide more specific error information
    let errorMessage = 'Internal server error';
    if (error.name === 'BSONTypeError') {
      errorMessage = 'Invalid payment ID format';
    } else if (error.message.includes('ObjectId')) {
      errorMessage = 'Invalid ID format provided';
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}