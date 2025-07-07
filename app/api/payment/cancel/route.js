import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const paymentData = Object.fromEntries(formData);

    console.log('Payment cancelled:', {
      transaction_id: paymentData.tran_id
    });

    return NextResponse.redirect(new URL('/payment/cancelled', request.url));

  } catch (error) {
    console.error('Payment cancel handler error:', error);
    return NextResponse.redirect(new URL('/payment/cancelled', request.url));
  }
}

export async function GET(request) {
  return NextResponse.redirect(new URL('/payment/cancelled', request.url));
}