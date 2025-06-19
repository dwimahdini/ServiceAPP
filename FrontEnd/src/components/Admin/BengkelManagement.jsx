import React, { useState, useEffect } from 'react';
import { bengkelService } from '../../services/bengkelService';
import BengkelDetailModal from './BengkelDetailModal';

const BengkelManagement = () => {
  const [bengkelList, setBengkelList] = useState([]);
  const [filteredBengkelList, setFilteredBengkelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBengkel, setEditingBengkel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBengkel, setSelectedBengkel] = useState(null);
  const [filterJenis, setFilterJenis] = useState('semua');
  const [testingConnection, setTestingConnection] = useState(false);
  const [formData, setFormData] = useState({
    nama_bengkel: '',
    alamat: '',
    telepon: '',
    jam_buka: '',
    jam_tutup: '',
    jenis_kendaraan: 'motor',
    rating: 4.0,
    deskripsi: '',
    layanan_tersedia: '',
    koordinat_lat: '',
    koordinat_lng: ''
  });

  useEffect(() => {
    fetchBengkelData();
  }, []);

  useEffect(() => {
    filterBengkelData();
  }, [bengkelList, filterJenis]);

  const filterBengkelData = () => {
    if (filterJenis === 'semua') {
      setFilteredBengkelList(bengkelList);
    } else {
      const filtered = bengkelList.filter(bengkel => bengkel.jenis_kendaraan === filterJenis);
      setFilteredBengkelList(filtered);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestingConnection(true);
      const result = await bengkelService.testConnection();
      alert(`Test koneksi berhasil!\n\nResponse: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Test connection failed:', error);
      alert(`Test koneksi gagal!\n\nError: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const fetchBengkelData = async () => {
    try {
      setLoading(true);
      console.log('Fetching bengkel data...');

      const result = await bengkelService.getAllBengkel();
      console.log('Bengkel service result:', result);

      if (result.success) {
        setBengkelList(result.data || []);
      } else {
        setBengkelList([]);
      }
    } catch (error) {
      console.error('Error fetching bengkel data:', error);
      console.error('Error details:', error.response?.data);

      // Fallback dengan mock data jika API gagal
      setBengkelList([
        {
          id: 1,
          nama_bengkel: 'Bengkel Motor Jaya',
          alamat: 'Jl. Rungkut Raya No. 123, Surabaya',
          telepon: '031-8765432',
          jam_buka: '08:00:00',
          jam_tutup: '17:00:00',
          jenis_kendaraan: 'motor',
          rating: 4.5,
          status: 'aktif',
          deskripsi: 'Bengkel motor terpercaya dengan teknisi berpengalaman',
          layanan_tersedia: 'Service Rutin, Ganti Oli, Tune Up',
          koordinat_lat: '-7.2575',
          koordinat_lng: '112.7521'
        },
        {
          id: 2,
          nama_bengkel: 'Auto Service Center',
          alamat: 'Jl. Raya Darmo No. 456, Surabaya',
          telepon: '031-7654321',
          jam_buka: '08:00:00',
          jam_tutup: '17:00:00',
          jenis_kendaraan: 'mobil',
          rating: 4.6,
          status: 'aktif',
          deskripsi: 'Layanan service mobil lengkap dan profesional',
          layanan_tersedia: 'Service Berkala, Tune Up, AC Service',
          koordinat_lat: '-7.2575',
          koordinat_lng: '112.7521'
        }
      ]);

      // Show error message to user
      alert('Gagal memuat data bengkel. Menggunakan data contoh.');
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
      let result;
      if (editingBengkel) {
        result = await bengkelService.updateBengkel(editingBengkel.id, formData);
      } else {
        result = await bengkelService.createBengkel(formData);
      }

      console.log('Save result:', result);
      await fetchBengkelData();
      resetForm();
      alert(result.message || (editingBengkel ? 'Data bengkel berhasil diupdate!' : 'Data bengkel berhasil disimpan!'));
    } catch (error) {
      console.error('Error saving bengkel:', error);
      console.error('Error details:', error.response?.data);

      // Tampilkan pesan error yang lebih spesifik
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menyimpan data bengkel';
      alert(errorMessage);
    }
  };

  const handleEdit = (bengkel) => {
    setEditingBengkel(bengkel);
    setFormData({
      nama_bengkel: bengkel.nama_bengkel || '',
      alamat: bengkel.alamat || '',
      telepon: bengkel.telepon || '',
      jam_buka: bengkel.jam_buka || '',
      jam_tutup: bengkel.jam_tutup || '',
      jenis_kendaraan: bengkel.jenis_kendaraan || 'motor',
      rating: bengkel.rating || 4.0,
      deskripsi: bengkel.deskripsi || '',
      layanan_tersedia: bengkel.layanan_tersedia || '',
      koordinat_lat: bengkel.koordinat_lat || '',
      koordinat_lng: bengkel.koordinat_lng || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus bengkel ini?')) {
      try {
        const result = await bengkelService.deleteBengkel(id);
        await fetchBengkelData();
        alert(result.message || 'Bengkel berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting bengkel:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Gagal menghapus bengkel';
        alert(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_bengkel: '',
      alamat: '',
      telepon: '',
      jam_buka: '',
      jam_tutup: '',
      jenis_kendaraan: 'motor',
      rating: 4.0,
      deskripsi: '',
      layanan_tersedia: '',
      koordinat_lat: '',
      koordinat_lng: ''
    });
    setEditingBengkel(null);
    setShowForm(false);
  };

  const handleDetailProduk = (bengkel) => {
    setSelectedBengkel(bengkel);
    setShowDetailModal(true);
  };

  const getJenisIcon = (jenis) => {
    return jenis === 'motor' ? '🏍️' : '🚗';
  };

  const getJenisBadgeColor = (jenis) => {
    return jenis === 'motor'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'aktif'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kelola Data Bengkel</h3>
          <p className="text-sm text-gray-600">Tambah dan kelola informasi bengkel yang akan ditampilkan kepada pengguna</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="semua">Semua Jenis</option>
            <option value="motor">Motor</option>
            <option value="mobil">Mobil</option>
          </select>
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {testingConnection ? 'Testing...' : 'Test Koneksi'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Tambah Bengkel Baru
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">🏪</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Bengkel</p>
              <p className="text-lg font-semibold text-gray-900">{bengkelList.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">🏍️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Bengkel Motor</p>
              <p className="text-lg font-semibold text-gray-900">{bengkelList.filter(b => b.jenis_kendaraan === 'motor').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">🚗</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Bengkel Mobil</p>
              <p className="text-lg font-semibold text-gray-900">{bengkelList.filter(b => b.jenis_kendaraan === 'mobil').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">⭐</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rating Rata-rata</p>
              <p className="text-lg font-semibold text-gray-900">
                {bengkelList.length > 0 ? (bengkelList.reduce((sum, b) => sum + (parseFloat(b.rating) || 0), 0) / bengkelList.length).toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {editingBengkel ? 'Edit Bengkel' : 'Tambah Bengkel Baru'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Bengkel *
                  </label>
                  <input
                    type="text"
                    name="nama_bengkel"
                    value={formData.nama_bengkel}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: Bengkel Motor Jaya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Kendaraan *
                  </label>
                  <select
                    name="jenis_kendaraan"
                    value={formData.jenis_kendaraan}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="motor">Motor</option>
                    <option value="mobil">Mobil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Jl. Rungkut Raya No. 123, Surabaya"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: 031-8765432"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jam Buka *
                  </label>
                  <input
                    type="time"
                    name="jam_buka"
                    value={formData.jam_buka}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jam Tutup *
                  </label>
                  <input
                    type="time"
                    name="jam_tutup"
                    value={formData.jam_tutup}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layanan Tersedia
                  </label>
                  <input
                    type="text"
                    name="layanan_tersedia"
                    value={formData.layanan_tersedia}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Service Rutin, Ganti Oli, Tune Up"
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
                  placeholder="Deskripsi bengkel..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Koordinat Latitude
                  </label>
                  <input
                    type="text"
                    name="koordinat_lat"
                    value={formData.koordinat_lat}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="-7.2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Koordinat Longitude
                  </label>
                  <input
                    type="text"
                    name="koordinat_lng"
                    value={formData.koordinat_lng}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="112.7500"
                  />
                </div>
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
                  {editingBengkel ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bengkel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBengkelList.map((bengkel) => (
          <div key={bengkel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">{getJenisIcon(bengkel.jenis_kendaraan)}</span>
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{bengkel.nama_bengkel}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisBadgeColor(bengkel.jenis_kendaraan)}`}>
                      {bengkel.jenis_kendaraan === 'motor' ? 'Motor' : 'Mobil'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(bengkel.status)}`}>
                      {bengkel.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{bengkel.rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-600">{bengkel.alamat}</p>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-sm text-gray-600">{bengkel.telepon}</p>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">{bengkel.jam_buka} - {bengkel.jam_tutup}</p>
              </div>
            </div>

            {bengkel.layanan_tersedia && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Layanan:</p>
                <div className="flex flex-wrap gap-1">
                  {bengkel.layanan_tersedia.split(',').map((layanan, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {layanan.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bengkel.deskripsi && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bengkel.deskripsi}</p>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleDetailProduk(bengkel)}
                className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Detail
              </button>
              <button
                onClick={() => handleEdit(bengkel)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(bengkel.id)}
                className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBengkelList.length === 0 && bengkelList.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">Belum ada bengkel yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Tambah bengkel pertama
          </button>
        </div>
      )}

      {filteredBengkelList.length === 0 && bengkelList.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">Tidak ada bengkel {filterJenis} yang ditemukan</p>
          <button
            onClick={() => setFilterJenis('semua')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Tampilkan semua bengkel
          </button>
        </div>
      )}

      {/* Bengkel Detail Modal */}
      {showDetailModal && selectedBengkel && (
        <BengkelDetailModal
          bengkelId={selectedBengkel.id}
          bengkelNama={selectedBengkel.nama_bengkel}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBengkel(null);
          }}
        />
      )}
    </div>
  );
};

export default BengkelManagement;
