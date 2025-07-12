// app/api/payment/success/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const reference = searchParams.get('reference');
    
    console.log('Payment success callback:', { paymentId, reference });

    if (!paymentId && !reference) {
      return NextResponse.redirect(
        new URL('/payment/error?message=Invalid payment parameters', request.url)
      );
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Find transaction
    const transaction = await db.collection('transactions').findOne({
      $or: [
        { transaction_id: reference },
        { gateway_reference: paymentId }
      ]
    });

    if (!transaction) {
      return NextResponse.redirect(
        new URL('/payment/error?message=Transaction not found', request.url)
      );
    }

    // Verify payment status with PipraPay API
    const pipraPayConfig = {
      api_key: process.env.PIPRAPAY_API_KEY,
      base_url: process.env.PIPRAPAY_BASE_URL || 'https://sandbox.piprapay.com'
    };

    const verifyResponse = await fetch(
      `${pipraPayConfig.base_url}/api/payments/${paymentId || transaction.gateway_reference}/verify`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pipraPayConfig.api_key}`,
          'Accept': 'application/json'
        }
      }
    );

    const verifyData = await verifyResponse.json();
    console.log('Payment verification result:', verifyData);

    if (verifyData.success && verifyData.data.status === 'completed') {
      // Update transaction status
      await db.collection('transactions').updateOne(
        { _id: transaction._id },
        {
          $set: {
            status: 'completed',
            verified_at: new Date(),
            verification_response: verifyData
          }
        }
      );

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/payment/success?transaction_id=${transaction.transaction_id}&plan=${transaction.plan}`, request.url)
      );
    } else {
      // Payment not yet completed or failed
      return NextResponse.redirect(
        new URL(`/payment/pending?transaction_id=${transaction.transaction_id}`, request.url)
      );
    }

  } catch (error) {
    console.error('Success callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/error?message=Payment verification failed', request.url)
    );
  }
}

export async function POST(request) {
  // Handle POST requests if PipraPay sends POST to success URL
  return GET(request);
}