import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const RevenueAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    topServices: [],
    dailyRevenue: [],
    monthlyRevenue: [],
    serviceBreakdown: []
  });

  // Mock data untuk demo
  const mockAnalyticsData = {
    totalRevenue: 15750000,
    revenueGrowth: 12.5,
    topServices: [
      { name: 'Konsultasi Psikologi', revenue: 6500000, percentage: 41.3, transactions: 13 },
      { name: 'Service Mobil', revenue: 4200000, percentage: 26.7, transactions: 8 },
      { name: 'Service Motor', revenue: 2800000, percentage: 17.8, transactions: 16 },
      { name: 'Cleaning Service', revenue: 1500000, percentage: 9.5, transactions: 12 },
      { name: 'Driver Service', revenue: 750000, percentage: 4.7, transactions: 5 }
    ],
    dailyRevenue: [
      { date: '2024-01-10', revenue: 1200000, transactions: 8 },
      { date: '2024-01-11', revenue: 1500000, transactions: 10 },
      { date: '2024-01-12', revenue: 980000, transactions: 6 },
      { date: '2024-01-13', revenue: 1800000, transactions: 12 },
      { date: '2024-01-14', revenue: 2100000, transactions: 14 },
      { date: '2024-01-15', revenue: 1650000, transactions: 11 },
      { date: '2024-01-16', revenue: 1920000, transactions: 13 }
    ],
    monthlyRevenue: [
      { month: 'Oct 2023', revenue: 12500000, transactions: 85 },
      { month: 'Nov 2023', revenue: 13200000, transactions: 92 },
      { month: 'Dec 2023', revenue: 14100000, transactions: 98 },
      { month: 'Jan 2024', revenue: 15750000, transactions: 106 }
    ],
    serviceBreakdown: [
      { service: 'Psikologi', revenue: 6500000, color: 'bg-purple-500' },
      { service: 'Bengkel', revenue: 7000000, color: 'bg-orange-500' },
      { service: 'Opo Wae', revenue: 2250000, color: 'bg-teal-500' }
    ]
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data since new transaction system is being implemented
      console.log('Using mock data for revenue analytics');
      setAnalyticsData(mockAnalyticsData);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Gagal memuat data analytics. Menggunakan data demo.');

      // Fallback to mock data
      setAnalyticsData(mockAnalyticsData);
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
    return new Date(dateString).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMaxRevenue = () => {
    return Math.max(...analyticsData.dailyRevenue.map(d => d.revenue));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
            <p className="text-gray-600 mt-1">Analisis pendapatan dan performa bisnis</p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
              <option value="quarter">3 Bulan Terakhir</option>
              <option value="year">12 Bulan Terakhir</option>
            </select>
            <button
              onClick={() => navigate('/admin/transactions/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <p className={`text-sm ${analyticsData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.revenueGrowth >= 0 ? '+' : ''}{analyticsData.revenueGrowth}% dari periode sebelumnya
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata per Hari</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.totalRevenue / (analyticsData.dailyRevenue.length || 1))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Layanan Terpopuler</p>
                <p className="text-lg font-bold text-gray-900">
                  {analyticsData.topServices[0]?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {analyticsData.topServices[0]?.percentage || 0}% dari total revenue
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Harian</h2>
            <div className="space-y-3">
              {analyticsData.dailyRevenue.map((day, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{formatDate(day.date)}</div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(day.revenue / getMaxRevenue()) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-32 text-sm text-gray-900 text-right">
                    {formatCurrency(day.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Layanan</h2>
            <div className="space-y-4">
              {analyticsData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{service.name}</span>
                      <span className="text-sm text-gray-600">{service.percentage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{service.transactions} transaksi</span>
                      <span className="text-xs font-medium text-gray-700">{formatCurrency(service.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Breakdown per Kategori Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.serviceBreakdown.map((category, index) => (
              <div key={index} className="text-center">
                <div className={`w-24 h-24 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {((category.revenue / analyticsData.totalRevenue) * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{category.service}</h3>
                <p className="text-sm text-gray-600">{formatCurrency(category.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trend Bulanan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Bulan</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Transaksi</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.monthlyRevenue.map((month, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{month.month}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(month.revenue)}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{month.transactions}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(month.revenue / month.transactions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RevenueAnalytics;
