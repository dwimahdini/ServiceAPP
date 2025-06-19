import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { bengkelService } from '../../services/bengkelService';

const ProdukBengkelManagement = () => {
  const [produkBengkel, setProdukBengkel] = useState([]);
  const [bengkelList, setBengkelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formData, setFormData] = useState({
    bengkel_id: '',
    nama_produk: '',
    harga: '',
    foto_produk: '',
    jenis_layanan: 'semua_jenis_layanan',
    deskripsi: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all bengkel products from DATABASE...');

      // Fetch semua produk bengkel dan daftar bengkel dari API
      const [produkResponse, bengkelResponse] = await Promise.all([
        bengkelService.getAllBengkelProduk(),
        bengkelService.getAllBengkel()
      ]);

      console.log('📊 Produk response:', produkResponse);
      console.log('🏪 Bengkel response:', bengkelResponse);

      if (produkResponse.success && produkResponse.data) {
        const produkData = produkResponse.data;
        console.log('✅ Setting produk from DATABASE:', produkData);
        console.log('🔢 Total products:', produkData.length);

        // Log sample products for debugging
        if (produkData.length > 0) {
          console.log('📋 Sample products:');
          produkData.slice(0, 3).forEach((produk, index) => {
            console.log(`Product ${index + 1}:`, {
              id: produk.id,
              nama_produk: produk.nama_produk,
              harga: produk.harga,
              bengkel: produk.Bengkel?.nama_bengkel,
              jenis_layanan: produk.jenis_layanan
            });
          });
        }

        setProdukBengkel(produkData);
      } else {
        console.log('⚠️ API call unsuccessful or no data:', produkResponse.error || produkResponse.message);
        console.log('🔄 Using fallback data');
        loadFallbackData();
      }

      if (bengkelResponse.success && bengkelResponse.data) {
        setBengkelList(bengkelResponse.data);
        console.log(`✅ Loaded ${bengkelResponse.data.length} bengkel`);
      } else {
        console.log('⚠️ Using fallback bengkel list');
        // Fallback bengkel list
        setBengkelList([
          {
            id: 8,
            nama_bengkel: 'Bengkel Ahmad',
            jenis_kendaraan: 'motor',
            alamat: 'Jl. Yang Lurus Sekali',
            status: 'aktif'
          }
        ]);
      }

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.log('🔄 Using fallback data due to API error');
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadAllProdukFromStorage = () => {
    try {
      // Load data from all bengkel localStorage
      const allProduk = [];

      // Check localStorage for each bengkel (we know bengkel 8 exists)
      for (let bengkelId = 1; bengkelId <= 20; bengkelId++) {
        const storageKey = `bengkel_produk_${bengkelId}`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Add bengkel info to each product
          const produkWithBengkel = parsedData.map(produk => ({
            ...produk,
            Bengkel: {
              id: bengkelId,
              nama_bengkel: bengkelId === 8 ? 'Bengkel Ahmad' : `Bengkel ${bengkelId}`,
              jenis_kendaraan: 'motor'
            }
          }));
          allProduk.push(...produkWithBengkel);
        }
      }

      return allProduk;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  const loadFallbackData = () => {
    console.log('⚠️ Loading fallback data - database might be empty');

    // Show empty state when database is empty
    setProdukBengkel([]);
    console.log('💡 Database kosong. Silakan tambah produk baru.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);

      const submitData = {
        bengkel_id: parseInt(formData.bengkel_id),
        nama_produk: formData.nama_produk,
        harga: parseFloat(formData.harga),
        foto_produk: formData.foto_produk || null,
        jenis_layanan: formData.jenis_layanan,
        deskripsi: formData.deskripsi || '',
        status: 'aktif'
      };

      if (editingProduk) {
        // Update existing product via API
        console.log('📝 Updating product ID:', editingProduk.id);

        const result = await bengkelService.updateBengkelProduk(editingProduk.id, submitData);

        if (result.success) {
          console.log('✅ Product updated successfully');
          alert(result.message || 'Produk berhasil diupdate!');

          // Refresh data from database
          await fetchData();
        } else {
          throw new Error(result.message || 'Gagal mengupdate produk');
        }
      } else {
        // Create new product via API
        console.log('➕ Creating new product');

        const result = await bengkelService.createBengkelProduk(submitData);

        if (result.success) {
          console.log('✅ Product created successfully');
          alert(result.message || 'Produk berhasil ditambahkan!');

          // Refresh data from database
          await fetchData();
        } else {
          throw new Error(result.message || 'Gagal menambahkan produk');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving produk bengkel:', error);
      alert('Gagal menyimpan data produk bengkel: ' + error.message);
    }
  };

  const handleEdit = (produk) => {
    console.log('Editing product:', produk);
    setEditingProduk(produk);
    setFormData({
      bengkel_id: produk.bengkel_id?.toString() || '',
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
          await fetchData();
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
    setFormData({
      bengkel_id: '',
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

  const getJenisLayananIcon = (jenis) => {
    switch (jenis) {
      case 'semua_jenis_layanan': return '🔧';
      case 'service_rutin': return '🔄';
      case 'perbaikan_mesin': return '⚙️';
      case 'ganti_ban': return '⚫';
      case 'ganti_oli': return '🛢️';
      case 'tune_up': return '🚀';
      case 'service_berkala': return '📅';
      default: return '🔧';
    }
  };

  const getJenisLayananBadgeColor = (jenis) => {
    switch (jenis) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kelola Produk/Spare Part</h3>
          <p className="text-sm text-gray-600">Daftar semua produk dari berbagai bengkel dalam bentuk list</p>
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
            <span>📊 Total: {produkBengkel.length} produk</span>
            <span>🏪 Dari {new Set(produkBengkel.map(p => p.Bengkel?.nama_bengkel)).size} bengkel</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              fetchData();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              console.log('🐛 Debug info:');
              console.log('Current produkBengkel:', produkBengkel);
              console.log('Current bengkelList:', bengkelList);
              console.log('Loading state:', loading);
              alert(`Debug: ${produkBengkel.length} products loaded. Check console for details.`);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🐛 Debug
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingProduk ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h4>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bengkel
                </label>
                <select
                  name="bengkel_id"
                  value={formData.bengkel_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih Bengkel</option>
                  {bengkelList.map((bengkel) => (
                    <option key={bengkel.id} value={bengkel.id}>
                      {bengkel.nama_bengkel} ({bengkel.jenis_kendaraan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk
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
                  Jenis Layanan
                </label>
                <select
                  name="jenis_layanan"
                  value={formData.jenis_layanan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="semua_jenis_layanan">🔧 Semua Jenis Layanan</option>
                  <option value="service_rutin">🔄 Service Rutin</option>
                  <option value="perbaikan_mesin">⚙️ Perbaikan Mesin</option>
                  <option value="ganti_ban">⚫ Ganti Ban</option>
                  <option value="ganti_oli">🛢️ Ganti Oli</option>
                  <option value="tune_up">🚀 Tune Up</option>
                  <option value="service_berkala">📅 Service Berkala</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp)
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
                  URL Foto Produk (Opsional)
                </label>
                <input
                  type="url"
                  name="foto_produk"
                  value={formData.foto_produk}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/foto-produk.jpg"
                />
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

      {/* Daftar Produk */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bengkel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Layanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produkBengkel.length > 0 ? (
                produkBengkel.map((produk) => (
                  <tr key={produk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {produk.foto_produk ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={produk.foto_produk}
                              alt={produk.nama_produk}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center ${produk.foto_produk ? 'hidden' : ''}`}>
                            <span className="text-lg">⚙️</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{produk.nama_produk}</div>
                          <div className="text-sm text-gray-500">{produk.deskripsi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {produk.Bengkel?.nama_bengkel || 'Bengkel Tidak Diketahui'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {produk.Bengkel?.jenis_kendaraan || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisLayananBadgeColor(produk.jenis_layanan)}`}>
                        {getJenisLayananIcon(produk.jenis_layanan)} {produk.jenis_layanan?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(produk.harga)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        produk.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {produk.status === 'aktif' ? '✅ Aktif' : '❌ Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(produk)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(produk.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Produk</h3>
                      <p className="text-gray-500 mb-4">
                        Belum ada produk bengkel yang tersimpan di database.
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Tambah Produk Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProdukBengkelManagement;
