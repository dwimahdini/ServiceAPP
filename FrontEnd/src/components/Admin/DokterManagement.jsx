import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import ImageUpload from './ImageUpload';

const DokterManagement = () => {
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDokter, setEditingDokter] = useState(null);
  const [formData, setFormData] = useState({
    pilih_dokter_psikolog: '',
    spesialisasi: '',
    deskripsi: '',
    harga_konsultasi: '',
    foto_url: '',
    alamat: '',
    telepon: '',
    jadwal_tersedia: []
  });

  useEffect(() => {
    fetchDokters();
  }, []);

  const fetchDokters = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Starting fetchDokters...');

      // Check authentication first
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token) {
        console.warn('⚠️ No token found');
        throw new Error('Please login as admin first');
      }

      if (user.role !== 'admin') {
        console.warn('⚠️ User is not admin:', user.role);
        throw new Error('Admin access required');
      }

      console.log('✅ Authentication check passed');

      // Now try to fetch dokters
      console.log('📡 Fetching dokters from API...');
      const response = await fetch('http://localhost:3001/simple/dokter', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API response not ok:', response.status, errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('📊 Raw API response:', responseData);

      // Ensure response is an array
      const doktersArray = Array.isArray(responseData) ? responseData : [];
      console.log('📋 Dokters array:', doktersArray);

      // Filter untuk dokter psikologi (layananId = 1)
      const psikologDokters = doktersArray.filter(item => {
        const isValid = item && typeof item === 'object' && item.layananId === 1;
        if (!isValid) {
          console.log('⚠️ Filtering out invalid item:', item);
        }
        return isValid;
      });

      console.log(`✅ Found ${psikologDokters.length} psychology dokters:`, psikologDokters);
      setDokters(psikologDokters);

    } catch (error) {
      console.error('❌ Error in fetchDokters:', error);
      setError(error.message || 'Unknown error occurred');

      // Set empty array instead of mock data to avoid confusion
      setDokters([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchDokters completed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current user info
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (editingDokter) {
        // Update dokter - menggunakan endpoint simple yang baru
        const updateData = {
          pilih_dokter_psikolog: formData.pilih_dokter_psikolog,
          spesialisasi: formData.spesialisasi,
          pengalaman: formData.deskripsi, // Map deskripsi ke pengalaman
          tarif_per_jam: parseFloat(formData.harga_konsultasi) || 0,
          foto: formData.foto_url || formData.foto || '', // Use uploaded image URL
          alamat: formData.alamat,
          telepon: formData.telepon,
          jadwal_tersedia: formData.jadwal_tersedia
        };

        console.log('Sending update data:', updateData);
        await authAPI.put(`/simple/dokter/${editingDokter.id}`, updateData);
      } else {
        // Tambah dokter baru - menggunakan endpoint simple yang baru
        const submitData = {
          pilih_dokter_psikolog: formData.pilih_dokter_psikolog,
          layananId: 1, // ID untuk layanan Psikologi
          spesialisasi: formData.spesialisasi,
          pengalaman: formData.deskripsi, // Map deskripsi ke pengalaman
          tarif_per_jam: parseFloat(formData.harga_konsultasi) || 0,
          foto: formData.foto_url || formData.foto || '', // Use uploaded image URL
          alamat: formData.alamat,
          telepon: formData.telepon,
          jadwal_tersedia: formData.jadwal_tersedia
        };

        console.log('Sending create data:', submitData);
        console.log('Current formData:', formData);
        await authAPI.post('/simple/dokter', submitData);
      }

      await fetchDokters();
      resetForm();
      alert('Data dokter berhasil disimpan!');
    } catch (error) {
      console.error('Error saving dokter:', error);

      // Show more detailed error message
      let errorMessage = 'Gagal menyimpan data dokter';
      if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }

      alert(errorMessage);
    }
  };

  const handleEdit = (dokter) => {
    setEditingDokter(dokter);

    // Safe parsing untuk jadwal_tersedia
    let jadwalTersedia = [];
    try {
      if (dokter.jadwal_tersedia) {
        if (typeof dokter.jadwal_tersedia === 'string') {
          jadwalTersedia = JSON.parse(dokter.jadwal_tersedia);
        } else if (Array.isArray(dokter.jadwal_tersedia)) {
          jadwalTersedia = dokter.jadwal_tersedia;
        }
      }
    } catch (error) {
      console.warn('Error parsing jadwal_tersedia:', error);
      jadwalTersedia = [];
    }

    setFormData({
      pilih_dokter_psikolog: dokter.pilih_dokter_psikolog || '',
      spesialisasi: dokter.spesialisasi || '',
      deskripsi: dokter.pengalaman || dokter.deskripsi || '',
      harga_konsultasi: dokter.tarif_per_jam || dokter.harga_konsultasi || '',
      foto_url: dokter.foto || dokter.foto_url || '',
      alamat: dokter.alamat || '',
      telepon: dokter.telepon || '',
      jadwal_tersedia: jadwalTersedia
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus dokter ini?')) {
      try {
        await authAPI.delete(`/simple/dokter/${id}`);
        await fetchDokters();
        alert('Dokter berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting dokter:', error);

        let errorMessage = 'Gagal menghapus dokter';
        if (error.response?.data?.message) {
          errorMessage += ': ' + error.response.data.message;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }

        alert(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      pilih_dokter_psikolog: '',
      spesialisasi: '',
      deskripsi: '',
      harga_konsultasi: '',
      foto_url: '',
      alamat: '',
      telepon: '',
      jadwal_tersedia: []
    });
    setEditingDokter(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJadwalChange = (hari) => {
    setFormData(prev => ({
      ...prev,
      jadwal_tersedia: prev.jadwal_tersedia.includes(hari)
        ? prev.jadwal_tersedia.filter(h => h !== hari)
        : [...prev.jadwal_tersedia, hari]
    }));
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600 mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Dokters</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchDokters}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary untuk menangkap error rendering
  if (error && error.includes('not a function')) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Component Error</h3>
          <p className="text-sm text-red-600 mt-2">
            There was an error loading the component. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kelola Dokter/Psikolog</h3>
          <p className="text-sm text-gray-600">Tambah, edit, dan hapus data dokter/psikolog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Dokter Baru
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Memuat data dokter...</p>
          <p className="text-xs text-gray-500 mt-1">Connecting to backend server...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800">Error Loading Dokters</h4>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <div className="mt-3 space-y-2">
            <button
              onClick={fetchDokters}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                console.log('🔧 Manual debug info:');
                console.log('- Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
                console.log('- User:', JSON.parse(localStorage.getItem('user') || '{}'));
                console.log('- Current URL:', window.location.href);
                alert('Debug info logged to console. Press F12 to view.');
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Debug Info
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingDokter ? 'Edit Dokter' : 'Tambah Dokter Baru'}
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
                  Nama Dokter/Psikolog
                </label>
                <input
                  type="text"
                  name="pilih_dokter_psikolog"
                  value={formData.pilih_dokter_psikolog}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spesialisasi
                </label>
                <input
                  type="text"
                  name="spesialisasi"
                  value={formData.spesialisasi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Konsultasi (Rp)
                </label>
                <input
                  type="number"
                  name="harga_konsultasi"
                  value={formData.harga_konsultasi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Praktik
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 021-1234567 atau 081234567890"
                />
              </div>

              <ImageUpload
                label="Foto Dokter"
                currentImage={formData.foto_url}
                onImageUploaded={(imageUrl) => {
                  console.log('ImageUpload callback received:', imageUrl);
                  setFormData(prev => {
                    const newFormData = {
                      ...prev,
                      foto_url: imageUrl || '',
                      foto: imageUrl || '' // Also update foto field for database consistency
                    };
                    console.log('Updated formData:', newFormData);
                    return newFormData;
                  });
                }}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jadwal Tersedia
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((hari) => (
                    <label key={hari} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.jadwal_tersedia.includes(hari)}
                        onChange={() => handleJadwalChange(hari)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{hari}</span>
                    </label>
                  ))}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingDokter ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Dokter */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(dokters) && dokters.length > 0 ? dokters.map((dokter) => {
            // Safe render dengan null checks
            if (!dokter || !dokter.id) return null;

            return (
              <div key={dokter.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <img
                    src={dokter.foto || dokter.foto_url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300'}
                    alt={dokter.pilih_dokter_psikolog || 'Dokter'}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{dokter.pilih_dokter_psikolog || 'Nama tidak tersedia'}</h4>
                    <p className="text-sm text-blue-600">{dokter.spesialisasi || 'Spesialisasi tidak tersedia'}</p>
                    <p className="text-sm text-gray-600 mt-1">{dokter.pengalaman || dokter.deskripsi || 'Deskripsi tidak tersedia'}</p>
                    <p className="text-sm font-medium text-green-600 mt-2">
                      Rp {((dokter.tarif_per_jam || dokter.harga_konsultasi || 0)).toLocaleString('id-ID')}/jam
                    </p>
                    {(() => {
                      // Safe parsing dan rendering jadwal
                      let jadwalArray = [];
                      try {
                        if (dokter.jadwal_tersedia) {
                          if (typeof dokter.jadwal_tersedia === 'string') {
                            jadwalArray = JSON.parse(dokter.jadwal_tersedia);
                          } else if (Array.isArray(dokter.jadwal_tersedia)) {
                            jadwalArray = dokter.jadwal_tersedia;
                          }
                        }
                      } catch (error) {
                        console.warn('Error parsing jadwal for display:', error);
                        jadwalArray = [];
                      }

                      return jadwalArray && jadwalArray.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Jadwal:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {jadwalArray.map((hari, index) => (
                              <span key={`${dokter.id}-${hari}-${index}`} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {hari}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(dokter)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dokter.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Belum ada dokter/psikolog yang terdaftar</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Tambah dokter pertama
              </button>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default DokterManagement;
