import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { psikologiService } from '../../services/psikologiService';

const DetailDokterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dokter, setDokter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchDokterDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const dokterData = await psikologiService.getDokterById(id);

        // Enhance data dengan informasi tambahan jika diperlukan
        const enhancedDokter = {
          ...dokterData,
          nama_dokter: dokterData.pilih_dokter_psikolog || dokterData.nama_dokter,
          tempat_praktik: dokterData.tempat_praktik || 'Klinik Terpercaya',
          alumni: dokterData.alumni || 'Universitas Terkemuka',
          biografi: dokterData.biografi || 'Psikolog berpengalaman dengan dedikasi tinggi untuk membantu pasien mencapai kesejahteraan mental yang optimal.',
          keahlian: dokterData.keahlian || ['Konsultasi Umum', 'Terapi Perilaku', 'Manajemen Stress'],
          jadwal_praktik: dokterData.jadwal_praktik || [
            { hari: 'Senin', jam: '09:00 - 17:00' },
            { hari: 'Selasa', jam: '09:00 - 17:00' },
            { hari: 'Rabu', jam: '09:00 - 15:00' },
            { hari: 'Kamis', jam: '13:00 - 17:00' },
            { hari: 'Jumat', jam: '09:00 - 12:00' }
          ],
          tarif: dokterData.tarif || {
            konsultasi_30: 'Rp 300.000',
            konsultasi_60: 'Rp 500.000'
          }
        };

        setDokter(enhancedDokter);
      } catch (error) {
        console.error('Error fetching dokter detail:', error);
        setError('Gagal memuat detail dokter. Silakan coba lagi.');

        // Fallback ke mock data jika API gagal
        const mockDokterDetail = {
          1: {
            id: 1,
            nama_dokter: 'Dr. Fauzan Hamid',
            spesialisasi: 'Psikologi Klinis',
            pengalaman: '4 tahun',
            rating: 4.8,
            tempat_praktik: 'Klinik ABC Surabaya Utara',
            alumni: 'Universitas Airlangga, 2015',
            foto: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600',
            biografi: 'Dr. Fauzan Hamid adalah psikolog klinis berpengalaman dengan spesialisasi dalam terapi kognitif-behavioral dan penanganan gangguan kecemasan.',
            keahlian: ['Terapi CBT', 'Anxiety Disorder', 'Depression', 'Trauma Therapy', 'Stress Management'],
            jadwal_praktik: [
              { hari: 'Senin', jam: '09:00 - 17:00' },
              { hari: 'Selasa', jam: '09:00 - 17:00' },
              { hari: 'Rabu', jam: '09:00 - 15:00' },
              { hari: 'Kamis', jam: '13:00 - 17:00' },
              { hari: 'Jumat', jam: '09:00 - 12:00' }
            ],
            tarif: {
              konsultasi_30: 'Rp 300.000',
              konsultasi_60: 'Rp 500.000'
            }
          }
        };

        const fallbackData = mockDokterDetail[id];
        if (fallbackData) {
          setDokter(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDokterDetail();
  }, [id]);

  const handleBookingClick = () => {
    // Navigate ke halaman booking dengan dokter yang dipilih
    navigate('/psikologi', { state: { selectedDokter: dokter } });
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

  if (!dokter && !loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Dokter tidak ditemukan'}
          </h1>
          <button
            onClick={() => navigate('/psikologi')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Daftar Dokter
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate('/psikologi')}
                className="hover:text-blue-600 transition-colors"
              >
                Konsultasi Psikologi
              </button>
              <span>›</span>
              <span className="text-gray-900 font-medium">Minibiografi dokter</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative bg-white">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Konsultasi Psikologi
              </h1>
              <p className="text-xl mb-8 text-gray-700 leading-relaxed">
                Kami siap mendampingi perjalanan Anda menuju kesejahteraan emosional. 
                Dapatkan bimbingan dari psikolog profesional dan terkualifikasi terbaik 
                untuk kesehatan mental Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Doctor Detail Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Doctor Photo */}
              <div className="md:w-1/3">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <img 
                    src={dokter.foto} 
                    alt={dokter.nama_dokter}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{dokter.nama_dokter}</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Pengalaman</h3>
                    <p className="text-gray-600">{dokter.pengalaman}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Tempat Praktik</h3>
                    <p className="text-gray-600">{dokter.tempat_praktik}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Alumni</h3>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block">
                      <p className="text-gray-700">{dokter.alumni}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(dokter.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">({dokter.rating})</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleBookingClick}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Jadwalkan Konsultasi
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Keahlian */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Keahlian</h3>
              <div className="flex flex-wrap gap-2">
                {dokter.keahlian.map((keahlian, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {keahlian}
                  </span>
                ))}
              </div>
            </div>

            {/* Jadwal Praktik */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Jadwal Praktik</h3>
              <div className="space-y-2">
                {dokter.jadwal_praktik.map((jadwal, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{jadwal.hari}</span>
                    <span className="text-gray-600">{jadwal.jam}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biografi */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Biografi</h3>
            <p className="text-gray-700 leading-relaxed">{dokter.biografi}</p>
          </div>

          {/* Tarif */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tarif Konsultasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Konsultasi 30 Menit</h4>
                <p className="text-2xl font-bold text-blue-600">{dokter.tarif.konsultasi_30}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Konsultasi 60 Menit</h4>
                <p className="text-2xl font-bold text-blue-600">{dokter.tarif.konsultasi_60}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailDokterPage;
