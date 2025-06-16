import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = ({ dokterId, layananId, durasiId, totalHarga }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jam_booking: '',
        tanggal_booking: '',
        layananId: layananId,
        dokterpsikologId: dokterId,
        durasiId: durasiId,
        total_harga: totalHarga || 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/bookings', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.bookingId) {
                // Redirect ke halaman pembayaran
                navigate(`/payment/${response.data.bookingId}`);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert(error.response?.data?.msg || 'Terjadi kesalahan saat membuat booking');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Buat Booking</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tanggal Booking
                    </label>
                    <input
                        type="date"
                        name="tanggal_booking"
                        value={formData.tanggal_booking}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Jam Booking
                    </label>
                    <input
                        type="time"
                        name="jam_booking"
                        value={formData.jam_booking}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Total Harga
                    </label>
                    <input
                        type="text"
                        value={`Rp ${(formData.total_harga || 0).toLocaleString()}`}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                        disabled
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Buat Booking
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
