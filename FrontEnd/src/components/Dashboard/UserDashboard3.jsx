import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import BookingForm from '../Booking/BookingForm';
import { layananAPI, bookingAPI } from '../../services/api';
import { mockLayananAPI, mockBookingAPI } from '../../services/mockAuth';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [layananList, setLayananList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState('konsultasi');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Use mock API for demo - replace with real API calls for production
      const [layananResponse, bookingResponse] = await Promise.all([
        mockLayananAPI.getAll(),
        mockBookingAPI.getAll()
      ]);
      
      setLayananList(layananResponse.data || []);
      setBookingList(bookingResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (type) => {
    setBookingType(type);
    setShowBookingForm(true);
  };

  const handleBookingClose = () => {
    setShowBookingForm(false);
    // Refresh booking list after booking
    fetchData();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="relative bg-cover bg-center h-screen flex items-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Future X
            </h1>
            <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed">
              Welcome back, {user?.name}!
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Solusi terpercaya untuk kebutuhan otomotif dan konsultasi psikologi Anda. 
              Kami hadir dengan layanan profesional dan berkualitas tinggi.
            </p>
            <button
              onClick={() => handleBookingClick('konsultasi')}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Layanan Kami Section */}
      <section id="layanan-kami" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan berbagai layanan berkualitas tinggi untuk memenuhi kebutuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bengkel</h3>
              <p className="text-gray-600 mb-6">
                Layanan perbaikan dan perawatan kendaraan dengan teknisi berpengalaman dan peralatan modern untuk menjaga performa optimal kendaraan Anda.
              </p>
              <button
                onClick={() => navigate('/bengkel')}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
              >
                Cari Bengkel
              </button>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Konsultasi Psikolog</h3>
              <p className="text-gray-600 mb-6">
                Konsultasi profesional dengan psikolog berpengalaman untuk membantu mengatasi berbagai masalah psikologis dan meningkatkan kesehatan mental Anda.
              </p>
              <button
                onClick={() => navigate('/psikologi')}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
              >
                Konsultasi Psikologi
              </button>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Opo Wae</h3>
              <p className="text-gray-600 mb-6">
                Layanan fleksibel dan beragam sesuai kebutuhan Anda. Kami siap membantu dengan berbagai solusi kreatif untuk berbagai keperluan Anda.
              </p>
              <button
                onClick={() => navigate('/opo-wae')}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
              >
                Layanan Harian
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tentang Kami
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Future X merupakan perusahaan yang berkomitmen memberikan layanan terbaik dalam bidang otomotif dan konsultasi psikologi.
                Dengan pengalaman bertahun-tahun, kami memahami kebutuhan pelanggan dan selalu mengutamakan kualitas dalam setiap layanan yang kami berikan.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tim profesional kami terdiri dari teknisi berpengalaman dan psikolog berlisensi yang siap membantu Anda dengan dedikasi tinggi dan pelayanan yang memuaskan.
              </p>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition duration-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Team working"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Kami Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kenapa Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami memberikan nilai lebih dengan komitmen kualitas dan kepuasan pelanggan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Layanan dukungan pelanggan yang tersedia 24 jam sehari, 7 hari seminggu untuk membantu kebutuhan Anda kapan saja.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Garansi</h3>
              <p className="text-gray-600">
                Kami memberikan jaminan 100% untuk setiap layanan yang kami berikan dengan standar kualitas terbaik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jadwalkan Konsultasi Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Jadwalkan Konsultasi
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Siap untuk memulai? Hubungi tim profesional kami sekarang juga untuk mendapatkan konsultasi terbaik sesuai kebutuhan Anda.
              </p>
              <button
                onClick={() => handleBookingClick('konsultasi')}
                className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 transform hover:scale-105"
              >
                Booking Sekarang
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Consultation"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard Overview
            </h2>
            <p className="text-lg text-gray-600">
              Your account summary and quick stats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Services</h3>
              <p className="text-3xl font-bold text-blue-600">{layananList.length}</p>
              <p className="text-gray-500 text-sm">Services ready to book</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Bookings</h3>
              <p className="text-3xl font-bold text-green-600">{bookingList.length}</p>
              <p className="text-gray-500 text-sm">Active bookings</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Status</h3>
              <p className="text-3xl font-bold text-yellow-600">Active</p>
              <p className="text-gray-500 text-sm">Your account is active</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Bookings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              My Bookings
            </h2>
            <p className="text-lg text-gray-600">
              Your recent bookings and appointments
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {bookingList.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {bookingList.map((booking) => (
                  <li key={booking.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Booking #{booking.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            Time: {booking.jam_booking} | Date: {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
                <div className="mt-6">
                  <button
                    onClick={() => handleBookingClick('konsultasi')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={showBookingForm}
        onClose={handleBookingClose}
        serviceType={bookingType}
      />
    </MainLayout>
  );
};

export default UserDashboard;
