import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const LayananOpoWaeManagement = () => {
  const [layananOpoWae, setLayananOpoWae] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [formData, setFormData] = useState({
    nama_pilih_layanan: '',
    deskripsi: '',
    harga_per_jam: '',
    harga_per_hari: '',
    kategori: 'cleaning',
    minimal_durasi: '2'
  });

  useEffect(() => {
    fetchLayananOpoWae();
  }, []);

  const fetchLayananOpoWae = async () => {
    try {
      setLoading(true);
      // Fetch layanan opo wae untuk layanan opo wae (layananId = 3)
      const response = await authAPI.get('/getpilihlayanan');
      // Filter hanya untuk layanan opo wae (layananId = 3)
      const opoWaeServices = response.data?.filter(item => item.layananId === 3) || [];
      setLayananOpoWae(opoWaeServices);
    } catch (error) {
      console.error('Error fetching layanan opo wae:', error);
      // Fallback dengan data mock
      setLayananOpoWae([
        {
          id: 1,
          nama_pilih_layanan: 'Driver Pribadi',
          deskripsi: 'Jasa driver untuk keperluan pribadi atau bisnis',
          harga_per_jam: 25000,
          harga_per_hari: 150000,
          kategori: 'transport',
          minimal_durasi: 2,
          layananId: 3
        },
        {
          id: 2,
          nama_pilih_layanan: 'Cleaning Service',
          deskripsi: 'Jasa pembersihan rumah, kantor, atau gedung',
          harga_per_jam: 20000,
          harga_per_hari: 120000,
          kategori: 'cleaning',
          minimal_durasi: 3,
          layananId: 3
        },
        {
          id: 3,
          nama_pilih_layanan: 'Babysitter',
          deskripsi: 'Jasa pengasuhan anak profesional',
          harga_per_jam: 30000,
          harga_per_hari: 200000,
          kategori: 'childcare',
          minimal_durasi: 4,
          layananId: 3
        },
        {
          id: 4,
          nama_pilih_layanan: 'Tukang Listrik',
          deskripsi: 'Jasa perbaikan dan instalasi listrik',
          harga_per_jam: 50000,
          harga_per_hari: 300000,
          kategori: 'maintenance',
          minimal_durasi: 1,
          layananId: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        layananId: 3, // ID untuk layanan Opo Wae
        harga_per_jam: parseInt(formData.harga_per_jam),
        harga_per_hari: parseInt(formData.harga_per_hari),
        minimal_durasi: parseInt(formData.minimal_durasi)
      };

      if (editingLayanan) {
        await authAPI.put(`/pilihlayanan/${editingLayanan.id}`, submitData);
      } else {
        await authAPI.post('/pilihlayanan', submitData);
      }
      
      await fetchLayananOpoWae();
      resetForm();
    } catch (error) {
      console.error('Error saving layanan opo wae:', error);
      alert('Gagal menyimpan data layanan opo wae');
    }
  };

  const handleEdit = (layanan) => {
    setEditingLayanan(layanan);
    setFormData({
      nama_pilih_layanan: layanan.nama_pilih_layanan || '',
      deskripsi: layanan.deskripsi || '',
      harga_per_jam: layanan.harga_per_jam?.toString() || '',
      harga_per_hari: layanan.harga_per_hari?.toString() || '',
      kategori: layanan.kategori || 'cleaning',
      minimal_durasi: layanan.minimal_durasi?.toString() || '2'
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
      nama_pilih_layanan: '',
      deskripsi: '',
      harga_per_jam: '',
      harga_per_hari: '',
      kategori: 'cleaning',
      minimal_durasi: '2'
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

  const getKategoriIcon = (kategori) => {
    switch (kategori) {
      case 'cleaning': return '🧹';
      case 'transport': return '🚗';
      case 'childcare': return '👶';
      case 'maintenance': return '🔧';
      case 'cooking': return '👨‍🍳';
      case 'gardening': return '🌱';
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
                  name="nama_pilih_layanan"
                  value={formData.nama_pilih_layanan}
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
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="cleaning">🧹 Cleaning</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="childcare">👶 Childcare</option>
                  <option value="maintenance">🔧 Maintenance</option>
                  <option value="cooking">👨‍🍳 Cooking</option>
                  <option value="gardening">🌱 Gardening</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per Jam (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga_per_jam"
                    value={formData.harga_per_jam}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="25000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per Hari (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga_per_hari"
                    value={formData.harga_per_hari}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="150000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimal Durasi (jam)
                </label>
                <select
                  name="minimal_durasi"
                  value={formData.minimal_durasi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="1">1 jam</option>
                  <option value="2">2 jam</option>
                  <option value="3">3 jam</option>
                  <option value="4">4 jam</option>
                  <option value="8">8 jam (1 hari)</option>
                </select>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Deskripsi layanan opo wae..."
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
        {layananOpoWae.map((layanan) => (
          <div key={layanan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getKategoriIcon(layanan.kategori)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{layanan.nama_pilih_layanan}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKategoriBadgeColor(layanan.kategori)}`}>
                    {layanan.kategori?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{layanan.deskripsi}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Per Jam:</span>
                <span className="text-sm font-medium text-purple-600">
                  {formatCurrency(layanan.harga_per_jam)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Per Hari:</span>
                <span className="text-sm font-medium text-purple-600">
                  {formatCurrency(layanan.harga_per_hari)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Min. Durasi:</span>
                <span className="text-sm text-gray-900">{layanan.minimal_durasi} jam</span>
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
        ))}
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
