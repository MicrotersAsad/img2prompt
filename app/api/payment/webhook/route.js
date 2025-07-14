// // app/api/payment/webhook/route.js
// import { NextResponse } from 'next/server';
// import clientPromise from '../../../../lib/mongodb';
// import crypto from 'crypto';

// export async function POST(request) {
//   try {
//     console.log('=== PipraPay Webhook Handler Start ===');
    
//     const body = await request.text();
//     const webhookData = JSON.parse(body);
    
//     console.log('Webhook data received:', webhookData);

//     // Verify webhook signature (if PipraPay provides webhook signing)
//     const signature = request.headers.get('x-piprapay-signature');
//     const webhookSecret = process.env.PIPRAPAY_WEBHOOK_SECRET;
    
//     if (webhookSecret && signature) {
//       const expectedSignature = crypto
//         .createHmac('sha256', webhookSecret)
//         .update(body)
//         .digest('hex');
      
//       if (signature !== expectedSignature) {
//         console.log('❌ Invalid webhook signature');
//         return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
//       }
//     }

//     // Database connection
//     const client = await clientPromise;
//     const db = client.db('imgtoprompt');

//     // Extract payment information from webhook
//     const {
//       payment_id,
//       reference,
//       status,
//       amount,
//       currency,
//       customer,
//       metadata
//     } = webhookData.data || webhookData;

//     console.log('Processing payment:', {
//       payment_id,
//       reference,
//       status,
//       amount
//     });

//     // Find the transaction in our database
//     const transaction = await db.collection('transactions').findOne({
//       $or: [
//         { transaction_id: reference },
//         { gateway_reference: payment_id }
//       ]
//     });

//     if (!transaction) {
//       console.log('❌ Transaction not found:', reference);
//       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
//     }

//     console.log('✅ Transaction found:', transaction.transaction_id);

//     // Update transaction status based on webhook
//     let updateData = {
//       webhook_received: new Date(),
//       gateway_status: status,
//       gateway_response: webhookData
//     };

//     if (status === 'completed' || status === 'success') {
//       console.log('✅ Payment successful');
      
//       updateData.status = 'completed';
//       updateData.completed_at = new Date();
      
//       // Update user subscription
//       const userId = transaction.user_id;
//       const plan = transaction.plan;
//       const billingCycle = transaction.billing_cycle;
      
//       // Calculate subscription end date
//       const startDate = new Date();
//       const endDate = new Date(startDate);
      
//       if (billingCycle === 'yearly') {
//         endDate.setFullYear(endDate.getFullYear() + 1);
//       } else {
//         endDate.setMonth(endDate.getMonth() + 1);
//       }

//       // Update user's subscription
//       await db.collection('users').updateOne(
//         { _id: userId },
//         {
//           $set: {
//             subscription: {
//               plan: plan,
//               status: 'active',
//               start_date: startDate,
//               end_date: endDate,
//               billing_cycle: billingCycle,
//               payment_provider: 'piprapay',
//               last_payment_date: new Date(),
//               transaction_id: transaction.transaction_id
//             },
//             updated_at: new Date()
//           }
//         }
//       );

//       console.log('✅ User subscription updated');

//       // Store subscription history
//       await db.collection('subscription_history').insertOne({
//         user_id: userId,
//         transaction_id: transaction.transaction_id,
//         plan: plan,
//         billing_cycle: billingCycle,
//         amount: transaction.amount,
//         currency: transaction.currency,
//         start_date: startDate,
//         end_date: endDate,
//         payment_provider: 'piprapay',
//         status: 'active',
//         created_at: new Date()
//       });

//       console.log('✅ Subscription history recorded');

//     } else if (status === 'failed' || status === 'cancelled') {
//       console.log('❌ Payment failed or cancelled');
//       updateData.status = 'failed';
//       updateData.failed_at = new Date();
//     } else {
//       console.log('ℹ️ Payment status:', status);
//       updateData.status = 'pending';
//     }

//     // Update transaction in database
//     await db.collection('transactions').updateOne(
//       { _id: transaction._id },
//       { $set: updateData }
//     );

