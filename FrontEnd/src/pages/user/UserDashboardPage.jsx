import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import UserProfile from '../../components/User/UserProfile';
import BookingHistory from '../../components/User/BookingHistory';
import { bookingService } from '../../services/bookingService';

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.id) {
      fetchBookingStats();
    }
  }, [user.id]);

  const fetchBookingStats = async () => {
    try {
      setLoading(true);
      const bookings = await bookingService.getUserBookings();

      const stats = {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'completed').length,
        pending: bookings.filter(b => b.status === 'pending').length
      };

      setBookingStats(stats);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'bookings', name: 'Riwayat Booking', icon: '📅' },
    { id: 'services', name: 'Layanan', icon: '🏥' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'bookings':
        return <BookingHistory />;
      case 'services':
        return <ServicesOverview />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Selamat datang, {user?.name}!</h1>
              <p className="text-blue-100">Kelola akun dan booking Anda di sini</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Booking</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : bookingStats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Booking Selesai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : bookingStats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Booking Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : bookingStats.pending}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Services Overview Component
const ServicesOverview = () => {
  const navigate = useNavigate();
  const services = [
    {
      id: 1,
      name: 'Psikologi',
      description: 'Konsultasi dengan dokter psikologi berpengalaman',
      icon: '🧠',
      color: 'bg-blue-500',
      link: '/psikologi'
    },
    {
      id: 2,
      name: 'Bengkel',
      description: 'Cari bengkel terdekat untuk kendaraan Anda',
      icon: '🔧',
      color: 'bg-green-500',
      link: '/bengkel'
    },
    {
      id: 3,
      name: 'Opo Wae',
      description: 'Layanan kebutuhan sehari-hari',
      icon: '🏠',
      color: 'bg-purple-500',
      link: '/opo-wae'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Layanan Tersedia</h3>
        <p className="text-gray-600">Pilih layanan yang Anda butuhkan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-2xl">{service.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            
            <button
              onClick={() => navigate(service.link)}
              className={`w-full ${service.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              Lihat Layanan
            </button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips Penggunaan</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Pastikan data profile Anda lengkap sebelum booking</li>
          <li>• Periksa jadwal ketersediaan provider sebelum memilih waktu</li>
          <li>• Simpan nomor kontak provider untuk komunikasi langsung</li>
          <li>• Lakukan pembayaran sesuai instruksi untuk konfirmasi booking</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboardPage;
