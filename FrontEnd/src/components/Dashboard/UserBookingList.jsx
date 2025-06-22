import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserBookingList = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/payment/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.success) {
                setBookings(result.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
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

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            'unpaid': { bg: 'bg-red-100', text: 'text-red-800', label: 'Belum Dibayar' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Konfirmasi' },
            'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'Sudah Dibayar' },
            'rejected': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Ditolak' }
        };
        
        const config = statusConfig[status] || statusConfig['unpaid'];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const handlePaymentClick = (bookingId) => {
        navigate(`/payment/${bookingId}`);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Riwayat Booking</h3>
            </div>
            
            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada booking</h3>
                    <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat booking baru.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Booking #{booking.id} - {booking.nama_layanan}
                                        </h4>
                                        {getPaymentStatusBadge(booking.payment_status)}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {booking.pilih_dokter_psikolog && (
                                            <div>Dokter: {booking.pilih_dokter_psikolog}</div>
                                        )}
                                        <div>Tanggal: {formatDate(booking.tanggal_booking)}</div>
                                        <div>Jam: {booking.jam_booking}</div>
                                        <div>Durasi: {booking.durasi_menit} menit</div>
                                        <div className="font-medium text-blue-600">
                                            Total: {formatCurrency(booking.total_harga)}
                                        </div>
                                        {booking.admin_notes && (
                                            <div className="text-red-600 text-xs">
                                                Catatan Admin: {booking.admin_notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="ml-4 flex flex-col space-y-2">
                                    {booking.payment_status === 'unpaid' && (
                                        <button
                                            onClick={() => handlePaymentClick(booking.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                        >
                                            Bayar Sekarang
                                        </button>
                                    )}
                                    {booking.payment_status === 'pending' && (
                                        <button
                                            onClick={() => handlePaymentClick(booking.id)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700"
                                        >
                                            Lihat Status
                                        </button>
                                    )}
                                    {booking.payment_status === 'paid' && (
                                        <button
                                            onClick={() => handlePaymentClick(booking.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                                        >
                                            Lihat Detail
                                        </button>
                                    )}
                                    {booking.payment_status === 'rejected' && (
                                        <button
                                            onClick={() => handlePaymentClick(booking.id)}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                                        >
                                            Lihat Detail
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookingList;