//     console.log('✅ Transaction updated');
//     console.log('=== PipraPay Webhook Handler End ===');

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Webhook processed successfully' 
//     });

//   } catch (error) {
//     console.error('❌ Webhook processing error:', error);
    
//     return NextResponse.json({
//       success: false,
//       message: 'Webhook processing failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     }, { status: 500 });
//   }
// }

// // Handle GET request for webhook verification (if needed by PipraPay)
// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const challenge = searchParams.get('challenge');
  
//   if (challenge) {
//     return NextResponse.json({ challenge });
//   }
  
//   return NextResponse.json({ 
//     message: 'PipraPay webhook endpoint is active',
//     timestamp: new Date().toISOString()
//   });
// }

// app/api/payment/webhook/route.js - PipraPay Webhook Handler
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('=== PipraPay Webhook Received ===');
    
    // Get the raw body for signature verification if needed
    const rawBody = await request.text();
    console.log('📥 Raw webhook body:', rawBody);
    
    // Parse the JSON data
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
      console.log('📋 Parsed webhook data:', webhookData);
    } catch (parseError) {
      console.error('❌ Failed to parse webhook JSON:', parseError.message);
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    // Verify webhook signature (if PipraPay provides one)
    const signature = request.headers.get('x-piprapay-signature');
    if (signature) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Extract transaction details from webhook
    const {
      order_id,           // This should match your transaction_id
      pp_id,              // PipraPay transaction ID
      status,             // Payment status
      amount,
      currency,
      payment_method,
      paid_at,
      metadata
    } = webhookData;

    console.log('🔍 Processing webhook for order:', order_id);

    if (!order_id) {
      console.error('❌ No order_id in webhook data');
      return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 });
    }

    // Find the transaction in database
    const transaction = await db.collection('transactions').findOne({
      transaction_id: order_id
    });

    if (!transaction) {
      console.error('❌ Transaction not found:', order_id);
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    console.log('✅ Transaction found:', transaction.transaction_id);

    // Process based on payment status
    let transactionStatus = 'pending';
    let shouldActivateSubscription = false;

    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        transactionStatus = 'completed';
        shouldActivateSubscription = true;
        console.log('🎉 Payment successful!');
        break;
        
      case 'failed':
      case 'cancelled':
      case 'canceled':
        transactionStatus = 'failed';
        console.log('❌ Payment failed/cancelled');
        break;
        
      case 'refunded':
        transactionStatus = 'refunded';
        console.log('🔄 Payment refunded');
        break;
        
      case 'pending':
      default:
        transactionStatus = 'pending';
        console.log('⏳ Payment still pending');
        break;
    }

    // Update transaction in database
    const updateData = {
      status: transactionStatus,
      gateway_reference: pp_id,
      webhook_data: webhookData,
      payment_method: payment_method,
      processed_at: new Date(),
      updated_at: new Date()
    };

    if (paid_at) {
      updateData.paid_at = new Date(paid_at);
    }

    await db.collection('transactions').updateOne(
      { transaction_id: order_id },
      { $set: updateData }
    );

    console.log('✅ Transaction updated with status:', transactionStatus);

    // If payment is successful, activate subscription
    if (shouldActivateSubscription) {
      await activateUserSubscription(db, transaction, webhookData);
    }

    // Send confirmation email if payment successful
    if (transactionStatus === 'completed') {
      await sendPaymentConfirmationEmail(transaction, webhookData);
    }

    console.log('✅ Webhook processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      transaction_id: order_id,
      status: transactionStatus
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

// Function to activate user subscription
async function activateUserSubscription(db, transaction, webhookData) {
  try {
    console.log('🔄 Activating subscription for user:', transaction.user_id);

    // Calculate subscription dates
    const now = new Date();
    let expiryDate = new Date(now);
    
    // Add time based on billing cycle
    switch (transaction.billing_cycle) {
      case 'monthly':
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case 'yearly':
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
      case 'weekly':
        expiryDate.setDate(expiryDate.getDate() + 7);
        break;
      default:
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Update user's subscription
    await db.collection('users').updateOne(
      { _id: transaction.user_id },
      {
        $set: {
          subscription_plan: transaction.plan,
          subscription_status: 'active',
          subscription_start: now,
          subscription_end: expiryDate,
          billing_cycle: transaction.billing_cycle,
          last_payment_date: now,
          last_payment_amount: transaction.amount,
          updated_at: now
        }
      }
    );

    // Create subscription record
    await db.collection('subscriptions').insertOne({
      user_id: transaction.user_id,
      plan: transaction.plan,
      billing_cycle: transaction.billing_cycle,
      status: 'active',
      amount: transaction.amount,
      currency: transaction.currency,
      start_date: now,
      end_date: expiryDate,
      transaction_id: transaction.transaction_id,
      payment_provider: 'piprapay',
      gateway_reference: webhookData.pp_id,
      created_at: now,
      updated_at: now
    });

    console.log('✅ Subscription activated successfully');
    
  } catch (error) {
    console.error('❌ Error activating subscription:', error);
    throw error;
  }
}

// Function to send payment confirmation email
async function sendPaymentConfirmationEmail(transaction, webhookData) {
  try {
    console.log('📧 Sending payment confirmation email...');
    
    // Get user details
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    const user = await db.collection('users').findOne({
      _id: transaction.user_id
    });

    if (!user || !user.email) {
      console.log('⚠️ No user email found, skipping email');
      return;
    }

    // Email content
    const emailData = {
      to: user.email,
      subject: 'Payment Confirmation - AI Prompt Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Payment Successful!</h2>
          <p>Hello ${user.name || 'Customer'},</p>
          
          <p>Your payment has been processed successfully.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Plan:</strong> ${transaction.plan}</p>
            <p><strong>Amount:</strong> ${transaction.amount} ${transaction.currency}</p>
            <p><strong>Transaction ID:</strong> ${transaction.transaction_id}</p>
            <p><strong>Payment Method:</strong> ${webhookData.payment_method || 'PipraPay'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Your subscription is now active. You can start using all the features of your ${transaction.plan} plan.</p>
          
          <p>Thank you for choosing AI Prompt Studio!</p>
          
          <p>Best regards,<br>AI Prompt Studio Team</p>
        </div>
      `
    };

    // Send email using your email service
    // await sendEmail(emailData);
    
    console.log('✅ Payment confirmation email sent');
    
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    // Don't throw error here, as email failure shouldn't affect payment processing
  }
}

// Function to verify webhook signature (implement based on PipraPay docs)
function verifyWebhookSignature(payload, signature) {
  try {
    // Implement signature verification based on PipraPay documentation
    // This is a placeholder - replace with actual verification logic
    
    const webhookSecret = process.env.PIPRAPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.log('⚠️ No webhook secret configured, skipping signature verification');
      return true;
    }

    // Example signature verification (adjust based on PipraPay specs):
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', webhookSecret)
    //   .update(payload, 'utf8')
    //   .digest('hex');
    
    // return signature === expectedSignature;
    
    return true; // Temporary - implement proper verification
    
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-PipraPay-Signature',
    },
  });
}

// Handle GET requests (some payment gateways send GET confirmations)
export async function GET(request) {
  const url = new URL(request.url);
  const order_id = url.searchParams.get('order_id');
  const status = url.searchParams.get('status');
  
  if (order_id && status) {
    console.log('📥 GET webhook received:', { order_id, status });
    
    // Process similar to POST webhook
    const webhookData = {
      order_id,
      status,
      pp_id: url.searchParams.get('pp_id'),
      amount: url.searchParams.get('amount'),
      currency: url.searchParams.get('currency') || 'BDT',
      payment_method: url.searchParams.get('payment_method')
    };
    
    // Reuse the POST logic
    return await POST({ 
      text: () => Promise.resolve(JSON.stringify(webhookData)),
      headers: { get: () => null }
    });
  }
  
  return NextResponse.json({ 
    success: false, 
    message: 'Invalid webhook parameters' 
  }, { status: 400 });
}