// app/api/payment/verify/[transactionId]/route.js - Payment verification using correct endpoint
export async function GET(request, { params }) {
  try {
    const { transactionId } = params;
    
    if (!transactionId) {
      return NextResponse.json({
        success: false,
        message: 'Transaction ID required'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    // Find transaction
    const transaction = await db.collection('transactions').findOne({
      $or: [
        { transaction_id: transactionId },
        { order_id: transactionId }
      ]
    });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: 'Transaction not found'
      }, { status: 404 });
    }

    // Verify with PipraPay using correct endpoint
    const pipraPayConfig = {
      api_key: process.env.PIPRAPAY_API_KEY || '154705944468734253932aa312268330118830854668734253932af1051487938',
      verify_endpoint: 'https://pay.hrlimon.com/api/verify-payments'
    };

    try {
      const verifyResponse = await fetch(pipraPayConfig.verify_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pipraPayConfig.api_key}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          order_id: transactionId,
          transaction_id: transactionId
        })
      });

      const verifyData = await verifyResponse.json();
      
      // Update transaction with verification result
      await db.collection('transactions').updateOne(
        { _id: transaction._id },
        {
          $set: {
            last_verification: new Date(),
            verification_response: verifyData,
            updated_at: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        transaction: {
          id: transaction.transaction_id,
          status: verifyData.status || transaction.status,
          amount: transaction.amount,
          plan: transaction.plan,
          verification: verifyData
        }
      });

    } catch (verifyError) {
      console.error('Verification error:', verifyError);
      
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        transaction: {
          id: transaction.transaction_id,
          status: transaction.status,
          amount: transaction.amount,
          plan: transaction.plan
        }
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to verify payment'
    }, { status: 500 });
  }
}