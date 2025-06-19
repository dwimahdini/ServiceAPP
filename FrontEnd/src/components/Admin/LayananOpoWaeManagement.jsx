import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const LayananOpoWaeManagement = () => {
  const [layananOpoWae, setLayananOpoWae] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [formData, setFormData] = useState({
    nama_pilihan: '',
    harga: ''
  });

  useEffect(() => {
    fetchLayananOpoWae();
  }, []);

  const fetchLayananOpoWae = async () => {
    try {
      setLoading(true);
      // Fetch layanan opo wae untuk layanan opo wae (layananId = 3)
      const response = await authAPI.get('/getpilihlayanan');
      console.log('Response data:', response.data);

      // Ambil data dari response.data.data (sesuai struktur response endpoint)
      const allServices = response.data?.data || [];
      // Filter hanya untuk layanan opo wae (layananId = 3)
      const opoWaeServices = allServices.filter(item => item.layananId === 3);
      setLayananOpoWae(opoWaeServices);
    } catch (error) {
      console.error('Error fetching layanan opo wae:', error);
      // NO FALLBACK DATA - hanya tampilkan data dari database
      setLayananOpoWae([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        nama_pilihan: formData.nama_pilihan,
        harga: parseFloat(formData.harga),
        layananId: 3 // ID untuk layanan Opo Wae
      };

      console.log('Submitting data:', submitData);

      if (editingLayanan) {
        await authAPI.put(`/pilihlayanan/${editingLayanan.id}`, submitData);
      } else {
        await authAPI.post('/pilihlayanan', submitData);
      }

      await fetchLayananOpoWae();
      resetForm();
      alert('Data berhasil disimpan!');
    } catch (error) {
      console.error('Error saving layanan opo wae:', error);
      alert('Gagal menyimpan data layanan opo wae: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (layanan) => {
    setEditingLayanan(layanan);
    setFormData({
      nama_pilihan: layanan.nama_pilihan || '',
      harga: layanan.harga?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus layanan opo wae ini?')) {
      try {
        await authAPI.delete(`/pilihlayanan/${id}`);
        await fetchLayananOpoWae();
      } catch (error) {
        console.error('Error deleting layanan opo wae:', error);
        alert('Gagal menghapus layanan opo wae');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_pilihan: '',
      harga: ''
    });
    setEditingLayanan(null);
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

  // Infer category from service name (same logic as in opoWaeService)
  const inferCategoryFromName = (nama) => {
    const name = nama.toLowerCase();
    if (name.includes('driver') || name.includes('ojek') || name.includes('transport')) {
      return 'transport';
    } else if (name.includes('cleaning') || name.includes('bersih') || name.includes('laundry')) {
      return 'cleaning';
    } else if (name.includes('baby') || name.includes('anak') || name.includes('pengasuh')) {
      return 'childcare';
    } else if (name.includes('tukang') || name.includes('perbaikan') || name.includes('maintenance')) {
      return 'maintenance';
    } else if (name.includes('pijat') || name.includes('spa') || name.includes('massage')) {
      return 'massage';
    } else if (name.includes('masak') || name.includes('catering') || name.includes('cook')) {
      return 'cooking';
    } else if (name.includes('taman') || name.includes('kebun') || name.includes('garden')) {
      return 'gardening';
    }
    return 'other';
  };

  const getKategoriIcon = (kategori) => {
    switch (kategori) {
      case 'cleaning': return '🧹';
      case 'transport': return '🚗';
      case 'childcare': return '👶';
      case 'maintenance': return '🔧';
      case 'cooking': return '👨‍🍳';
      case 'gardening': return '🌱';
      case 'massage': return '💆';
      case 'other': return '🏠';
      default: return '🏠';
    }
  };

  const getKategoriBadgeColor = (kategori) => {
    switch (kategori) {
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      case 'transport': return 'bg-green-100 text-green-800';
      case 'childcare': return 'bg-pink-100 text-pink-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cooking': return 'bg-yellow-100 text-yellow-800';
      case 'gardening': return 'bg-emerald-100 text-emerald-800';
      case 'massage': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kelola Jenis Layanan Opo Wae</h3>
          <p className="text-sm text-gray-600">Driver, cleaner, babysitter, tukang, dan layanan harian lainnya</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tambah Layanan Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingLayanan ? 'Edit Layanan Opo Wae' : 'Tambah Layanan Opo Wae Baru'}
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
                  Nama Layanan
                </label>
                <input
                  type="text"
                  name="nama_pilihan"
                  value={formData.nama_pilihan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Driver Pribadi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-600">
                  Kategori akan otomatis ditentukan berdasarkan nama layanan
                </div>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="25000"
                  required
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingLayanan ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Layanan Opo Wae */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layananOpoWae.map((layanan) => {
          const inferredCategory = inferCategoryFromName(layanan.nama_pilihan);
          return (
            <div key={layanan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getKategoriIcon(inferredCategory)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{layanan.nama_pilihan}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKategoriBadgeColor(inferredCategory)}`}>
                      {inferredCategory?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="text-lg font-medium text-purple-600">
                {formatCurrency(layanan.harga)}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(layanan)}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(layanan.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {layananOpoWae.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada layanan opo wae yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-purple-600 hover:text-purple-800"
          >
            Tambah layanan opo wae pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default LayananOpoWaeManagement;
