// Base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function untuk handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

// Helper function untuk get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function untuk create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Transaction Service
export const transactionService = {
  // Get all transactions (admin only)
  async getAllTransactions(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = `${API_BASE_URL}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  async getTransactionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      throw error;
    }
  },

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(transactionData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction status
  async updateTransactionStatus(id, status, notes = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ status, notes }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  },

  // Cancel transaction
  async cancelTransaction(id, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true),
        body: JSON.stringify({ reason }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error canceling transaction:', error);
      throw error;
    }
  },

  // Get payment history
  async getPaymentHistory(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = `${API_BASE_URL}/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Process payment
  async processPayment(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(paymentData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(id, status, notes = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ status, notes }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = `${API_BASE_URL}/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Generate invoice
  async generateInvoice(invoiceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(invoiceData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoiceById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching invoice by ID:', error);
      throw error;
    }
  },

  // Get revenue analytics
  async getRevenueAnalytics(period = 'month') {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/revenue?period=${period}`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  // Get transaction analytics
  async getTransactionAnalytics(period = 'month') {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/transactions?period=${period}`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      throw error;
    }
  }
};

export default transactionService;
