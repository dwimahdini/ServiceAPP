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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600 mt-1">Monitor dan kelola database MySQL sistem</p>
        </div>

        {/* Database Management Component */}
        <DatabaseManagement />
      </div>
    </MainLayout>
  );
};

export default DatabaseManagementPage;
