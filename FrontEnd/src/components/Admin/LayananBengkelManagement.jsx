import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const LayananBengkelManagement = () => {
  const [layananBengkel, setLayananBengkel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [formData, setFormData] = useState({
    nama_pilih_layanan: '',
    deskripsi: '',
    harga: '',
    estimasi_waktu: '',
    kategori: 'service'
  });

  useEffect(() => {
    fetchLayananBengkel();
  }, []);

  const fetchLayananBengkel = async () => {
    try {
      setLoading(true);
      // Fetch layanan bengkel untuk layanan bengkel (layananId = 2)
      const response = await authAPI.get('/getpilihlayanan');
      // Filter hanya untuk layanan bengkel (layananId = 2)
      const bengkelServices = response.data?.filter(item => item.layananId === 2) || [];
      setLayananBengkel(bengkelServices);
    } catch (error) {
      console.error('Error fetching layanan bengkel:', error);
      // Fallback dengan data mock
      setLayananBengkel([
        {
          id: 1,
          nama_pilih_layanan: 'Service Berkala',
          deskripsi: 'Service rutin setiap 3000-5000 km',
          harga: 75000,
          estimasi_waktu: '2-3 jam',
          kategori: 'service',
          layananId: 2
        },
        {
          id: 2,
          nama_pilih_layanan: 'Ganti Oli',
          deskripsi: 'Penggantian oli mesin dan filter oli',
          harga: 50000,
          estimasi_waktu: '30 menit',
          kategori: 'service',
          layananId: 2
        },
        {
          id: 3,
          nama_pilih_layanan: 'Tune Up',
          deskripsi: 'Penyetelan mesin untuk performa optimal',
          harga: 150000,
          estimasi_waktu: '3-4 jam',
          kategori: 'perbaikan',
          layananId: 2
        },
        {
          id: 4,
          nama_pilih_layanan: 'Ganti Ban',
          deskripsi: 'Penggantian ban motor/mobil',
          harga: 200000,
          estimasi_waktu: '1 jam',
          kategori: 'spare_part',
          layananId: 2
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
        layananId: 2, // ID untuk layanan Bengkel
        harga: parseInt(formData.harga)
      };

      if (editingLayanan) {
        await authAPI.put(`/pilihlayanan/${editingLayanan.id}`, submitData);
      } else {
        await authAPI.post('/pilihlayanan', submitData);
      }
      
      await fetchLayananBengkel();
      resetForm();
    } catch (error) {
      console.error('Error saving layanan bengkel:', error);
      alert('Gagal menyimpan data layanan bengkel');
    }
  };

  const handleEdit = (layanan) => {
    setEditingLayanan(layanan);
    setFormData({
      nama_pilih_layanan: layanan.nama_pilih_layanan || '',
      deskripsi: layanan.deskripsi || '',
      harga: layanan.harga?.toString() || '',
      estimasi_waktu: layanan.estimasi_waktu || '',
      kategori: layanan.kategori || 'service'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus layanan bengkel ini?')) {
      try {
        await authAPI.delete(`/pilihlayanan/${id}`);
        await fetchLayananBengkel();
      } catch (error) {
        console.error('Error deleting layanan bengkel:', error);
        alert('Gagal menghapus layanan bengkel');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_pilih_layanan: '',
      deskripsi: '',
      harga: '',
      estimasi_waktu: '',
      kategori: 'service'
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
      case 'service': return '🔧';
      case 'perbaikan': return '⚙️';
      case 'spare_part': return '🔩';
      default: return '🛠️';
    }
  };

  const getKategoriBadgeColor = (kategori) => {
    switch (kategori) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'perbaikan': return 'bg-orange-100 text-orange-800';
      case 'spare_part': return 'bg-green-100 text-green-800';
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Jenis Layanan Bengkel</h3>
          <p className="text-sm text-gray-600">Service berkala, ganti oli, perbaikan, dan layanan bengkel lainnya</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Tambah Layanan Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingLayanan ? 'Edit Layanan Bengkel' : 'Tambah Layanan Bengkel Baru'}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Service Berkala"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="service">🔧 Service</option>
                  <option value="perbaikan">⚙️ Perbaikan</option>
                  <option value="spare_part">🔩 Spare Part</option>
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
                  placeholder="75000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimasi Waktu
                </label>
                <input
                  type="text"
                  name="estimasi_waktu"
                  value={formData.estimasi_waktu}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="2-3 jam"
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
                  placeholder="Deskripsi layanan bengkel..."
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
                  {editingLayanan ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Layanan Bengkel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layananBengkel.map((layanan) => (
          <div key={layanan.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getKategoriIcon(layanan.kategori)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{layanan.nama_pilih_layanan}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKategoriBadgeColor(layanan.kategori)}`}>
                    {layanan.kategori?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{layanan.deskripsi}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Harga:</span>
                <span className="text-lg font-medium text-green-600">
                  {formatCurrency(layanan.harga)}
                </span>
              </div>
              {layanan.estimasi_waktu && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estimasi:</span>
                  <span className="text-sm text-gray-900">{layanan.estimasi_waktu}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(layanan)}
                className="text-green-600 hover:text-green-800 text-sm"
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

      {layananBengkel.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada layanan bengkel yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-green-600 hover:text-green-800"
          >
            Tambah layanan bengkel pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default LayananBengkelManagement;
