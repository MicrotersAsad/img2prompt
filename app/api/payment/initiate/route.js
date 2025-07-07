// app/api/payment/initiate/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('=== Payment API Debug Start ===');
    
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
    console.log('Token length:', token?.length);
    console.log('Token preview:', token?.substring(0, 20) + '...');
    
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json(
        { success: false, message: 'Token missing' },
        { status: 401 }
      );
    }

    // Token verify করুন
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
    console.log('Decoded user ID type:', typeof decoded.userId);

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

    // Convert userId to proper format
    let userId = decoded.userId;
    console.log('Original userId:', userId);
    console.log('Original userId type:', typeof userId);

    // Try to find user with different ID formats
    let user = null;
    
    // First try: use as-is
    console.log('🔍 Searching user with original ID...');
    user = await db.collection('users').findOne({ _id: userId });
    console.log('User found with original ID:', user ? 'Yes' : 'No');

    // Second try: convert to ObjectId if it's a string
    if (!user && typeof userId === 'string') {
      console.log('🔍 Trying to convert string ID to ObjectId...');
      try {
        const objectId = new ObjectId(userId);
        console.log('ObjectId created:', objectId);
        user = await db.collection('users').findOne({ _id: objectId });
        console.log('User found with ObjectId:', user ? 'Yes' : 'No');
      } catch (objectIdError) {
        console.log('❌ ObjectId conversion failed:', objectIdError.message);
      }
    }

    // Third try: search by string ID in case it was stored as string
    if (!user) {
      console.log('🔍 Searching with string comparison...');
      user = await db.collection('users').findOne({ _id: userId.toString() });
      console.log('User found with string ID:', user ? 'Yes' : 'No');
    }

    // Fourth try: search all users to see what's in the database
    if (!user) {
      console.log('🔍 Checking all users in database...');
      const allUsers = await db.collection('users').find({}).limit(5).toArray();
      console.log('Sample users in database:');
      allUsers.forEach((u, index) => {
        console.log(`User ${index + 1}:`, {
          _id: u._id,
          _id_type: typeof u._id,
          email: u.email,
          name: u.name
        });
      });
    }

    if (!user) {
      console.log('❌ User not found in database');
      console.log('Searched for userId:', userId);
      console.log('UserId type:', typeof userId);
      
      return NextResponse.json({
        success: false,
        message: 'User not found',
        debug: {
          searchedUserId: userId,
          userIdType: typeof userId,
          decodedToken: decoded
        }
      }, { status: 404 });
    }

    console.log('✅ User found:', {
      _id: user._id,
      email: user.email,
      name: user.name
    });

    // Rest of payment processing...
    console.log('💳 Processing payment...');

    // SSLCommerz configuration
    const sslcommerzConfig = {
      store_id:"aibuster0live",
      store_passwd: "66D694426D70B78246",
      is_live: process.env.NODE_ENV === 'production'
    };

    // Check if environment variables are set
    if (!sslcommerzConfig.store_id || !sslcommerzConfig.store_passwd) {
      console.error('❌ SSLCommerz credentials not configured');
      return NextResponse.json({
        success: false,
        message: 'Payment service not configured'
      }, { status: 500 });
    }

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated transaction ID:', tran_id);

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://img2prompt-three.vercel.app';

    // SSLCommerz payment data
    const paymentData = {
      store_id: sslcommerzConfig.store_id,
      store_passwd: sslcommerzConfig.store_passwd,
      total_amount: parseFloat(amount).toFixed(2),
      currency: currency,
      tran_id: tran_id,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      
      // Customer information from user data
      cus_name: user.name || 'Customer',
      cus_email: user.email,
      cus_add1: user.address || 'N/A',
      cus_city: user.city || 'Dhaka',
      cus_state: user.state || 'Dhaka',
      cus_postcode: user.postcode || '1000',
      cus_country: user.country || 'Bangladesh',
      cus_phone: user.phone || '01700000000',
      cus_fax: user.phone || '01700000000',
      
      // Product information
      product_name: `AI Prompt Studio - ${plan} Plan`,
      product_category: 'Software Subscription',
      product_profile: 'general',
      
      // Shipping information - Required by SSLCommerz
      shipping_method: 'NO', // Digital product, no shipping required
      num_of_item: 1,
      
      // Shipping address (required even when shipping_method is NO)
      ship_name: user.name || 'Customer',
      ship_add1: user.address || 'N/A',
      ship_add2: '',
      ship_city: user.city || 'Dhaka',
      ship_state: user.state || 'Dhaka',
      ship_postcode: user.postcode || '1000',
      ship_country: user.country || 'Bangladesh',
      
      // Additional parameters for our reference
      value_a: plan,
      value_b: billing_cycle || 'monthly',
      value_c: user._id.toString(),
      value_d: decoded.userId
    };

    console.log('Payment data prepared:', {
      ...paymentData,
      store_passwd: '[HIDDEN]'
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
      created_at: new Date(),
      payment_data: {
        ...paymentData,
        store_passwd: '[HIDDEN]'
      }
    });
    console.log('✅ Transaction stored in database');

    // SSLCommerz API endpoint
    const sslcommerzUrl = sslcommerzConfig.is_live 
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    console.log('🌐 Making request to SSLCommerz:', sslcommerzUrl);

    // Make request to SSLCommerz
    const response = await fetch(sslcommerzUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(paymentData).toString(),
    });

    const responseText = await response.text();
    console.log('SSLCommerz response status:', response.status);
    console.log('SSLCommerz response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse SSLCommerz response:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid response from payment gateway'
      }, { status: 500 });
    }

    console.log('Parsed SSLCommerz result:', result);

    if (result.status === 'SUCCESS' && result.GatewayPageURL) {
      console.log('✅ Payment gateway URL received');
      
      // Update transaction with gateway response
      await db.collection('transactions').updateOne(
        { transaction_id: tran_id },
        { 
          $set: { 
            gateway_response: result,
            gateway_url: result.GatewayPageURL,
            updated_at: new Date()
          } 
        }
      );

      console.log('=== Payment API Debug End - SUCCESS ===');

      return NextResponse.json({
        success: true,
        payment_url: result.GatewayPageURL,
        transaction_id: tran_id,
        amount: amount,
        plan: plan
      });
    } else {
      console.error('❌ SSLCommerz error:', result);
      
      // Update transaction status
      await db.collection('transactions').updateOne(
        { transaction_id: tran_id },
        { 
          $set: { 
            status: 'failed',
            error_message: result.failedreason || 'Payment initiation failed',
            gateway_response: result,
            updated_at: new Date()
          } 
        }
      );

      console.log('=== Payment API Debug End - FAILED ===');

      return NextResponse.json({
        success: false,
        message: result.failedreason || 'Payment initiation failed',
        error_details: result
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    console.log('=== Payment API Debug End - ERROR ===');
    
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