import React, { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ServiceCategories from '../../components/OpoWae/ServiceCategories';

const OpoWaePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProviders, setShowProviders] = useState(false);
  const [providers, setProviders] = useState([]);

  // Mock data providers untuk demo
  const mockProviders = {
    1: [ // Transportasi
      { id: 1, nama: 'Budi Santoso', rating: 4.8, pengalaman: '5 tahun', tarif: 'Rp 100.000/hari', tersedia: true, foto: null },
      { id: 2, nama: 'Andi Wijaya', rating: 4.6, pengalaman: '3 tahun', tarif: 'Rp 80.000/hari', tersedia: true, foto: null },
      { id: 3, nama: 'Sari Indah', rating: 4.9, pengalaman: '7 tahun', tarif: 'Rp 120.000/hari', tersedia: false, foto: null }
    ],
    2: [ // Kebersihan
      { id: 4, nama: 'Cleaning Pro', rating: 4.7, pengalaman: '4 tahun', tarif: 'Rp 150.000/rumah', tersedia: true, foto: null },
      { id: 5, nama: 'Fresh Clean', rating: 4.5, pengalaman: '2 tahun', tarif: 'Rp 120.000/rumah', tersedia: true, foto: null }
    ],
    3: [ // Perbaikan
      { id: 6, nama: 'Teknik Jaya', rating: 4.8, pengalaman: '8 tahun', tarif: 'Rp 200.000/panggilan', tersedia: true, foto: null },
      { id: 7, nama: 'Fix It Fast', rating: 4.4, pengalaman: '3 tahun', tarif: 'Rp 150.000/panggilan', tersedia: true, foto: null }
    ]
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setProviders(mockProviders[category.id] || []);
    setShowProviders(true);
  };

  const handleBookProvider = (provider) => {
    alert(`Booking ${provider.nama} berhasil! Kami akan menghubungi Anda segera.`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Opo Wae - Layanan Harian
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Solusi untuk semua kebutuhan harian Anda. Temukan penyedia layanan terpercaya dengan mudah
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories Section */}
            <div className="lg:col-span-2">
              <ServiceCategories onCategorySelect={handleCategorySelect} />
            </div>

            {/* Providers Section */}
            <div className="lg:col-span-1">
              {showProviders && selectedCategory ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Penyedia Layanan - {selectedCategory.nama}
                  </h3>
                  
                  {providers.length > 0 ? (
                    <div className="space-y-4">
                      {providers.map((provider) => (
                        <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              {provider.foto ? (
                                <img 
                                  src={provider.foto} 
                                  alt={provider.nama}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{provider.nama}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {provider.rating}
                              </div>
                              <p className="text-xs text-gray-500">{provider.pengalaman}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                provider.tersedia 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {provider.tersedia ? 'Tersedia' : 'Sibuk'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-indigo-600">
                              {provider.tarif}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleBookProvider(provider)}
                            disabled={!provider.tersedia}
                            className={`w-full px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                              provider.tersedia
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {provider.tersedia ? 'Book Sekarang' : 'Tidak Tersedia'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum Ada Provider
                      </h3>
                      <p className="text-gray-600">
                        Penyedia layanan untuk kategori ini sedang dalam proses rekrutmen
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Pilih Kategori Layanan
                  </h3>
                  <p className="text-gray-600">
                    Pilih kategori layanan di sebelah kiri untuk melihat penyedia layanan yang tersedia
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cara Kerja Opo Wae
              </h2>
              <p className="text-lg text-gray-600">
                Mudah dan cepat dalam 3 langkah sederhana
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pilih Kategori
                </h3>
                <p className="text-gray-600">
                  Pilih kategori layanan yang Anda butuhkan dari berbagai pilihan yang tersedia
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pilih Provider
                </h3>
                <p className="text-gray-600">
                  Lihat profil dan rating penyedia layanan, lalu pilih yang sesuai dengan kebutuhan Anda
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Book & Nikmati
                </h3>
                <p className="text-gray-600">
                  Lakukan booking dan nikmati layanan berkualitas dari penyedia terpercaya
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default OpoWaePage;
