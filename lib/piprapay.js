// lib/piprapay.js
class PipraPay {
  constructor() {
    this.apiKey = process.env.PIPRAPAY_API_KEY;
    this.baseUrl = process.env.PIPRAPAY_BASE_URL || 'https://sandbox.piprapay.com';
    this.webhookSecret = process.env.PIPRAPAY_WEBHOOK_SECRET;
  }

  // Create a payment
  async createPayment(paymentData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment creation failed');
      }

      return data;
    } catch (error) {
      console.error('PipraPay createPayment error:', error);
      throw error;
    }
  }

  // Verify a payment
  async verifyPayment(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/${paymentId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('PipraPay verifyPayment error:', error);
      throw error;
    }
  }

  // Get payment details
  async getPayment(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment details');
      }

      return data;
    } catch (error) {
      console.error('PipraPay getPayment error:', error);
      throw error;
    }
  }

  // Cancel a payment
  async cancelPayment(paymentId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/${paymentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment cancellation failed');
      }

      return data;
    } catch (error) {
      console.error('PipraPay cancelPayment error:', error);
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('Webhook secret not configured');
      return true; // Allow if no secret is configured
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Format payment data for PipraPay
  formatPaymentData({
    amount,
    currency = 'BDT',
    reference,
    description,
    customer,
    callbackUrls,
    metadata = {}
  }) {
    return {
      amount: parseFloat(amount).toFixed(2),
      currency,
      reference,
      description,
      customer: {
        name: customer.name || 'Customer',
        email: customer.email,
        phone: customer.phone || '',
        address: {
          line1: customer.address?.line1 || '',
          city: customer.address?.city || 'Dhaka',
          state: customer.address?.state || 'Dhaka',
          postal_code: customer.address?.postal_code || '1000',
          country: customer.address?.country || 'BD'
        }
      },
      callback_urls: {
        success: callbackUrls.success,
        cancel: callbackUrls.cancel,
        webhook: callbackUrls.webhook
      },
      metadata
    };
  }
}

// Export singleton instance
const piprapay = new PipraPay();
export default piprapay;

// Also export the class for custom instances
export { PipraPay };

// Helper functions
export const createPaymentLink = async (paymentData) => {
  return await piprapay.createPayment(paymentData);
};

export const verifyPaymentStatus = async (paymentId) => {
  return await piprapay.verifyPayment(paymentId);
};

export const getPaymentDetails = async (paymentId) => {
  return await piprapay.getPayment(paymentId);
};

// Validation helpers
export const validatePaymentData = (data) => {
  const required = ['amount', 'reference', 'description', 'customer'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!data.customer.email) {
    throw new Error('Customer email is required');
  }

  if (isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
    throw new Error('Invalid amount');
  }

  return true;
};

// Currency helper
export const formatCurrency = (amount, currency = 'BDT') => {
  const formatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
};