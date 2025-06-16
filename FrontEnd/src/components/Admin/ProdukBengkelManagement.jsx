import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const ProdukBengkelManagement = () => {
  const [produkBengkel, setProdukBengkel] = useState([]);
  const [layananBengkel, setLayananBengkel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formData, setFormData] = useState({
    nama_produk: '',
    pilihlayananId: '',
    harga: '',
    stok: '',
    deskripsi: '',
    kategori_produk: 'oli'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch produk dan layanan bengkel
      const [produkResponse, layananResponse] = await Promise.all([
        authAPI.get('/getproduk'),
        authAPI.get('/getpilihlayanan')
      ]);
      
      // Filter produk untuk layanan bengkel (layananId = 2)
      const bengkelProducts = produkResponse.data?.filter(item => item.layananId === 2) || [];
      setProdukBengkel(bengkelProducts);
      
      // Filter layanan bengkel
      const bengkelServices = layananResponse.data?.filter(item => item.layananId === 2) || [];
      setLayananBengkel(bengkelServices);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback dengan data mock
      setProdukBengkel([
        {
          id: 1,
          nama_produk: 'Oli Mesin Yamalube',
          pilihlayananId: 1,
          layanan_nama: 'Ganti Oli',
          harga: 45000,
          stok: 50,
          deskripsi: 'Oli mesin berkualitas tinggi untuk motor Yamaha',
          kategori_produk: 'oli',
          layananId: 2
        },
        {
          id: 2,
          nama_produk: 'Ban Tubeless IRC',
          pilihlayananId: 2,
          layanan_nama: 'Ganti Ban',
          harga: 180000,
          stok: 25,
          deskripsi: 'Ban tubeless ukuran 80/90-14 untuk motor matic',
          kategori_produk: 'ban',
          layananId: 2
        },
        {
          id: 3,
          nama_produk: 'Kampas Rem Depan',
          pilihlayananId: 3,
          layanan_nama: 'Service Berkala',
          harga: 35000,
          stok: 30,
          deskripsi: 'Kampas rem depan untuk berbagai jenis motor',
          kategori_produk: 'spare_part',
          layananId: 2
        }
      ]);
      
      setLayananBengkel([
        { id: 1, nama_pilih_layanan: 'Ganti Oli' },
        { id: 2, nama_pilih_layanan: 'Ganti Ban' },
        { id: 3, nama_pilih_layanan: 'Service Berkala' }
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
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok)
      };

      if (editingProduk) {
        await authAPI.put(`/produk/${editingProduk.id}`, submitData);
      } else {
        await authAPI.post('/tambahproduk', submitData);
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving produk bengkel:', error);
      alert('Gagal menyimpan data produk bengkel');
    }
  };

  const handleEdit = (produk) => {
    setEditingProduk(produk);
    setFormData({
      nama_produk: produk.nama_produk || '',
      pilihlayananId: produk.pilihlayananId?.toString() || '',
      harga: produk.harga?.toString() || '',
      stok: produk.stok?.toString() || '',
      deskripsi: produk.deskripsi || '',
      kategori_produk: produk.kategori_produk || 'oli'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await authAPI.delete(`/produk/${id}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting produk:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_produk: '',
      pilihlayananId: '',
      harga: '',
      stok: '',
      deskripsi: '',
      kategori_produk: 'oli'
    });
    setEditingProduk(null);
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
      case 'oli': return '🛢️';
      case 'ban': return '⚫';
      case 'spare_part': return '🔩';
      case 'aki': return '🔋';
      case 'filter': return '🔍';
      default: return '⚙️';
    }
  };

  const getKategoriBadgeColor = (kategori) => {
    switch (kategori) {
      case 'oli': return 'bg-yellow-100 text-yellow-800';
      case 'ban': return 'bg-gray-100 text-gray-800';
      case 'spare_part': return 'bg-blue-100 text-blue-800';
      case 'aki': return 'bg-green-100 text-green-800';
      case 'filter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStokStatus = (stok) => {
    if (stok <= 5) return { color: 'text-red-600', status: 'Stok Habis' };
    if (stok <= 15) return { color: 'text-yellow-600', status: 'Stok Menipis' };
    return { color: 'text-green-600', status: 'Stok Tersedia' };
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
          <h3 className="text-lg font-medium text-gray-900">Kelola Produk/Spare Part</h3>
          <p className="text-sm text-gray-600">Oli, kampas rem, ban, aki, dan spare part lainnya</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Tambah Produk Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">
                {editingProduk ? 'Edit Produk' : 'Tambah Produk Baru'}
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
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Oli Mesin Yamalube"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Produk
                </label>
                <select
                  name="kategori_produk"
                  value={formData.kategori_produk}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="oli">🛢️ Oli</option>
                  <option value="ban">⚫ Ban</option>
                  <option value="spare_part">🔩 Spare Part</option>
                  <option value="aki">🔋 Aki</option>
                  <option value="filter">🔍 Filter</option>
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

              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="45000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="50"
                    required
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
                  placeholder="Deskripsi produk..."
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
                  {editingProduk ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Produk */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produkBengkel.map((produk) => {
                const stokStatus = getStokStatus(produk.stok);
                return (
                  <tr key={produk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getKategoriIcon(produk.kategori_produk)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{produk.nama_produk}</div>
                          <div className="text-sm text-gray-500">{produk.deskripsi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKategoriBadgeColor(produk.kategori_produk)}`}>
                        {produk.kategori_produk?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {produk.layanan_nama || `Layanan ID: ${produk.pilihlayananId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(produk.harga)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${stokStatus.color}`}>
                        {produk.stok} pcs
                      </div>
                      <div className={`text-xs ${stokStatus.color}`}>
                        {stokStatus.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(produk)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(produk.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {produkBengkel.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada produk bengkel yang terdaftar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-green-600 hover:text-green-800"
          >
            Tambah produk pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default ProdukBengkelManagement;
