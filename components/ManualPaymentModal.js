// components/ManualPaymentModal.js
'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Phone, CreditCard, Smartphone } from 'lucide-react';

const ManualPaymentModal = ({ isOpen, onClose, plan, amount }) => {
  const [step, setStep] = useState(1); // 1: Instructions, 2: Submit Details
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Payment numbers (replace with your actual numbers)
  const paymentNumbers = {
    bkash: '01712345678',
    nagad: '01812345678',
    rocket: '01912345678'
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumbers[paymentMethod]);
    // You can add a toast notification here
  };

  const handleSubmitPayment = async () => {
    if (!senderNumber || !transactionId) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/payment/manual-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: plan.name,
          amount: amount,
          payment_method: paymentMethod,
          sender_number: senderNumber,
          transaction_id: transactionId,
          billing_cycle: plan.lifetimePrice ? 'lifetime' : 'monthly'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
      } else {
        alert('Submission failed: ' + result.message);
      }
    } catch (error) {
      alert('Error submitting payment details');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <>
            {step === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Manual Payment
                </h3>
                
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-200 text-sm mb-2">
                    <strong>Plan:</strong> {plan.name}
                  </p>
                  <p className="text-yellow-200 text-sm">
                    <strong>Amount:</strong> ৳{amount.toLocaleString()}
                  </p>
                </div>

                <h4 className="text-lg font-semibold text-white mb-4">Choose Payment Method:</h4>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod('bkash')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">bK</span>
                        </div>
                        <span className="text-white font-medium">bKash</span>
                      </div>
                      <span className="text-purple-200 text-sm">{paymentNumbers.bkash}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('nagad')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-500/20'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-white font-medium">Nagad</span>
                      </div>
                      <span className="text-purple-200 text-sm">{paymentNumbers.nagad}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('rocket')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'rocket'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-purple-500/30 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="text-white font-medium">Rocket</span>
                      </div>
                      <span className="text-purple-200 text-sm">{paymentNumbers.rocket}</span>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Payment Instructions
                </h3>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 mb-6 text-left">
                  <h4 className="text-white font-semibold mb-3">Step 1: Send Money</h4>
                  <div className="space-y-2 text-blue-200 text-sm">
                    <p>• Open your {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} app</p>
                    <p>• Select "Send Money"</p>
                    <p>• Enter this number: <strong className="text-white">{paymentNumbers[paymentMethod]}</strong></p>
                    <button
                      onClick={handleCopyNumber}
                      className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Number
                    </button>
                    <p>• Amount: <strong className="text-white">৳{amount.toLocaleString()}</strong></p>
                    <p>• Complete the transaction</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-6 mb-6 text-left">
                  <h4 className="text-white font-semibold mb-3">Step 2: Submit Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Your Phone Number</label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm mb-2">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter transaction ID"
                        className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    disabled={submitting || !senderNumber || !transactionId}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Payment'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Payment Submitted!
            </h3>
            
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6 mb-6">
              <p className="text-green-200 text-sm mb-4">
                Your payment details have been submitted successfully. Our team will verify your payment within 24 hours.
              </p>
              <div className="text-left space-y-2 text-green-200 text-sm">
                <p><strong>Plan:</strong> {plan.name}</p>
                <p><strong>Amount:</strong> ৳{amount.toLocaleString()}</p>
                <p><strong>Method:</strong> {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
                <p><strong>Your Number:</strong> {senderNumber}</p>
                <p><strong>Transaction ID:</strong> {transactionId}</p>
              </div>
            </div>

            <p className="text-purple-200 text-sm mb-6">
              You will receive an email confirmation once your payment is approved and your plan is activated.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualPaymentModal;