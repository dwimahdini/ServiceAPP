import React, { useState, useEffect } from 'react';

const BengkelMap = ({ userLocation, onBengkelSelect }) => {
  const [bengkelList, setBengkelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(userLocation || '');

  // Mock data bengkel untuk demo
  const mockBengkelData = [
    {
      id: 1,
      nama: 'Bengkel Jaya Motor',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      jarak: '2.5 km',
      rating: 4.5,
      telepon: '021-1234567',
      jamBuka: '08:00 - 17:00',
      layanan: ['Service Rutin', 'Ganti Oli', 'Tune Up']
    },
    {
      id: 2,
      nama: 'Auto Service Center',
      alamat: 'Jl. Gatot Subroto No. 456, Jakarta',
      jarak: '3.2 km',
      rating: 4.2,
      telepon: '021-7654321',
      jamBuka: '07:00 - 18:00',
      layanan: ['AC Mobil', 'Rem', 'Transmisi']
    },
    {
      id: 3,
      nama: 'Bengkel Mandiri',
      alamat: 'Jl. Thamrin No. 789, Jakarta',
      jarak: '4.1 km',
      rating: 4.7,
      telepon: '021-9876543',
      jamBuka: '08:30 - 16:30',
      layanan: ['Body Repair', 'Cat Mobil', 'Denting']
    }
  ];

  useEffect(() => {
    if (selectedLocation) {
      searchNearbyBengkel();
    }
  }, [selectedLocation]);

  const searchNearbyBengkel = async () => {
    setLoading(true);
    try {
      // Simulasi API call
      setTimeout(() => {
        setBengkelList(mockBengkelData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bengkel:', error);
      setLoading(false);
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (selectedLocation.trim()) {
      searchNearbyBengkel();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi. Silakan masukkan alamat secara manual.');
        }
      );
    } else {
      alert('Geolocation tidak didukung oleh browser ini.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Cari Bengkel Terdekat
      </h3>

      {/* Location Input */}
      <form onSubmit={handleLocationSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="Masukkan alamat atau lokasi Anda..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition duration-300"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </div>
      </form>

      {/* Map Placeholder */}
      <div className="mb-6">
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            <p className="text-gray-500">Peta akan ditampilkan di sini</p>
            <p className="text-sm text-gray-400">Integrasi dengan Google Maps/Mapbox</p>
          </div>
        </div>
      </div>

      {/* Bengkel List */}
      {bengkelList.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Bengkel Terdekat ({bengkelList.length} ditemukan)
          </h4>
          <div className="space-y-4">
            {bengkelList.map((bengkel) => (
              <div
                key={bengkel.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300 cursor-pointer"
                onClick={() => onBengkelSelect && onBengkelSelect(bengkel)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-900">{bengkel.nama}</h5>
                  <span className="text-sm text-indigo-600 font-medium">{bengkel.jarak}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{bengkel.alamat}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {bengkel.rating}
                  </span>
                  <span>{bengkel.telepon}</span>
                  <span>{bengkel.jamBuka}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bengkel.layanan.map((layanan, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {layanan}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Mencari bengkel terdekat...</p>
        </div>
      )}
    </div>
  );
};

export default BengkelMap;
