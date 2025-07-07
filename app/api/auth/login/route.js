import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyPassword, generateToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      console.warn('Login attempt: Email or password missing.');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('imgtoprompt');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.warn(`Login attempt: User not found for email: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      console.warn(`Login attempt: Invalid password for user: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user._id.toString());

    // Prepare the successful login response
    // IMPORTANT: The token is now returned in the response body for localStorage use.
    const responseData = {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        token: token // Include the token in the response body
      }
    };

    return NextResponse.json(responseData, { status: 200 }); // Return the response data

  } catch (error) {
    console.error('Login error (server-side):', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
