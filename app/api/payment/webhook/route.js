import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export async function POST(req) {
  try {
    console.log('🔔 PipraPay Webhook Received');

    // Read raw body as buffer from request
    const rawBody = await req.arrayBuffer();
    const rawBodyStr = Buffer.from(rawBody).toString('utf-8');

    // Signature verification (if used)
    const signature = req.headers.get('x-piprapay-signature');
    const secret = process.env.PIPRAPAY_WEBHOOK_SECRET;

    if (signature && secret) {
      const computed = crypto.createHmac('sha256', secret).update(rawBodyStr).digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))) {
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 403 });
      }
    } else {
      const apiKey = req.headers.get('mh-piprapay-api-key');
      const expected = process.env.PIPRAPAY_API_KEY;
      if (!apiKey || apiKey !== expected) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBodyStr);
    const { pp_id, customer_name, customer_email_mobile, payment_method, amount, fee = 0, refund_amount = 0, total = 0, currency, status, date, metadata = {} } = body;
    const transaction_id = metadata.transaction_id || body.transaction_id;
    if (!transaction_id || !status) {
      return NextResponse.json({ success: false, message: 'Missing transaction_id or status' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    const transaction = await db.collection('transactions').findOne({ transaction_id });
    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    await db.collection('transactions').updateOne(
      { transaction_id },
      {
        $set: {
          status,
          gateway_reference: pp_id?.toString(),
          customer_name: customer_name || transaction.customer_name,
          customer_email_mobile: customer_email_mobile || transaction.customer_email_mobile,
          payment_method: payment_method || transaction.payment_provider,
          amount: parseFloat(amount) || transaction.amount,
          fee: parseFloat(fee) || transaction.fee || 0,
          refund_amount: parseFloat(refund_amount) || transaction.refund_amount || 0,
          total: parseFloat(total) || transaction.total || transaction.amount,
          currency: currency || transaction.currency,
          payment_date: date ? new Date(date) : transaction.payment_date || new Date(),
          metadata: { ...transaction.metadata, ...metadata },
          updated_at: new Date(),
        },
      }
    );

    if (['success', 'completed'].includes(status.toLowerCase())) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(transaction.user_id) });
      if (user) {
        const plan = transaction.plan || metadata.plan || 'free';
        const billing = transaction.billing_cycle || metadata.billing_cycle || 'monthly';
        const promptsLimit = getPromptsLimit(plan);
        const endDate = calculateSubscriptionEnd(billing);
        await db.collection('users').updateOne(
          { _id: new ObjectId(transaction.user_id) },
          {
            $set: {
              subscription: {
                plan,
                status: 'active',
                promptsUsed: user.subscription?.promptsUsed || 0,
                promptsLimit,
                startDate: new Date(),
                endDate,
                billingCycle: billing,
              },
              updated_at: new Date(),
            },
          }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return NextResponse.json({ success: false, message: 'Internal error', error: err.message }, { status: 500 });
  }
}

function getPromptsLimit(plan) {
  const limits = { free: 10, Starter: 100, lifetime: Infinity };
  return limits[plan?.toLowerCase()] || 10;
}

function calculateSubscriptionEnd(billingCycle) {
  const date = new Date();
  billingCycle === 'yearly' ? date.setFullYear(date.getFullYear() + 1) : date.setMonth(date.getMonth() + 1);
  return date;
}
