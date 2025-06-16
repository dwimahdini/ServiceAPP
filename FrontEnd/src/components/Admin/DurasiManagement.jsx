import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const DurasiManagement = () => {
  const [durasis, setDurasis] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDurasi, setEditingDurasi] = useState(null);
  const [formData, setFormData] = useState({
    durasi: '',
    harga: '',
    dokterpsikologId: '',
    deskripsi: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch durasi dan dokter
      const [durasiResponse, dokterResponse] = await Promise.all([
        authAPI.get('/getdurasi'),
        authAPI.get('/getpilihdokterpsikolog')
      ]);
      
      setDurasis(durasiResponse.data || []);
      setDokters(dokterResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dengan data mock
      setDurasis([
        {
          id: 1,
          durasi: 30,
          harga: 150000,
          dokterpsikologId: 1,
          dokter_nama: 'Dr. Ahmad Wijaya, M.Psi',
          deskripsi: 'Konsultasi singkat untuk masalah ringan'
        },
        {
          id: 2,
          durasi: 60,
          harga: 250000,
          dokterpsikologId: 1,
          dokter_nama: 'Dr. Ahmad Wijaya, M.Psi',
          deskripsi: 'Konsultasi standar untuk terapi rutin'
        },
        {
          id: 3,
          durasi: 90,
          harga: 350000,
          dokterpsikologId: 2,
          dokter_nama: 'Dr. Sari Indah, S.Psi',
          deskripsi: 'Konsultasi mendalam untuk kasus kompleks'
        }
      ]);
      
      setDokters([
        { id: 1, pilih_dokter_psikolog: 'Dr. Ahmad Wijaya, M.Psi' },
        { id: 2, pilih_dokter_psikolog: 'Dr. Sari Indah, S.Psi' }
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
        durasi: parseInt(formData.durasi),
        harga: parseInt(formData.harga)
      };

      if (editingDurasi) {
        await authAPI.put(`/durasi/${editingDurasi.id}`, submitData);
      } else {
        await authAPI.post('/tambahdurasi', submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving durasi:', error);
      alert('Gagal menyimpan data durasi');
    }
  };

  const handleEdit = (durasi) => {
    setEditingDurasi(durasi);
    setFormData({
      durasi: durasi.durasi.toString(),
      harga: durasi.harga.toString(),
      dokterpsikologId: durasi.dokterpsikologId.toString(),
      deskripsi: durasi.deskripsi || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus durasi ini?')) {
      try {
        await authAPI.delete(`/durasi/${id}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting durasi:', error);
        alert('Gagal menghapus durasi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      durasi: '',
      harga: '',
      dokterpsikologId: '',
      deskripsi: ''
    });
    setEditingDurasi(null);
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Durasi Konsultasi</h3>
          <p className="text-sm text-gray-600">Atur durasi dan harga konsultasi untuk setiap dokter</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Durasi Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingDurasi ? 'Edit Durasi' : 'Tambah Durasi Baru'}
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
                  Dokter/Psikolog
                </label>
                <select
                  name="dokterpsikologId"
                  value={formData.dokterpsikologId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Dokter</option>
                  {dokters.map((dokter) => (
                    <option key={dokter.id} value={dokter.id}>
                      {dokter.pilih_dokter_psikolog}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi (menit)
                </label>
                <select
                  name="durasi"
                  value={formData.durasi}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Durasi</option>
                  <option value="30">30 menit</option>
                  <option value="45">45 menit</option>
                  <option value="60">60 menit</option>
                  <option value="90">90 menit</option>
                  <option value="120">120 menit</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150000"
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
                  placeholder="Deskripsi untuk durasi konsultasi ini..."
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
                  {editingDurasi ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Durasi */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {durasis.map((durasi) => (
                <tr key={durasi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {durasi.dokter_nama || `Dokter ID: ${durasi.dokterpsikologId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{durasi.durasi} menit</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(durasi.harga)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {durasi.deskripsi || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(durasi)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(durasi.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {durasis.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada durasi konsultasi yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Tambah durasi pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default DurasiManagement;
