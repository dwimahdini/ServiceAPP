import React from 'react';

const DokterCard = ({ dokter, onSelectJadwal, onBooking }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {dokter.foto ? (
            <img 
              src={dokter.foto} 
              alt={dokter.nama}
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
            {dokter.nama}
          </h3>
          <p className="text-indigo-600 font-medium mb-2">
            {dokter.spesialisasi}
          </p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {dokter.pengalaman} tahun pengalaman
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {dokter.rating} ({dokter.jumlahReview} review)
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Biografi:</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {dokter.biografi}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Keahlian:</h4>
        <div className="flex flex-wrap gap-1">
          {dokter.keahlian.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tarif Konsultasi:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">30 menit:</span>
            <span className="font-medium">{dokter.tarif.tigaPuluhMenit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">60 menit:</span>
            <span className="font-medium">{dokter.tarif.enamPuluhMenit}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Jadwal Tersedia:</h4>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {dokter.jadwalTersedia.map((jadwal, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-center"
            >
              {jadwal}
            </span>
          ))}
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
