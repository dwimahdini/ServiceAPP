import React, { useState } from 'react';

const BookingConfirmation = ({ layanan, onConfirm, onCancel, loading }) => {
  const servicePrice = parseFloat(layanan.harga) || 0;
  const totalAmount = servicePrice; // Tidak ada biaya admin

  const handleConfirm = () => {
    // Sistem super sederhana seperti psikologi
    const bookingData = {
      pilihLayananId: layanan.id,
      total_harga: servicePrice,
      notes: `Booking layanan: ${layanan.nama_pilihan}`
    };
    onConfirm(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Konfirmasi Booking
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Service Details - Simplified */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Detail Layanan</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Layanan:</span>
              <span className="font-medium">{layanan.nama_pilihan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kategori:</span>
              <span>{layanan.kategori || 'Layanan Umum'}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-gray-900">Total Pembayaran:</span>
              <span className="text-indigo-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Simple Action Buttons - No complex form */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Konfirmasi Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
