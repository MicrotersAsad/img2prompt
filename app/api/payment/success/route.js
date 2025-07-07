import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const paymentData = Object.fromEntries(formData);

    // Verify payment with SSLCommerz
    const verificationData = {
      val_id: paymentData.val_id,
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      format: 'json'
    };

    const sslcommerzUrl = process.env.NODE_ENV === 'production'
      ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

    const verificationResponse = await fetch(sslcommerzUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(verificationData).toString(),
    });

    const verificationResult = await verificationResponse.json();

    if (verificationResult.status === 'VALID') {
      // Payment is valid, activate subscription
      // Here you would typically:
      // 1. Update user subscription in database
      // 2. Send confirmation email
      // 3. Log the transaction

      console.log('Payment successful:', {
        transaction_id: paymentData.tran_id,
        amount: paymentData.amount,
        plan: paymentData.value_a,
        billing_cycle: paymentData.value_b
      });

      // Redirect to success page
      return NextResponse.redirect(new URL('/payment/success', request.url));
    } else {
      // Payment verification failed
      return NextResponse.redirect(new URL('/payment/failed', request.url));
    }

  } catch (error) {
    console.error('Payment success handler error:', error);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}

export async function GET(request) {
  // Handle GET request for success URL
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  if (status === 'success') {
    return NextResponse.redirect(new URL('/payment/success', request.url));
  } else {
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}