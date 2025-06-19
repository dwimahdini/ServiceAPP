import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import BengkelDetailModal from '../../components/Bengkel/BengkelDetailModal';
import { bengkelService } from '../../services/bengkelService';

const LayananMotorPage = () => {
  const [bengkelList, setBengkelList] = useState([]);
  const [filteredBengkel, setFilteredBengkel] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBengkel, setSelectedBengkel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);





  useEffect(() => {
    fetchBengkelData();
  }, []);

  const fetchBengkelData = async () => {
    try {
      setLoading(true);
      // Ambil bengkel khusus motor dan produk secara parallel
      const [bengkelResponse, produkResponse] = await Promise.all([
        bengkelService.getBengkelByJenis('motor'),
        bengkelService.getAllBengkelProduk()
      ]);

      const bengkelData = bengkelResponse.data || [];
      const produkData = produkResponse.data || [];

      // Format data bengkel untuk kompatibilitas dengan UI yang ada
      const formattedBengkelData = bengkelData.map(bengkel => ({
        id: bengkel.id,
        nama: bengkel.nama_bengkel,
        alamat: bengkel.alamat,
        jarak: bengkel.koordinat_lat && bengkel.koordinat_lng ? 'Lokasi tersedia' : 'Hubungi bengkel',
        rating: bengkel.rating || 4.0,
        layanan: bengkel.layanan_tersedia ? bengkel.layanan_tersedia.split(',').map(l => l.trim()) : [],
        jam_buka: `${bengkel.jam_buka} - ${bengkel.jam_tutup}`,
        telepon: bengkel.telepon
      }));

      // Filter produk untuk bengkel motor saja
      const motorProduk = produkData.filter(produk =>
        produk.Bengkel && produk.Bengkel.jenis_kendaraan === 'motor'
      );

      setBengkelList(formattedBengkelData);
      setFilteredBengkel(formattedBengkelData);
      setProdukList(motorProduk);
    } catch (error) {
      console.error('Error fetching bengkel data:', error);
      // Set empty arrays on error
      setBengkelList([]);
      setFilteredBengkel([]);
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewDetail = (bengkel) => {
    setSelectedBengkel(bengkel);
    setShowDetailModal(true);
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
            ) : filteredBengkel.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada bengkel motor</h3>
                <p className="text-gray-500">Bengkel motor akan segera tersedia di area Anda.</p>
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
                        <button
                          onClick={() => handleViewDetail(bengkel)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
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
                {/* Kategori dinamis berdasarkan jenis layanan produk yang tersedia */}
                {[...new Set(produkList.map(produk => produk.jenis_layanan).filter(Boolean))].map((kategori) => (
                  <button
                    key={kategori}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {kategori}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produkList.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada produk</h3>
                  <p className="text-gray-500">Produk untuk bengkel motor akan segera tersedia.</p>
                </div>
              ) : (
                produkList.map((produk) => (
                <div key={produk.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {produk.foto_produk ? (
                      <img
                        src={produk.foto_produk}
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
                  <p className="text-blue-600 font-bold">
                    Rp {produk.harga ? produk.harga.toLocaleString('id-ID') : '0'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {produk.Bengkel ? produk.Bengkel.nama_bengkel : 'Bengkel tidak diketahui'}
                  </p>
                </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedBengkel && (
          <BengkelDetailModal
            bengkel={selectedBengkel}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedBengkel(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default LayananMotorPage;
