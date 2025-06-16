import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const SimpleAPITest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API...');

    try {
      // Test 0: Check authentication
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      console.log('Token:', token);
      console.log('User:', user);

      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      if (user.role !== 'admin') {
        throw new Error(`User role is '${user.role}', but 'admin' role is required.`);
      }

      // Test 1: Check if authAPI.post exists
      console.log('authAPI object:', authAPI);
      console.log('authAPI.post function:', authAPI.post);

      if (typeof authAPI.post !== 'function') {
        throw new Error('authAPI.post is not a function');
      }
      
      // Test 2: Simple GET request
      setResult('Testing GET request...');
      const getResponse = await authAPI.get('/getpilihdokterpsikolog');
      console.log('GET Response:', getResponse);
      
      // Test 3: POST request
      setResult('Testing POST request...');
      const testData = {
        pilih_dokter_psikolog: 'Dr. API Test, M.Psi',
        layananId: 1,
        spesialisasi: 'Test Spesialisasi',
        deskripsi: 'Test deskripsi dari API test',
        harga_konsultasi: 500000,
        foto_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300'
      };
      
      const postResponse = await authAPI.post('/tambahpilihdokterpsikolog', testData);
      console.log('POST Response:', postResponse);
      
      setResult(`✅ API Test Success!\nGET: ${getResponse.data?.length || 0} records\nPOST: ${postResponse.data?.message || 'Success'}`);
      
    } catch (error) {
      console.error('API Test Error:', error);
      setResult(`❌ API Test Failed:\n${error.message}\n\nDetails:\n${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('Testing direct fetch...');
    
    try {
      const response = await fetch('http://localhost:5000/getpilihdokterpsikolog');
      const data = await response.json();
      
      setResult(`✅ Direct Fetch Success!\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Direct Fetch Failed:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setResult(`🔍 Authentication Status:

Token: ${token ? 'EXISTS ✅' : 'MISSING ❌'}
Token Preview: ${token ? token.substring(0, 50) + '...' : 'N/A'}

User: ${user.name || 'UNKNOWN'}
Email: ${user.email || 'UNKNOWN'}
Role: ${user.role || 'UNKNOWN'}
User ID: ${user.id || 'UNKNOWN'}

Status: ${token && user.role === 'admin' ? 'READY FOR API CALLS ✅' : 'NOT READY ❌'}

${!token ? '⚠️ Please login first!' : ''}
${user.role !== 'admin' ? '⚠️ Admin role required!' : ''}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Simple API Test</h2>

        <div className="space-y-4">
          <button
            onClick={checkAuth}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Check Authentication
          </button>

          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test authAPI'}
          </button>

          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAPITest;
