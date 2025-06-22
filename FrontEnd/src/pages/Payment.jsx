import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import BackButton from '../components/UI/BackButton';

const Payment = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentData, setPaymentData] = useState({
        payment_method: 'transfer_bank',
        payment_proof: ''
    });

    useEffect(() => {
        fetchBookingDetail();
    }, [bookingId]);

    const fetchBookingDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/payment/detail/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success) {
                setBooking(result.data);
            } else {
                alert('Booking tidak ditemukan');
                navigate('/user/dashboard');
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            alert('Gagal mengambil data booking');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        
        if (!paymentData.payment_proof.trim()) {
            alert('Silakan masukkan bukti pembayaran');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/payment/submit/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Bukti pembayaran berhasil diupload! Menunggu konfirmasi admin.');
                navigate('/user/dashboard');
            } else {
                alert(result.message || 'Gagal mengupload bukti pembayaran');
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('Gagal mengupload bukti pembayaran');
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Tidak Ditemukan</h2>
                        <button 
                            onClick={() => navigate('/user/dashboard')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Kembali ke Dashboard
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <BackButton
                            to="/user/dashboard"
                            label="Kembali ke Dashboard"
                            variant="secondary"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Pembayaran</h1>
                    
                    {/* Detail Pesanan */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Pesanan</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Layanan:</span>
                                <span className="font-medium">{booking.nama_layanan}</span>
                            </div>

                            {/* Opo Wae specific details */}
                            {booking.layananId === 3 && (
                                <>
                                    {booking.service_name && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Jenis Layanan:</span>
                                            <span className="font-medium">{booking.service_name}</span>
                                        </div>
                                    )}
                                    {booking.service_category && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Kategori:</span>
                                            <span className="font-medium">{booking.service_category}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Psikologi specific details */}
                            {booking.pilih_dokter_psikolog && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dokter:</span>
                                        <span className="font-medium">{booking.pilih_dokter_psikolog}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Spesialisasi:</span>
                                        <span className="font-medium">{booking.spesialisasi}</span>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tanggal:</span>
                                <span className="font-medium">{formatDate(booking.tanggal_booking)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jam:</span>
                                <span className="font-medium">{booking.jam_booking}</span>
                            </div>

                            {/* Show duration only for psikologi */}
                            {booking.layananId !== 3 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Durasi:</span>
                                    <span className="font-medium">{booking.durasi_menit} menit</span>
                                </div>
                            )}

                            {booking.notes && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Catatan:</span>
                                    <span className="font-medium">{booking.notes}</span>
                                </div>
                            )}

                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Pembayaran:</span>
                                    <span className="text-blue-600">{formatCurrency(booking.total_harga)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Pembayaran */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Pembayaran</h2>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.payment_status === 'unpaid' ? 'bg-red-100 text-red-800' :
                                booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {booking.payment_status === 'unpaid' ? 'Belum Dibayar' :
                                 booking.payment_status === 'pending' ? 'Menunggu Konfirmasi' :
                                 booking.payment_status === 'paid' ? 'Sudah Dibayar' :
                                 booking.payment_status === 'rejected' ? 'Ditolak' : booking.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* Form Pembayaran */}
                    {booking.payment_status === 'unpaid' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Bukti Pembayaran</h2>
                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Metode Pembayaran
                                    </label>
                                    <select
                                        value={paymentData.payment_method}
                                        onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="transfer_bank">Transfer Bank</option>
                                        <option value="e_wallet">E-Wallet</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bukti Pembayaran (Link/Keterangan)
                                    </label>
                                    <textarea
                                        value={paymentData.payment_proof}
                                        onChange={(e) => setPaymentData({...paymentData, payment_proof: e.target.value})}
                                        placeholder="Masukkan link bukti pembayaran atau keterangan pembayaran..."
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                                >
                                    {submitting ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Pesan untuk status lain */}
                    {booking.payment_status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800">
                                Bukti pembayaran Anda sedang diverifikasi oleh admin. Mohon tunggu konfirmasi.
                            </p>
                        </div>
                    )}

                    {booking.payment_status === 'paid' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800">
                                Pembayaran Anda telah dikonfirmasi. Terima kasih!
                            </p>
                        </div>
                    )}

                    {booking.payment_status === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800">
                                Pembayaran Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                            </p>
                            {booking.admin_notes && (
                                <p className="text-red-700 mt-2">
                                    <strong>Catatan Admin:</strong> {booking.admin_notes}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Payment;
