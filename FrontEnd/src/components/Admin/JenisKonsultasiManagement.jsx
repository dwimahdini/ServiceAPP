import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const JenisKonsultasiManagement = () => {
  const [jenisKonsultasi, setJenisKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJenis, setEditingJenis] = useState(null);
  const [formData, setFormData] = useState({
    nama_pilih_layanan: '',
    deskripsi: '',
    harga_dasar: '',
    tipe_konsultasi: 'online'
  });

  useEffect(() => {
    fetchJenisKonsultasi();
  }, []);

  const fetchJenisKonsultasi = async () => {
    try {
      setLoading(true);
      // Fetch jenis konsultasi untuk layanan psikologi
      const response = await authAPI.get('/getpilihlayanan');
      // Filter hanya untuk layanan psikologi (layananId = 1)
      const psikologiServices = response.data?.filter(item => item.layananId === 1) || [];
      setJenisKonsultasi(psikologiServices);
    } catch (error) {
      console.error('Error fetching jenis konsultasi:', error);
      // Fallback dengan data mock
      setJenisKonsultasi([
        {
          id: 1,
          nama_pilih_layanan: 'Konsultasi Online',
          deskripsi: 'Konsultasi melalui video call atau chat',
          harga_dasar: 100000,
          tipe_konsultasi: 'online',
          layananId: 1
        },
        {
          id: 2,
          nama_pilih_layanan: 'Konsultasi Offline',
          deskripsi: 'Konsultasi tatap muka di klinik',
          harga_dasar: 150000,
          tipe_konsultasi: 'offline',
          layananId: 1
        },
        {
          id: 3,
          nama_pilih_layanan: 'Home Visit',
          deskripsi: 'Konsultasi di rumah pasien',
          harga_dasar: 250000,
          tipe_konsultasi: 'home_visit',
          layananId: 1
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
        layananId: 1, // ID untuk layanan Psikologi
        harga_dasar: parseInt(formData.harga_dasar)
      };

      if (editingJenis) {
        await authAPI.put(`/pilihlayanan/${editingJenis.id}`, submitData);
      } else {
        await authAPI.post('/pilihlayanan', submitData);
      }
      
      await fetchJenisKonsultasi();
      resetForm();
    } catch (error) {
      console.error('Error saving jenis konsultasi:', error);
      alert('Gagal menyimpan data jenis konsultasi');
    }
  };

  const handleEdit = (jenis) => {
    setEditingJenis(jenis);
    setFormData({
      nama_pilih_layanan: jenis.nama_pilih_layanan || '',
      deskripsi: jenis.deskripsi || '',
      harga_dasar: jenis.harga_dasar?.toString() || '',
      tipe_konsultasi: jenis.tipe_konsultasi || 'online'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jenis konsultasi ini?')) {
      try {
        await authAPI.delete(`/pilihlayanan/${id}`);
        await fetchJenisKonsultasi();
      } catch (error) {
        console.error('Error deleting jenis konsultasi:', error);
        alert('Gagal menghapus jenis konsultasi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_pilih_layanan: '',
      deskripsi: '',
      harga_dasar: '',
      tipe_konsultasi: 'online'
    });
    setEditingJenis(null);
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

  const getTipeIcon = (tipe) => {
    switch (tipe) {
      case 'online': return '💻';
      case 'offline': return '🏥';
      case 'home_visit': return '🏠';
      default: return '💬';
    }
  };

  const getTipeBadgeColor = (tipe) => {
    switch (tipe) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-green-100 text-green-800';
      case 'home_visit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kelola Jenis Konsultasi</h3>
          <p className="text-sm text-gray-600">Atur jenis konsultasi yang tersedia (Online, Offline, Home Visit)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Jenis Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingJenis ? 'Edit Jenis Konsultasi' : 'Tambah Jenis Konsultasi Baru'}
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
                  Nama Jenis Konsultasi
                </label>
                <input
                  type="text"
                  name="nama_pilih_layanan"
                  value={formData.nama_pilih_layanan}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Konsultasi Online"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Konsultasi
                </label>
                <select
                  name="tipe_konsultasi"
                  value={formData.tipe_konsultasi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="online">💻 Online</option>
                  <option value="offline">🏥 Offline</option>
                  <option value="home_visit">🏠 Home Visit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Dasar (Rp)
                </label>
                <input
                  type="number"
                  name="harga_dasar"
                  value={formData.harga_dasar}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100000"
                  required
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi jenis konsultasi..."
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingJenis ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Jenis Konsultasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jenisKonsultasi.map((jenis) => (
          <div key={jenis.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTipeIcon(jenis.tipe_konsultasi)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{jenis.nama_pilih_layanan}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipeBadgeColor(jenis.tipe_konsultasi)}`}>
                    {jenis.tipe_konsultasi?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{jenis.deskripsi}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium text-green-600">
                {formatCurrency(jenis.harga_dasar)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(jenis)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(jenis.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jenisKonsultasi.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada jenis konsultasi yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Tambah jenis konsultasi pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default JenisKonsultasiManagement;
