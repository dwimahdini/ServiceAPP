import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const AdminLoginTest = () => {
  const [testResults, setTestResults] = useState({
    apiConnection: null,
    adminLogin: null,
    userLogin: null
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Test credentials - Updated with real database credentials
  const adminCredentials = {
    email: 'admin12@gmail.com',
    password: 'admin123'
  };

  const userCredentials = {
    email: 'user@example.com',
    password: 'password'
  };

  const testApiConnection = async () => {
    try {
      setLoading(true);

      // Test multiple possible endpoints
      const endpoints = [
        'http://localhost:5000/api/test',
        'http://localhost:5000/test',
        'http://localhost:5000/',
        'http://localhost:3000/api/test',
        'http://localhost:3000/test',
        'http://localhost:3000/'
      ];

      let connectionResult = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.text();
            connectionResult = {
              success: true,
              message: `API connection successful at ${endpoint}`,
              data: data
            };
            break;
          }
        } catch (err) {
          console.log(`Failed to connect to ${endpoint}:`, err.message);
        }
      }

      if (!connectionResult) {
        connectionResult = {
          success: false,
          message: 'No backend server found on ports 3000 or 5000. Please start your backend server.'
        };
      }

      setTestResults(prev => ({
        ...prev,
        apiConnection: connectionResult
      }));

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        apiConnection: { success: false, message: `Connection failed: ${error.message}` }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    try {
      setLoading(true);
      
      const result = await login(adminCredentials);
      
      if (result.success) {
        setTestResults(prev => ({
          ...prev,
          adminLogin: { 
            success: true, 
            message: `Admin login successful! Role: ${result.user.role}`,
            user: result.user
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          adminLogin: { success: false, message: result.error }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        adminLogin: { success: false, message: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testUserLogin = async () => {
    try {
      setLoading(true);
      
      const result = await login(userCredentials);
      
      if (result.success) {
        setTestResults(prev => ({
          ...prev,
          userLogin: { 
            success: true, 
            message: `User login successful! Role: ${result.user.role}`,
            user: result.user
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          userLogin: { success: false, message: result.error }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        userLogin: { success: false, message: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testDirectApiCall = async () => {
    try {
      setLoading(true);
      
      // Test direct API call
      const response = await authAPI.login(adminCredentials);
      
      setTestResults(prev => ({
        ...prev,
        adminLogin: { 
          success: true, 
          message: 'Direct API call successful!',
          data: response.data
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        adminLogin: { 
          success: false, 
          message: `Direct API call failed: ${error.response?.data?.message || error.message}`
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const goToAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  const goToTransactionDashboard = () => {
    navigate('/admin/transactions/dashboard');
  };

  const StatusIndicator = ({ result }) => {
    if (!result) return <span className="text-gray-500">⚪ Not tested</span>;
    if (result.success) return <span className="text-green-600">✅ Success</span>;
    return <span className="text-red-600">❌ Failed</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login & API Test</h1>
          
          {/* API Connection Test */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">API Connection Test</h2>
              <button
                onClick={testApiConnection}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Test Connection
              </button>
            </div>
            <div className="flex items-center gap-3">
              <StatusIndicator result={testResults.apiConnection} />
              <span className="text-sm text-gray-600">
                {testResults.apiConnection?.message || 'Test API connection to http://localhost:5000'}
              </span>
            </div>
          </div>

          {/* Admin Login Test */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Admin Login Test</h2>
              <div className="flex gap-2">
                <button
                  onClick={testDirectApiCall}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  Direct API Call
                </button>
                <button
                  onClick={testAdminLogin}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Test Admin Login
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StatusIndicator result={testResults.adminLogin} />
                <span className="text-sm text-gray-600">
                  {testResults.adminLogin?.message || 'Test admin login with admin12@gmail.com'}
                </span>
              </div>
              {testResults.adminLogin?.user && (
                <div className="text-xs text-gray-500 ml-6">
                  User: {testResults.adminLogin.user.name} | Role: {testResults.adminLogin.user.role}
                </div>
              )}
            </div>
          </div>

          {/* User Login Test */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">User Login Test</h2>
              <button
                onClick={testUserLogin}
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                Test User Login
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StatusIndicator result={testResults.userLogin} />
                <span className="text-sm text-gray-600">
                  {testResults.userLogin?.message || 'Test user login with user@example.com'}
                </span>
              </div>
              {testResults.userLogin?.user && (
                <div className="text-xs text-gray-500 ml-6">
                  User: {testResults.userLogin.user.name} | Role: {testResults.userLogin.user.role}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Go to Login Page
              </button>
              <button
                onClick={goToAdminDashboard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Admin Dashboard
              </button>
              <button
                onClick={goToTransactionDashboard}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Transaction Dashboard
              </button>
            </div>
          </div>

          {/* Backend Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Backend Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>API Base URL:</strong> http://localhost:5000</div>
              <div><strong>Expected Endpoints:</strong> /login, /register, /users</div>
              <div><strong>Database:</strong> MySQL with schema from database-schema.sql</div>
              <div><strong>Admin Credentials:</strong> admin12@gmail.com / admin123</div>
              <div><strong>User Credentials:</strong> user@example.com / password</div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Testing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoginTest;
