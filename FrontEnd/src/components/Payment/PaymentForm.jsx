import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [paymentProof, setPaymentProof] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setPaymentProof(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentProof) {
            alert('Silakan pilih bukti pembayaran');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('payment_proof', paymentProof);
        formData.append('bookingId', bookingId);

        try {
            const response = await axios.post('http://localhost:5000/payments/proof', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Bukti pembayaran berhasil diunggah');
                navigate('/bookings');
            }
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            alert(error.response?.data?.msg || 'Terjadi kesalahan saat mengunggah bukti pembayaran');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Bukti Pembayaran</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Bukti Pembayaran
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Format yang didukung: JPG, PNG, JPEG (Max. 2MB)
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Mengunggah...' : 'Upload Bukti Pembayaran'}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm; 