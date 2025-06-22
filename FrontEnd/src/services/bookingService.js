// Base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper function untuk handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.msg || errorData.message || errorMessage;

      // Log debug info if available
      if (errorData.debug) {
        console.error('API Error Debug Info:', errorData.debug);
      }
    } catch (e) {
      // If JSON parsing fails, try text
      try {
        errorMessage = await response.text();
      } catch (textError) {
        console.error('Failed to parse error response:', textError);
      }
    }
    throw new Error(errorMessage);
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
        // Pastikan tanggal_booking ada, jika tidak gunakan hari ini
        tanggal_booking: bookingData.tanggal_booking || new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        status: 'pending',
        payment_status: 'unpaid'
      };

      // Use the correct endpoint based on the controller
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

    // Map durasi jam ke durasiId berdasarkan database
    const durasiMapping = {
      1: 1, // 1 jam -> durasiId 1 (60 menit)
      3: 2, // 3 jam -> durasiId 2 (180 menit)
      5: 3  // 5 jam -> durasiId 3 (300 menit)
    };

    const durasiJam = parseInt(formData.durasi_konsultasi) || 1;
    const durasiId = durasiMapping[durasiJam] || 1;

    // Calculate total price based on duration and doctor's rate
    const tarifPerJam = parseFloat(formData.tarif_per_jam) || 0;
    const totalHarga = tarifPerJam * durasiJam;

    // Get booking date - improved date handling
    let tanggalBooking;
    if (formData.pilih_hari) {
      // Convert day name to actual date
      const today = new Date();
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const targetDayIndex = dayNames.indexOf(formData.pilih_hari);

      if (targetDayIndex !== -1) {
        const currentDayIndex = today.getDay();
        let daysToAdd = targetDayIndex - currentDayIndex;

        // If target day is today or in the past, schedule for next week
        if (daysToAdd <= 0) {
          daysToAdd += 7;
        }

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);
        tanggalBooking = targetDate.toISOString().split('T')[0];
      } else {
        // Fallback to today if day name not recognized
        tanggalBooking = today.toISOString().split('T')[0];
      }
    } else {
      tanggalBooking = new Date().toISOString().split('T')[0];
    }

    // Ambil nama user dari localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.name || 'Pasien';

    const bookingData = {
      layananId: 1, // Psikologi
      dokterpsikologId: parseInt(formData.pilih_dokter_psikolog),
      durasi_menit: durasiJam * 60, // Convert jam ke menit untuk backend
      jam_booking: formData.pilih_jam,
      tanggal_booking: tanggalBooking, // Format YYYY-MM-DD
      total_harga: totalHarga,
      notes: `Konsultasi ${formData.pilih_hari} dengan ${userName} - ${durasiJam} jam`
    };

    return bookingData;
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
      tanggal_booking: new Date().toISOString().split('T')[0], // Today's date
      total_harga: parseFloat(layananData.harga),
      notes: `Booking layanan: ${layananData.nama_pilihan}`
    };
  },

  // Validate booking data - SIMPLIFIED
  validateBookingData(bookingData) {
    // Simple validation - check if we have pilihLayananId for Opo Wae
    if (bookingData.pilihLayananId) {
      // This is Opo Wae booking - only need pilihLayananId
      if (!bookingData.pilihLayananId) {
        throw new Error('Layanan harus dipilih');
      }
      return true;
    }

    // For other services, check layananId
    if (bookingData.layananId) {
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
          if (!bookingData.durasi_menit) {
            throw new Error('Durasi konsultasi harus dipilih');
          }
          break;
        case 2: // Bengkel
          if (!bookingData.bengkelId) {
            throw new Error('Bengkel harus dipilih');
          }
          break;
      }
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
