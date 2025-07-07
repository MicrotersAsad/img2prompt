import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getUserFromToken } from '../../../lib/auth';

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES_PER_REQUEST = 10; // Limit number of files per request

// Helper function to create standardized error responses
const createErrorResponse = (message, status) => {
  console.error(`❌ Error: ${message}`);
  return NextResponse.json({ success: false, message }, { status });
};

// Helper function to sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-') // Replace special characters with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit filename length
};

// Helper function to validate file
const validateFile = (file) => {
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }
  if (file.size === 0) {
    return { valid: false, error: 'Empty file uploaded' };
  }
  return { valid: true };
};

export async function POST(request) {
  console.log('=== API UPLOAD START ===');

  // Validate environment variable
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return createErrorResponse('Storage configuration error - BLOB token missing', 500);
  }

  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return createErrorResponse('Authentication required', 401);
    }

    // Validate user
    let user;
    try {
      user = await getUserFromToken(token);
      if (!user || user.email !== 'shoesizeconvert@gmail.com') {
        return createErrorResponse('Admin access required', 403);
      }
    } catch (authError) {
      return createErrorResponse('Invalid authentication token', 401);
    }

    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      return createErrorResponse('Invalid form data', 400);
    }

    // Get files from form data
    const files = [
      ...formData.getAll('file'),
      ...formData.getAll('files'),
    ].filter(f => f instanceof File);

    if (files.length === 0) {
      return createErrorResponse('No files uploaded', 400);
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return createErrorResponse(`Maximum ${MAX_FILES_PER_REQUEST} files allowed per request`, 400);
    }

    const uploadedFiles = [];

    // Process each file
    for (const file of files) {
      console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return createErrorResponse(validation.error, 400);
      }

      // Generate sanitized filename based on original name
      const sanitizedName = sanitizeFilename(file.name);
      const filename = `blog-images/${sanitizedName}`;

      console.log('Generated filename:', filename);

      try {
        // Upload to Vercel Blob
        console.log('Uploading to Vercel Blob...');
        const blob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: false, // Vercel Blob will add suffix if needed to avoid overwrite
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log('✅ Blob upload successful:', blob.url);

        uploadedFiles.push({
          url: blob.url,
          filename: sanitizedName,
          originalFilename: file.name,
          size: file.size,
          type: file.type,
        });
      } catch (uploadError) {
        console.error('❌ Vercel Blob upload error:', uploadError.message);
        return createErrorResponse(`Failed to upload to storage: ${uploadError.message}`, 500);
      }
    }

    console.log('✅ All files uploaded successfully');

    // Return success response
    const response = {
      success: true,
      files: uploadedFiles.map(file => file.url),
      data: uploadedFiles,
      message: 'Images uploaded successfully',
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API Error:', error.message);
    return createErrorResponse(`Server error: ${error.message}`, 500);
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  console.log('OPTIONS request received');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Consider restricting to specific origins
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle GET request for testing
export async function GET() {
  console.log('GET request to upload endpoint');
  return NextResponse.json({
    message: 'Image upload endpoint is working',
    methods: ['POST'],
    formats: ALLOWED_IMAGE_TYPES,
    maxSize: '5MB',
    maxFiles: MAX_FILES_PER_REQUEST,
    requiredEnvVars: {
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'MISSING',
    },
  });
}