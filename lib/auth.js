// lib/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId) {
  console.log('🔐 Generating token for userId:', userId, typeof userId);
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  console.log('✅ Token generated successfully');
  return token;
}

export function verifyToken(token) {
  try {
    console.log('🔍 Verifying token...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('Token preview:', token?.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    console.error('Error type:', error.name);
    return null;
  }
}

export async function getUserFromToken(token) {
  try {
    console.log('🔍 Getting user from token...');
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('❌ Token verification failed');
      return null;
    }

    console.log('🔗 Connecting to database...');
    const client = await clientPromise;
    const db = client.db('imgtoprompt');
    
    let userId = decoded.userId;
    console.log('Searching for user with ID:', userId, typeof userId);
    
    let user = null;
    
    // Try different ID formats
    // First: use as-is
    user = await db.collection('users').findOne({ _id: userId });
    console.log('User found with original ID:', user ? 'Yes' : 'No');
    
    // Second: try ObjectId conversion
    if (!user && typeof userId === 'string') {
      try {
        const objectId = new ObjectId(userId);
        user = await db.collection('users').findOne({ _id: objectId });
        console.log('User found with ObjectId:', user ? 'Yes' : 'No');
      } catch (err) {
        console.log('ObjectId conversion failed:', err.message);
      }
    }
    
    // Third: try string comparison
    if (!user) {
      user = await db.collection('users').findOne({ _id: userId.toString() });
      console.log('User found with string ID:', user ? 'Yes' : 'No');
    }
    
    if (!user) {
      console.log('❌ User not found in database');
      // Show sample users for debugging
      const sampleUsers = await db.collection('users').find({}).limit(3).toArray();
      console.log('Sample users in database:');
      sampleUsers.forEach((u, i) => {
        console.log(`User ${i + 1}:`, {
          _id: u._id,
          _id_type: typeof u._id,
          email: u.email
        });
      });
      return null;
    }

    console.log('✅ User found:', {
      _id: user._id,
      email: user.email,
      name: user.name
    });

    // Password remove করুন
    const { password, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('❌ Error in getUserFromToken:', error);
    return null;
  }
}