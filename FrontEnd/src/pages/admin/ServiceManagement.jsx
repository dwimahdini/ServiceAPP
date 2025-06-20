import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import DokterManagement from '../../components/Admin/DokterManagement';

import ProdukBengkelManagement from '../../components/Admin/ProdukBengkelManagement';

import BengkelManagement from '../../components/Admin/BengkelManagement';
import LayananOpoWaeManagement from '../../components/Admin/LayananOpoWaeManagement';

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
      description: 'Kelola dokter/psikolog',
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
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'psikologi':
        return <PsikologiManagement />;
      case 'bengkel':
        return <BengkelManagementSection />;
      case 'opo-wae':
        return <OpoWaeManagement />;
      default:
        return <PsikologiManagement />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Kelola Layanan</h1>
            <p className="text-gray-600 mt-1">Kelola data untuk ketiga fitur layanan utama</p>
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
      </div>
    </MainLayout>
  );
};

// Komponen untuk mengelola Psikologi
const PsikologiManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">🧠</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan Psikologi</h2>
          <p className="text-gray-600">Tambah dan kelola dokter/psikolog</p>
        </div>
      </div>

      {/* Section Content - Langsung tampilkan DokterManagement */}
      <div className="bg-gray-50 rounded-lg p-6">
        <DokterManagement />
      </div>
    </div>
  );
};

// Komponen untuk mengelola Bengkel
const BengkelManagementSection = () => {
  const [activeSection, setActiveSection] = useState('bengkel');

  const sections = [
    { id: 'bengkel', name: 'Data Bengkel', icon: '🏪' },
    { id: 'produk', name: 'Produk/Spare Part', icon: '⚙️' }
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
        {activeSection === 'bengkel' && <BengkelManagement />}
        {activeSection === 'produk' && <ProdukBengkelManagement />}
      </div>
    </div>
  );
};

// Komponen untuk mengelola Opo Wae
const OpoWaeManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">🏠</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan Opo Wae</h2>
          <p className="text-gray-600">Tambah dan kelola jenis layanan harian</p>
        </div>
      </div>

      {/* Section Content - Langsung tampilkan LayananOpoWaeManagement */}
      <div className="bg-gray-50 rounded-lg p-6">
        <LayananOpoWaeManagement />
      </div>
    </div>
  );
};

// All management components are now implemented



export default ServiceManagement;
