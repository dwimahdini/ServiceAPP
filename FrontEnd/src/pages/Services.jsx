import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import ServiceList from '../components/Services/ServiceList';

const Services = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Layanan Kami
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Temukan berbagai layanan berkualitas tinggi yang kami tawarkan untuk memenuhi kebutuhan Anda
            </p>
          </div>
        </section>

        {/* Services Content */}
        <ServiceList />
      </div>
    </MainLayout>
  );
};

export default Services;
