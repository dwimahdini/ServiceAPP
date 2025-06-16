import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const BengkelPage = () => {
  const navigate = useNavigate();
  const [produkList, setProdukList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Mock data untuk demo
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
    },
    {
      id: 5,
      nama_produk: 'Aki Mobil',
      harga: 'Rp 950.000',
      kategori: 'Aki',
      merek: 'Yuasa',
      gambar: null
    },
    {
      id: 6,
      nama_produk: 'Ban Radial',
      harga: 'Rp 1.200.000',
      kategori: 'Ban',
      merek: 'Dunlop',
      gambar: null
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulasi API call - nanti bisa diganti dengan real API
      setTimeout(() => {
        setProdukList(mockProdukData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const categories = ['Semua', 'Ban', 'Aki', 'Oli'];

  const filteredProduk = selectedCategory === 'Semua'
    ? produkList
    : produkList.filter(produk => produk.kategori === selectedCategory);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gray-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Layanan Bengkel
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Kami menyediakan layanan perbaikan dan perawatan kendaraan terbaik dengan teknisi berpengalaman dan peralatan modern.
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                LIHAT SELENGKAPNYA
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Layanan Motor */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Layanan Motor</h3>
              <p className="text-gray-600 mb-6">
                Perawatan berkala, perbaikan dan service untuk semua jenis kendaraan bermotor roda dua.
              </p>
              <button
                onClick={() => navigate('/layanan-motor')}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lihat Selengkapnya
              </button>
            </div>

            {/* Layanan Mobil */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Layanan Mobil</h3>
              <p className="text-gray-600 mb-6">
                Servis berkala dan perbaikan untuk semua jenis kendaraan bermotor roda empat.
              </p>
              <button
                onClick={() => navigate('/layanan-mobil')}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lihat Selengkapnya
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Semua Produk</h2>
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Lihat Selengkapnya
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories Sidebar */}
              <div className="lg:w-1/4">
                <h3 className="text-lg font-semibold mb-4">Kategori</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-8">Layanan</h3>
                <div className="space-y-2">
                  <button className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    Motor
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    Mobil
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:w-3/4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProduk.map((produk) => (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BengkelPage;
