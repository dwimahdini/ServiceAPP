import React, { useState } from 'react';

const JadwalKonsultasi = ({ dokter, onBooking, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30');

  // Mock jadwal untuk demo
  const jadwalMingguIni = [
    { tanggal: '2024-01-15', hari: 'Senin', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    { tanggal: '2024-01-16', hari: 'Selasa', slots: ['09:00', '10:30', '13:00', '14:30'] },
    { tanggal: '2024-01-17', hari: 'Rabu', slots: ['08:00', '09:30', '11:00', '15:00', '16:00'] },
    { tanggal: '2024-01-18', hari: 'Kamis', slots: ['09:00', '10:00', '14:00', '15:30'] },
    { tanggal: '2024-01-19', hari: 'Jumat', slots: ['08:30', '10:00', '11:30', '13:00'] },
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Silakan pilih tanggal dan waktu konsultasi');
      return;
    }

    const bookingData = {
      dokter: dokter,
      tanggal: selectedDate,
      waktu: selectedTime,
      durasi: selectedDuration,
      tarif: selectedDuration === '30' ? dokter.tarif.tigaPuluhMenit : dokter.tarif.enamPuluhMenit
    };

    onBooking && onBooking(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Jadwal Konsultasi - {dokter.nama}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Dokter Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{dokter.nama}</h4>
                <p className="text-sm text-gray-600">{dokter.spesialisasi}</p>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Pilih Durasi Konsultasi:</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDuration('30')}
                className={`p-3 border rounded-lg text-center ${
                  selectedDuration === '30'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">30 Menit</div>
                <div className="text-sm text-gray-600">{dokter.tarif.tigaPuluhMenit}</div>
              </button>
              <button
                onClick={() => setSelectedDuration('60')}
                className={`p-3 border rounded-lg text-center ${
                  selectedDuration === '60'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">60 Menit</div>
                <div className="text-sm text-gray-600">{dokter.tarif.enamPuluhMenit}</div>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Pilih Tanggal:</h4>
            <div className="grid grid-cols-5 gap-2">
              {jadwalMingguIni.map((jadwal) => (
                <button
                  key={jadwal.tanggal}
                  onClick={() => {
                    setSelectedDate(jadwal.tanggal);
                    setSelectedTime(''); // Reset time selection
                  }}
                  className={`p-3 border rounded-lg text-center ${
                    selectedDate === jadwal.tanggal
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-xs text-gray-600">{jadwal.hari}</div>
                  <div className="font-medium">{jadwal.tanggal.split('-')[2]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Pilih Waktu:</h4>
              <div className="grid grid-cols-4 gap-2">
                {jadwalMingguIni
                  .find(j => j.tanggal === selectedDate)
                  ?.slots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 border rounded-lg text-center ${
                        selectedTime === time
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Ringkasan Booking:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Dokter: {dokter.nama}</div>
                <div>Tanggal: {selectedDate}</div>
                <div>Waktu: {selectedTime}</div>
                <div>Durasi: {selectedDuration} menit</div>
                <div className="font-medium">
                  Total: {selectedDuration === '30' ? dokter.tarif.tigaPuluhMenit : dokter.tarif.enamPuluhMenit}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Booking Konsultasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JadwalKonsultasi;
