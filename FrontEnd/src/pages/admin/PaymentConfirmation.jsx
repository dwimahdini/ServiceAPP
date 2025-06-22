import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Admin/AdminNavbar';

const PaymentConfirmation = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, paid, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔍 Fetching pending payments...');
            console.log('Token:', token ? 'Present' : 'Missing');

            const response = await fetch('http://localhost:3001/admin/payments/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                setPendingPayments(result.data);
                console.log('✅ Pending payments loaded:', result.data.length);
            } else {
                console.log('❌ API returned error:', result.message);
            }
        } catch (error) {
            console.error('❌ Error fetching pending payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (bookingId, action) => {
        const adminNotes = action === 'reject' ? 
            prompt('Masukkan alasan penolakan:') : '';
        
        if (action === 'reject' && !adminNotes) {
            alert('Alasan penolakan harus diisi');
            return;
        }

        setProcessing(bookingId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/admin/payments/confirm/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: action,
                    admin_notes: adminNotes
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(result.message);
                fetchPendingPayments(); // Refresh data
            } else {
                alert(result.message || 'Gagal mengkonfirmasi pembayaran');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Gagal mengkonfirmasi pembayaran');
        } finally {
            setProcessing(null);
        }
    };

    // Fungsi hapus semua transaksi
    const handleDeleteAllTransactions = async () => {
        const confirmDelete = window.confirm(
            '⚠️ PERINGATAN!\n\nApakah Anda yakin ingin menghapus SEMUA transaksi?\n\n' +
            '• Semua data booking akan hilang permanen\n' +
            '• ID akan direset ke #1\n' +
            '• Tindakan ini tidak dapat dibatalkan\n\n' +
            'Ketik "HAPUS SEMUA" untuk konfirmasi:'
        );

        if (!confirmDelete) return;

        const confirmation = prompt('Ketik "HAPUS SEMUA" untuk konfirmasi:');
        if (confirmation !== 'HAPUS SEMUA') {
            alert('Konfirmasi tidak sesuai. Penghapusan dibatalkan.');
            return;
        }

        try {
            setDeleting(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3001/admin/payments/delete-all', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                alert(`✅ Berhasil menghapus semua transaksi!\n\nTotal dihapus: ${result.deletedCount} transaksi\nID booking direset ke #1`);
                fetchPendingPayments(); // Refresh data
            } else {
                alert('❌ Gagal menghapus transaksi: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting all transactions:', error);
            alert('❌ Gagal menghapus semua transaksi');
        } finally {
            setDeleting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    // Filter and search functionality - berdasarkan status booking
    const filteredPayments = pendingPayments.filter(payment => {
        const matchesFilter = filter === 'all' || payment.status === filter;
        const matchesSearch = searchTerm === '' ||
            payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toString().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    // Statistics - berdasarkan status booking
    const stats = {
        total: pendingPayments.length,
        pending: pendingPayments.filter(p => p.status === 'pending').length,
        confirmed: pendingPayments.filter(p => p.status === 'confirmed').length,
        rejected: pendingPayments.filter(p => p.status === 'rejected').length,
        totalAmount: pendingPayments.reduce((sum, p) => sum + parseFloat(p.total_harga), 0)
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AdminNavbar />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading pembayaran pending...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header with Statistics */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pembayaran</h1>
                            <p className="mt-2 text-gray-600">Kelola semua transaksi dan pembayaran</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</div>
                            <div className="text-sm text-gray-500">Total Transaksi</div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-blue-600 text-sm font-semibold">{stats.total}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Total</div>
                                    <div className="text-xs text-gray-500">Semua transaksi</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-yellow-600 text-sm font-semibold">{stats.pending}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Pending</div>
                                    <div className="text-xs text-gray-500">Menunggu konfirmasi</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-green-600 text-sm font-semibold">{stats.confirmed}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Disetujui</div>
                                    <div className="text-xs text-gray-500">Sudah dikonfirmasi</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-red-600 text-sm font-semibold">{stats.rejected}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Ditolak</div>
                                    <div className="text-xs text-gray-500">Pembayaran ditolak</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua ({stats.total})
                                </button>

                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'pending'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Pending ({stats.pending})
                                </button>
                                <button
                                    onClick={() => setFilter('confirmed')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'confirmed'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Disetujui ({stats.confirmed})
                                </button>
                                <button
                                    onClick={() => setFilter('rejected')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'rejected'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Ditolak ({stats.rejected})
                                </button>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari customer, email, atau ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchPendingPayments}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors whitespace-nowrap"
                                >
                                    {loading ? 'Loading...' : '🔄 Refresh'}
                                </button>
                                <button
                                    onClick={handleDeleteAllTransactions}
                                    disabled={deleting || loading}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors whitespace-nowrap"
                                >
                                    {deleting ? 'Menghapus...' : '🗑️ Hapus Semua'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredPayments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                        <div className="text-gray-500 text-lg">
                            {searchTerm || filter !== 'all'
                                ? 'Tidak ada transaksi yang sesuai dengan filter'
                                : 'Tidak ada transaksi yang ditemukan'
                            }
                        </div>
                        {(searchTerm || filter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilter('all');
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="text-sm text-gray-600 mb-4">
                            Menampilkan {filteredPayments.length} dari {pendingPayments.length} transaksi
                        </div>
                        {filteredPayments.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
                                {/* Header Card */}
                                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">#{payment.id}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{payment.customer_name}</h3>
                                                <p className="text-sm text-gray-500">{payment.customer_email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600">{formatCurrency(payment.total_harga)}</div>
                                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {payment.status === 'pending' ? 'Menunggu Persetujuan' :
                                                 payment.status === 'confirmed' ? 'Disetujui' :
                                                 payment.status === 'rejected' ? 'Ditolak' : payment.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="px-6 py-4">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Service Info */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Detail Layanan</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    <span className="text-sm font-medium">{payment.nama_layanan}</span>
                                                </div>

                                                {/* Tampilkan info dokter hanya untuk layanan Psikologi */}
                                                {payment.nama_layanan === 'Psikologi' && payment.pilih_dokter_psikolog && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        <span className="text-sm">{payment.pilih_dokter_psikolog}</span>
                                                    </div>
                                                )}

                                                {/* Tampilkan jenis layanan untuk Opo Wae */}
                                                {payment.nama_layanan === 'Opo Wae' && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        <span className="text-sm">{payment.opo_wae_service || payment.notes?.replace('Booking layanan: ', '') || 'Layanan Umum'}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    <span className="text-sm">{formatDate(payment.tanggal_booking)} • {payment.jam_booking}</span>
                                                </div>

                                                {/* Tampilkan durasi hanya untuk layanan yang relevan */}
                                                {payment.nama_layanan === 'Psikologi' && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                        <span className="text-sm">{payment.durasi_menit} menit</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Info Pembayaran</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                    <span className="text-sm">{payment.payment_method?.replace('_', ' ') || 'Transfer Bank'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                                    <span className="text-sm">{formatDateTime(payment.payment_date)}</span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <span className="text-xs text-gray-600">Bukti: </span>
                                                    <span className="text-xs font-mono">{payment.payment_proof}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Aksi</h4>
                                            {payment.status === 'pending' ? (
                                                <div className="flex flex-col space-y-2">
                                                    <button
                                                        onClick={() => handleConfirmPayment(payment.id, 'approve')}
                                                        disabled={processing === payment.id}
                                                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium text-sm transition-colors"
                                                    >
                                                        {processing === payment.id ? 'Processing...' : '✓ Setujui'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleConfirmPayment(payment.id, 'reject')}
                                                        disabled={processing === payment.id}
                                                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium text-sm transition-colors"
                                                    >
                                                        {processing === payment.id ? 'Processing...' : '✗ Tolak'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                                    Status: <span className="font-medium capitalize">{payment.status}</span>
                                                    {payment.admin_notes && (
                                                        <div className="mt-1 text-xs">
                                                            Catatan: {payment.admin_notes}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmation;
