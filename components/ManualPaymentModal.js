// components/ManualPaymentModal.js
'use client';

import React, { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ManualPaymentModal = ({ isOpen, onClose, plan, amount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setSuccessMessage('');

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Please login to continue');
      }

      console.log('🚀 Initiating payment for:', { plan: plan.name, amount });

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'BDT',
          plan: plan.name,
          billing_cycle: plan.lifetimePrice ? 'lifetime' : 'monthly'
        })
      });

      const data = await response.json();
      console.log('💳 Payment response:', data);

      // Handle both your working format and standard format
      if (data.success && data.payment_url) {
        // Standard success response
        setSuccessMessage('Redirecting to payment gateway...');
        setTimeout(() => {
          window.location.href = data.payment_url;
        }, 1000);
      } else if (data.status === true && data.pp_url) {
        // Your PipraPay format (status: true, pp_url)
        setSuccessMessage('Redirecting to PipraPay...');
        setTimeout(() => {
          window.location.href = data.pp_url;
        }, 1000);
      } else if (data.fallback === 'manual_payment') {
        // Show manual payment fallback
        throw new Error(data.message || 'Gateway temporarily unavailable. Please try manual payment.');
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
          disabled={isProcessing}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            Complete Payment
          </h3>
          
          <p className="text-purple-200 text-sm">
            You're purchasing the <strong className="text-yellow-400">{plan?.name}</strong> plan
          </p>
        </div>

        {/* Plan Details */}
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200">Plan:</span>
            <span className="text-white font-semibold">{plan?.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200">Amount:</span>
            <span className="text-yellow-400 font-bold text-lg">
              {formatCurrency(amount)}
            </span>
          </div>
          {plan?.lifetimePrice ? (
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Type:</span>
              <span className="text-green-400 font-semibold">One-time payment</span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Billing:</span>
              <span className="text-blue-400 font-semibold">Monthly</span>
            </div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-green-200 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Logged in as <strong>{user.email}</strong></span>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Please log in to continue with payment</span>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Accepted Payment Methods</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">Visa</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">MasterCard</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">bKash</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">Nagad</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">Rocket</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2 text-center">
              <div className="text-xs text-purple-200">Banking</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-green-200 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || !user || successMessage}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : successMessage ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Redirecting...
            </>
          ) : !user ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Login Required
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5" />
              Proceed to Payment
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-purple-300 text-xs">
            🔒 Your payment is secured with SSL encryption
          </p>
          <p className="text-purple-400 text-xs mt-1">
            Powered by PipraPay - Bangladesh's trusted payment gateway
          </p>
        </div>

        {/* Terms */}
        <div className="mt-4 text-center">
          <p className="text-purple-300 text-xs">
            By proceeding, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentModal;