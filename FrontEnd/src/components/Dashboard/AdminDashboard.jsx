import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Layout/Navbar';
import EnhancedDashboard from '../Admin/EnhancedDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dasbor Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Selamat datang kembali, {user?.name}! Berikut ringkasan sistem Anda.
            </p>
          </div>

          {/* Enhanced Dashboard */}
          <EnhancedDashboard />

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
