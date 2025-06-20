import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import ImageUpload from './ImageUpload';

const BengkelProdukManagement = ({ bengkelId, bengkelNama, onClose }) => {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formData, setFormData] = useState({
    nama_produk: '',
    harga: '',
    foto_produk: '',
    jenis_layanan: 'semua_jenis_layanan',
    deskripsi: ''
  });

  const jenisLayananOptions = [
    { value: 'semua_jenis_layanan', label: 'Semua Jenis Layanan' },
    { value: 'service_rutin', label: 'Service Rutin' },
    { value: 'perbaikan_mesin', label: 'Perbaikan Mesin' },
    { value: 'ganti_ban', label: 'Ganti Ban' },
    { value: 'ganti_oli', label: 'Ganti Oli' },
    { value: 'tune_up', label: 'Tune Up' },
    { value: 'service_berkala', label: 'Service Berkala' }
  ];

  useEffect(() => {
    if (bengkelId) {
      fetchProdukData();
    }
  }, [bengkelId]);

  const fetchProdukData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.get(`/bengkel/${bengkelId}/produk`);
      setProdukList(response.data || []);
    } catch (error) {
      console.error('Error fetching produk data:', error);
      setProdukList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        bengkel_id: bengkelId,
        harga: parseFloat(formData.harga)
      };

      if (editingProduk) {
        await authAPI.put(`/bengkel-produk/${editingProduk.id}`, submitData);
      } else {
        await authAPI.post('/bengkel-produk', submitData);
      }

      await fetchProdukData();
      resetForm();
      alert('Produk berhasil disimpan!');
    } catch (error) {
      console.error('Error saving produk:', error);
      alert('Gagal menyimpan produk');
    }
  };

  const handleEdit = (produk) => {
    setEditingProduk(produk);
    setFormData({
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
        await authAPI.delete(`/bengkel-produk/${id}`);
        await fetchProdukData();
        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting produk:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_produk: '',
      harga: '',
      foto_produk: '',
      jenis_layanan: 'semua_jenis_layanan',
      deskripsi: ''
    });
    setEditingProduk(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getJenisLayananLabel = (value) => {
    const option = jenisLayananOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getJenisLayananIcon = (jenis) => {
    const icons = {
      'semua_jenis_layanan': '🔧',
      'service_rutin': '⚙️',
      'perbaikan_mesin': '🔩',
      'ganti_ban': '🛞',
      'ganti_oli': '🛢️',
      'tune_up': '🔧',
      'service_berkala': '📅'
    };
    return icons[jenis] || '🔧';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Kelola Produk - {bengkelNama}
            </h3>
            <p className="text-sm text-gray-600">
              Tambah dan kelola produk/layanan untuk bengkel ini
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tambah Produk
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
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
                      Nama Produk/Layanan *
                    </label>
                    <input
                      type="text"
                      name="nama_produk"
                      value={formData.nama_produk}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Contoh: Service Rutin Motor Matic"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga *
                      </label>
                      <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Contoh: 75000"
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
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {jenisLayananOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ImageUpload
                    label="Foto Produk"
                    currentImage={formData.foto_produk}
                    onImageUploaded={(imageUrl) => {
                      setFormData(prev => ({
                        ...prev,
                        foto_produk: imageUrl || ''
                      }));
                    }}
                  />

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
                      placeholder="Deskripsi detail produk/layanan..."
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

          {/* Produk List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produkList.map((produk) => (
              <div key={produk.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getJenisLayananIcon(produk.jenis_layanan)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{produk.nama_produk}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getJenisLayananLabel(produk.jenis_layanan)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Harga:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(produk.harga)}
                    </span>
                  </div>

                  {produk.foto_produk && (
                    <div className="mt-3">
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

                  {produk.deskripsi && (
                    <p className="text-sm text-gray-600 line-clamp-3">{produk.deskripsi}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(produk)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(produk.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {produkList.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">Belum ada produk yang terdaftar</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Tambah produk pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BengkelProdukManagement;
