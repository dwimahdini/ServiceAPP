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

        // Use data from database only - no default values
        const enhancedDokter = {
          ...dokterData,
          nama_dokter: dokterData.pilih_dokter_psikolog || dokterData.nama_dokter,
          tempat_praktik: dokterData.alamat || null,
          alumni: null, // Will be shown only if available in database
          biografi: dokterData.pengalaman || null,
          keahlian: dokterData.spesialisasi ? [dokterData.spesialisasi] : [],
          jadwal_praktik: [], // Will be shown only if available in database
          tarif: dokterData.tarif_per_jam ? {
            per_jam: `Rp ${parseFloat(dokterData.tarif_per_jam).toLocaleString('id-ID')}`
          } : null
        };

        setDokter(enhancedDokter);
      } catch (error) {
        console.error('Error fetching dokter detail:', error);
        setError('Gagal memuat detail dokter. Silakan coba lagi.');

        // No fallback data - show error state instead
        setDokter(null);
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
                  {dokter.foto ? (
                    <img
                      src={dokter.foto}
                      alt={dokter.nama_dokter}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{dokter.nama_dokter}</h2>
                
                <div className="space-y-4 mb-6">
                  {dokter.pengalaman && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Pengalaman</h3>
                      <p className="text-gray-600">{dokter.pengalaman}</p>
                    </div>
                  )}

                  {dokter.tempat_praktik && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Alamat Praktik</h3>
                      <p className="text-gray-600">{dokter.tempat_praktik}</p>
                    </div>
                  )}

                  {dokter.spesialisasi && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Spesialisasi</h3>
                      <div className="bg-blue-100 px-4 py-2 rounded-lg inline-block">
                        <p className="text-blue-800 font-medium">{dokter.spesialisasi}</p>
                      </div>
                    </div>
                  )}

                  {dokter.tarif_per_jam && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Tarif</h3>
                      <div className="bg-green-100 px-4 py-2 rounded-lg inline-block">
                        <p className="text-green-800 font-bold">Rp {parseFloat(dokter.tarif_per_jam).toLocaleString('id-ID')}/jam</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold">Psikolog Profesional</span>
                  </div>
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

          {/* Additional Info - Only show if data exists */}
          {dokter.keahlian && dokter.keahlian.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
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
          )}

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Kontak</h3>
            <div className="space-y-3">
              {dokter.no_hp && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{dokter.no_hp}</span>
                </div>
              )}
              {dokter.email && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{dokter.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailDokterPage;
