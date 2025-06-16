import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

const TransaksiPage = () => {
  const { user } = useAuth();
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  // Mock data transaksi untuk demo
  const mockTransaksiData = [
    {
      id: 'TRX001',
      tanggal: '2024-01-15',
      layanan: 'Konsultasi Psikologi',
      provider: 'Dr. Sarah Wijaya',
      jumlah: 500000,
      status: 'completed',
      metodePembayaran: 'Transfer Bank',
      detail: {
        durasi: '60 menit',
        waktu: '14:00 - 15:00',
        catatan: 'Konsultasi stress management'
      }
    },
    {
      id: 'TRX002',
      tanggal: '2024-01-14',
      layanan: 'Service Bengkel',
      provider: 'Bengkel Jaya Motor',
      jumlah: 350000,
      status: 'pending',
      metodePembayaran: 'E-Wallet',
      detail: {
        jenis: 'Ganti Oli + Tune Up',
        kendaraan: 'Honda Jazz 2018',
        estimasi: '2-3 jam'
      }
    },
    {
      id: 'TRX003',
      tanggal: '2024-01-13',
      layanan: 'Cleaning Service',
      provider: 'Fresh Clean',
      jumlah: 150000,
      status: 'cancelled',
      metodePembayaran: 'Cash',
      detail: {
        area: 'Rumah 2 lantai',
        durasi: '4 jam',
        peralatan: 'Disediakan provider'
      }
    },
    {
      id: 'TRX004',
      tanggal: '2024-01-12',
      layanan: 'Supir Pribadi',
      provider: 'Budi Santoso',
      jumlah: 200000,
      status: 'completed',
      metodePembayaran: 'Transfer Bank',
      detail: {
        rute: 'Jakarta - Bandung',
        durasi: '8 jam',
        kendaraan: 'Avanza 2020'
      }
    }
  ];

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setTransaksiList(mockTransaksiData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const filteredTransaksi = filterStatus
    ? transaksiList.filter(transaksi => transaksi.status === filterStatus)
    : transaksiList;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Riwayat Transaksi
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Kelola dan pantau semua transaksi layanan Anda
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Filter Transaksi
                </h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Semua Status</option>
                  <option value="completed">Selesai</option>
                  <option value="pending">Menunggu</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Menampilkan {filteredTransaksi.length} dari {transaksiList.length} transaksi
              </div>
            </div>
          </div>

          {/* Transaksi List */}
          <div className="space-y-4">
            {filteredTransaksi.map((transaksi) => (
              <div key={transaksi.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {transaksi.layanan}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaksi.status)}`}>
                        {getStatusText(transaksi.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Provider: {transaksi.provider}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      ID: {transaksi.id} • {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pembayaran: {transaksi.metodePembayaran}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-2xl font-bold text-indigo-600 mb-2">
                      {formatCurrency(transaksi.jumlah)}
                    </p>
                    <button
                      onClick={() => setSelectedTransaksi(transaksi)}
                      className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition duration-300"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransaksi.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada transaksi
              </h3>
              <p className="text-gray-600">
                {filterStatus ? 'Tidak ada transaksi dengan status yang dipilih' : 'Belum ada transaksi yang dilakukan'}
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedTransaksi && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detail Transaksi - {selectedTransaksi.id}
                  </h3>
                  <button
                    onClick={() => setSelectedTransaksi(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Layanan</label>
                      <p className="text-gray-900">{selectedTransaksi.layanan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provider</label>
                      <p className="text-gray-900">{selectedTransaksi.provider}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                      <p className="text-gray-900">{new Date(selectedTransaksi.tanggal).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaksi.status)}`}>
                        {getStatusText(selectedTransaksi.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                      <p className="text-xl font-bold text-indigo-600">{formatCurrency(selectedTransaksi.jumlah)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                      <p className="text-gray-900">{selectedTransaksi.metodePembayaran}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detail Layanan</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {Object.entries(selectedTransaksi.detail).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    onClick={() => setSelectedTransaksi(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                  {selectedTransaksi.status === 'completed' && (
                    <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransaksiPage;
