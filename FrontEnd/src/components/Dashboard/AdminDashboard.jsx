import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Layout/Navbar';
import { authAPI, layananAPI, bookingAPI, produkAPI } from '../../services/api';
import { mockAuthAPI, mockLayananAPI, mockBookingAPI, mockProdukAPI } from '../../services/mockAuth';
import EnhancedDashboard from '../Admin/EnhancedDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name}! Here's your system overview.
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
