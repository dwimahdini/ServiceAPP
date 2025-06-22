import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import ServiceCard from '../components/UI/ServiceCard';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Bengkel"
              description="Temukan bengkel terpercaya di sekitar Anda"
              icon="🔧"
              link="/bengkel"
            />
            <ServiceCard
              title="Psikologi"
              description="Konsultasi dengan psikolog profesional"
              icon="🧠"
              link="/psikologi"
            />
            <ServiceCard
              title="Opo Wae"
              description="Layanan kebutuhan sehari-hari"
              icon="🛍️"
              link="/opo-wae"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
