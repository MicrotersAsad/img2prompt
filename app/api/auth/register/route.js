import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { hashPassword, generateToken } from '../../../../lib/auth';

// This line explicitly tells Next.js to always render this route dynamically.
// It prevents the "NEXT_STATIC_GEN_BAILOUT" error when using dynamic features
// like reading the request body (request.json()).
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt'); // Connect to your specific database

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      subscription: {
        plan: 'free',
        status: 'active',
        promptsUsed: 0,
        promptsLimit: 5, // Free tier limit
        startDate: new Date(),
        endDate: null
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate token
    // Using the ObjectId from MongoDB as the user ID for the token
    const token = generateToken(result.insertedId.toString());

    const response = NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.insertedId.toString(), // Convert ObjectId to string for client-side use
        name,
        email,
        subscription: {
          plan: 'free',
          status: 'active',
          promptsUsed: 0,
          promptsLimit: 5
        }
      }
    });

    // Set HTTP-only cookie for authentication
    response.cookies.set('auth-token', token, {
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 // Cookie expires in 7 days (in seconds)
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
