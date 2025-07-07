'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Importing icons from Lucide React
import Link from 'next/link'; // For client-side navigation without full page reloads
import { useRouter } from 'next/navigation'; // Hook for programmatic navigation in Next.js App Router
import Layout from '@/components/Layout';

export default function LoginPage() {
  // State to manage form input data (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to manage loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to store and display error messages
  const [error, setError] = useState('');
  // Initialize Next.js router for navigation
  const router = useRouter();

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true); // Set loading to true to disable button and show loading indicator
    setError(''); // Clear any previous errors

    try {
      // Send a POST request to your login API route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(formData), // Send form data as a JSON string
      });

      // Parse the JSON response from the API
      const data = await response.json();

      if (response.ok && data.success) { // Check if the response was successful (status 2xx and success: true)
        // Store the token in localStorage upon successful login
        if (data.user && data.user.token) {
          localStorage.setItem('auth-token', data.user.token);
          console.log('Token stored in localStorage:', data.user.token); // Confirm token storage
        }
        console.log('Attempting to redirect to /dashboard...'); // <-- ADD THIS LOG
        // If login is successful, redirect to the dashboard
        router.push('/dashboard');
      } else {
        // If login fails, set the error message from the API response
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Catch any network errors or unexpected issues
      console.error('Login fetch error:', error); // Log the error for debugging
      setError('An unexpected error occurred. Please try again.'); // Generic error message for the user
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handler for input field changes
  const handleChange = (e) => {
    // Update formData state with the new input value
    setFormData({
      ...formData, // Keep existing form data
      [e.target.name]: e.target.value // Update the specific field by its name
    });
  };

  return (
    <Layout>

 
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        {/* Application Title and Slogan */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">AI Prompt Studio</h1>
          </div>
          <p className="text-purple-200">Sign in to your account</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message Display */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm flex items-center justify-center">
                {error}
              </div>
            )}

            {/* Email Input Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword state
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Dont have an account?{' '}
              <Link href="/auth/register" className="text-yellow-400 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
       </Layout>
  );
}
