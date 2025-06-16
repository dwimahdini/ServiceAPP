import React, { useState, useEffect } from 'react';

const ServiceList = () => {
  const [layananList, setLayananList] = useState([]);
  const [pilihanLayanan, setPilihanLayanan] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [durasiList, setDurasiList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('layanan');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data
      const [layananRes, pilihanRes, dokterRes, durasiRes, produkRes] = await Promise.all([
        fetch('/api/getlayanan'),
        fetch('/api/getpilihlayanan'),
        fetch('/api/getpilihdokterpsikolog'),
        fetch('/api/getdurasi'),
        fetch('/api/getproduk')
      ]);

      const layananData = await layananRes.json();
      const pilihanData = await pilihanRes.json();
      const dokterData = await dokterRes.json();
      const durasiData = await durasiRes.json();
      const produkData = await produkRes.json();

      setLayananList(layananData.data || []);
      setPilihanLayanan(pilihanData.data || []);
      setDokterList(dokterData.data || []);
      setDurasiList(durasiData.data || []);
      setProdukList(produkData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Layanan Kami
        </h2>
        <p className="text-lg text-gray-600">
          Jelajahi berbagai layanan yang tersedia
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('layanan')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'layanan'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Layanan Utama
          </button>
          <button
            onClick={() => setActiveTab('dokter')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dokter'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dokter/Psikolog
          </button>
          <button
            onClick={() => setActiveTab('produk')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'produk'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab('durasi')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'durasi'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Paket Durasi
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'layanan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layananList.map((layanan) => (
              <div key={layanan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {layanan.nama_layanan}
                </h3>
                <p className="text-gray-600 mb-4">
                  {layanan.deskripsi || 'Layanan berkualitas tinggi dengan standar profesional.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600">
                    {layanan.harga || 'Hubungi Kami'}
                  </span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                    Pilih
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dokter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dokterList.map((dokter) => (
              <div key={dokter.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {dokter.nama_dokter}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {dokter.spesialisasi || 'Psikolog Profesional'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {dokter.pengalaman || 'Berpengalaman dalam bidang psikologi'}
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                    Konsultasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'produk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produkList.map((produk) => (
              <div key={produk.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {produk.nama_produk}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {produk.deskripsi || 'Produk berkualitas tinggi'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600">
                    {produk.harga || 'Hubungi Kami'}
                  </span>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition duration-300 text-sm">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'durasi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {durasiList.map((durasi) => (
              <div key={durasi.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border-l-4 border-indigo-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {durasi.durasi}
                </h3>
                <p className="text-gray-600 mb-4">
                  {durasi.deskripsi || 'Paket layanan dengan durasi yang fleksibel sesuai kebutuhan Anda.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {durasi.harga}
                  </span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                    Pilih Paket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'layanan' && layananList.length === 0) ||
          (activeTab === 'dokter' && dokterList.length === 0) ||
          (activeTab === 'produk' && produkList.length === 0) ||
          (activeTab === 'durasi' && durasiList.length === 0)) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'layanan' && 'Belum ada layanan yang tersedia.'}
              {activeTab === 'dokter' && 'Belum ada dokter/psikolog yang tersedia.'}
              {activeTab === 'produk' && 'Belum ada produk yang tersedia.'}
              {activeTab === 'durasi' && 'Belum ada paket durasi yang tersedia.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
