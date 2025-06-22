import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import BackButton from '../../components/UI/BackButton';
import { bookingService } from '../../services/bookingService';

const TransactionPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Menggunakan endpoint yang sama dengan UserBookingList
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching user bookings...');
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await fetch('http://localhost:3001/payment/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        // Sort berdasarkan tanggal terbaru
        const sortedBookings = (result.data || []).sort((a, b) =>
          new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
        );
        console.log('✅ Bookings loaded:', sortedBookings.length);
        console.log('Bookings data:', sortedBookings);
        setBookings(sortedBookings);
      } else {
        console.log('❌ API returned error:', result.message);
        setError('Gagal memuat riwayat transaksi');
        setBookings([]);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setError('Gagal memuat riwayat transaksi');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi hapus semua transaksi user
  const handleDeleteAllUserTransactions = async () => {
    const confirmDelete = window.confirm(
      '⚠️ PERINGATAN!\n\nApakah Anda yakin ingin menghapus SEMUA transaksi Anda?\n\n' +
      '• Semua riwayat booking Anda akan hilang permanen\n' +
      '• Tindakan ini tidak dapat dibatalkan\n\n' +
      'Ketik "HAPUS SEMUA" untuk konfirmasi:'
    );

    if (!confirmDelete) return;

    const confirmation = prompt('Ketik "HAPUS SEMUA" untuk konfirmasi:');
    if (confirmation !== 'HAPUS SEMUA') {
      alert('Konfirmasi tidak sesuai. Penghapusan dibatalkan.');
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3001/payment/delete-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Berhasil menghapus semua transaksi Anda!\n\nTotal dihapus: ${result.deletedCount} transaksi`);
        fetchBookings(); // Refresh data
      } else {
        alert('❌ Gagal menghapus transaksi: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting user transactions:', error);
      alert('❌ Gagal menghapus semua transaksi');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: 'Menunggu Persetujuan', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { text: 'Disetujui', color: 'bg-green-100 text-green-800' },
      'paid': { text: 'Disetujui', color: 'bg-green-100 text-green-800' },
      'unpaid': { text: 'Belum Bayar', color: 'bg-red-100 text-red-800' },
      'rejected': { text: 'Ditolak', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <BackButton
                to="/user/dashboard"
                label="Kembali ke Dashboard"
                variant="secondary"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings & Payments</h1>
                <p className="text-gray-600 mt-2">Riwayat booking dan status pembayaran Anda</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchBookings}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Loading...' : '🔄 Refresh'}
                </button>
                <button
                  onClick={handleDeleteAllUserTransactions}
                  disabled={deleting || loading || bookings.length === 0}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {deleting ? 'Menghapus...' : '🗑️ Hapus Semua'}
                </button>
              </div>
            </div>
          </div>



          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada booking</h3>
                <p className="text-gray-500">Booking Anda akan muncul di sini setelah melakukan pemesanan.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.nama_layanan}
                        </h3>
                        {getStatusBadge(booking.status || booking.payment_status)}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(booking.total_harga)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.tanggal_booking)}
                        </p>
                      </div>
                    </div>

                    {/* Detail Pesanan */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">ID Pesanan:</span>
                            <span className="font-mono font-medium">#{booking.id}</span>
                          </div>

                          {/* Tampilkan info dokter hanya untuk layanan Psikologi */}
                          {booking.nama_layanan === 'Psikologi' && booking.pilih_dokter_psikolog && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dokter:</span>
                              <span className="font-medium">{booking.pilih_dokter_psikolog}</span>
                            </div>
                          )}
                          {booking.nama_layanan === 'Psikologi' && booking.spesialisasi && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Spesialisasi:</span>
                              <span className="font-medium">{booking.spesialisasi}</span>
                            </div>
                          )}

                          {/* Tampilkan jenis layanan untuk Opo Wae */}
                          {booking.nama_layanan === 'Opo Wae' && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jenis Layanan:</span>
                              <span className="font-medium">{booking.opo_wae_service || booking.notes?.replace('Booking layanan: ', '') || 'Layanan Umum'}</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-gray-600">Tanggal Layanan:</span>
                            <span className="font-medium">{formatDate(booking.tanggal_booking)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jam:</span>
                            <span className="font-medium">{booking.jam_booking}</span>
                          </div>

                          {/* Tampilkan durasi hanya untuk layanan yang relevan */}
                          {booking.nama_layanan === 'Psikologi' && booking.durasi_menit && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Durasi:</span>
                              <span className="font-medium">{booking.durasi_menit} menit</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Harga:</span>
                            <span className="text-blue-600 font-bold text-lg">
                              {formatCurrency(booking.total_harga)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tanggal Pesan:</span>
                            <span className="font-medium">{formatDate(booking.created_at || booking.createdAt)}</span>
                          </div>
                          {booking.notes && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catatan Anda:</span>
                              <span className="font-medium text-blue-600">{booking.notes}</span>
                            </div>
                          )}
                          {booking.admin_notes && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catatan Admin:</span>
                              <span className="font-medium text-green-600">{booking.admin_notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionPage;
