import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import SimpleAPITest from './SimpleAPITest';

const DatabaseTestPanel = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');

  const testCases = [
    {
      id: 'test-dokter',
      name: 'Test Tambah Dokter Psikolog',
      description: 'Menambah data dokter ke tabel dokterPsikologs',
      endpoint: '/tambahpilihdokterpsikolog',
      method: 'POST',
      data: {
        pilih_dokter_psikolog: 'Dr. Test Psikolog, M.Psi',
        layananId: 1,
        spesialisasi: 'Psikologi Klinis',
        pengalaman: '5 tahun',
        harga_konsultasi: 500000,
        jadwal_tersedia: 'Senin-Jumat 09:00-17:00',
        foto_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300'
      }
    },
    {
      id: 'test-layanan',
      name: 'Test Tambah Pilih Layanan',
      description: 'Menambah data layanan ke tabel pilihlayanans',
      endpoint: '/tambahpilihlayanan',
      method: 'POST',
      data: {
        nama_pilih_layanan: 'Test Konsultasi Online',
        layananId: 1,
        deskripsi: 'Konsultasi psikologi secara online via video call',
        harga_dasar: 300000
      }
    },
    {
      id: 'test-durasi',
      name: 'Test Tambah Durasi',
      description: 'Menambah data durasi ke tabel durasis',
      endpoint: '/tambahdurasi',
      method: 'POST',
      data: {
        durasi: 90,
        layananId: 1,
        dokterpsikologId: 1,
        harga: 750000
      }
    },
    {
      id: 'test-produk',
      name: 'Test Tambah Produk Bengkel',
      description: 'Menambah data produk ke tabel produks',
      endpoint: '/tambahproduk',
      method: 'POST',
      data: {
        nama_produk: 'Test Oli Mesin Synthetic',
        layananId: 2,
        pilihlayananId: 1,
        kategori: 'oli',
        harga: 150000,
        stok: 50
      }
    },
    {
      id: 'test-booking',
      name: 'Test Tambah Booking',
      description: 'Menambah data booking ke tabel Bookings',
      endpoint: '/tambahbooking',
      method: 'POST',
      data: {
        jam_booking: '10:00:00',
        tanggal_booking: '2024-01-20',
        userId: 1,
        layananId: 1,
        dokterpsikologId: 1,
        durasiId: 1,
        total_harga: 500000
      }
    }
  ];

  const runTest = async (testCase) => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      console.log(`Running test: ${testCase.name}`);
      console.log(`Endpoint: ${testCase.endpoint}`);
      console.log(`Data:`, testCase.data);
      
      const response = await authAPI.post(testCase.endpoint, testCase.data);
      const endTime = Date.now();
      
      const result = {
        id: testCase.id,
        name: testCase.name,
        status: 'SUCCESS',
        response: response.data,
        duration: endTime - startTime,
        timestamp: new Date().toLocaleString(),
        endpoint: testCase.endpoint,
        data: testCase.data
      };
      
      setTestResults(prev => [result, ...prev]);
      console.log(`Test ${testCase.name} SUCCESS:`, response.data);
      
    } catch (error) {
      const endTime = Date.now();
      
      const result = {
        id: testCase.id,
        name: testCase.name,
        status: 'ERROR',
        error: error.response?.data || error.message,
        duration: endTime - startTime,
        timestamp: new Date().toLocaleString(),
        endpoint: testCase.endpoint,
        data: testCase.data
      };
      
      setTestResults(prev => [result, ...prev]);
      console.error(`Test ${testCase.name} ERROR:`, error);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    for (const testCase of testCases) {
      await runTest(testCase);
      // Wait 1 second between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const fetchDatabaseData = async () => {
    setLoading(true);
    try {
      const [dokters, layanans, durasis, payments, bookings] = await Promise.all([
        authAPI.get('/simple/dokter'),
        authAPI.get('/simple/layanan'),
        authAPI.get('/simple/durasi'),
        authAPI.get('/simple/payment'),
        authAPI.get('/simple/booking')
      ]);

      const result = {
        id: 'fetch-data',
        name: 'Fetch Database Data',
        status: 'SUCCESS',
        response: {
          dokters: dokters.data?.length || 0,
          layanans: layanans.data?.length || 0,
          durasis: durasis.data?.length || 0,
          payments: payments.data?.length || 0,
          bookings: bookings.data?.length || 0,
          data: {
            dokters: dokters.data,
            layanans: layanans.data,
            durasis: durasis.data,
            payments: payments.data,
            bookings: bookings.data
          }
        },
        duration: 0,
        timestamp: new Date().toLocaleString()
      };

      setTestResults(prev => [result, ...prev]);
    } catch (error) {
      const result = {
        id: 'fetch-data',
        name: 'Fetch Database Data',
        status: 'ERROR',
        error: error.response?.data || error.message,
        timestamp: new Date().toLocaleString()
      };
      setTestResults(prev => [result, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simple API Test */}
      <SimpleAPITest />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Database Test Panel</h2>
        <p className="text-gray-600 mb-4">
          Test koneksi dan penyimpanan data ke database MySQL "pintukeluar"
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={fetchDatabaseData}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Fetch Database Data
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        {/* Individual Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testCases.map((testCase) => (
            <button
              key={testCase.id}
              onClick={() => runTest(testCase)}
              disabled={loading}
              className="text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="font-medium text-sm">{testCase.name}</div>
              <div className="text-xs text-gray-500 mt-1">{testCase.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={`${result.id}-${index}`}
            className={`bg-white shadow rounded-lg p-6 border-l-4 ${
              result.status === 'SUCCESS' ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{result.name}</h3>
                <p className="text-sm text-gray-500">{result.timestamp}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.status}
                </span>
                {result.duration && (
                  <span className="text-xs text-gray-500">{result.duration}ms</span>
                )}
              </div>
            </div>

            {result.endpoint && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">Endpoint: </span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{result.endpoint}</code>
              </div>
            )}

            {result.response && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">Response:</span>
                <pre className="mt-1 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result.response, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="mb-3">
                <span className="text-sm font-medium text-red-700">Error:</span>
                <pre className="mt-1 text-xs bg-red-50 p-3 rounded overflow-x-auto text-red-800">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}

            {result.data && (
              <details className="mt-3">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Request Data
                </summary>
                <pre className="mt-1 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No test results yet. Run some tests to see results here.</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseTestPanel;
