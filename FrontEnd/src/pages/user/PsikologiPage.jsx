import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { psikologiService } from '../../services/psikologiService';
import ApiStatus from '../../components/Debug/ApiStatus';

const PsikologiPage = () => {
  const navigate = useNavigate();
  const [dokterList, setDokterList] = useState([]);
  const [durasiList, setDurasiList] = useState([]);
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    nama_lengkap: '',
    layanan_konsultasi: '',
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

      // Fallback ke mock data jika API gagal
      const mockDokterData = [
        {
          id: 1,
          pilih_dokter_psikolog: 'Dr. Fauzan Jamil',
          spesialisasi: 'Psikologi Klinis',
          pengalaman: '8 tahun',
          rating: 4.8,
          foto: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 2,
          pilih_dokter_psikolog: 'Dr. Rina Damayanti',
          spesialisasi: 'Psikologi Anak',
          pengalaman: '6 tahun',
          rating: 4.7,
          foto: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 3,
          pilih_dokter_psikolog: 'Dr. Sabrina Salsabila',
          spesialisasi: 'Terapi Keluarga',
          pengalaman: '10 tahun',
          rating: 4.9,
          foto: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: 4,
          pilih_dokter_psikolog: 'Dr. Ahmad Jatmiko',
          spesialisasi: 'Psikologi Dewasa',
          pengalaman: '12 tahun',
          rating: 4.6,
          foto: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];

      const mockDurasiData = [
        { id: 1, durasi: 30, label: '30 Menit' },
        { id: 2, durasi: 60, label: '1 Jam' },
        { id: 3, durasi: 90, label: '1.5 Jam' }
      ];

      const mockLayananData = [
        { id: 1, nama_layanan: 'Konsultasi Individual' },
        { id: 2, nama_layanan: 'Terapi Keluarga' },
        { id: 3, nama_layanan: 'Konseling Anak' },
        { id: 4, nama_layanan: 'Konseling Pasangan' }
      ];

      setDokterList(mockDokterData);
      setDurasiList(mockDurasiData);
      setLayananList(mockLayananData);
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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Prepare booking data sesuai dengan database schema
      const bookingData = {
        jam_booking: bookingForm.pilih_jam,
        layananId: parseInt(bookingForm.layanan_konsultasi),
        dokterpsikologId: parseInt(bookingForm.pilih_dokter_psikolog),
        durasiId: parseInt(bookingForm.durasi_konsultasi)
      };

      console.log('Sending booking data:', bookingData);

      const result = await psikologiService.createBooking(bookingData);

      console.log('Booking result:', result);
      alert('Booking berhasil! Kami akan menghubungi Anda segera.');

      // Reset form
      setBookingForm({
        nama_lengkap: '',
        layanan_konsultasi: '',
        pilih_jam: '',
        durasi_konsultasi: '',
        pilih_dokter_psikolog: ''
      });

    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('Gagal membuat booking. Silakan coba lagi.');
      alert('Gagal membuat booking. Silakan coba lagi.');
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
        <div className="relative bg-white">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Konsultasi Psikologi
              </h1>
              <p className="text-xl mb-8 text-gray-700 leading-relaxed">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={bookingForm.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Anda"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <select
                    name="layanan_konsultasi"
                    value={bookingForm.layanan_konsultasi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Layanan Konsultasi</option>
                    {layananList.map((layanan) => (
                      <option key={layanan.id} value={layanan.id}>
                        {layanan.nama_layanan || layanan.layanan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <select
                    name="pilih_dokter_psikolog"
                    value={bookingForm.pilih_dokter_psikolog}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Dokter/Psikolog</option>
                    {dokterList.map((dokter) => (
                      <option key={dokter.id} value={dokter.id}>
                        {dokter.pilih_dokter_psikolog || dokter.nama_dokter}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    name="durasi_konsultasi"
                    value={bookingForm.durasi_konsultasi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Durasi Konsultasi</option>
                    {durasiList.map((durasi) => (
                      <option key={durasi.id} value={durasi.id}>
                        {durasi.label || `${durasi.durasi} Menit`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8">
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
                  className={`px-12 py-3 rounded-lg font-semibold transition-colors ${
                    submitting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Memproses...' : 'Booking'}
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dokterList.map((dokter) => (
                  <div key={dokter.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <img
                        src={dokter.foto}
                        alt={dokter.nama_dokter}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {dokter.pilih_dokter_psikolog || dokter.nama_dokter}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">{dokter.spesialisasi}</p>
                      <p className="text-gray-600 text-sm mb-3">
                        Pengalaman: {dokter.pengalaman || 'Berpengalaman'}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(dokter.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({dokter.rating || 4.5})</span>
                      </div>

                      <button
                        onClick={() => handleDokterClick(dokter.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Pilih Dokter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Debug Component - Remove in production */}
      {process.env.NODE_ENV === 'development' && <ApiStatus />}
    </MainLayout>
  );
};

export default PsikologiPage;
