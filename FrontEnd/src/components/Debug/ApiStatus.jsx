import React, { useState, useEffect } from 'react';
import { psikologiService } from '../../services/psikologiService';

const ApiStatus = () => {
  const [status, setStatus] = useState({
    dokter: { loading: false, success: false, error: null, data: null },
    durasi: { loading: false, success: false, error: null, data: null },
    layanan: { loading: false, success: false, error: null, data: null }
  });

  const testEndpoint = async (endpointName, serviceMethod) => {
    setStatus(prev => ({
      ...prev,
      [endpointName]: { loading: true, success: false, error: null, data: null }
    }));

    try {
      const data = await serviceMethod();
      setStatus(prev => ({
        ...prev,
        [endpointName]: { loading: false, success: true, error: null, data }
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        [endpointName]: { loading: false, success: false, error: error.message, data: null }
      }));
    }
  };

  const testAllEndpoints = () => {
    testEndpoint('dokter', psikologiService.getDokterPsikolog);
    testEndpoint('durasi', psikologiService.getDurasi);
    testEndpoint('layanan', psikologiService.getLayanan);
  };

  const StatusIndicator = ({ status }) => {
    if (status.loading) {
      return <span className="text-yellow-600">⏳ Loading...</span>;
    }
    if (status.success) {
      return <span className="text-green-600">✅ Success ({status.data?.length || 0} items)</span>;
    }
    if (status.error) {
      return <span className="text-red-600">❌ Error: {status.error}</span>;
    }
    return <span className="text-gray-600">⚪ Not tested</span>;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">API Status</h3>
        <button
          onClick={testAllEndpoints}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Test All
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Dokter:</strong> <StatusIndicator status={status.dokter} />
        </div>
        <div>
          <strong>Durasi:</strong> <StatusIndicator status={status.durasi} />
        </div>
        <div>
          <strong>Layanan:</strong> <StatusIndicator status={status.layanan} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div><strong>Base URL:</strong> http://localhost:3000/api</div>
          <div><strong>Mode:</strong> {process.env.NODE_ENV}</div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;
