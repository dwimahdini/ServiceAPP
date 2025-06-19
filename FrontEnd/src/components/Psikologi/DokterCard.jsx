import React from 'react';

const DokterCard = ({ dokter, onSelectJadwal, onBooking }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {dokter.foto ? (
            <img
              src={dokter.foto}
              alt={dokter.pilih_dokter_psikolog}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {dokter.pilih_dokter_psikolog}
          </h3>
          <p className="text-indigo-600 font-medium mb-2">
            {dokter.spesialisasi}
          </p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {dokter.pengalaman}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Berpengalaman
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tarif Konsultasi:</h4>
        <div className="text-lg font-semibold text-indigo-600">
          {dokter.tarif_per_jam ? `Rp ${parseFloat(dokter.tarif_per_jam).toLocaleString('id-ID')}/jam` : 'Hubungi dokter'}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          30 menit: {dokter.tarif_per_jam ? `Rp ${(parseFloat(dokter.tarif_per_jam) * 0.5).toLocaleString('id-ID')}` : 'Hubungi dokter'}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSelectJadwal && onSelectJadwal(dokter)}
          className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition duration-300"
        >
          Lihat Jadwal
        </button>
        <button
          onClick={() => onBooking && onBooking(dokter)}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Konsultasi Sekarang
        </button>
      </div>
    </div>
  );
};

export default DokterCard;
