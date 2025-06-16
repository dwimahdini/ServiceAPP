// API Testing Utilities
import { authAPI } from '../services/api';

export const testApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    return {
      success: true,
      message: 'API connection successful',
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: 'API connection failed',
      error: error.message
    };
  }
};

export const testAdminLogin = async (credentials = { email: 'admin@futurex.com', password: 'admin123' }) => {
  try {
    const response = await authAPI.login(credentials);
    return {
      success: true,
      message: 'Admin login successful',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Admin login failed',
      error: error.response?.data?.msg || error.message
    };
  }
};

export const testDatabaseEndpoints = async () => {
  const endpoints = [
    { name: 'Users', endpoint: '/users' },
    { name: 'Layanan', endpoint: '/getlayanan' },
    { name: 'Dokter', endpoint: '/getpilihdokterpsikolog' },
    { name: 'Durasi', endpoint: '/getdurasi' },
    { name: 'Booking', endpoint: '/getbooking' }
  ];

  const results = [];

  for (const { name, endpoint } of endpoints) {
    try {
      const response = await authAPI.get(endpoint);
      results.push({
        name,
        endpoint,
        success: true,
        count: response.data?.length || 0,
        message: `${name} endpoint working`
      });
    } catch (error) {
      results.push({
        name,
        endpoint,
        success: false,
        error: error.response?.data?.msg || error.message,
        message: `${name} endpoint failed`
      });
    }
  }

  return results;
};

// Console testing functions for development
if (import.meta.env.DEV) {
  window.testAPI = {
    connection: testApiConnection,
    adminLogin: testAdminLogin,
    database: testDatabaseEndpoints
  };
  
  console.log('🧪 API Testing utilities loaded. Use window.testAPI in console.');
}
