'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, X, Shield, Sparkles, Crown, Calendar, Phone, Eye, Copy, Check } from 'lucide-react';
import BlogDashboard from './BlogDashboard';
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';

const DashboardClient = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [prompts, setPrompts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active',
    promptsUsed: 0,
    promptsLimit: 10,
    billingCycle: 'monthly',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const tabs = [
    { id: 'overview', label: 'Overview', adminOnly: false },
    { id: 'history', label: 'Prompt History', adminOnly: false },
    { id: 'subscription', label: 'Subscription', adminOnly: false },
    { id: 'settings', label: 'Settings', adminOnly: false },
    { id: 'admin-payments', label: 'Admin Payments', adminOnly: true, email: 'shoesizeconvert@gmail.com' },
    { id: 'blog-management', label: 'Blog Management', adminOnly: true, email: 'shoesizeconvert@gmail.com' },
  ];

  const getPlanColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'professional':
        return 'from-purple-500 to-indigo-500';
      case 'lifetime':
        return 'from-yellow-500 to-orange-500';
      case 'starter':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'professional':
        return <Sparkles className="w-10 h-10 text-purple-400" />;
      case 'lifetime':
        return <Crown className="w-10 h-10 text-yellow-400" />;
      case 'starter':
        return <Shield className="w-10 h-10 text-blue-400" />;
      default:
        return <Shield className="w-10 h-10 text-gray-400" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'piprapay':
        return <img src="/icons/piprapay.png" alt="PipraPay" className="w-5 h-5" />;
      default:
        return <img src="/icons/other.png" alt="Other" className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">Pending</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Completed</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">{status || 'Unknown'}</span>;
    }
  };

  const fetchTransactions = async () => {
    setPaymentLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/payment/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('Unauthorized: Admin access required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      setError(error.message || 'Error fetching transactions');
      setTransactions([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchPromptHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/prompts/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPrompts(data.prompts);
      } else {
        throw new Error(data.message || 'Failed to fetch prompt history');
      }
    } catch (error) {
      setError(error.message || 'Error fetching prompt history');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      if (data.success && data.user?.subscription) {
        setSubscription({
          plan: data.user.subscription.plan,
          status: data.user.subscription.status,
          promptsUsed: data.user.subscription.promptsUsed,
          promptsLimit: data.user.subscription.promptsLimit,
          billingCycle: data.user.subscription.billingCycle,
          startDate: data.user.subscription.startDate,
          endDate: data.user.subscription.endDate,
          createdAt: data.user.createdAt,
          updatedAt: data.user.subscription.updatedAt,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPromptHistory();
      fetchUserSubscription();
      if (user.isAdmin || user.email === 'shoesizeconvert@gmail.com') {
        fetchTransactions();
      }
    }
  }, [user]);

  const openPromptModal = (prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };

  const closePromptModal = () => {
    setShowPromptModal(false);
    setSelectedPrompt(null);
    setCopiedPromptId(null);
  };

  const copyPromptToClipboard = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <Layout>


    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              (!tab.adminOnly || user?.isAdmin || (tab.email && user?.email === tab.email)) && (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              )
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Prompts Used</p>
                    <p className="text-2xl font-bold text-white">
                      {subscription.promptsUsed} / {subscription.promptsLimit}
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                      style={{ width: `${(subscription.promptsUsed / subscription.promptsLimit) * 100}%` }}
                    ></div>
                    <p className="text-purple-200 text-xs mt-1">
                      {subscription.promptsLimit - subscription.promptsUsed} remaining
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Current Plan</p>
                    <p className="text-2xl font-bold text-white capitalize">{subscription.plan}</p>
                  </div>
                  {getPlanIcon(subscription.plan)}
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPlanColor(
                      subscription.plan
                    )} text-white`}
                  >
                    {subscription.status}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Member Since</p>
                    <p className="text-2xl font-bold text-white">
                      {subscription.createdAt
                        ? new Date(subscription.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/"
                  className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate New Prompt
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  Upgrade Plan
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">
                Prompt History{' '}
                {user?.email === 'shoesizeconvert@gmail.com' && (
                  <span className="text-yellow-400 text-lg">(Admin - All Users)</span>
                )}
              </h1>
              <button
                onClick={fetchPromptHistory}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Refresh
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading prompts...</p>
                </div>
              ) : prompts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/30">
                        {user?.email === 'shoesizeconvert@gmail.com' && (
                          <>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">User</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">User ID</th>
                          </>
                        )}
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Date</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Type</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Preview</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prompts.map((prompt, index) => (
                        <tr key={prompt._id || index} className="border-b border-purple-500/10 hover:bg-purple-800/20">
                          {user?.email === 'shoesizeconvert@gmail.com' && (
                            <>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-white font-medium text-sm">{prompt.userName || 'Unknown User'}</div>
                                  <div className="text-purple-300 text-xs">{prompt.userEmail || 'No email'}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-purple-200 font-mono text-xs">
                                  {prompt.userId?.toString().substring(0, 8)}...
                                </div>
                              </td>
                            </>
                          )}
                          <td className="py-3 px-4">
                            <div className="text-purple-200 text-sm">
                              {new Date(prompt.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                prompt.type === 'veo3'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-green-500/20 text-green-300'
                              }`}
                            >
                              {prompt.type === 'veo3' ? 'Video' : 'Image'}
                              {prompt.style && ` (${prompt.style})`}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="text-white text-sm truncate">{prompt.prompt?.substring(0, 50)}...</div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openPromptModal(prompt)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                              title="View Full Prompt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center ANTIALIASED">
                  <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">No prompts generated yet</p>
                  <Link
                    href="/"
                    className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Generate Your First Prompt
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Subscription Management</h1>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getPlanIcon(subscription.plan)}
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-white capitalize">{subscription.plan} Plan</h3>
                    <p className="text-purple-200">
                      {subscription.promptsUsed} / {subscription.promptsLimit} prompts used
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getPlanColor(
                    subscription.plan
                  )} text-white`}
                >
                  {subscription.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Usage This Month</h4>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                      style={{ width: `${Math.min((subscription.promptsUsed / subscription.promptsLimit) * 100, 100)}%` }}
                    ></div>
                    <p className="text-purple-200 text-sm mt-1">
                      {subscription.promptsLimit - subscription.promptsUsed} prompts remaining
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Plan Details</h4>
                  <ul className="text-purple-200 text-sm space-y-1">
                    <li>• {subscription.promptsLimit} prompts per month</li>
                    <li>• Billing Cycle: {subscription.billingCycle}</li>
                    <li>• Start Date: {new Date(subscription.startDate).toLocaleDateString()}</li>
                    <li>• End Date: {new Date(subscription.endDate).toLocaleDateString()}</li>
                    <li>• Advanced AI analysis</li>
                    <li>• Priority support</li>
                    {subscription.plan !== 'free' && <li>• Export capabilities</li>}
                  </ul>
                </div>
              </div>

              {subscription.plan === 'free' && (
                <div className="mt-6 pt-6 border-t border-purple-500/30">
                  <div className="text-center">
                    <h4 className="text-white font-semibold mb-2">Ready to upgrade?</h4>
                    <p className="text-purple-200 text-sm mb-4">Get unlimited prompts and premium features</p>
                    <Link
                      href="/pricing"
                      className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Member Since</label>
                  <input
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
              <p className="text-red-200 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'blog-management' && user?.email === 'shoesizeconvert@gmail.com' && <BlogDashboard />}

        {activeTab === 'admin-payments' && (user?.isAdmin || user?.email === 'shoesizeconvert@gmail.com') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Payments</h1>
              <div className="flex items-center gap-4">
                <span className="text-purple-200 text-sm">
                  Pending: {transactions.filter((p) => p.status === 'pending').length}
                </span>
                <button
                  onClick={fetchTransactions}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
              {paymentLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-purple-200 mt-2">Loading payments...</p>
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/30">
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">User</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Plan</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Amount</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Method</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">TrxID</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Order</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Date</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Status</th>
                        <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="border-b border-purple-500/10 hover:bg-purple-800/20">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white font-medium text-sm">{transaction.user_name || 'Unknown'}</div>
                              <div className="text-purple-300 text-xs">{transaction.user_email || 'No email'}</div>
                              <div className="text-purple-400 text-xs flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {transaction.customer_phone || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white font-medium text-sm">{transaction.plan}</div>
                            <div className="text-purple-300 text-xs">{transaction.billing_cycle}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white font-bold text-sm">৳{transaction.amount.toLocaleString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(transaction.payment_provider)}
                              <span className="text-white capitalize text-sm">{transaction.payment_provider}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white font-mono text-xs">{transaction.transaction_id}</div>
                          </td>
                          <td className="py-3 px-4">
                            {transaction.order ? (
                              <div className="text-white text-sm">
                                <div>Order ID: {transaction.order._id || 'N/A'}</div>
                                <div className="text-purple-300 text-xs">
                                  {transaction.order.items?.length || 0} item(s)
                                </div>
                              </div>
                            ) : (
                              <div className="text-purple-300 text-sm">No order linked</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-purple-200 text-xs">
                              {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(transaction.status)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedTransaction(transaction)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">No payments found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {showPromptModal && selectedPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePromptModal}></div>
            <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-purple-500/30 shadow-2xl max-h-[80vh] overflow-y-auto">
              <button
                onClick={closePromptModal}
                className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-white mb-6">Prompt Details</h3>
              <div className="space-y-4 text-sm">
                {user?.email === 'shoesizeconvert@gmail.com' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-purple-300">User:</span>
                      <div className="text-right">
                        <div className="text-white">{selectedPrompt.userName || 'Unknown User'}</div>
                        <div className="text-purple-200 text-xs">{selectedPrompt.userEmail || 'No email'}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">User ID:</span>
                      <span className="text-white font-mono text-xs">{selectedPrompt.userId?.toString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-purple-300">Created:</span>
                  <span className="text-white text-xs">{new Date(selectedPrompt.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Type:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPrompt.type === 'veo3' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {selectedPrompt.type === 'veo3' ? 'Video' : 'Image'}
                    {selectedPrompt.style && ` (${selectedPrompt.style})`}
                  </span>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-purple-300 font-medium">Full Prompt:</span>
                    <button
                      onClick={() => copyPromptToClipboard(selectedPrompt.prompt, selectedPrompt._id)}
                      className="p-2 text-purple-300 hover:text-white transition-colors bg-purple-800/50 rounded-lg flex items-center gap-2"
                    >
                      {copiedPromptId === selectedPrompt._id ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{selectedPrompt.prompt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTransaction(null)}></div>
            <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-white mb-6">Payment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">Transaction ID:</span>
                  <span className="text-white font-mono text-xs">{selectedTransaction.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">User:</span>
                  <div className="text-right">
                    <div className="text-white">{selectedTransaction.user_name || 'Unknown'}</div>
                    <div className="text-purple-200 text-xs">{selectedTransaction.user_email || 'No email'}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Plan:</span>
                  <div className="text-right">
                    <div className="text-white">{selectedTransaction.plan}</div>
                    <div className="text-purple-200 text-xs">{selectedTransaction.billing_cycle}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Amount:</span>
                  <span className="text-white font-bold">৳{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Method:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedTransaction.payment_provider)}
                    <span className="text-white capitalize">{selectedTransaction.payment_provider}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Phone:</span>
                  <span className="text-white">{selectedTransaction.customer_phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Submitted:</span>
                  <span className="text-white text-xs">{new Date(selectedTransaction.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Status:</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                {selectedTransaction.order && (
                  <div>
                    <span className="text-purple-300">Order Details:</span>
                    <div className="text-white text-xs mt-1 p-2 bg-purple-800/30 rounded">
                      <div>Order ID: {selectedTransaction.order._id || 'N/A'}</div>
                      <div>Items: {selectedTransaction.order.items?.length || 0}</div>
                      {selectedTransaction.order.items?.map((item, index) => (
                        <div key={index} className="ml-2">
                          - {item.name} (Qty: {item.quantity}, Price: ৳{item.price.toLocaleString()})
                        </div>
                      ))}
                      <div>Total: ৳{selectedTransaction.order.total?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
        </Layout>
  );
};

export default DashboardClient;