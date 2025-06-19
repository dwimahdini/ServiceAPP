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

// Opo Wae Service
export const opoWaeService = {
  // Get all layanan opo wae
  async getAllLayanan() {
    try {
      const response = await fetch(`${API_BASE_URL}/getpilihlayanan`, {
        method: 'GET',
        headers: createHeaders(false), // Tidak perlu auth untuk melihat daftar layanan
      });
      const result = await handleResponse(response);
      
      // Handle response format sesuai dokumentasi
      if (result.data) {
        // Filter hanya layanan Opo Wae (layananId = 3)
        return result.data.filter(layanan => layanan.layananId === 3);
      }
      
      return result.filter ? result.filter(layanan => layanan.layananId === 3) : [];
    } catch (error) {
      console.error('Error fetching opo wae layanan:', error);
      throw error;
    }
  },

  // Get layanan by kategori
  async getLayananByKategori(kategori) {
    try {
      const allLayanan = await this.getAllLayanan();
      return allLayanan.filter(layanan => {
        const inferredCategory = this.inferCategoryFromName(layanan.nama_pilihan);
        return inferredCategory === kategori.toLowerCase();
      });
    } catch (error) {
      console.error('Error fetching layanan by kategori:', error);
      throw error;
    }
  },

  // Get layanan by ID
  async getLayananById(id) {
    try {
      const allLayanan = await this.getAllLayanan();
      const layanan = allLayanan.find(l => l.id === parseInt(id));
      if (!layanan) {
        throw new Error('Layanan tidak ditemukan');
      }
      return layanan;
    } catch (error) {
      console.error('Error fetching layanan by ID:', error);
      throw error;
    }
  },

  // Create booking untuk layanan opo wae
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tambahbooking`, {
        method: 'POST',
        headers: createHeaders(true), // Perlu auth untuk booking
        body: JSON.stringify(bookingData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating opo wae booking:', error);
      throw error;
    }
  },

  // Add layanan opo wae (admin only)
  async addLayanan(layananData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pilihlayanan`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify({
          ...layananData,
          layananId: 3 // Opo Wae layanan ID
        }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding opo wae layanan:', error);
      throw error;
    }
  },

  // Update layanan opo wae (admin only)
  async updateLayanan(id, layananData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pilihlayanan/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(layananData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating opo wae layanan:', error);
      throw error;
    }
  },

  // Delete layanan opo wae (admin only)
  async deleteLayanan(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pilihlayanan/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting opo wae layanan:', error);
      throw error;
    }
  },

  // Get kategori layanan yang tersedia dari database
  async getKategoriLayanan() {
    try {
      const allLayanan = await this.getAllLayanan();

      // Jika tidak ada data di database, return array kosong
      if (!allLayanan || allLayanan.length === 0) {
        return [];
      }

      // Untuk sementara, buat kategori berdasarkan nama layanan yang ada
      // Ini akan diganti ketika field kategori sudah ada di database
      const categories = allLayanan.map(layanan => {
        const kategori = this.inferCategoryFromName(layanan.nama_pilihan);
        return {
          id: kategori,
          nama: this.getCategoryDisplayName(kategori),
          icon: this.getCategoryIcon(kategori),
          deskripsi: this.getCategoryDescription(kategori),
          color: this.getCategoryColor(kategori)
        };
      });

      // Remove duplicates
      const uniqueCategories = categories.filter((category, index, self) =>
        index === self.findIndex(c => c.id === category.id)
      );

      return uniqueCategories;
    } catch (error) {
      console.error('Error fetching kategori layanan:', error);
      return [];
    }
  },

  // Infer category from service name
  inferCategoryFromName(nama) {
    const name = nama.toLowerCase();
    if (name.includes('driver') || name.includes('ojek') || name.includes('transport')) {
      return 'transport';
    } else if (name.includes('cleaning') || name.includes('bersih') || name.includes('laundry')) {
      return 'cleaning';
    } else if (name.includes('baby') || name.includes('anak') || name.includes('pengasuh')) {
      return 'childcare';
    } else if (name.includes('tukang') || name.includes('perbaikan') || name.includes('maintenance')) {
      return 'maintenance';
    } else if (name.includes('pijat') || name.includes('spa') || name.includes('massage')) {
      return 'massage';
    } else if (name.includes('masak') || name.includes('catering') || name.includes('cook')) {
      return 'cooking';
    } else if (name.includes('taman') || name.includes('kebun') || name.includes('garden')) {
      return 'gardening';
    }
    return 'other';
  },

  // Helper functions for category display
  getCategoryDisplayName(kategori) {
    const names = {
      'transport': 'Transportasi',
      'cleaning': 'Kebersihan',
      'childcare': 'Perawatan Anak',
      'maintenance': 'Perbaikan',
      'massage': 'Kesehatan & Spa',
      'cooking': 'Memasak',
      'gardening': 'Berkebun',
      'other': 'Layanan Lainnya'
    };
    return names[kategori] || kategori.charAt(0).toUpperCase() + kategori.slice(1);
  },

  getCategoryIcon(kategori) {
    const icons = {
      'transport': '🚗',
      'cleaning': '🧹',
      'childcare': '👶',
      'maintenance': '🔧',
      'massage': '💆',
      'cooking': '👨‍🍳',
      'gardening': '🌱',
      'other': '🏠'
    };
    return icons[kategori] || '🏠';
  },

  getCategoryDescription(kategori) {
    const descriptions = {
      'transport': 'Driver pribadi, ojek, dan layanan transportasi lainnya',
      'cleaning': 'Cleaning service, laundry, dan perawatan rumah',
      'childcare': 'Babysitter, pengasuh anak, dan perawatan bayi',
      'maintenance': 'Tukang, perbaikan rumah, dan maintenance',
      'massage': 'Pijat, spa, terapi, dan perawatan kesehatan',
      'cooking': 'Jasa memasak dan catering',
      'gardening': 'Perawatan taman dan berkebun',
      'other': 'Layanan kebutuhan harian lainnya'
    };
    return descriptions[kategori] || `Layanan ${kategori}`;
  },

  getCategoryColor(kategori) {
    const colors = {
      'transport': 'bg-blue-500',
      'cleaning': 'bg-green-500',
      'childcare': 'bg-pink-500',
      'maintenance': 'bg-orange-500',
      'massage': 'bg-purple-500',
      'cooking': 'bg-yellow-500',
      'gardening': 'bg-emerald-500',
      'other': 'bg-gray-500'
    };
    return colors[kategori] || 'bg-gray-500';
  }
};

export default opoWaeService;
