import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import BackButton from '../../components/UI/BackButton';
import BookingConfirmation from '../../components/OpoWae/BookingConfirmation';
import { opoWaeService } from '../../services/opoWaeService';
import { bookingService } from '../../services/bookingService';

const OpoWaePage = () => {
  const navigate = useNavigate();
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const layananData = await opoWaeService.getAllLayanan();
      setLayananList(layananData);
    } catch (error) {
      console.error('Error fetching opo wae data:', error);
      setError('Gagal memuat data layanan. Silakan coba lagi.');
      setLayananList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookProvider = (layanan) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.id) {
      alert('Silakan login terlebih dahulu untuk melakukan booking.');
      return;
    }

    setSelectedLayanan(layanan);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      const response = await bookingService.createValidatedBooking(bookingData);

      if (response.success) {
        // Sistem sederhana seperti psikologi - langsung berhasil tanpa redirect ke payment
        alert(`Booking ${selectedLayanan.nama_pilihan} berhasil! 🎉\n\n` +
              `ID Booking: ${response.data.bookingId}\n` +
              `Layanan: ${selectedLayanan.nama_pilihan}\n` +
              `Total Pembayaran: Rp ${response.data.totalAmount.toLocaleString('id-ID')}\n\n` +
              `Silakan lakukan pembayaran dan admin akan mengkonfirmasi.`);

        setShowConfirmation(false);
        setSelectedLayanan(null);

        // Tidak redirect ke payment page, langsung selesai seperti psikologi
      } else {
        alert(response.msg || 'Gagal membuat booking. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    setSelectedLayanan(null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <BackButton
                to="/user/dashboard"
                label="Kembali ke Dashboard"
                variant="white"
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Opo Wae - Layanan Harian
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                Solusi untuk semua kebutuhan harian Anda. Temukan penyedia layanan terpercaya dengan mudah
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Layanan Tersedia
            </h2>
            <p className="text-lg text-gray-600">
              Temukan berbagai layanan harian yang Anda butuhkan
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : layananList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layananList.map((layanan) => (
                <div key={layanan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {layanan.nama_pilihan || layanan.nama}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {layanan.kategori || 'Layanan Umum'}
                      </p>
                    </div>
                  </div>

                  {layanan.deskripsi && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {layanan.deskripsi}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-indigo-600">
                      Rp {layanan.harga ? parseFloat(layanan.harga).toLocaleString('id-ID') : '0'}
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Tersedia
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookProvider(layanan)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Book Sekarang
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Belum Ada Layanan
              </h3>
              <p className="text-gray-600">
                Layanan akan segera tersedia. Silakan cek kembali nanti.
              </p>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cara Kerja Opo Wae
              </h2>
              <p className="text-lg text-gray-600">
                Mudah dan cepat dalam 2 langkah sederhana
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pilih Layanan
                </h3>
                <p className="text-gray-600">
                  Pilih layanan yang Anda butuhkan dari daftar layanan yang tersedia
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Book & Nikmati
                </h3>
                <p className="text-gray-600">
                  Klik "Book Sekarang" dan nikmati layanan berkualitas dari penyedia terpercaya
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedLayanan && (
        <BookingConfirmation
          layanan={selectedLayanan}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
          loading={bookingLoading}
        />
      )}
    </MainLayout>
  );
};

export default OpoWaePage;
