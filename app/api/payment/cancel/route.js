
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


