import React, { useState, useEffect } from 'react';
import { bengkelService } from '../../services/bengkelService';

const BengkelDetailModal = ({ bengkelId, bengkelNama, onClose }) => {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [formData, setFormData] = useState({
    bengkel_id: bengkelId,
    nama_produk: '',
    harga: '',
    foto_produk: '',
    jenis_layanan: 'semua_jenis_layanan',
    deskripsi: ''
  });

  // Load data from localStorage first
  useEffect(() => {
    if (bengkelId) {
      const storageKey = `bengkel_produk_${bengkelId}`;
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Loading data from localStorage:', parsedData);
          setProdukList(parsedData);
          setHasLoadedFromStorage(true);
          setLoading(false);
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
          fetchProdukBengkel();
        }
      } else {
        fetchProdukBengkel();
      }
    }
  }, [bengkelId]);

  const fetchProdukBengkel = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching produk for bengkel:', bengkelId);

      const result = await bengkelService.getProdukByBengkelId(bengkelId);
      console.log('✅ Service result:', result);

      if (result.success) {
        const produkData = result.data || [];
        console.log('📊 Setting produk list from DATABASE:', produkData);
        console.log('🔢 Product count:', produkData.length);

        // Log each product for debugging
        produkData.forEach((produk, index) => {
          console.log(`Product ${index + 1}:`, produk);
        });

        setProdukList(produkData);

        // Optional: Save to localStorage as backup
        saveToLocalStorage(produkData);
      } else {
        console.log('⚠️ API call unsuccessful:', result.error);
        console.log('🔄 Using fallback data');
        loadFallbackData();
      }
    } catch (error) {
      console.error('❌ Error fetching produk bengkel:', error);
      console.log('🔄 Using fallback data due to API error');
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    console.log('⚠️ Loading fallback data - database might be empty');

    if (bengkelId === 8) {
      // Show empty state with message
      setProdukList([]);
      console.log('💡 Database kosong untuk Bengkel Ahmad. Silakan tambah produk baru.');
    } else {
      // Empty array untuk bengkel lain
      setProdukList([]);
    }
  };

  const saveToLocalStorage = (data) => {
    try {
      const storageKey = `bengkel_produk_${bengkelId}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log('Data saved to localStorage:', data);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting form data:', formData);

      if (editingProduk) {
        // Update existing product via API
        console.log('📝 Updating product ID:', editingProduk.id);

        const result = await bengkelService.updateBengkelProduk(editingProduk.id, formData);

        if (result.success) {
          console.log('✅ Product updated successfully');
          alert(result.message || 'Produk berhasil diupdate!');

          // Refresh data from database
          await fetchProdukBengkel();
        } else {
          throw new Error(result.message || 'Gagal mengupdate produk');
        }
      } else {
        // Create new product via API
        console.log('➕ Creating new product for bengkel:', bengkelId);

        const produkData = {
          bengkel_id: bengkelId,
          nama_produk: formData.nama_produk,
          harga: parseFloat(formData.harga),
          foto_produk: formData.foto_produk || null,
          jenis_layanan: formData.jenis_layanan,
          deskripsi: formData.deskripsi || ''
        };

        const result = await bengkelService.createBengkelProduk(produkData);

        if (result.success) {
          console.log('✅ Product created successfully');
          alert(result.message || 'Produk berhasil ditambahkan!');

          // Refresh data from database
          await fetchProdukBengkel();
        } else {
          throw new Error(result.message || 'Gagal menambahkan produk');
        }
      }

      resetForm();
    } catch (error) {
      console.error('❌ Error saving produk:', error);
      alert('Gagal menyimpan produk: ' + error.message);
    }
  };

  const handleEdit = (produk) => {
    console.log('Editing product:', produk);
    setEditingProduk(produk);
    setFormData({
      bengkel_id: bengkelId,
      nama_produk: produk.nama_produk || '',
      harga: produk.harga?.toString() || '',
      foto_produk: produk.foto_produk || '',
      jenis_layanan: produk.jenis_layanan || 'semua_jenis_layanan',
      deskripsi: produk.deskripsi || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        console.log('🗑️ Deleting product ID:', id);

        const result = await bengkelService.deleteBengkelProduk(id);

        if (result.success) {
          console.log('✅ Product deleted successfully');
          alert(result.message || 'Produk berhasil dihapus!');

          // Refresh data from database
          await fetchProdukBengkel();
        } else {
          throw new Error(result.message || 'Gagal menghapus produk');
        }
      } catch (error) {
        console.error('❌ Error deleting produk:', error);
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    console.log('Resetting form');
    setFormData({
      bengkel_id: bengkelId,
      nama_produk: '',
      harga: '',
      foto_produk: '',
      jenis_layanan: 'semua_jenis_layanan',
      deskripsi: ''
    });
    setEditingProduk(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getJenisLayananIcon = (jenisLayanan) => {
    switch (jenisLayanan) {
      case 'semua_jenis_layanan': return '🔧';
      case 'service_rutin': return '🛠️';
      case 'perbaikan_mesin': return '⚙️';
      case 'ganti_ban': return '⚫';
      case 'ganti_oli': return '🛢️';
      case 'tune_up': return '🔩';
      case 'service_berkala': return '📅';
      default: return '🔧';
    }
  };

  const getJenisLayananLabel = (jenisLayanan) => {
    switch (jenisLayanan) {
      case 'semua_jenis_layanan': return 'Semua Jenis';
      case 'service_rutin': return 'Service Rutin';
      case 'perbaikan_mesin': return 'Perbaikan Mesin';
      case 'ganti_ban': return 'Ganti Ban';
      case 'ganti_oli': return 'Ganti Oli';
      case 'tune_up': return 'Tune Up';
      case 'service_berkala': return 'Service Berkala';
      default: return jenisLayanan;
    }
  };

  const getJenisLayananBadgeColor = (jenisLayanan) => {
    switch (jenisLayanan) {
      case 'semua_jenis_layanan': return 'bg-gray-100 text-gray-800';
      case 'service_rutin': return 'bg-blue-100 text-blue-800';
      case 'perbaikan_mesin': return 'bg-red-100 text-red-800';
      case 'ganti_ban': return 'bg-purple-100 text-purple-800';
      case 'ganti_oli': return 'bg-yellow-100 text-yellow-800';
      case 'tune_up': return 'bg-green-100 text-green-800';
      case 'service_berkala': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Kelola Produk Bengkel</h3>
            <p className="text-sm text-gray-600">{bengkelNama}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tambah Produk
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading data dari database...</p>
              <p className="text-sm text-gray-500">Bengkel ID: {bengkelId}</p>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">📦</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-700">Total Produk</p>
                      <p className="text-lg font-semibold text-blue-900">{produkList.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">✅</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-700">Produk Aktif</p>
                      <p className="text-lg font-semibold text-green-900">
                        {produkList.filter(p => p.status === 'aktif').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-semibold text-sm">💰</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-700">Rata-rata Harga</p>
                      <p className="text-lg font-semibold text-yellow-900">
                        {produkList.length > 0 ? formatCurrency(produkList.reduce((sum, p) => sum + (parseFloat(p.harga) || 0), 0) / produkList.length) : 'Rp 0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product List */}
              {produkList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {produkList.map((produk) => (
                    <div key={produk.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {produk.foto_produk ? (
                            <img 
                              src={produk.foto_produk} 
                              alt={produk.nama_produk}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl ${produk.foto_produk ? 'hidden' : ''}`}
                          >
                            {getJenisLayananIcon(produk.jenis_layanan)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{produk.nama_produk}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{produk.deskripsi}</p>
                          
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJenisLayananBadgeColor(produk.jenis_layanan)}`}>
                              {getJenisLayananLabel(produk.jenis_layanan)}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(produk.harga)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              produk.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {produk.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>

                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleEdit(produk)}
                              className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(produk.id)}
                              className="flex-1 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
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
                  <p className="text-gray-700 font-medium mb-2">Database Kosong</p>
                  <p className="text-gray-500 mb-1">Belum ada produk di database untuk bengkel ini</p>
                  <p className="text-xs text-blue-600 mb-4">💡 Tambah produk baru akan langsung tersimpan ke database MySQL</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Tambah Produk ke Database
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {editingProduk ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h4>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Oli Mesin Yamalube"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Layanan *
                </label>
                <select
                  name="jenis_layanan"
                  value={formData.jenis_layanan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="semua_jenis_layanan">🔧 Semua Jenis</option>
                  <option value="service_rutin">🛠️ Service Rutin</option>
                  <option value="perbaikan_mesin">⚙️ Perbaikan Mesin</option>
                  <option value="ganti_ban">⚫ Ganti Ban</option>
                  <option value="ganti_oli">🛢️ Ganti Oli</option>
                  <option value="tune_up">🔩 Tune Up</option>
                  <option value="service_berkala">📅 Service Berkala</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="45000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Produk (URL)
                  </label>
                  <input
                    type="url"
                    name="foto_produk"
                    value={formData.foto_produk}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/foto.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi produk..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingProduk ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BengkelDetailModal;
