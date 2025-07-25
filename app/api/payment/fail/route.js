import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const paymentData = Object.fromEntries(formData);

    console.log('Payment failed:', {
      transaction_id: paymentData.tran_id,
      error: paymentData.error
    });

    return NextResponse.redirect(new URL('/payment/failed', request.url));

  } catch (error) {
    console.error('Payment fail handler error:', error);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}

export async function GET(request) {
  return NextResponse.redirect(new URL('/payment/failed', request.url));
}