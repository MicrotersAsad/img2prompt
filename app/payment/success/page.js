import React from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Successful - AI Prompt Studio',
  description: 'Your subscription has been activated successfully',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-purple-200 mb-8">
            Your subscription has been activated successfully. You can now access all premium features of AI Prompt Studio.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Start Creating Prompts
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/dashboard"
              className="w-full border-2 border-purple-400 text-purple-200 py-3 px-6 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to AI Prompt Studio Premium!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}