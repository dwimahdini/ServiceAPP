import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const TarifManagement = () => {
  const [tarif, setTarif] = useState([]);
  const [layananOpoWae, setLayananOpoWae] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarif, setEditingTarif] = useState(null);
  const [formData, setFormData] = useState({
    nama_tarif: '',
    pilihlayananId: '',
    harga_per_jam: '',
    harga_per_hari: '',
    harga_per_minggu: '',
    harga_per_bulan: '',
    diskon_persen: '0',
    minimal_jam: '1',
    deskripsi: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch tarif dan layanan opo wae
      // Menggunakan endpoint durasi untuk menyimpan data tarif
      const [tarifResponse, layananResponse] = await Promise.all([
        authAPI.get('/getdurasi'),
        authAPI.get('/getpilihlayanan')
      ]);
      
      // Filter tarif untuk layanan opo wae (layananId = 3)
      const opoWaeTarifs = tarifResponse.data?.filter(item => item.layananId === 3) || [];
      setTarif(opoWaeTarifs);
      
      // Filter layanan opo wae
      const opoWaeServices = layananResponse.data?.filter(item => item.layananId === 3) || [];
      setLayananOpoWae(opoWaeServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dengan data mock
      setTarif([
        {
          id: 1,
          nama_tarif: 'Tarif Driver Harian',
          pilihlayananId: 1,
          layanan_nama: 'Driver Pribadi',
          harga_per_jam: 25000,
          harga_per_hari: 150000,
          harga_per_minggu: 900000,
          harga_per_bulan: 3000000,
          diskon_persen: 10,
          minimal_jam: 2,
          deskripsi: 'Tarif untuk layanan driver pribadi dengan diskon untuk kontrak jangka panjang',
          layananId: 3
        },
        {
          id: 2,
          nama_tarif: 'Tarif Cleaning Premium',
          pilihlayananId: 2,
          layanan_nama: 'Cleaning Service',
          harga_per_jam: 30000,
          harga_per_hari: 200000,
          harga_per_minggu: 1200000,
          harga_per_bulan: 4000000,
          diskon_persen: 15,
          minimal_jam: 3,
          deskripsi: 'Tarif premium untuk layanan cleaning dengan peralatan lengkap',
          layananId: 3
        },
        {
          id: 3,
          nama_tarif: 'Tarif Babysitter Profesional',
          pilihlayananId: 3,
          layanan_nama: 'Babysitter',
          harga_per_jam: 35000,
          harga_per_hari: 250000,
          harga_per_minggu: 1500000,
          harga_per_bulan: 5000000,
          diskon_persen: 20,
          minimal_jam: 4,
          deskripsi: 'Tarif untuk babysitter berpengalaman dengan sertifikat',
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
        durasi: parseInt(formData.minimal_jam), // Menggunakan field durasi untuk minimal_jam
        layananId: 3, // ID untuk layanan Opo Wae
        ...formData,
        harga_per_jam: parseInt(formData.harga_per_jam),
        harga_per_hari: parseInt(formData.harga_per_hari),
        harga_per_minggu: parseInt(formData.harga_per_minggu),
        harga_per_bulan: parseInt(formData.harga_per_bulan),
        diskon_persen: parseInt(formData.diskon_persen),
        minimal_jam: parseInt(formData.minimal_jam)
      };

      if (editingTarif) {
        await authAPI.put(`/durasi/${editingTarif.id}`, submitData);
      } else {
        await authAPI.post('/tambahdurasi', submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving tarif:', error);
      alert('Gagal menyimpan data tarif');
    }
  };

  const handleEdit = (tarifItem) => {
    setEditingTarif(tarifItem);
    setFormData({
      nama_tarif: tarifItem.nama_tarif || '',
      pilihlayananId: tarifItem.pilihlayananId?.toString() || '',
      harga_per_jam: tarifItem.harga_per_jam?.toString() || '',
      harga_per_hari: tarifItem.harga_per_hari?.toString() || '',
      harga_per_minggu: tarifItem.harga_per_minggu?.toString() || '',
      harga_per_bulan: tarifItem.harga_per_bulan?.toString() || '',
      diskon_persen: tarifItem.diskon_persen?.toString() || '0',
      minimal_jam: tarifItem.minimal_jam?.toString() || tarifItem.durasi?.toString() || '1',
      deskripsi: tarifItem.deskripsi || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus tarif ini?')) {
      try {
        await authAPI.delete(`/durasi/${id}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting tarif:', error);
        alert('Gagal menghapus tarif');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_tarif: '',
      pilihlayananId: '',
      harga_per_jam: '',
      harga_per_hari: '',
      harga_per_minggu: '',
      harga_per_bulan: '',
      diskon_persen: '0',
      minimal_jam: '1',
      deskripsi: ''
    });
    setEditingTarif(null);
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

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    const discount = (originalPrice * discountPercent) / 100;
    return originalPrice - discount;
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Tarif & Harga</h3>
          <p className="text-sm text-gray-600">Atur harga per jam/hari/minggu/bulan untuk setiap layanan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Tambah Tarif Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingTarif ? 'Edit Tarif' : 'Tambah Tarif Baru'}
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
                    Nama Tarif
                  </label>
                  <input
                    type="text"
                    name="nama_tarif"
                    value={formData.nama_tarif}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tarif Driver Harian"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per Minggu (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga_per_minggu"
                    value={formData.harga_per_minggu}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="900000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per Bulan (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga_per_bulan"
                    value={formData.harga_per_bulan}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="3000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diskon (%)
                  </label>
                  <input
                    type="number"
                    name="diskon_persen"
                    value={formData.diskon_persen}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="10"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimal Jam
                  </label>
                  <select
                    name="minimal_jam"
                    value={formData.minimal_jam}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">1 jam</option>
                    <option value="2">2 jam</option>
                    <option value="3">3 jam</option>
                    <option value="4">4 jam</option>
                    <option value="8">8 jam</option>
                  </select>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Deskripsi tarif dan ketentuan..."
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
                  {editingTarif ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Tarif */}
      <div className="space-y-6">
        {tarif.map((tarifItem) => (
          <div key={tarifItem.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{tarifItem.nama_tarif}</h4>
                <p className="text-sm text-purple-600">{tarifItem.layanan_nama || `Layanan ID: ${tarifItem.pilihlayananId}`}</p>
                {tarifItem.deskripsi && (
                  <p className="text-sm text-gray-600 mt-1">{tarifItem.deskripsi}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(tarifItem)}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tarifItem.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Per Jam</div>
                <div className="text-lg font-medium text-purple-600">
                  {formatCurrency(tarifItem.harga_per_jam)}
                </div>
                {tarifItem.diskon_persen > 0 && (
                  <div className="text-xs text-green-600">
                    Setelah diskon: {formatCurrency(calculateDiscountedPrice(tarifItem.harga_per_jam, tarifItem.diskon_persen))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Per Hari</div>
                <div className="text-lg font-medium text-purple-600">
                  {formatCurrency(tarifItem.harga_per_hari)}
                </div>
                {tarifItem.diskon_persen > 0 && (
                  <div className="text-xs text-green-600">
                    Setelah diskon: {formatCurrency(calculateDiscountedPrice(tarifItem.harga_per_hari, tarifItem.diskon_persen))}
                  </div>
                )}
              </div>

              {tarifItem.harga_per_minggu && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Per Minggu</div>
                  <div className="text-lg font-medium text-purple-600">
                    {formatCurrency(tarifItem.harga_per_minggu)}
                  </div>
                  {tarifItem.diskon_persen > 0 && (
                    <div className="text-xs text-green-600">
                      Setelah diskon: {formatCurrency(calculateDiscountedPrice(tarifItem.harga_per_minggu, tarifItem.diskon_persen))}
                    </div>
                  )}
                </div>
              )}

              {tarifItem.harga_per_bulan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Per Bulan</div>
                  <div className="text-lg font-medium text-purple-600">
                    {formatCurrency(tarifItem.harga_per_bulan)}
                  </div>
                  {tarifItem.diskon_persen > 0 && (
                    <div className="text-xs text-green-600">
                      Setelah diskon: {formatCurrency(calculateDiscountedPrice(tarifItem.harga_per_bulan, tarifItem.diskon_persen))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Minimal booking: {tarifItem.minimal_jam || tarifItem.durasi} jam
              </div>
              {tarifItem.diskon_persen > 0 && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Diskon {tarifItem.diskon_persen}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tarif.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada tarif yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-purple-600 hover:text-purple-800"
          >
            Tambah tarif pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default TarifManagement;
