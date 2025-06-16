import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const DatabaseManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dbStats, setDbStats] = useState({
    users: 0,
    layanans: 0,
    dokterpsikologs: 0,
    durasis: 0,
    bookings: 0,
    payments: 0,
    schedulevalidations: 0
  });
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'tables', name: 'Tables', icon: '🗃️' },
    { id: 'test', name: 'API Test', icon: '🧪' },
    { id: 'backup', name: 'Backup', icon: '💾' }
  ];

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    setLoading(true);
    try {
      const endpoints = [
        { key: 'users', endpoint: '/users' },
        { key: 'layanans', endpoint: '/getlayanan' },
        { key: 'dokterpsikologs', endpoint: '/getpilihdokterpsikolog' },
        { key: 'durasis', endpoint: '/getdurasi' },
        { key: 'bookings', endpoint: '/getbooking' },
        { key: 'payments', endpoint: '/getpayment' },
        { key: 'schedulevalidations', endpoint: '/getschedule' }
      ];

      const results = {};
      
      for (const { key, endpoint } of endpoints) {
        try {
          const response = await authAPI.get(endpoint);
          results[key] = response.data?.length || 0;
        } catch (error) {
          console.warn(`Failed to fetch ${key}:`, error.message);
          results[key] = 0;
        }
      }

      setDbStats(results);
    } catch (error) {
      console.error('Error fetching database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    const startTime = Date.now();
    try {
      let response;
      switch (method) {
        case 'POST':
          response = await authAPI.post(endpoint, data);
          break;
        case 'PUT':
          response = await authAPI.put(endpoint, data);
          break;
        case 'DELETE':
          response = await authAPI.delete(endpoint);
          break;
        default:
          response = await authAPI.get(endpoint);
      }

      const duration = Date.now() - startTime;
      const result = {
        id: Date.now(),
        endpoint,
        method,
        status: 'SUCCESS',
        statusCode: response.status || 200,
        duration: `${duration}ms`,
        dataCount: response.data?.length || (response.data ? 1 : 0),
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const duration = Date.now() - startTime;
      const result = {
        id: Date.now(),
        endpoint,
        method,
        status: 'ERROR',
        statusCode: error.response?.status || 500,
        error: error.response?.data?.message || error.message,
        duration: `${duration}ms`,
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dbStats).map(([table, count]) => (
            <div key={table} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 capitalize">
                {table.replace(/s$/, '')}
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </div>
          ))}
        </div>
        <button
          onClick={fetchDatabaseStats}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Stats'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Health</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Connection Status</span>
            <span className="text-green-600 font-medium">✅ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Records</span>
            <span className="font-medium">{Object.values(dbStats).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Database Name</span>
            <span className="font-medium">pintukeluar</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Tables</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(dbStats).map(([table, count]) => (
              <tr key={table}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {table}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    count > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {count > 0 ? 'Active' : 'Empty'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => testEndpoint(`/get${table.replace(/s$/, '')}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Test Query
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApiTest = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoint Testing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => testEndpoint('/getlayanan')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Test Layanan API
          </button>
          <button
            onClick={() => testEndpoint('/getpilihdokterpsikolog')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Test Dokter API
          </button>
          <button
            onClick={() => testEndpoint('/getbooking')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Test Booking API
          </button>
          <button
            onClick={() => testEndpoint('/users')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Test Users API
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Test Results</h4>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a button above to test an endpoint.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border ${
                    result.status === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        result.status === 'SUCCESS' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.method} {result.endpoint}
                      </span>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{result.duration}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.statusCode}
                      </span>
                    </div>
                  </div>
                  {result.status === 'SUCCESS' && (
                    <p className="text-sm text-green-700 mt-1">
                      ✅ Success - {result.dataCount} records returned
                    </p>
                  )}
                  {result.status === 'ERROR' && (
                    <p className="text-sm text-red-700 mt-1">
                      ❌ Error: {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Backup & Maintenance</h3>
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800">⚠️ Backup Recommendations</h4>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            <li>• Backup database sebelum melakukan perubahan besar</li>
            <li>• Gunakan phpMyAdmin untuk export database</li>
            <li>• Simpan backup di lokasi yang aman</li>
            <li>• Test restore process secara berkala</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('http://localhost/phpmyadmin', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Open phpMyAdmin
          </button>
          <button
            onClick={fetchDatabaseStats}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Refresh Database Stats
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
          <p className="text-gray-600">Kelola dan monitor database MySQL</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tables' && renderTables()}
        {activeTab === 'test' && renderApiTest()}
        {activeTab === 'backup' && renderBackup()}
      </div>
    </div>
  );
};

export default DatabaseManagement;
