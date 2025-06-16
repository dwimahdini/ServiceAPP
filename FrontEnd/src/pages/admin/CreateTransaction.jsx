import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { bookingTransactionService } from '../../services/bookingTransactionService';
import { authAPI } from '../../services/api';

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    serviceType: '',
    serviceName: '',
    serviceProvider: '',
    amount: '',
    paymentMethod: '',
    notes: '',
    duration: ''
  });

  // Mock data untuk demo
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com' }
  ];

  const mockServices = {
    psikologi: [
      { id: 1, name: 'Konsultasi Individual', provider: 'Dr. Fauzan Jamil', price: 500000 },
      { id: 2, name: 'Terapi Keluarga', provider: 'Dr. Sabrina Salsabila', price: 700000 },
      { id: 3, name: 'Konseling Anak', provider: 'Dr. Rina Damayanti', price: 600000 }
    ],
    bengkel: [
      { id: 4, name: 'Service Motor - Ganti Oli', provider: 'Bengkel ABC', price: 150000 },
      { id: 5, name: 'Service Mobil - Tune Up', provider: 'Bengkel XYZ', price: 750000 },
      { id: 6, name: 'Ganti Ban Motor', provider: 'Bengkel ABC', price: 300000 }
    ],
    'opo-wae': [
      { id: 7, name: 'Cleaning Service', provider: 'Clean Pro', price: 200000 },
      { id: 8, name: 'Driver Service', provider: 'Drive Safe', price: 150000 },
      { id: 9, name: 'Laundry Service', provider: 'Wash & Go', price: 50000 }
    ]
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // In real implementation, fetch from API
      setUsers(mockUsers);
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Gagal memuat data. Menggunakan data demo.');
      setUsers(mockUsers);
      setServices(mockServices);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill service details when service is selected
    if (name === 'serviceName' && formData.serviceType) {
      const selectedService = services[formData.serviceType]?.find(s => s.id === parseInt(value));
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          serviceProvider: selectedService.provider,
          amount: selectedService.price
        }));
      }
    }

    // Clear service selection when service type changes
    if (name === 'serviceType') {
      setFormData(prev => ({
        ...prev,
        serviceName: '',
        serviceProvider: '',
        amount: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const transactionData = {
        userId: parseInt(formData.userId),
        service: {
          name: services[formData.serviceType]?.find(s => s.id === parseInt(formData.serviceName))?.name || '',
          type: formData.serviceType,
          provider: formData.serviceProvider,
          duration: formData.duration
        },
        amount: parseInt(formData.amount),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'pending'
      };

      console.log('Creating transaction:', transactionData);
      
      const result = await bookingTransactionService.createTransaction(transactionData);
      
      alert('Transaksi berhasil dibuat!');
      navigate(`/admin/transactions/${result.id}`);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Gagal membuat transaksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceOptions = () => {
    if (!formData.serviceType || !services[formData.serviceType]) {
      return [];
    }
    return services[formData.serviceType];
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Buat Transaksi Baru</h1>
            <p className="text-gray-600 mt-1">Buat transaksi manual untuk customer</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Customer *
                </label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Customer</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Layanan *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenis Layanan</option>
                  <option value="psikologi">Psikologi</option>
                  <option value="bengkel">Bengkel</option>
                  <option value="opo-wae">Opo Wae</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Layanan *
                </label>
                <select
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.serviceType}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Pilih Layanan</option>
                  {getServiceOptions().map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penyedia Layanan
                </label>
                <input
                  type="text"
                  name="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi (opsional)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="contoh: 60 menit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount (IDR) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (opsional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Tambahkan catatan untuk transaksi ini..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/transactions')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-md transition-colors ${
                  loading
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Membuat...' : 'Buat Transaksi'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {formData.userId && formData.serviceName && formData.amount && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Preview Transaksi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Customer:</span>
                <span className="ml-2 text-blue-700">
                  {users.find(u => u.id === parseInt(formData.userId))?.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Layanan:</span>
                <span className="ml-2 text-blue-700">
                  {services[formData.serviceType]?.find(s => s.id === parseInt(formData.serviceName))?.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Provider:</span>
                <span className="ml-2 text-blue-700">{formData.serviceProvider}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Total:</span>
                <span className="ml-2 text-blue-700 font-bold">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(formData.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CreateTransaction;
