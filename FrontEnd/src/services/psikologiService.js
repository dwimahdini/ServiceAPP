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
      // Filter hanya dokter psikologi (layananId = 1)
      return allDokters.filter(dokter => dokter.layananId === 1);
    } catch (error) {
      console.error('Error fetching dokter psikolog:', error);
      throw error;
    }
  },

  // Get dokter by ID (filter dari semua dokter)
  async getDokterById(id) {
    try {
      const allDokter = await this.getDokterPsikolog();
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
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching durasi:', error);
      throw error;
    }
  },

  // Get all layanan
  async getLayanan() {
    try {
      const response = await fetch(`${API_BASE_URL}/simple/layanan`, {
        method: 'GET',
        headers: createHeaders(false),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching layanan:', error);
      throw error;
    }
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tambahbooking`, {
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
      const response = await fetch(`${API_BASE_URL}/getbooking`, {
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
