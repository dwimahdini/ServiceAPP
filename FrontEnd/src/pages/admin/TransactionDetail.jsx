import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Mock data untuk demo
  const mockTransaction = {
    id: 'TRX001',
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+62812345678'
    },
    service: {
      name: 'Konsultasi Psikologi',
      type: 'psikologi',
      provider: 'Dr. Fauzan Jamil',
      duration: '60 menit',
      description: 'Konsultasi psikologi individual untuk mengatasi kecemasan'
    },
    amount: 500000,
    status: 'completed',
    paymentMethod: 'Transfer Bank',
    paymentDetails: {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      transferDate: '2024-01-15T10:00:00Z',
      referenceNumber: 'TF20240115001'
    },
    timeline: [
      {
        status: 'created',
        timestamp: '2024-01-15T09:00:00Z',
        description: 'Transaksi dibuat',
        user: 'System'
      },
      {
        status: 'pending',
        timestamp: '2024-01-15T09:05:00Z',
        description: 'Menunggu pembayaran',
        user: 'System'
      },
      {
        status: 'paid',
        timestamp: '2024-01-15T10:00:00Z',
        description: 'Pembayaran diterima',
        user: 'Admin'
      },
      {
        status: 'processing',
        timestamp: '2024-01-15T10:30:00Z',
        description: 'Layanan sedang berlangsung',
        user: 'Dr. Fauzan Jamil'
      },
      {
        status: 'completed',
        timestamp: '2024-01-15T11:30:00Z',
        description: 'Layanan selesai',
        user: 'Dr. Fauzan Jamil'
      }
    ],
    notes: 'Konsultasi berjalan lancar. Pasien menunjukkan progress yang baik.',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  };

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data since transaction system is simplified
      setTransaction(mockTransaction);

    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      setError('Gagal memuat detail transaksi. Menggunakan data demo.');
      
      // Fallback to mock data
      setTransaction(mockTransaction);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      
      // Mock update since transaction system is simplified
      console.log('Updating transaction status:', id, newStatus);
      
      // Update local state
      setTransaction(prev => ({
        ...prev,
        status: newStatus,
        timeline: [
          ...prev.timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: `Status diubah menjadi ${getStatusText(newStatus)}`,
            user: 'Admin'
          }
        ]
      }));
      
      alert('Status transaksi berhasil diupdate!');
    } catch (error) {
      console.error('Error updating transaction status:', error);
      alert('Gagal mengupdate status transaksi.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
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
      case 'processing':
        return 'Diproses';
      case 'cancelled':
        return 'Dibatalkan';
      case 'paid':
        return 'Dibayar';
      case 'created':
        return 'Dibuat';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!transaction) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaksi tidak ditemukan</h2>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Daftar Transaksi
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/admin/transactions')}
              className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Transaksi
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Detail Transaksi</h1>
            <p className="text-gray-600 mt-1">ID: {transaction.id}</p>
          </div>
          <div className="flex gap-3">
            {transaction.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('processing')}
                disabled={updating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updating ? 'Memproses...' : 'Proses Transaksi'}
              </button>
            )}
            {transaction.status === 'processing' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {updating ? 'Memproses...' : 'Selesaikan'}
              </button>
            )}
            {(transaction.status === 'pending' || transaction.status === 'processing') && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updating}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Batalkan
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Transaksi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-gray-900">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Layanan</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Layanan</label>
                  <p className="text-gray-900">{transaction.service.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Penyedia Layanan</label>
                  <p className="text-gray-900">{transaction.service.provider}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durasi</label>
                  <p className="text-gray-900">{transaction.service.duration}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-gray-900">{transaction.service.description}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {transaction.paymentDetails && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Pembayaran</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank</label>
                    <p className="text-gray-900">{transaction.paymentDetails.bankName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">No. Rekening</label>
                    <p className="text-gray-900">{transaction.paymentDetails.accountNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Rekening</label>
                    <p className="text-gray-900">{transaction.paymentDetails.accountName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">No. Referensi</label>
                    <p className="text-gray-900">{transaction.paymentDetails.referenceNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {transaction.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan</h2>
                <p className="text-gray-900">{transaction.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Customer</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama</label>
                  <p className="text-gray-900">{transaction.user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{transaction.user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telepon</label>
                  <p className="text-gray-900">{transaction.user.phone}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                {transaction.timeline.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).replace('text-', 'bg-').replace('100', '500')}`}></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                      <p className="text-xs text-gray-500">oleh {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionDetail;
