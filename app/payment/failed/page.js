import React from 'react';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Failed - AI Prompt Studio',
  description: 'Payment could not be processed',
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Failed
          </h1>
          
          <p className="text-purple-200 mb-8">
            We couldn't process your payment. Please check your payment details and try again.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/pricing"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full border-2 border-purple-400 text-purple-200 py-3 px-6 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-purple-300 text-sm">
              Need help? <Link href="/contact" className="text-yellow-400 hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}