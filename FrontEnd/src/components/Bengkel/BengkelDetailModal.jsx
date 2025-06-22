import React, { useState, useEffect } from 'react';

const BengkelDetailModal = ({ bengkel, onClose }) => {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generate kategori dinamis dari data produk yang tersedia
  const jenisLayananOptions = [
    { value: 'all', label: 'Semua Layanan' },
    ...Array.from(new Set(produkList.map(produk => produk.jenis_layanan).filter(Boolean)))
      .map(jenis => ({ value: jenis, label: jenis }))
  ];

  useEffect(() => {
    if (bengkel?.id) {
      fetchProdukData();
    }
  }, [bengkel]);

  const fetchProdukData = async () => {
    try {
      setLoading(true);
      console.log('Fetching produk for bengkel ID:', bengkel.id);

      // Menggunakan fetch langsung karena ini public endpoint
      const response = await fetch(`http://localhost:3001/bengkel/${bengkel.id}/produk`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Produk data received:', result);

      // Backend mengembalikan { success: true, data: [...] }
      const produkData = result.data || [];
      setProdukList(produkData);
    } catch (error) {
      console.error('Error fetching produk data:', error);
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getJenisLayananLabel = (value) => {
    return value || 'Layanan Umum';
  };

  const getJenisLayananIcon = (jenis) => {
    // Icon dinamis berdasarkan kata kunci dalam nama jenis layanan
    const jenisLower = (jenis || '').toLowerCase();
    if (jenisLower.includes('oli')) return '🛢️';
    if (jenisLower.includes('ban')) return '🛞';
    if (jenisLower.includes('service') || jenisLower.includes('rutin')) return '⚙️';
    if (jenisLower.includes('mesin') || jenisLower.includes('perbaikan')) return '🔩';
    if (jenisLower.includes('tune') || jenisLower.includes('up')) return '🔧';
    if (jenisLower.includes('berkala') || jenisLower.includes('jadwal')) return '📅';
    return '🔧'; // Default icon
  };

  const filteredProduk = selectedCategory === 'all' 
    ? produkList 
    : produkList.filter(produk => produk.jenis_layanan === selectedCategory);

  if (!bengkel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{bengkel.nama}</h2>
            <p className="text-gray-600">{bengkel.alamat}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Bengkel Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{bengkel.telepon}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{bengkel.jam_buka}</span>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-700">Rating: {bengkel.rating}/5</span>
              </div>
            </div>

            <div>
              {bengkel.layanan && bengkel.layanan.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Layanan Tersedia:</h4>
                  <div className="flex flex-wrap gap-2">
                    {bengkel.layanan.map((layanan, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {layanan}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Produk Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Produk & Layanan</h3>
              <span className="text-sm text-gray-500">
                {filteredProduk.length} produk tersedia
              </span>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {jenisLayananOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Produk List */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProduk.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProduk.map((produk) => (
                  <div key={produk.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getJenisLayananIcon(produk.jenis_layanan)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{produk.nama_produk}</h4>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {getJenisLayananLabel(produk.jenis_layanan)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {produk.foto_produk && (
                      <div className="mb-3">
                        <img
                          src={produk.foto_produk}
                          alt={produk.nama_produk}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(produk.harga)}
                        </span>
                      </div>

                      {produk.deskripsi && (
                        <p className="text-sm text-gray-600 line-clamp-2">{produk.deskripsi}</p>
                      )}

                      <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  {selectedCategory === 'all'
                    ? 'Bengkel ini belum menambahkan produk atau layanan'
                    : 'Tidak ada produk untuk kategori ini'
                  }
                </p>
                {selectedCategory === 'all' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Silakan hubungi bengkel langsung untuk informasi produk dan layanan yang tersedia
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BengkelDetailModal;
