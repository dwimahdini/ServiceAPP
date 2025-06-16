import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const PekerjaManagement = () => {
  const [pekerja, setPekerja] = useState([]);
  const [layananOpoWae, setLayananOpoWae] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPekerja, setEditingPekerja] = useState(null);
  const [formData, setFormData] = useState({
    nama_pekerja: '',
    pilihlayananId: '',
    keahlian: '',
    pengalaman: '',
    rating: '5',
    telepon: '',
    alamat: '',
    foto_url: '',
    status: 'tersedia'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch pekerja dan layanan opo wae
      // Menggunakan endpoint dokter untuk menyimpan data pekerja
      const [pekerjaResponse, layananResponse] = await Promise.all([
        authAPI.get('/getpilihdokterpsikolog'),
        authAPI.get('/getpilihlayanan')
      ]);
      
      // Filter pekerja untuk layanan opo wae (layananId = 3)
      const opoWaeWorkers = pekerjaResponse.data?.filter(item => item.layananId === 3) || [];
      setPekerja(opoWaeWorkers);
      
      // Filter layanan opo wae
      const opoWaeServices = layananResponse.data?.filter(item => item.layananId === 3) || [];
      setLayananOpoWae(opoWaeServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dengan data mock
      setPekerja([
        {
          id: 1,
          pilih_dokter_psikolog: 'Budi Santoso',
          nama_pekerja: 'Budi Santoso',
          pilihlayananId: 1,
          layanan_nama: 'Driver Pribadi',
          keahlian: 'Mengemudi mobil dan motor, mengenal rute Jakarta',
          pengalaman: '5 tahun',
          rating: 4.8,
          telepon: '081234567890',
          alamat: 'Jakarta Selatan',
          foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          status: 'tersedia',
          layananId: 3
        },
        {
          id: 2,
          pilih_dokter_psikolog: 'Sari Wulandari',
          nama_pekerja: 'Sari Wulandari',
          pilihlayananId: 2,
          layanan_nama: 'Cleaning Service',
          keahlian: 'Pembersihan rumah, kantor, deep cleaning',
          pengalaman: '3 tahun',
          rating: 4.9,
          telepon: '081234567891',
          alamat: 'Jakarta Timur',
          foto_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
          status: 'tersedia',
          layananId: 3
        },
        {
          id: 3,
          pilih_dokter_psikolog: 'Maya Indah',
          nama_pekerja: 'Maya Indah',
          pilihlayananId: 3,
          layanan_nama: 'Babysitter',
          keahlian: 'Pengasuhan anak, pendidikan anak usia dini',
          pengalaman: '7 tahun',
          rating: 5.0,
          telepon: '081234567892',
          alamat: 'Jakarta Barat',
          foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
          status: 'tersedia',
          layananId: 3
        }
      ]);
      
      setLayananOpoWae([
        { id: 1, nama_pilih_layanan: 'Driver Pribadi' },
        { id: 2, nama_pilih_layanan: 'Cleaning Service' },
        { id: 3, nama_pilih_layanan: 'Babysitter' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        pilih_dokter_psikolog: formData.nama_pekerja,
        layananId: 3, // ID untuk layanan Opo Wae
        ...formData,
        rating: parseFloat(formData.rating)
      };

      if (editingPekerja) {
        await authAPI.put(`/dokterpsikolog/${editingPekerja.id}`, submitData);
      } else {
        await authAPI.post('/tambahpilihdokterpsikolog', submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving pekerja:', error);
      alert('Gagal menyimpan data pekerja');
    }
  };

  const handleEdit = (worker) => {
    setEditingPekerja(worker);
    setFormData({
      nama_pekerja: worker.pilih_dokter_psikolog || worker.nama_pekerja || '',
      pilihlayananId: worker.pilihlayananId?.toString() || '',
      keahlian: worker.keahlian || '',
      pengalaman: worker.pengalaman || '',
      rating: worker.rating?.toString() || '5',
      telepon: worker.telepon || '',
      alamat: worker.alamat || '',
      foto_url: worker.foto_url || '',
      status: worker.status || 'tersedia'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pekerja ini?')) {
      try {
        await authAPI.delete(`/dokterpsikolog/${id}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting pekerja:', error);
        alert('Gagal menghapus pekerja');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_pekerja: '',
      pilihlayananId: '',
      keahlian: '',
      pengalaman: '',
      rating: '5',
      telepon: '',
      alamat: '',
      foto_url: '',
      status: 'tersedia'
    });
    setEditingPekerja(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'tersedia': return 'bg-green-100 text-green-800';
      case 'sibuk': return 'bg-yellow-100 text-yellow-800';
      case 'tidak_aktif': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Pekerja/Provider</h3>
          <p className="text-sm text-gray-600">Data pekerja untuk setiap layanan opo wae</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tambah Pekerja Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingPekerja ? 'Edit Pekerja' : 'Tambah Pekerja Baru'}
              </h4>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pekerja
                  </label>
                  <input
                    type="text"
                    name="nama_pekerja"
                    value={formData.nama_pekerja}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Budi Santoso"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layanan
                  </label>
                  <select
                    name="pilihlayananId"
                    value={formData.pilihlayananId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Pilih Layanan</option>
                    {layananOpoWae.map((layanan) => (
                      <option key={layanan.id} value={layanan.id}>
                        {layanan.nama_pilih_layanan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keahlian
                </label>
                <textarea
                  name="keahlian"
                  value={formData.keahlian}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Deskripsi keahlian dan kemampuan..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pengalaman
                  </label>
                  <input
                    type="text"
                    name="pengalaman"
                    value={formData.pengalaman}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="5 tahun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="5">5.0 ⭐⭐⭐⭐⭐</option>
                    <option value="4.5">4.5 ⭐⭐⭐⭐⭐</option>
                    <option value="4">4.0 ⭐⭐⭐⭐</option>
                    <option value="3.5">3.5 ⭐⭐⭐⭐</option>
                    <option value="3">3.0 ⭐⭐⭐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="sibuk">Sibuk</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="081234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Jakarta Selatan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Foto
                </label>
                <input
                  type="url"
                  name="foto_url"
                  value={formData.foto_url}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/foto.jpg"
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
                  {editingPekerja ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Pekerja */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pekerja.map((worker) => (
          <div key={worker.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={worker.foto_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                alt={worker.pilih_dokter_psikolog || worker.nama_pekerja}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{worker.pilih_dokter_psikolog || worker.nama_pekerja}</h4>
                <p className="text-sm text-purple-600">{worker.layanan_nama || `Layanan ID: ${worker.pilihlayananId}`}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm">{getRatingStars(worker.rating || 5)}</span>
                  <span className="text-sm text-gray-500">({worker.rating || 5})</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {worker.keahlian && (
                <p className="text-sm text-gray-600">{worker.keahlian}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pengalaman:</span>
                <span className="text-sm text-gray-900">{worker.pengalaman || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Telepon:</span>
                <span className="text-sm text-gray-900">{worker.telepon || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(worker.status)}`}>
                  {worker.status?.replace('_', ' ').toUpperCase() || 'TERSEDIA'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(worker)}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(worker.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {pekerja.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada pekerja yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-purple-600 hover:text-purple-800"
          >
            Tambah pekerja pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default PekerjaManagement;
