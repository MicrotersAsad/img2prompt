// components/DashboardClient.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  History,
  Settings,
  LogOut,
  Sparkles,
  Crown,
  Zap,
  Calendar,
  TrendingUp,
  FileText,
  Shield,
  Check,
  X,
  Eye,
  Phone,
  Clock,
  AlertTriangle,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';
import BlogDashboard from './BlogDashboard';

const DashboardClient = ({ user: initialUser, onLogout }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualPayments, setManualPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPromptHistory();
    } else if (activeTab === 'admin-payments' && (user?.isAdmin || user?.email === 'shoesizeconvert@gmail.com')) {
      fetchManualPayments();
    }
  }, [activeTab, user]);

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token');
    }
    return null;
  };

  // Helper function to handle API errors
  const handleApiError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    setError(`Failed to ${context}. Please try again.`);
  };

  const fetchPromptHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching prompt history with token:', token?.substring(0, 10) + '...');
      
      // Admin gets all prompts, regular users get only their prompts
      const endpoint = user?.email === 'shoesizeconvert@gmail.com' 
        ? '/api/prompts/all-history' 
        : '/api/prompts/history';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Prompt history response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Prompt history data:', data);
      
      if (data.success) {
        setPrompts(data.prompts || []);
      } else {
        throw new Error(data.message || 'Failed to fetch prompt history');
      }
    } catch (error) {
      handleApiError(error, 'fetch prompt history');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchManualPayments = async () => {
    setPaymentLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching manual payments with token:', token?.substring(0, 10) + '...');
      
      const response = await fetch('/api/payment/manual-payments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Manual payments response status:', response.status);
      console.log('Manual payments response:', response);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Manual payments data:', data);
      
      if (data.success) {
        setManualPayments(data.payments || []);
      } else {
        throw new Error(data.message || 'Failed to fetch manual payments');
      }
    } catch (error) {
      handleApiError(error, 'fetch manual payments');
      setManualPayments([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Modal helper functions
  const openApproveModal = (payment) => {
    setPendingPayment(payment);
    setShowApproveModal(true);
    setError(null);
  };

  const openRejectModal = (payment) => {
    setPendingPayment(payment);
    setRejectReason('');
    setShowRejectModal(true);
    setError(null);
  };

  const closeModals = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setPendingPayment(null);
    setRejectReason('');
    setError(null);
    setIsProcessing(false);
  };

  const handleApprovePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch('/api/payment/manual-payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ payment_id: pendingPayment._id })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchManualPayments(); // Refresh list
        closeModals();
      } else {
        setError(result.message || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      setError('Error approving payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) {
      setError('Please enter a rejection reason');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch('/api/payment/manual-payments/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          payment_id: pendingPayment._id,
          reason: rejectReason.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchManualPayments(); // Refresh list
        closeModals();
      } else {
        setError(result.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      setError('Error rejecting payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy prompt to clipboard function
  const copyPromptToClipboard = (promptText, promptId) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(promptId);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Open prompt modal
  const openPromptModal = (prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };

  // Close prompt modal
  const closePromptModal = () => {
    setSelectedPrompt(null);
    setShowPromptModal(false);
    setCopiedPromptId(null);
  };

  // Use the logout function passed from useAuth
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'professional':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'lifetime':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'professional':
        return 'from-yellow-400 to-orange-400';
      case 'lifetime':
        return 'from-purple-400 to-pink-400';
      default:
        return 'from-blue-400 to-cyan-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center gap-1">
          <Check className="w-3 h-3" /> Approved
        </span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs flex items-center gap-1">
          <X className="w-3 h-3" /> Rejected
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">Unknown</span>;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bkash':
        return <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">bK</div>;
      case 'nagad':
        return <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">N</div>;
      case 'rocket':
        return <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>;
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  // Check if user has subscription data, if not provide default
  const subscription = user?.subscription || {
    plan: 'free',
    status: 'active',
    promptsUsed: 0,
    promptsLimit: 10
  };

  // Error display component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-red-300">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-900">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{user?.name || 'User'}</h3>
                  <p className="text-purple-200 text-sm">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-purple-200 hover:bg-purple-800/30'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-purple-200 hover:bg-purple-800/30'
                  }`}
                >
                  <History className="w-5 h-5 mr-3" />
                  Prompt History
                </button>

                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'subscription'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-purple-200 hover:bg-purple-800/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  Subscription
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-purple-200 hover:bg-purple-800/30'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>

                {/* Admin Section */}
                {(user?.isAdmin || user?.email === 'shoesizeconvert@gmail.com') && (
                  <>
                    <button
                      onClick={() => setActiveTab('admin-payments')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                        activeTab === 'admin-payments'
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                          : 'text-purple-200 hover:bg-purple-800/30'
                      }`}
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Manual Payments
                      {manualPayments.filter(p => p.status === 'pending').length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {manualPayments.filter(p => p.status === 'pending').length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('blog-management')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                        activeTab === 'blog-management'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'text-purple-200 hover:bg-purple-800/30'
                      }`}
                    >
                      <FileText className="w-5 h-5 mr-3" />
                      Blog Management
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error display */}
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={() => {
                  setError(null);
                  if (activeTab === 'history') {
                    fetchPromptHistory();
                  } else if (activeTab === 'admin-payments') {
                    fetchManualPayments();
                  }
                }}
              />
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Prompts Used</p>
                        <p className="text-2xl font-bold text-white">
                          {subscription.promptsUsed}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{
                            width: `${(subscription.promptsUsed / subscription.promptsLimit) * 100}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-purple-200 text-xs mt-1">
                        {subscription.promptsLimit - subscription.promptsUsed} remaining
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Current Plan</p>
                        <p className="text-2xl font-bold text-white capitalize">
                          {subscription.plan}
                        </p>
                      </div>
                      {getPlanIcon(subscription.plan)}
                    </div>
                    <div className="mt-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPlanColor(subscription.plan)} text-white`}>
                        {subscription.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Member Since</p>
                        <p className="text-2xl font-bold text-white">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
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
                    Prompt History {user?.email === 'shoesizeconvert@gmail.com' && (
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
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  prompt.type === 'veo3' 
                                    ? 'bg-blue-500/20 text-blue-300' 
                                    : 'bg-green-500/20 text-green-300'
                                }`}>
                                  {prompt.type === 'veo3' ? 'Video' : 'Image'}
                                  {prompt.style && ` (${prompt.style})`}
                                </span>
                              </td>
                              <td className="py-3 px-4 max-w-xs">
                                <div className="text-white text-sm truncate">
                                  {prompt.prompt?.substring(0, 50)}...
                                </div>
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
                    <div className="text-center py-8">
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
                        <h3 className="text-xl font-bold text-white capitalize">
                          {subscription.plan} Plan
                        </h3>
                        <p className="text-purple-200">
                          {subscription.promptsUsed} / {subscription.promptsLimit} prompts used
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getPlanColor(subscription.plan)} text-white`}>
                      {subscription.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Usage This Month</h4>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                          style={{
                            width: `${Math.min((subscription.promptsUsed / subscription.promptsLimit) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-purple-200 text-sm mt-1">
                        {subscription.promptsLimit - subscription.promptsUsed} prompts remaining
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">Plan Details</h4>
                      <ul className="text-purple-200 text-sm space-y-1">
                        <li>• {subscription.promptsLimit} prompts per month</li>
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
                        <p className="text-purple-200 text-sm mb-4">
                          Get unlimited prompts and premium features
                        </p>
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
                  <p className="text-red-200 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Blog Management Tab */}
            {activeTab === 'blog-management' && user?.email === 'shoesizeconvert@gmail.com' && (
              <BlogDashboard />
            )}

            {/* Admin Manual Payments Section */}
            {activeTab === 'admin-payments' && (user?.isAdmin || user?.email === 'shoesizeconvert@gmail.com') && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-white">Manual Payments</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-purple-200 text-sm">
                      Pending: {manualPayments.filter(p => p.status === 'pending').length}
                    </span>
                    <button
                      onClick={fetchManualPayments}
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
                  ) : manualPayments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-500/30">
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">User</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Plan</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Amount</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Method</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">TrxID</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Date</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 text-purple-200 font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {manualPayments.map((payment) => (
                            <tr key={payment._id} className="border-b border-purple-500/10 hover:bg-purple-800/20">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-white font-medium text-sm">{payment.user_name}</div>
                                  <div className="text-purple-300 text-xs">{payment.user_email}</div>
                                  <div className="text-purple-400 text-xs flex items-center gap-1 mt-1">
                                    <Phone className="w-3 h-3" />
                                    {payment.sender_number}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-white font-medium text-sm">{payment.plan}</div>
                                <div className="text-purple-300 text-xs">{payment.billing_cycle}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-white font-bold text-sm">৳{payment.amount.toLocaleString()}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {getPaymentMethodIcon(payment.payment_method)}
                                  <span className="text-white capitalize text-sm">{payment.payment_method}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-white font-mono text-xs">{payment.transaction_id}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-purple-200 text-xs">
                                  {new Date(payment.submitted_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(payment.status)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1">
                                  {payment.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => openApproveModal(payment)}
                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                                        title="Approve"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => openRejectModal(payment)}
                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                        title="Reject"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setSelectedPayment(payment)}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-purple-200">No manual payments found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Details Modal */}
      {showPromptModal && selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePromptModal}
          ></div>
          
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
                <span className="text-white text-xs">
                  {new Date(selectedPrompt.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-purple-300">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedPrompt.type === 'veo3' 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
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
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedPrompt.prompt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPayment(null)}
          ></div>
          
          <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30 shadow-2xl">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">Payment Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-300">Reference:</span>
                <span className="text-white font-mono text-xs">{selectedPayment.payment_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">User:</span>
                <div className="text-right">
                  <div className="text-white">{selectedPayment.user_name}</div>
                  <div className="text-purple-200 text-xs">{selectedPayment.user_email}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Plan:</span>
                <div className="text-right">
                  <div className="text-white">{selectedPayment.plan}</div>
                  <div className="text-purple-200 text-xs">{selectedPayment.billing_cycle}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Amount:</span>
                <span className="text-white font-bold">৳{selectedPayment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Method:</span>
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(selectedPayment.payment_method)}
                  <span className="text-white capitalize">{selectedPayment.payment_method}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Sender:</span>
                <span className="text-white">{selectedPayment.sender_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Transaction ID:</span>
                <span className="text-white font-mono text-xs">{selectedPayment.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Submitted:</span>
                <span className="text-white text-xs">{new Date(selectedPayment.submitted_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Status:</span>
                {getStatusBadge(selectedPayment.status)}
              </div>
              {selectedPayment.admin_notes && (
                <div>
                  <span className="text-purple-300">Notes:</span>
                  <div className="text-white text-xs mt-1 p-2 bg-purple-800/30 rounded">{selectedPayment.admin_notes}</div>
                </div>
              )}
            </div>

            {selectedPayment.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    openApproveModal(selectedPayment);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    openRejectModal(selectedPayment);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Payment Modal */}
      {showApproveModal && pendingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          <div className="relative bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-green-500/30 shadow-2xl">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-green-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Approve Payment</h3>
              
              {/* Show error in modal if any */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <div className="bg-green-800/30 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-300">User:</span>
                    <span className="text-white">{pendingPayment.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Plan:</span>
                    <span className="text-white">{pendingPayment.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Amount:</span>
                    <span className="text-white font-bold">৳{pendingPayment.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Method:</span>
                    <span className="text-white capitalize">{pendingPayment.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">TrxID:</span>
                    <span className="text-white font-mono text-xs">{pendingPayment.transaction_id}</span>
                  </div>
                </div>
              </div>

              <p className="text-green-200 text-sm mb-6">
                Are you sure you want to approve this payment? This action will activate the user's subscription.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeModals}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprovePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Approve Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showRejectModal && pendingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          ></div>
          
          <div className="relative bg-gradient-to-br from-red-900 to-rose-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-red-500/30 shadow-2xl">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-red-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Reject Payment</h3>
              
              {/* Show error in modal if any */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <div className="bg-red-800/30 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-300">User:</span>
                    <span className="text-white">{pendingPayment.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300">Plan:</span>
                    <span className="text-white">{pendingPayment.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300">Amount:</span>
                    <span className="text-white font-bold">৳{pendingPayment.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300">TrxID:</span>
                    <span className="text-white font-mono text-xs">{pendingPayment.transaction_id}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-red-200 text-sm font-medium mb-2 text-left">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this payment..."
                  className="w-full px-4 py-3 bg-red-800/30 border border-red-500/30 rounded-lg text-white placeholder-red-300/60 focus:outline-none focus:border-red-400 resize-none"
                  rows={3}
                  maxLength={500}
                  disabled={isProcessing}
                />
                <div className="text-right text-red-300 text-xs mt-1">
                  {rejectReason.length}/500
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModals}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectPayment}
                  disabled={!rejectReason.trim() || isProcessing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Reject Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
        
    </Layout>
  );
};

export default DashboardClient;