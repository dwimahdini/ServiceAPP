import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { bookingTransactionService } from '../../services/bookingTransactionService';

const AllTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Mock data untuk demo
  const mockTransactions = [
    {
      id: 'TRX001',
      user: { name: 'John Doe', email: 'john@example.com' },
      service: 'Konsultasi Psikologi',
      serviceType: 'psikologi',
      amount: 500000,
      status: 'completed',
      paymentMethod: 'Transfer Bank',
      date: '2024-01-15T10:30:00Z',
      notes: 'Konsultasi dengan Dr. Fauzan'
    },
    {
      id: 'TRX002',
      user: { name: 'Jane Smith', email: 'jane@example.com' },
      service: 'Service Motor - Ganti Oli',
      serviceType: 'bengkel',
      amount: 350000,
      status: 'pending',
      paymentMethod: 'E-Wallet',
      date: '2024-01-15T09:15:00Z',
      notes: 'Menunggu konfirmasi pembayaran'
    },
    {
      id: 'TRX003',
      user: { name: 'Bob Wilson', email: 'bob@example.com' },
      service: 'Cleaning Service',
      serviceType: 'opo-wae',
      amount: 200000,
      status: 'completed',
      paymentMethod: 'Cash',
      date: '2024-01-14T16:45:00Z',
      notes: 'Pembersihan rumah selesai'
    },
    {
      id: 'TRX004',
      user: { name: 'Alice Brown', email: 'alice@example.com' },
      service: 'Service Mobil - Tune Up',
      serviceType: 'bengkel',
      amount: 750000,
      status: 'processing',
      paymentMethod: 'Credit Card',
      date: '2024-01-14T14:20:00Z',
      notes: 'Sedang dalam proses pengerjaan'
    },
    {
      id: 'TRX005',
      user: { name: 'Charlie Davis', email: 'charlie@example.com' },
      service: 'Driver Service',
      serviceType: 'opo-wae',
      amount: 150000,
      status: 'completed',
      paymentMethod: 'Transfer Bank',
      date: '2024-01-14T11:30:00Z',
      notes: 'Perjalanan selesai'
    },
    {
      id: 'TRX006',
      user: { name: 'Diana Prince', email: 'diana@example.com' },
      service: 'Terapi Keluarga',
      serviceType: 'psikologi',
      amount: 700000,
      status: 'cancelled',
      paymentMethod: 'Transfer Bank',
      date: '2024-01-13T15:00:00Z',
      notes: 'Dibatalkan oleh customer'
    }
  ];

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };

      const response = await bookingTransactionService.getAllTransactions(queryParams);
      
      setTransactions(response.data || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0
      }));

    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Gagal memuat data transaksi. Menggunakan data demo.');
      
      // Fallback to mock data with filtering
      let filteredData = mockTransactions;
      
      if (filters.status) {
        filteredData = filteredData.filter(t => t.status === filters.status);
      }
      if (filters.service) {
        filteredData = filteredData.filter(t => t.serviceType === filters.service);
      }
      if (filters.search) {
        filteredData = filteredData.filter(t => 
          t.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.service.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setTransactions(filteredData);
      setPagination(prev => ({
        ...prev,
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / prev.itemsPerPage)
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleStatusUpdate = async (transactionId, newStatus) => {
    try {
      await bookingTransactionService.updateTransactionStatus(transactionId, newStatus);
      fetchTransactions(); // Refresh data
      alert('Status transaksi berhasil diupdate!');
    } catch (error) {
      console.error('Error updating transaction status:', error);
      alert('Gagal mengupdate status transaksi.');
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
      default:
        return status;
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case 'psikologi':
        return 'bg-purple-100 text-purple-800';
      case 'bengkel':
        return 'bg-orange-100 text-orange-800';
      case 'opo-wae':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Semua Transaksi</h1>
            <p className="text-gray-600 mt-1">Kelola dan monitor semua transaksi sistem</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/transactions/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/admin/transactions/create')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Buat Transaksi
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pencarian</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="ID, User, atau Layanan..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="processing">Diproses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layanan</label>
              <select
                value={filters.service}
                onChange={(e) => handleFilterChange('service', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Layanan</option>
                <option value="psikologi">Psikologi</option>
                <option value="bengkel">Bengkel</option>
                <option value="opo-wae">Opo Wae</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Transaksi ({pagination.totalItems} total)
              </h2>
              <div className="text-sm text-gray-600">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID / User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                          <div className="text-sm text-gray-500">{transaction.user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{transaction.service}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(transaction.serviceType)}`}>
                            {transaction.serviceType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/transactions/${transaction.id}`)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Detail
                          </button>
                          {transaction.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(transaction.id, 'processing')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Proses
                            </button>
                          )}
                          {transaction.status === 'processing' && (
                            <button
                              onClick={() => handleStatusUpdate(transaction.id, 'completed')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: index + 1 }))}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.currentPage === index + 1
                      ? 'text-blue-600 bg-blue-50 border border-blue-300'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllTransactions;
