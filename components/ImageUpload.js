'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const ImageUpload = ({ value, onChange, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token');
    }
    return null;
  };

  const handleFileUpload = async (file) => {
    console.log('=== CLIENT UPLOAD DEBUG ===');
    console.log('File:', file);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    if (!file) {
      console.log('❌ No file provided');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type');
      alert('Please select an image file only');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('❌ File too large');
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const token = getAuthToken();
      console.log('Token found:', token ? 'YES' : 'NO');
      console.log('Token value:', token);
      
      if (!token) {
        console.log('❌ No auth token');
        alert('Authentication required. Please login again.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      
      // FormData check
      console.log('FormData created:');
      console.log('FormData has file:', formData.has('file'));
      console.log('FormData get file:', formData.get('file'));
      
      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry - ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes, ${value.type})` : value);
      }

      console.log('File object details:');
      console.log('- instanceof File:', file instanceof File);
      console.log('- constructor:', file.constructor.name);
      console.log('- size:', file.size);
      console.log('- type:', file.type);
      console.log('- name:', file.name);

      console.log('Sending request to /api/upload-image...');
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it automatically for FormData
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success && data.files && data.files.length > 0) {
        console.log('✅ Upload successful');
        onChange(data.files[0]); // Return the first uploaded file URL
      } else {
        console.log('❌ Upload failed:', data.message);
        alert(data.message || 'Failed to upload image');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    console.log('File selected from input:', file);
    if (file) {
      handleFileUpload(file);
    }
    // Clear input to allow same file upload again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    console.log('File dropped:', file);
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    console.log('Removing image');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        // Show uploaded image with full preview
        <div className="relative">
          <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Featured image"
              className="w-full h-auto max-h-96 object-contain"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.src = '/placeholder-image.jpg'; // Fallback image
              }}
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-gray-400 text-sm truncate">{value}</p>
            <p className="text-green-400 text-xs">✅ Image uploaded successfully</p>
          </div>
        </div>
      ) : (
        // Show upload area
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-purple-400 bg-purple-900/20'
              : 'border-gray-600 hover:border-purple-500 bg-gray-800/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                <p className="text-white font-medium mb-2">Uploading...</p>
                <p className="text-gray-400 text-sm">Please wait while we upload your image</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium mb-2">Click to upload featured image</p>
                <p className="text-gray-400 text-sm">or drag and drop • JPG, PNG, GIF, WebP (max 5MB)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;