import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { testApiConnection, testAdminLogin, testDatabaseEndpoints } from '../../utils/apiTest';

const SystemAdministration = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemInfo, setSystemInfo] = useState({
    apiStatus: 'unknown',
    databaseStatus: 'unknown',
    totalUsers: 0,
    totalAdmins: 0,
    lastBackup: 'Never',
    systemUptime: '0 days'
  });
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: '🖥️' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' }
  ];

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      // Test API connection
      const apiTest = await testApiConnection();
      
      // Get user statistics
      const usersResponse = await authAPI.get('/users').catch(() => ({ data: [] }));
      const users = usersResponse.data || [];
      
      setSystemInfo({
        apiStatus: apiTest.success ? 'online' : 'offline',
        databaseStatus: users.length > 0 ? 'connected' : 'disconnected',
        totalUsers: users.filter(u => u.role === 'user').length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        lastBackup: 'Manual backup required',
        systemUptime: '1 day' // Mock data
      });
    } catch (error) {
      console.error('Error fetching system info:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSystemTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test API connection
      const apiResult = await testApiConnection();
      setTestResults(prev => [...prev, {
        id: 'api-connection',
        name: 'API Connection',
        status: apiResult.success ? 'success' : 'error',
        message: apiResult.message,
        timestamp: new Date().toLocaleTimeString()
      }]);

      // Test database endpoints
      const dbResults = await testDatabaseEndpoints();
      dbResults.forEach(result => {
        setTestResults(prev => [...prev, {
          id: `db-${result.name.toLowerCase()}`,
          name: `Database - ${result.name}`,
          status: result.success ? 'success' : 'error',
          message: result.message,
          details: result.success ? `${result.count} records` : result.error,
          timestamp: new Date().toLocaleTimeString()
        }]);
      });

    } catch (error) {
      setTestResults(prev => [...prev, {
        id: 'system-error',
        name: 'System Test',
        status: 'error',
        message: 'System test failed',
        details: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${systemInfo.apiStatus === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`text-2xl ${systemInfo.apiStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                {systemInfo.apiStatus === 'online' ? '🟢' : '🔴'}
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Status</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{systemInfo.apiStatus}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${systemInfo.databaseStatus === 'connected' ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-2xl">🗄️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Database</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{systemInfo.databaseStatus}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-lg font-bold text-gray-900">{systemInfo.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-lg font-bold text-gray-900">{systemInfo.totalAdmins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Tests */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Health Check</h3>
          <button
            onClick={runSystemTests}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded-lg border ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      result.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.status === 'success' ? '✅' : '❌'} {result.name}
                    </span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                </div>
                <p className={`text-sm mt-1 ${
                  result.status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                  {result.details && ` - ${result.details}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800">👥 User Statistics</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-blue-700">Total Users: </span>
              <span className="font-semibold text-blue-900">{systemInfo.totalUsers}</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Total Admins: </span>
              <span className="font-semibold text-blue-900">{systemInfo.totalAdmins}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            View All Users
          </button>
          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Admin
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800">🔒 Security Recommendations</h4>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            <li>• Gunakan password yang kuat untuk admin</li>
            <li>• Aktifkan 2FA jika tersedia</li>
            <li>• Monitor login attempts secara berkala</li>
            <li>• Update sistem secara rutin</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => alert('Password change feature coming soon!')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Change Admin Password
          </button>
          <button
            onClick={() => alert('Security audit feature coming soon!')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Security Audit
          </button>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800">🔧 Maintenance Tasks</h4>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Backup:</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.lastBackup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">System Uptime:</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.systemUptime}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('http://localhost/phpmyadmin', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Database Backup
          </button>
          <button
            onClick={fetchSystemInfo}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Refresh System Info
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Administration</h2>
          <p className="text-gray-600">Monitor dan kelola sistem secara keseluruhan</p>
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
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'maintenance' && renderMaintenance()}
      </div>
    </div>
  );
};

export default SystemAdministration;
