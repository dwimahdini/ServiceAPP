import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import BackButton from '../../components/UI/BackButton';
import { psikologiService } from '../../services/psikologiService';
import { bookingService } from '../../services/bookingService';

const PsikologiPage = () => {
  const navigate = useNavigate();
  const [dokterList, setDokterList] = useState([]);
  const [durasiList, setDurasiList] = useState([]);
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    pilih_hari: '',
    pilih_jam: '',
    durasi_konsultasi: '',
    pilih_dokter_psikolog: ''
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dokter, durasi, dan layanan secara parallel
      const [dokterData, durasiData, layananData] = await Promise.all([
        psikologiService.getDokterPsikolog(),
        psikologiService.getDurasi(),
        psikologiService.getLayanan()
      ]);

      setDokterList(dokterData);
      setDurasiList(durasiData);
      setLayananList(layananData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');

      // Set empty arrays on error - NO MOCK DATA!
      setDokterList([]);
      setDurasiList([]);
      setLayananList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get available days for selected doctor
  const getAvailableDays = () => {
    if (!bookingForm.pilih_dokter_psikolog) return [];

    const selectedDokter = dokterList.find(dokter =>
      dokter.id.toString() === bookingForm.pilih_dokter_psikolog
    );

    if (!selectedDokter || !selectedDokter.jadwal_tersedia) return [];

    // Safe parsing jadwal_tersedia
    try {
      if (typeof selectedDokter.jadwal_tersedia === 'string') {
        return JSON.parse(selectedDokter.jadwal_tersedia);
      } else if (Array.isArray(selectedDokter.jadwal_tersedia)) {
        return selectedDokter.jadwal_tersedia;
      }
    } catch (error) {
      console.warn('Error parsing jadwal_tersedia in getAvailableDays:', error);
    }

    return [];
  };

  // Get doctors with combined name and specialization
  const getDokterWithSpecialization = () => {
    return dokterList.map(dokter => ({
      ...dokter,
      displayName: `${dokter.pilih_dokter_psikolog || dokter.nama_dokter} - ${dokter.spesialisasi || 'Spesialisasi Umum'}`
    }));
  };

  // Calculate booking details and total payment
  const calculateBookingDetails = () => {
    if (!bookingForm.pilih_dokter_psikolog || !bookingForm.durasi_konsultasi) {
      return null;
    }

    const selectedDokter = dokterList.find(dokter =>
      dokter.id.toString() === bookingForm.pilih_dokter_psikolog
    );

    if (!selectedDokter) return null;

    const durasi = parseInt(bookingForm.durasi_konsultasi);
    const tarifPerJam = parseFloat(selectedDokter.tarif_per_jam) || 0;
    const subtotal = tarifPerJam * durasi;
    const adminFee = 10000; // Biaya admin tetap
    const total = subtotal + adminFee;

    return {
      dokter: selectedDokter,
      durasi: durasi,
      tarifPerJam: tarifPerJam,
      subtotal: subtotal,
      adminFee: adminFee,
      total: total
    };
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Silakan login terlebih dahulu untuk melakukan booking.');
      return;
    }

    // Calculate booking details
    const details = calculateBookingDetails();
    if (!details) {
      alert('Mohon lengkapi semua data booking.');
      return;
    }

    // Set booking details and show modal
    setBookingDetails(details);
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Get selected doctor data for tarif
      const selectedDokter = dokterList.find(dokter =>
        dokter.id.toString() === bookingForm.pilih_dokter_psikolog
      );

      if (!selectedDokter) {
        throw new Error('Dokter tidak ditemukan');
      }

      // Add tarif to form data
      const formDataWithTarif = {
        ...bookingForm,
        tarif_per_jam: selectedDokter.tarif_per_jam || selectedDokter.harga_konsultasi || 0
      };

      // Format booking data menggunakan booking service
      const bookingData = bookingService.formatPsikologiBooking(formDataWithTarif);

      console.log('Sending booking data:', bookingData);

      const bookingResult = await bookingService.createValidatedBooking(bookingData);

      console.log('Booking result:', bookingResult);

      // Sistem sederhana - booking sudah include transaksi
      if (bookingResult.success && bookingResult.data) {
        const { bookingId, totalAmount, customerName, serviceDetails } = bookingResult.data;

        alert(`Booking berhasil dibuat! 🎉\n\n` +
              `ID Booking: ${bookingId}\n` +
              `Nama: ${customerName}\n` +
              `Layanan: ${serviceDetails}\n` +
              `Total Pembayaran: Rp ${totalAmount.toLocaleString('id-ID')}\n\n` +
              `Silakan lakukan pembayaran dan upload bukti transfer.`);
      } else {
        alert('Booking berhasil! Kami akan menghubungi Anda segera.');
      }

      // Reset form and close modal
      setBookingForm({
        pilih_hari: '',
        pilih_jam: '',
        durasi_konsultasi: '',
        pilih_dokter_psikolog: ''
      });
      setShowConfirmModal(false);
      setBookingDetails(null);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error.message || 'Gagal membuat booking. Silakan coba lagi.');
      alert(error.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDokterClick = (dokterId) => {
    navigate(`/psikologi/dokter/${dokterId}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gray-900">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
            }}
          ></div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              {/* Back Button */}
              <div className="mb-6">
                <BackButton
                  to="/user/dashboard"
                  label="Kembali ke Dashboard"
                  variant="white"
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Konsultasi Psikologi
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                Kami menyediakan layanan konsultasi psikologi profesional dengan psikolog berpengalaman.
                Dapatkan bantuan untuk kesehatan mental dan kesejahteraan hidup Anda dengan layanan terpercaya
                yang telah membantu ribuan klien mencapai kehidupan yang lebih baik.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-center mb-6">Booking Konsultasi Psikologi</h2>
            <p className="text-gray-600 text-center mb-8">
              Booking dan temukan layanan yang terbaik untuk konsultasi psikologi bersama kami!
            </p>

            <form onSubmit={handleBookingSubmit} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <select
                    name="pilih_dokter_psikolog"
                    value={bookingForm.pilih_dokter_psikolog}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Dokter & Spesialisasi</option>
                    {getDokterWithSpecialization().map((dokter) => (
                      <option key={dokter.id} value={dokter.id}>
                        {dokter.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <select
                    name="durasi_konsultasi"
                    value={bookingForm.durasi_konsultasi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Durasi Konsultasi</option>
                    <option value="1">1 Jam</option>
                    <option value="3">3 Jam</option>
                    <option value="5">5 Jam (Maksimal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <select
                    name="pilih_hari"
                    value={bookingForm.pilih_hari}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Hari Konsultasi</option>
                    {getAvailableDays().map((hari) => (
                      <option key={hari} value={hari}>
                        {hari}
                      </option>
                    ))}
                  </select>
                  {bookingForm.pilih_dokter_psikolog && getAvailableDays().length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Dokter belum mengatur jadwal tersedia
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="time"
                    name="pilih_jam"
                    value={bookingForm.pilih_jam}
                    onChange={handleInputChange}
                    placeholder="Pilih Jam Konsultasi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-12 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Lihat Rincian & Booking
                </button>
              </div>
            </form>
          </div>

          {/* Dokter Psikologi Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Dokter Psikologi</h2>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : dokterList.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada dokter psikologi</h3>
                <p className="text-gray-500">Dokter psikologi akan segera tersedia untuk konsultasi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dokterList.map((dokter) => {
                  // Safe render dengan null checks
                  if (!dokter || !dokter.id) return null;

                  return (
                    <div key={dokter.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="aspect-square bg-gray-200 flex items-center justify-center">
                        {(dokter.foto || dokter.foto_url) ? (
                          <img
                            src={dokter.foto || dokter.foto_url}
                            alt={dokter.pilih_dokter_psikolog || 'Dokter'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center" style={{display: (dokter.foto || dokter.foto_url) ? 'none' : 'flex'}}>
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {dokter.pilih_dokter_psikolog || dokter.nama_dokter || 'Nama tidak tersedia'}
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">{dokter.spesialisasi || 'Spesialisasi tidak tersedia'}</p>
                        <p className="text-gray-600 text-sm mb-3">
                          Pengalaman: {dokter.pengalaman || dokter.deskripsi || 'Berpengalaman'}
                        </p>

                        {(dokter.tarif_per_jam || dokter.harga_konsultasi) && (
                          <div className="mb-3">
                            <p className="text-green-600 font-semibold">
                              Rp {parseFloat(dokter.tarif_per_jam || dokter.harga_konsultasi || 0).toLocaleString('id-ID')}/jam
                            </p>
                          </div>
                        )}

                        {(() => {
                          // Safe parsing dan rendering jadwal
                          let jadwalArray = [];
                          try {
                            if (dokter.jadwal_tersedia) {
                              if (typeof dokter.jadwal_tersedia === 'string') {
                                jadwalArray = JSON.parse(dokter.jadwal_tersedia);
                              } else if (Array.isArray(dokter.jadwal_tersedia)) {
                                jadwalArray = dokter.jadwal_tersedia;
                              }
                            }
                          } catch (error) {
                            console.warn('Error parsing jadwal for user display:', error);
                            jadwalArray = [];
                          }

                          return jadwalArray && jadwalArray.length > 0 ? (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-1">Jadwal Tersedia:</p>
                              <div className="flex flex-wrap gap-1">
                                {jadwalArray.map((hari, index) => (
                                  <span key={`${dokter.id}-jadwal-${index}`} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {hari}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Berpengalaman</span>
                      </div>

                      <button
                        onClick={() => handleDokterClick(dokter.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Pilih Dokter
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Konfirmasi Booking */}
        {showConfirmModal && bookingDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Konfirmasi Booking</h3>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Detail Pasien */}
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Detail Pasien</h4>
                    <p className="text-gray-600">Nama: {JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}</p>
                  </div>

                  {/* Detail Dokter */}
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Detail Dokter</h4>
                    <p className="text-gray-600">Nama: {bookingDetails.dokter.pilih_dokter_psikolog}</p>
                    <p className="text-gray-600">Spesialisasi: {bookingDetails.dokter.spesialisasi}</p>
                    <p className="text-gray-600">Tarif: Rp {bookingDetails.tarifPerJam.toLocaleString('id-ID')}/jam</p>
                  </div>

                  {/* Detail Konsultasi */}
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Detail Konsultasi</h4>
                    <p className="text-gray-600">Hari: {bookingForm.pilih_hari}</p>
                    <p className="text-gray-600">Jam: {bookingForm.pilih_jam}</p>
                    <p className="text-gray-600">Durasi: {bookingDetails.durasi} jam</p>
                  </div>

                  {/* Rincian Pembayaran */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Rincian Pembayaran</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Konsultasi ({bookingDetails.durasi} jam)</span>
                        <span className="text-gray-600">Rp {bookingDetails.subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Biaya Admin</span>
                        <span className="text-gray-600">Rp {bookingDetails.adminFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span className="text-gray-900">Total Pembayaran</span>
                        <span className="text-green-600">Rp {bookingDetails.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Catatan */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Catatan:</strong> Pembayaran dapat dilakukan setelah konfirmasi booking.
                      Tim kami akan menghubungi Anda untuk konfirmasi jadwal dan metode pembayaran.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      submitting
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default PsikologiPage;
