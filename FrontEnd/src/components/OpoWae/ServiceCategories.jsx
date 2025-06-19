import React, { useState, useEffect } from 'react';
import { opoWaeService } from '../../services/opoWaeService';

const ServiceCategories = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch kategori layanan dari database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categories = await opoWaeService.getKategoriLayanan();
        setServiceCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setServiceCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect && onCategorySelect(category);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Opo Wae - Layanan Harian
          </h2>
          <p className="text-gray-600">
            Memuat kategori layanan...
          </p>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Opo Wae - Layanan Harian
        </h2>
        <p className="text-gray-600">
          {serviceCategories.length > 0
            ? "Temukan berbagai layanan untuk kebutuhan harian Anda"
            : "Belum ada kategori layanan tersedia"
          }
        </p>
      </div>

      {serviceCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada layanan tersedia</h3>
          <p className="text-gray-500">Admin belum menambahkan layanan Opo Wae ke sistem.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {serviceCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition duration-300 hover:shadow-md ${
              selectedCategory?.id === category.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {category.nama}
              </h3>
              <p className="text-sm text-gray-600">
                {category.deskripsi}
              </p>
            </div>
          </div>
        ))}
        </div>
      )}

      {selectedCategory && serviceCategories.length > 0 && (
        <div className="border-t pt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${selectedCategory.color} rounded-full flex items-center justify-center`}>
                <span className="text-xl">{selectedCategory.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCategory.nama}
                </h3>
                <p className="text-gray-600">{selectedCategory.deskripsi}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Pilih kategori ini untuk melihat penyedia layanan yang tersedia
              </p>
              <button
                onClick={() => onCategorySelect && onCategorySelect(selectedCategory)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Lihat Penyedia Layanan
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedCategory && serviceCategories.length > 0 && (
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
