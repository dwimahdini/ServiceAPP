import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const EnhancedDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
      activeServices: 0
    },
    recentBookings: [],
    serviceStats: [],
    revenueChart: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [users, bookings, payments, layanan, dokters] = await Promise.all([
        authAPI.get('/users').catch(() => ({ data: [] })),
        authAPI.get('/simple/booking').catch(() => ({ data: [] })),
        authAPI.get('/simple/payment').catch(() => ({ data: [] })),
        authAPI.get('/simple/layanan').catch(() => ({ data: [] })),
        authAPI.get('/simple/dokter').catch(() => ({ data: [] }))
      ]);

      // Calculate stats
      const totalRevenue = payments.data?.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount || 0);
      }, 0) || 0;

      // Group bookings by service
      const serviceStats = layanan.data?.map(service => {
        const serviceBookings = bookings.data?.filter(booking => 
          booking.layananId === service.id
        ) || [];
        
        const serviceProviders = dokters.data?.filter(dokter => 
          dokter.layananId === service.id
        ) || [];

        return {
          id: service.id,
          name: service.nama_layanan,
          bookings: serviceBookings.length,
          providers: serviceProviders.length,
          revenue: serviceBookings.reduce((sum, booking) => 
            sum + parseFloat(booking.total_harga || 0), 0
          )
        };
      }) || [];

      // Recent bookings (last 5)
      const recentBookings = bookings.data?.slice(-5).reverse() || [];

      setDashboardData({
        stats: {
          totalUsers: users.data?.length || 0,
          totalBookings: bookings.data?.length || 0,
          totalRevenue: totalRevenue,
          activeServices: layanan.data?.length || 0
        },
        recentBookings,
        serviceStats,
        revenueChart: payments.data?.slice(-7) || []
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jumlah Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Layanan Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeServices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Statistics - Full Width */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kinerja Layanan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.serviceStats.map((service) => (
            <div key={service.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{service.name}</span>
                <span className="text-sm text-gray-600">{service.bookings} pesanan</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((service.bookings / Math.max(...dashboardData.serviceStats.map(s => s.bookings), 1)) * 100, 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{service.providers} penyedia</span>
                <span className="text-xs font-medium text-gray-700">{formatCurrency(service.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/admin/services'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kelola Layanan
          </button>
          <button
            onClick={() => window.location.href = '/admin/payments'}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
