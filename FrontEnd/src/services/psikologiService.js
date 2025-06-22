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

// Psikologi Service
export const psikologiService = {
  // Get all dokter/psikolog
  async getDokterPsikolog() {
    try {
      const response = await fetch(`${API_BASE_URL}/simple/dokter`, {
        method: 'GET',
        headers: createHeaders(false), // Tidak perlu auth untuk melihat daftar dokter
      });
      const allDokters = await handleResponse(response);
      console.log('All dokters from API:', allDokters);
      // Filter hanya dokter psikologi (layananId = 1)
      const psikologDokters = allDokters.filter(dokter => dokter.layananId === 1);
      console.log('Filtered psikolog dokters:', psikologDokters);
      return psikologDokters;
    } catch (error) {
      console.error('Error fetching dokter psikolog:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Get dokter by ID (filter dari semua dokter)
  async getDokterById(id) {
    try {
      // Validasi ID
      if (!id || isNaN(parseInt(id))) {
        throw new Error('ID dokter tidak valid');
      }

      const allDokter = await this.getDokterPsikolog();

      if (!Array.isArray(allDokter) || allDokter.length === 0) {
        throw new Error('Tidak ada data dokter tersedia');
      }

      const dokter = allDokter.find(d => d.id === parseInt(id));

      if (!dokter) {
        throw new Error('Dokter tidak ditemukan');
      }

      return dokter;
    } catch (error) {
      console.error('Error fetching dokter by ID:', error);
      throw error;
    }
  },

  // Get all durasi
  async getDurasi() {
    try {
      const response = await fetch(`${API_BASE_URL}/simple/durasi`, {
        method: 'GET',
        headers: createHeaders(false),
      });
      const allDurasi = await handleResponse(response);
      // Return static durasi options
      return allDurasi;
    } catch (error) {
      console.error('Error fetching durasi:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Get all layanan
  async getLayanan() {
    try {
      const response = await fetch(`${API_BASE_URL}/simple/layanan`, {
        method: 'GET',
        headers: createHeaders(false),
      });
      const allLayanan = await handleResponse(response);
      console.log('All layanan from API:', allLayanan);
      // Filter hanya layanan psikologi (id = 1)
      const psikologLayanan = allLayanan.filter(layanan => layanan.id === 1);
      console.log('Filtered psikolog layanan:', psikologLayanan);
      return psikologLayanan;
    } catch (error) {
      console.error('Error fetching layanan:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: createHeaders(true), // Perlu auth untuk booking
        body: JSON.stringify(bookingData),
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
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: createHeaders(true), // Perlu auth untuk melihat booking sendiri
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Add dokter/psikolog (admin only)
  async addDokterPsikolog(dokterData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tambahpilihdokterpsikolog`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(dokterData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding dokter psikolog:', error);
      throw error;
    }
  },

  // Add durasi (admin only)
  async addDurasi(durasiData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tambahdurasi`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(durasiData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding durasi:', error);
      throw error;
    }
  }
};

export default psikologiService;
