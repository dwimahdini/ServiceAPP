import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const MerekKendaraanManagement = () => {
  const [merekKendaraan, setMerekKendaraan] = useState([]);
  const [layananBengkel, setLayananBengkel] = useState([]);
  const [produkBengkel, setProdukBengkel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMerek, setEditingMerek] = useState(null);
  const [formData, setFormData] = useState({
    nama_produk_merek: '',
    pilihlayananId: '',
    produkId: '',
    produkdetailId: '',
    jenis_kendaraan: 'motor',
    deskripsi: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch semua data yang diperlukan
      const [merekResponse, layananResponse, produkResponse] = await Promise.all([
        authAPI.get('/getprodukmerek'),
        authAPI.get('/getpilihlayanan'),
        authAPI.get('/getproduk')
      ]);
      
      // Filter untuk layanan bengkel (layananId = 2)
      const bengkelMereks = merekResponse.data?.filter(item => item.layananId === 2) || [];
      setMerekKendaraan(bengkelMereks);
      
      const bengkelServices = layananResponse.data?.filter(item => item.layananId === 2) || [];
      setLayananBengkel(bengkelServices);
      
      const bengkelProducts = produkResponse.data?.filter(item => item.layananId === 2) || [];
      setProdukBengkel(bengkelProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dengan data mock
      setMerekKendaraan([
        {
          id: 1,
          nama_produk_merek: 'Honda',
          pilihlayananId: 1,
          produkId: 1,
          layanan_nama: 'Service Berkala',
          produk_nama: 'Oli Mesin',
          jenis_kendaraan: 'motor',
          deskripsi: 'Merek Honda untuk semua jenis motor Honda',
          layananId: 2
        },
        {
          id: 2,
          nama_produk_merek: 'Yamaha',
          pilihlayananId: 1,
          produkId: 1,
          layanan_nama: 'Service Berkala',
          produk_nama: 'Oli Mesin',
          jenis_kendaraan: 'motor',
          deskripsi: 'Merek Yamaha untuk semua jenis motor Yamaha',
          layananId: 2
        },
        {
          id: 3,
          nama_produk_merek: 'Toyota',
          pilihlayananId: 2,
          produkId: 2,
          layanan_nama: 'Ganti Oli',
          produk_nama: 'Oli Mobil',
          jenis_kendaraan: 'mobil',
          deskripsi: 'Merek Toyota untuk semua jenis mobil Toyota',
          layananId: 2
        }
      ]);
      
      setLayananBengkel([
        { id: 1, nama_pilih_layanan: 'Service Berkala' },
        { id: 2, nama_pilih_layanan: 'Ganti Oli' }
      ]);
      
      setProdukBengkel([
        { id: 1, nama_produk: 'Oli Mesin' },
        { id: 2, nama_produk: 'Oli Mobil' }
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
        pilihlayananId: parseInt(formData.pilihlayananId),
        produkId: parseInt(formData.produkId),
        produkdetailId: parseInt(formData.produkdetailId) || 1 // Default jika tidak ada
      };

      if (editingMerek) {
        await authAPI.put(`/produkmerek/${editingMerek.id}`, submitData);
      } else {
        await authAPI.post('/tambahprodukmerek', submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving merek kendaraan:', error);
      alert('Gagal menyimpan data merek kendaraan');
    }
  };

  const handleEdit = (merek) => {
    setEditingMerek(merek);
    setFormData({
      nama_produk_merek: merek.nama_produk_merek || '',
      pilihlayananId: merek.pilihlayananId?.toString() || '',
      produkId: merek.produkId?.toString() || '',
      produkdetailId: merek.produkdetailId?.toString() || '',
      jenis_kendaraan: merek.jenis_kendaraan || 'motor',
      deskripsi: merek.deskripsi || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus merek kendaraan ini?')) {
      try {
        await authAPI.delete(`/produkmerek/${id}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting merek:', error);
        alert('Gagal menghapus merek kendaraan');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_produk_merek: '',
      pilihlayananId: '',
      produkId: '',
      produkdetailId: '',
      jenis_kendaraan: 'motor',
      deskripsi: ''
    });
    setEditingMerek(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getJenisIcon = (jenis) => {
    switch (jenis) {
      case 'motor': return '🏍️';
      case 'mobil': return '🚗';
      case 'truk': return '🚛';
      default: return '🚗';
    }
  };

  const getJenisBadgeColor = (jenis) => {
    switch (jenis) {
      case 'motor': return 'bg-blue-100 text-blue-800';
      case 'mobil': return 'bg-green-100 text-green-800';
      case 'truk': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMerekIcon = (merek) => {
    const merekLower = merek.toLowerCase();
    if (merekLower.includes('honda')) return '🔴';
    if (merekLower.includes('yamaha')) return '🔵';
    if (merekLower.includes('toyota')) return '⚪';
    if (merekLower.includes('suzuki')) return '🟡';
    return '⚫';
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Merek Kendaraan</h3>
          <p className="text-sm text-gray-600">Honda, Yamaha, Toyota, Suzuki, dan merek kendaraan lainnya</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Tambah Merek Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingMerek ? 'Edit Merek Kendaraan' : 'Tambah Merek Kendaraan Baru'}
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
                  Nama Merek
                </label>
                <input
                  type="text"
                  name="nama_produk_merek"
                  value={formData.nama_produk_merek}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Honda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kendaraan
                </label>
                <select
                  name="jenis_kendaraan"
                  value={formData.jenis_kendaraan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="motor">🏍️ Motor</option>
                  <option value="mobil">🚗 Mobil</option>
                  <option value="truk">🚛 Truk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layanan Terkait
                </label>
                <select
                  name="pilihlayananId"
                  value={formData.pilihlayananId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih Layanan</option>
                  {layananBengkel.map((layanan) => (
                    <option key={layanan.id} value={layanan.id}>
                      {layanan.nama_pilih_layanan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk Terkait
                </label>
                <select
                  name="produkId"
                  value={formData.produkId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih Produk</option>
                  {produkBengkel.map((produk) => (
                    <option key={produk.id} value={produk.id}>
                      {produk.nama_produk}
                    </option>
                  ))}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi merek kendaraan..."
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
                  {editingMerek ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Merek Kendaraan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merekKendaraan.map((merek) => (
          <div key={merek.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">{getMerekIcon(merek.nama_produk_merek)}</span>
                  <span className="text-2xl">{getJenisIcon(merek.jenis_kendaraan)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{merek.nama_produk_merek}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisBadgeColor(merek.jenis_kendaraan)}`}>
                    {merek.jenis_kendaraan?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Layanan:</span> {merek.layanan_nama || `ID: ${merek.pilihlayananId}`}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Produk:</span> {merek.produk_nama || `ID: ${merek.produkId}`}
              </div>
              {merek.deskripsi && (
                <p className="text-sm text-gray-600">{merek.deskripsi}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(merek)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(merek.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {merekKendaraan.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada merek kendaraan yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-green-600 hover:text-green-800"
          >
            Tambah merek kendaraan pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default MerekKendaraanManagement;
