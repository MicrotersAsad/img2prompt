// app/api/payment/initiate/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('=== PipraPay Payment API Debug Start ===');
    
    // Authorization check
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header or invalid format');
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json(
        { success: false, message: 'Token missing' },
        { status: 401 }
      );
    }

    // Token verification
    console.log('🔍 Verifying token...');
    const decoded = verifyToken(token);
    console.log('Token verification result:', decoded);
    
    if (!decoded) {
      console.log('❌ Invalid token');
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('✅ Token verified successfully');
    console.log('Decoded user ID:', decoded.userId);

    // Get request data
    const body = await request.json();
    const { amount, currency = 'BDT', plan, billing_cycle } = body;
    console.log('Payment data received:', { amount, currency, plan, billing_cycle });

    // Validate required fields
    if (!amount || !plan) {
      console.log('❌ Missing required fields');
      return NextResponse.json({
        success: false,
        message: 'Amount and plan are required'
      }, { status: 400 });
    }

    // Database connection
    console.log('🔗 Connecting to database...');
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    console.log('✅ Database connected');

    // Find user in database
    let userId = decoded.userId;
    let user = null;
    
    // Try different ID formats
    user = await db.collection('users').findOne({ _id: userId });
    
    if (!user && typeof userId === 'string') {
      try {
        const objectId = new ObjectId(userId);
        user = await db.collection('users').findOne({ _id: objectId });
      } catch (objectIdError) {
        console.log('❌ ObjectId conversion failed:', objectIdError.message);
      }
    }

    if (!user) {
      user = await db.collection('users').findOne({ _id: userId.toString() });
    }

    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    console.log('✅ User found:', {
      _id: user._id,
      email: user.email,
      name: user.name
    });

    // PipraPay configuration
    const pipraPayConfig = {
      api_key: process.env.PIPRAPAY_API_KEY,
      base_url: process.env.PIPRAPAY_BASE_URL || 'https://sandbox.piprapay.com',
      is_live: process.env.NODE_ENV === 'production'
    };

    // Check if environment variables are set
    if (!pipraPayConfig.api_key) {
      console.error('❌ PipraPay API key not configured');
      return NextResponse.json({
        success: false,
        message: 'Payment service not configured'
      }, { status: 500 });
    }

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated transaction ID:', tran_id);

    // Get base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://img2prompt-three.vercel.app';

    // PipraPay payment data
    const paymentData = {
      amount: parseFloat(amount).toFixed(2),
      currency: currency,
      reference: tran_id,
      description: `AI Prompt Studio - ${plan} Plan`,
      
      // Customer information
      customer: {
        name: user.name || 'Customer',
        email: user.email,
        phone: user.phone || '01700000000',
        address: {
          line1: user.address || 'N/A',
          city: user.city || 'Dhaka',
          state: user.state || 'Dhaka',
          postal_code: user.postcode || '1000',
          country: user.country || 'BD'
        }
      },
      
      // Callback URLs
      callback_urls: {
        success: `${baseUrl}/api/payment/success`,
        cancel: `${baseUrl}/api/payment/cancel`,
        webhook: `${baseUrl}/api/payment/webhook`
      },
      
      // Additional metadata
      metadata: {
        plan: plan,
        billing_cycle: billing_cycle || 'monthly',
        user_id: user._id.toString(),
        product_name: `AI Prompt Studio - ${plan} Plan`,
        product_category: 'Software Subscription'
      }
    };

    console.log('Payment data prepared for PipraPay:', {
      ...paymentData,
      metadata: paymentData.metadata
    });

    // Store transaction in database for tracking
    console.log('💾 Storing transaction in database...');
    await db.collection('transactions').insertOne({
      transaction_id: tran_id,
      user_id: user._id,
      amount: parseFloat(amount),
      currency: currency,
      plan: plan,
      billing_cycle: billing_cycle || 'monthly',
      status: 'pending',
      payment_provider: 'piprapay',
      created_at: new Date(),
      payment_data: paymentData
    });
    console.log('✅ Transaction stored in database');

    // PipraPay API endpoint for payment initiation
    const pipraPayUrl = `${pipraPayConfig.base_url}/api/payments`;
    console.log('🌐 Making request to PipraPay:', pipraPayUrl);

    // Make request to PipraPay
    const response = await fetch(pipraPayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pipraPayConfig.api_key}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData),
    });

    const responseData = await response.json();
    console.log('PipraPay response status:', response.status);
    console.log('PipraPay response:', responseData);

    if (response.ok && responseData.success) {
      console.log('✅ Payment URL received from PipraPay');
      
      // Update transaction with gateway response
      await db.collection('transactions').updateOne(
        { transaction_id: tran_id },
        { 
          $set: { 
            gateway_response: responseData,
            payment_url: responseData.data.payment_url,
            gateway_reference: responseData.data.payment_id,
            updated_at: new Date()
          } 
        }
      );

      console.log('=== PipraPay Payment API Debug End - SUCCESS ===');

      return NextResponse.json({
        success: true,
        payment_url: responseData.data.payment_url,
        payment_id: responseData.data.payment_id,
        transaction_id: tran_id,
        amount: amount,
        plan: plan
      });
    } else {
      console.error('❌ PipraPay error:', responseData);
      
      // Update transaction status
      await db.collection('transactions').updateOne(
        { transaction_id: tran_id },
        { 
          $set: { 
            status: 'failed',
            error_message: responseData.message || 'Payment initiation failed',
            gateway_response: responseData,
            updated_at: new Date()
          } 
        }
      );

      console.log('=== PipraPay Payment API Debug End - FAILED ===');

      return NextResponse.json({
        success: false,
        message: responseData.message || 'Payment initiation failed',
        error_details: responseData
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    console.log('=== PipraPay Payment API Debug End - ERROR ===');
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}