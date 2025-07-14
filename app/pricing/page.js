'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Crown, Zap, Star, User, X, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ManualPaymentModal from '../../components/ManualPaymentModal';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const router = useRouter();

  // Use the useAuth hook
  const { user, loading, logout } = useAuth();
  const isLoggedIn = !!user;

  console.log('User from useAuth:', user);
  console.log('Loading:', loading);
  console.log('Is logged in:', isLoggedIn);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals getting started',
      monthlyPrice: 10,
      yearlyPrice: 9990,
      features: [
        '50 AI prompts per month',
        'Basic image analysis',
        'Standard support',
        'Export to text',
        'Basic templates'
      ],
      popular: false,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Professional',
      description: 'Best for creative professionals',
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      features: [
        '500 AI prompts per month',
        'Advanced image analysis',
        'Priority support',
        'Export to multiple formats',
        'Premium templates',
        'Batch processing',
        'API access'
      ],
      popular: true,
      color: 'from-pink-500 to-yellow-500'
    },
    {
      name: 'Lifetime Deal',
      description: 'One-time payment, lifetime access',
      monthlyPrice: null,
      yearlyPrice: null,
      lifetimePrice: 49999,
      features: [
        'Unlimited AI prompts',
        'All premium features',
        'Lifetime updates',
        'Priority support',
        'Commercial license',
        'Advanced API access',
        'Custom integrations',
        'White-label option'
      ],
      popular: false,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handlePayment = async (plan) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setSelectedPlan(plan);
      setShowLoginModal(true);
      return;
    }

    // Calculate amount
    const amount = billingCycle === 'monthly' ? plan.monthlyPrice : 
                   billingCycle === 'yearly' ? plan.yearlyPrice : 
                   plan.lifetimePrice;

    // Show manual payment modal
    setPaymentPlan(plan);
    setPaymentAmount(amount);
    setShowManualPayment(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>


    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
      {/* Manual Payment Modal */}
      {showManualPayment && (
        <ManualPaymentModal
          isOpen={showManualPayment}
          onClose={() => setShowManualPayment(false)}
          plan={paymentPlan}
          amount={paymentAmount}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Account Required
              </h3>
              
              <p className="text-purple-200 mb-2">
                To purchase the <strong className="text-yellow-400">{selectedPlan?.name}</strong> plan, you need to:
              </p>
              
              <ul className="text-purple-200 text-sm mb-6 space-y-2">
                <li>✨ Create a free account</li>
                <li>🔐 Secure payment processing</li>
                <li>📊 Access to dashboard</li>
                <li>💾 Save your prompt history</li>
              </ul>

              <div className="flex gap-3">
                <Link 
                  href="/auth/login" 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  Sign Up
                </Link>
              </div>
              
              <p className="text-purple-300 text-xs mt-4">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Join thousands of creators already using AI Prompt Studio
              </p>
            </div>
          </div>
        </div>
      )}

  

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
            Unlock the full potential of AI-powered prompt generation with our flexible pricing options
          </p>

          {/* User Status Display */}
          {isLoggedIn ? (
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-green-200 text-sm">
                ✅ Welcome back, <strong>{user?.name}</strong>! You can now purchase any plan.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> You need to <Link href="/auth/login" className="underline hover:text-yellow-100">login</Link> or <Link href="/auth/register" className="underline hover:text-yellow-100">create an account</Link> to purchase a plan.
              </p>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 bg-yellow-400 text-purple-900 px-2 py-1 rounded-full text-xs font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border transition-all hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-2xl shadow-yellow-400/20' 
                    : 'border-purple-500/20 hover:border-purple-400/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-purple-200 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    {plan.lifetimePrice ? (
                      <div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                          ৳{plan.lifetimePrice.toLocaleString()}
                        </div>
                        <div className="text-purple-300 text-sm">One-time payment</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                          ৳{billingCycle === 'monthly' 
                            ? plan.monthlyPrice.toLocaleString() 
                            : plan.yearlyPrice.toLocaleString()}
                        </div>
                        <div className="text-purple-300 text-sm">
                          per {billingCycle === 'monthly' ? 'month' : 'year'}
                        </div>
                        {billingCycle === 'yearly' && (
                          <div className="text-green-400 text-xs mt-1">
                            Save ৳{((plan.monthlyPrice * 12) - plan.yearlyPrice).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-purple-200 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform ${
                    !isLoggedIn
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-[1.02] cursor-pointer'
                      : plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 shadow-xl hover:shadow-2xl hover:scale-[1.02]'
                      : `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:scale-[1.02]`
                  }`}
                >
                  {!isLoggedIn 
                    ? 'Login Required' 
                    : plan.lifetimePrice 
                    ? 'Get Lifetime Access' 
                    : 'Get Started'
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose AI Prompt Studio?
            </h2>
            <p className="text-purple-200 text-lg">
              Trusted by thousands of creators worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-purple-200">Generate professional prompts in seconds with our optimized AI</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-purple-200">Professional-grade prompts that work with all major AI platforms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Trusted by Pros</h3>
              <p className="text-purple-200">Used by leading designers and artists worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-purple-200 text-sm">We accept all major credit cards, debit cards, and mobile banking through SSLCommerz, including bKash, Nagad, and Rocket.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-purple-200 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-purple-200 text-sm">Yes, we offer a 7-day free trial with 10 AI prompts to help you get started.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-2">What's included in the lifetime deal?</h3>
              <p className="text-purple-200 text-sm">The lifetime deal includes unlimited AI prompts, all premium features, lifetime updates, and priority support with a one-time payment.</p>
            </div>
          </div>
        </div>
      </section>

  
    </div>
        </Layout>
  );
};

export default PricingPage;