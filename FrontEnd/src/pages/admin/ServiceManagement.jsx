import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import DokterManagement from '../../components/Admin/DokterManagement';
import DurasiManagement from '../../components/Admin/DurasiManagement';
import JenisKonsultasiManagement from '../../components/Admin/JenisKonsultasiManagement';
import LayananBengkelManagement from '../../components/Admin/LayananBengkelManagement';
import ProdukBengkelManagement from '../../components/Admin/ProdukBengkelManagement';
import MerekKendaraanManagement from '../../components/Admin/MerekKendaraanManagement';
import LayananOpoWaeManagement from '../../components/Admin/LayananOpoWaeManagement';
import PekerjaManagement from '../../components/Admin/PekerjaManagement';
import TarifManagement from '../../components/Admin/TarifManagement';
import DatabaseTestPanel from '../../components/Admin/DatabaseTestPanel';

const ServiceManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('psikologi');
  const [loading, setLoading] = useState(false);

  // Data untuk 3 fitur layanan utama
  const services = [
    {
      id: 'psikologi',
      name: 'Psikologi',
      icon: '🧠',
      description: 'Kelola dokter, durasi konsultasi, dan jenis layanan psikologi',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'bengkel',
      name: 'Bengkel',
      icon: '🔧',
      description: 'Kelola layanan bengkel, produk, dan spare part',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'opo-wae',
      name: 'Opo Wae',
      icon: '🏠',
      description: 'Kelola layanan harian seperti driver, cleaner, babysitter',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'database-test',
      name: 'Database Test',
      icon: '🗄️',
      description: 'Test koneksi dan penyimpanan data ke MySQL database',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'psikologi':
        return <PsikologiManagement />;
      case 'bengkel':
        return <BengkelManagement />;
      case 'opo-wae':
        return <OpoWaeManagement />;
      case 'database-test':
        return <DatabaseTestPanel />;
      default:
        return <PsikologiManagement />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Layanan</h1>
            <p className="text-gray-600 mt-1">Kelola data untuk ketiga fitur layanan utama</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {/* Service Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === service.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{service.icon}</span>
                    <span>{service.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Komponen untuk mengelola Psikologi
const PsikologiManagement = () => {
  const [activeSection, setActiveSection] = useState('dokter');

  const sections = [
    { id: 'dokter', name: 'Dokter/Psikolog', icon: '👨‍⚕️' },
    { id: 'durasi', name: 'Durasi Konsultasi', icon: '⏰' },
    { id: 'jenis', name: 'Jenis Konsultasi', icon: '💬' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">🧠</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan Psikologi</h2>
          <p className="text-gray-600">Tambah dan kelola dokter, durasi, serta jenis konsultasi</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-4 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            <span className="font-medium">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeSection === 'dokter' && <DokterManagement />}
        {activeSection === 'durasi' && <DurasiManagement />}
        {activeSection === 'jenis' && <JenisKonsultasiManagement />}
      </div>
    </div>
  );
};

// Komponen untuk mengelola Bengkel
const BengkelManagement = () => {
  const [activeSection, setActiveSection] = useState('layanan');

  const sections = [
    { id: 'layanan', name: 'Jenis Layanan', icon: '🔧' },
    { id: 'produk', name: 'Produk/Spare Part', icon: '⚙️' },
    { id: 'merek', name: 'Merek Kendaraan', icon: '🏷️' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">🔧</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan Bengkel</h2>
          <p className="text-gray-600">Tambah dan kelola layanan bengkel, produk, dan spare part</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-4 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            <span className="font-medium">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeSection === 'layanan' && <LayananBengkelManagement />}
        {activeSection === 'produk' && <ProdukBengkelManagement />}
        {activeSection === 'merek' && <MerekKendaraanManagement />}
      </div>
    </div>
  );
};

// Komponen untuk mengelola Opo Wae
const OpoWaeManagement = () => {
  const [activeSection, setActiveSection] = useState('layanan');

  const sections = [
    { id: 'layanan', name: 'Jenis Layanan', icon: '🏠' },
    { id: 'pekerja', name: 'Pekerja/Provider', icon: '👥' },
    { id: 'tarif', name: 'Tarif & Harga', icon: '💰' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">🏠</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan Opo Wae</h2>
          <p className="text-gray-600">Tambah dan kelola layanan harian, pekerja, dan tarif</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-4 mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            <span className="font-medium">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeSection === 'layanan' && <LayananOpoWaeManagement />}
        {activeSection === 'pekerja' && <PekerjaManagement />}
        {activeSection === 'tarif' && <TarifManagement />}
      </div>
    </div>
  );
};

// All management components are now implemented



export default ServiceManagement;
