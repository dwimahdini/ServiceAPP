import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import DatabaseManagement from '../../components/Admin/DatabaseManagement';

const DatabaseManagementPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
            <p className="text-gray-600 mt-1">Monitor dan kelola database MySQL sistem</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {/* Database Management Component */}
        <DatabaseManagement />
      </div>
    </MainLayout>
  );
};

export default DatabaseManagementPage;
