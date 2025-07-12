
// app/api/payment/cancel/route.js
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const reference = searchParams.get('reference');
    
    console.log('Payment cancelled:', { paymentId, reference });

    if (reference) {
      // Database connection
      const client = await clientPromise;
      const db = client.db('imgtoprompt');

      // Update transaction status
      await db.collection('transactions').updateOne(
        { transaction_id: reference },
        {
          $set: {
            status: 'cancelled',
            cancelled_at: new Date()
          }
        }
      );
    }

    // Redirect to cancel page
    return NextResponse.redirect(
      new URL(`/payment/cancelled?transaction_id=${reference}`, request.url)
    );

  } catch (error) {
    console.error('Cancel callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/error?message=Payment cancellation processing failed', request.url)
    );
  }
}

export async function POST(request) {
  return GET(request);
}

// app/api/payment/verify/route.js - Manual payment verification endpoint
export async function POST(request) {
  try {
    const { transaction_id, payment_id } = await request.json();
    
    if (!transaction_id && !payment_id) {
      return NextResponse.json({
        success: false,
        message: 'Transaction ID or Payment ID required'
      }, { status: 400 });
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Find transaction
    const transaction = await db.collection('transactions').findOne({
      $or: [
        { transaction_id },
        { gateway_reference: payment_id }
      ]
    });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: 'Transaction not found'
      }, { status: 404 });
    }

    // Verify with PipraPay
    const pipraPayConfig = {
      api_key: process.env.PIPRAPAY_API_KEY,
      base_url: process.env.PIPRAPAY_BASE_URL || 'https://sandbox.piprapay.com'
    };

    const verifyResponse = await fetch(
      `${pipraPayConfig.base_url}/api/payments/${payment_id || transaction.gateway_reference}/verify`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pipraPayConfig.api_key}`,
          'Accept': 'application/json'
        }
      }
    );

    const verifyData = await verifyResponse.json();

    // Update transaction with verification result
    await db.collection('transactions').updateOne(
      { _id: transaction._id },
      {
        $set: {
          last_verification: new Date(),
          verification_response: verifyData
        }
      }
    );

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.transaction_id,
        status: verifyData.data?.status || transaction.status,
        amount: transaction.amount,
        plan: transaction.plan
      },
      verification: verifyData
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
