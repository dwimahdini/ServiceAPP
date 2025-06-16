import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';

const LayananMotorPage = () => {
  const [bengkelList, setBengkelList] = useState([]);
  const [filteredBengkel, setFilteredBengkel] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data untuk bengkel
  const mockBengkelData = [
    {
      id: 1,
      nama: 'Bengkel Motor Jaya',
      alamat: 'Jl. Rungkut Raya No. 123',
      jarak: '2.5 km',
      rating: 4.5,
      layanan: ['Service Rutin', 'Ganti Oli', 'Tune Up'],
      jam_buka: '08:00 - 17:00',
      telepon: '031-8765432'
    },
    {
      id: 2,
      nama: 'Jaya Motor',
      alamat: 'Jl. Gubeng Kertajaya No. 45',
      jarak: '3.2 km',
      rating: 4.3,
      layanan: ['Service Rutin', 'Perbaikan Mesin', 'Ganti Ban'],
      jam_buka: '09:00 - 18:00',
      telepon: '031-5678901'
    },
    {
      id: 3,
      nama: 'Motor Service Center',
      alamat: 'Jl. Ahmad Yani No. 78',
      jarak: '4.1 km',
      rating: 4.7,
      layanan: ['Service Berkala', 'Tune Up', 'Ganti Oli'],
      jam_buka: '08:30 - 17:30',
      telepon: '031-2345678'
    }
  ];

  // Mock data untuk produk
  const mockProdukData = [
    {
      id: 1,
      nama_produk: 'Ban Tubeless',
      harga: 'Rp 450.000',
      kategori: 'Ban',
      merek: 'Michelin',
      gambar: null
    },
    {
      id: 2,
      nama_produk: 'Aki Kering',
      harga: 'Rp 750.000',
      kategori: 'Aki',
      merek: 'GS Astra',
      gambar: null
    },
    {
      id: 3,
      nama_produk: 'Ban Motor',
      harga: 'Rp 350.000',
      kategori: 'Ban',
      merek: 'Bridgestone',
      gambar: null
    },
    {
      id: 4,
      nama_produk: 'Oli Mesin',
      harga: 'Rp 85.000',
      kategori: 'Oli',
      merek: 'Shell',
      gambar: null
    }
  ];

  useEffect(() => {
    // Simulasi loading data
    setLoading(true);
    setTimeout(() => {
      setBengkelList(mockBengkelData);
      setFilteredBengkel(mockBengkelData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi pencarian
    setTimeout(() => {
      if (searchLocation.trim() === '') {
        setFilteredBengkel(bengkelList);
      } else {
        const filtered = bengkelList.filter(bengkel =>
          bengkel.alamat.toLowerCase().includes(searchLocation.toLowerCase()) ||
          bengkel.nama.toLowerCase().includes(searchLocation.toLowerCase())
        );
        setFilteredBengkel(filtered);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gray-900 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Layanan Motor
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Kami menyediakan layanan perbaikan dan perawatan motor terbaik dengan teknisi berpengalaman dan peralatan modern untuk semua jenis motor.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Temukan Bengkel Terdekat</h2>
            <p className="text-gray-600 text-center mb-8">
              Cari dan temukan bengkel terdekat dengan lokasi Anda
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Masukkan lokasi Anda..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Mencari...' : 'Temukan'}
                </button>
              </div>
            </form>
          </div>

          {/* Bengkel List */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Bengkel Terdekat</h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBengkel.map((bengkel) => (
                  <div key={bengkel.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{bengkel.nama}</h4>
                        <p className="text-gray-600 mb-2">{bengkel.alamat}</p>
                        <p className="text-sm text-gray-500 mb-2">Jarak: {bengkel.jarak}</p>
                        <p className="text-sm text-gray-500 mb-3">Jam Buka: {bengkel.jam_buka}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {bengkel.layanan.map((layanan, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {layanan}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(bengkel.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({bengkel.rating})</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Lihat Detail
                        </button>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          Hubungi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Pilih Produk</h2>
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Lihat Selengkapnya
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium">
                  Semua
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Ban
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Aki
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Oli
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProdukData.map((produk) => (
                <div key={produk.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {produk.gambar ? (
                      <img 
                        src={produk.gambar} 
                        alt={produk.nama_produk}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{produk.nama_produk}</h4>
                  <p className="text-blue-600 font-bold">{produk.harga}</p>
                  <p className="text-sm text-gray-500">{produk.merek}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LayananMotorPage;
