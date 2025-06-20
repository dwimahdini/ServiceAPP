// Base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper function untuk handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

// Helper function untuk get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function untuk create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Booking Service - Universal untuk semua layanan
export const bookingService = {
  // Create booking untuk semua jenis layanan
  async createBooking(bookingData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User tidak ditemukan. Silakan login terlebih dahulu.');
      }

      // Prepare booking data dengan user ID
      const finalBookingData = {
        ...bookingData,
        userId: user.id,
        tanggal_booking: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        status: 'pending',
        payment_status: 'pending'
      };

      console.log('Creating booking with data:', finalBookingData);

      const response = await fetch(`${API_BASE_URL}/tambahbooking`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(finalBookingData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get user bookings
  async getUserBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/getbooking`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/getbooking/${id}`, {
        method: 'GET',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/updatebooking/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(id) {
    try {
      return await this.updateBookingStatus(id, 'cancelled');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Helper functions untuk format booking data berdasarkan jenis layanan

  // Format booking data untuk Psikologi
  formatPsikologiBooking(formData) {
    return {
      layananId: 1, // Psikologi
      dokterpsikologId: parseInt(formData.pilih_dokter_psikolog),
      durasi_jam: parseInt(formData.durasi_konsultasi) || 1, // Durasi dalam jam
      jam_booking: formData.pilih_jam,
      hari_booking: formData.pilih_hari,
      notes: `Konsultasi dengan ${formData.nama_lengkap || 'Pasien'} - ${formData.durasi_konsultasi} jam`
    };
  },

  // Format booking data untuk Bengkel
  formatBengkelBooking(bengkelData, produkData = null) {
    return {
      layananId: 2, // Bengkel
      bengkelId: parseInt(bengkelData.id),
      produkId: produkData ? parseInt(produkData.id) : null,
      jam_booking: new Date().toTimeString().split(' ')[0], // Current time
      notes: `Booking bengkel: ${bengkelData.nama_bengkel}`
    };
  },

  // Format booking data untuk Opo Wae
  formatOpoWaeBooking(layananData) {
    return {
      layananId: 3, // Opo Wae
      pilihLayananId: parseInt(layananData.id),
      jam_booking: new Date().toTimeString().split(' ')[0], // Current time
      notes: `Booking layanan: ${layananData.nama_pilihan}`
    };
  },

  // Validate booking data
  validateBookingData(bookingData) {
    const requiredFields = ['layananId'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Field wajib tidak lengkap: ${missingFields.join(', ')}`);
    }

    // Validate layananId
    if (![1, 2, 3].includes(bookingData.layananId)) {
      throw new Error('Jenis layanan tidak valid');
    }

    // Specific validation based on service type
    switch (bookingData.layananId) {
      case 1: // Psikologi
        if (!bookingData.dokterpsikologId) {
          throw new Error('Dokter/Psikolog harus dipilih');
        }
        if (!bookingData.jam_booking) {
          throw new Error('Jam booking harus diisi');
        }
        if (!bookingData.hari_booking) {
          throw new Error('Hari konsultasi harus dipilih');
        }
        break;
      case 2: // Bengkel
        if (!bookingData.bengkelId) {
          throw new Error('Bengkel harus dipilih');
        }
        break;
      case 3: // Opo Wae
        if (!bookingData.pilihLayananId) {
          throw new Error('Jenis layanan harus dipilih');
        }
        break;
    }

    return true;
  },

  // Create booking dengan validasi
  async createValidatedBooking(bookingData) {
    try {
      // Validate data first
      this.validateBookingData(bookingData);
      
      // Create booking
      return await this.createBooking(bookingData);
    } catch (error) {
      console.error('Error creating validated booking:', error);
      throw error;
    }
  }
};

export default bookingService;
