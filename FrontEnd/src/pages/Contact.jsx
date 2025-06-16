import React from 'react';
import Footer from '../components/Layout/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Konten placeholder, bisa diganti dengan info kontak */}
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8">Silakan hubungi kami melalui form di bawah atau melalui informasi kontak yang tersedia di footer.</p>
          {/* Placeholder form atau info */}
          <div className="bg-gray-100 rounded-lg p-8 shadow">
            <p className="text-gray-500">(Form kontak atau info kontak bisa diletakkan di sini)</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact; 