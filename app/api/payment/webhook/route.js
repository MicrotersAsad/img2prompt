// app/api/payment/webhook/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import crypto from 'crypto';

export async function POST(request) {
  try {
    console.log('=== PipraPay Webhook Handler Start ===');
    
    const body = await request.text();
    const webhookData = JSON.parse(body);
    
    console.log('Webhook data received:', webhookData);

    // Verify webhook signature (if PipraPay provides webhook signing)
    const signature = request.headers.get('x-piprapay-signature');
    const webhookSecret = process.env.PIPRAPAY_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.log('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Extract payment information from webhook
    const {
      payment_id,
      reference,
      status,
      amount,
      currency,
      customer,
      metadata
    } = webhookData.data || webhookData;

    console.log('Processing payment:', {
      payment_id,
      reference,
      status,
      amount
    });

    // Find the transaction in our database
    const transaction = await db.collection('transactions').findOne({
      $or: [
        { transaction_id: reference },
        { gateway_reference: payment_id }
      ]
    });

    if (!transaction) {
      console.log('❌ Transaction not found:', reference);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    console.log('✅ Transaction found:', transaction.transaction_id);

    // Update transaction status based on webhook
    let updateData = {
      webhook_received: new Date(),
      gateway_status: status,
      gateway_response: webhookData
    };

    if (status === 'completed' || status === 'success') {
      console.log('✅ Payment successful');
      
      updateData.status = 'completed';
      updateData.completed_at = new Date();
      
      // Update user subscription
      const userId = transaction.user_id;
      const plan = transaction.plan;
      const billingCycle = transaction.billing_cycle;
      
      // Calculate subscription end date
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Update user's subscription
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $set: {
            subscription: {
              plan: plan,
              status: 'active',
              start_date: startDate,
              end_date: endDate,
              billing_cycle: billingCycle,
              payment_provider: 'piprapay',
              last_payment_date: new Date(),
              transaction_id: transaction.transaction_id
            },
            updated_at: new Date()
          }
        }
      );

      console.log('✅ User subscription updated');

      // Store subscription history
      await db.collection('subscription_history').insertOne({
        user_id: userId,
        transaction_id: transaction.transaction_id,
        plan: plan,
        billing_cycle: billingCycle,
        amount: transaction.amount,
        currency: transaction.currency,
        start_date: startDate,
        end_date: endDate,
        payment_provider: 'piprapay',
        status: 'active',
        created_at: new Date()
      });

      console.log('✅ Subscription history recorded');

    } else if (status === 'failed' || status === 'cancelled') {
      console.log('❌ Payment failed or cancelled');
      updateData.status = 'failed';
      updateData.failed_at = new Date();
    } else {
      console.log('ℹ️ Payment status:', status);
      updateData.status = 'pending';
    }

    // Update transaction in database
    await db.collection('transactions').updateOne(
      { _id: transaction._id },
      { $set: updateData }
    );

    console.log('✅ Transaction updated');
    console.log('=== PipraPay Webhook Handler End ===');

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Webhook processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Handle GET request for webhook verification (if needed by PipraPay)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    message: 'PipraPay webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}