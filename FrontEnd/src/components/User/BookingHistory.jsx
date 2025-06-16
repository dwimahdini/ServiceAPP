import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ambil semua booking dan filter berdasarkan user
      const response = await authAPI.get('/simple/booking');
      const allBookings = response.data || [];
      
      // Filter booking milik user ini
      const userBookings = allBookings.filter(booking => booking.userId === user.id);
      
      // Sort berdasarkan tanggal terbaru
      userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Gagal memuat riwayat booking');
      
      // Mock data untuk demo
      setBookings([
        {
          id: 1,
          layananId: 1,
          dokterpsikologId: 1,
          tanggal_booking: '2025-06-20',
          jam_booking: '10:00:00',
          status: 'confirmed',
          total_harga: 500000,
          payment_status: 'paid',
          notes: 'Konsultasi stress kerja',
          createdAt: '2025-06-16T10:00:00Z',
          layanan: { nama_layanan: 'Psikologi' },
          dokter: { pilih_dokter_psikolog: 'Dr. Sarah Wijaya, M.Psi' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Yakin ingin membatalkan booking ini?')) {
      return;
    }

    try {
      // Update status booking menjadi cancelled
      await authAPI.put(`/simple/booking/${bookingId}`, {
        status: 'cancelled'
      });
      
      // Refresh data
      await fetchBookings();
      alert('Booking berhasil dibatalkan');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Gagal membatalkan booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Please login to view booking history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Booking</h2>
        <button
          onClick={fetchBookings}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'pending', label: 'Pending' },
          { key: 'confirmed', label: 'Dikonfirmasi' },
          { key: 'completed', label: 'Selesai' },
          { key: 'cancelled', label: 'Dibatalkan' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === filterOption.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Booking #{booking.id}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Layanan:</span> {booking.layanan?.nama_layanan || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Provider:</span> {booking.dokter?.pilih_dokter_psikolog || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Tanggal:</span> {new Date(booking.tanggal_booking).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Jam:</span> {booking.jam_booking}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Total:</span> 
                        <span className="text-green-600 font-semibold ml-1">
                          Rp{booking.total_harga?.toLocaleString('id-ID')}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Dibuat:</span> {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                      </p>
                      {booking.notes && (
                        <p className="text-gray-600">
                          <span className="font-medium">Catatan:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Batalkan
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && booking.payment_status === 'unpaid' && (
                    <button
                      onClick={() => alert('Fitur pembayaran akan segera tersedia')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Bayar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Belum ada booking' : `Tidak ada booking ${filter}`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Anda belum pernah melakukan booking layanan'
              : `Tidak ada booking dengan status ${filter}`
            }
          </p>
          <button
            onClick={() => window.location.href = '/psikologi'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Booking Sekarang
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
