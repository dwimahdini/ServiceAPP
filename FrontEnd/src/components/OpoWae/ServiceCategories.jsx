import React, { useState } from 'react';

const ServiceCategories = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock data kategori layanan untuk demo
  const serviceCategories = [
    {
      id: 1,
      nama: 'Transportasi',
      icon: '🚗',
      deskripsi: 'Layanan supir, ojek, rental kendaraan',
      subKategori: ['Supir Pribadi', 'Ojek Online', 'Rental Mobil', 'Rental Motor'],
      estimasiHarga: 'Rp 50.000 - 500.000',
      waktuLayanan: '24 jam'
    },
    {
      id: 2,
      nama: 'Kebersihan',
      icon: '🧹',
      deskripsi: 'Layanan pembersihan rumah, kantor, kendaraan',
      subKategori: ['Cleaning Service', 'Cuci Mobil', 'Cuci Motor', 'Pest Control'],
      estimasiHarga: 'Rp 75.000 - 300.000',
      waktuLayanan: '08:00 - 17:00'
    },
    {
      id: 3,
      nama: 'Perbaikan',
      icon: '🔧',
      deskripsi: 'Layanan perbaikan elektronik, furniture, dll',
      subKategori: ['Service AC', 'Perbaikan TV', 'Furniture Repair', 'Plumbing'],
      estimasiHarga: 'Rp 100.000 - 800.000',
      waktuLayanan: '09:00 - 18:00'
    },
    {
      id: 4,
      nama: 'Kuliner',
      icon: '🍳',
      deskripsi: 'Layanan katering, chef pribadi, delivery',
      subKategori: ['Chef Pribadi', 'Katering Event', 'Meal Prep', 'Delivery Food'],
      estimasiHarga: 'Rp 200.000 - 2.000.000',
      waktuLayanan: 'Fleksibel'
    },
    {
      id: 5,
      nama: 'Perawatan',
      icon: '💆',
      deskripsi: 'Layanan spa, massage, grooming',
      subKategori: ['Massage', 'Spa Treatment', 'Hair Styling', 'Nail Art'],
      estimasiHarga: 'Rp 150.000 - 1.000.000',
      waktuLayanan: '10:00 - 22:00'
    },
    {
      id: 6,
      nama: 'Pendidikan',
      icon: '📚',
      deskripsi: 'Layanan les privat, tutor, kursus',
      subKategori: ['Les Privat', 'Tutor Online', 'Kursus Bahasa', 'Skill Training'],
      estimasiHarga: 'Rp 100.000 - 500.000',
      waktuLayanan: 'Fleksibel'
    },
    {
      id: 7,
      nama: 'Teknologi',
      icon: '💻',
      deskripsi: 'Layanan IT support, web development, dll',
      subKategori: ['IT Support', 'Web Development', 'App Development', 'Digital Marketing'],
      estimasiHarga: 'Rp 300.000 - 5.000.000',
      waktuLayanan: 'Fleksibel'
    },
    {
      id: 8,
      nama: 'Event',
      icon: '🎉',
      deskripsi: 'Layanan event organizer, dekorasi, dll',
      subKategori: ['Event Organizer', 'Dekorasi', 'Photography', 'Entertainment'],
      estimasiHarga: 'Rp 500.000 - 10.000.000',
      waktuLayanan: 'Sesuai Event'
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect && onCategorySelect(category);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Opo Wae - Layanan Harian
        </h2>
        <p className="text-gray-600">
          Temukan berbagai layanan untuk kebutuhan harian Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {serviceCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-md ${
              selectedCategory?.id === category.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.nama}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {category.deskripsi}
              </p>
              <div className="text-xs text-indigo-600 font-medium">
                {category.estimasiHarga}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="border-t pt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{selectedCategory.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCategory.nama}
                </h3>
                <p className="text-gray-600">{selectedCategory.deskripsi}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sub Layanan:</h4>
                <div className="space-y-1">
                  {selectedCategory.subKategori.map((sub, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estimasi Harga:</h4>
                <p className="text-lg font-semibold text-indigo-600">
                  {selectedCategory.estimasiHarga}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Waktu Layanan:</h4>
                <p className="text-gray-600">
                  {selectedCategory.waktuLayanan}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition duration-300">
                Lihat Provider
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                Booking Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-8 border-t">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Kategori Layanan
          </h3>
          <p className="text-gray-600">
            Klik salah satu kategori di atas untuk melihat detail layanan yang tersedia
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceCategories;
