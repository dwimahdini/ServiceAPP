import { authAPI } from './api';

/**
 * Service untuk mengelola operasi CRUD Bengkel
 * Menggunakan endpoint yang sudah teruji sesuai dokumentasi
 */
export const bengkelService = {
  /**
   * Mengambil semua data bengkel
   * @returns {Promise} Response dengan data bengkel
   */
  async getAllBengkel() {
    try {
      const response = await authAPI.get('/bengkel');
      console.log('Get all bengkel response:', response.data);
      
      // Handle response format sesuai dokumentasi
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Error fetching bengkel:', error);
      throw error;
    }
  },

  /**
   * Mengambil data bengkel berdasarkan ID
   * @param {number} id - ID bengkel
   * @returns {Promise} Response dengan data bengkel
   */
  async getBengkelById(id) {
    try {
      const response = await authAPI.get(`/bengkel/${id}`);
      console.log('Get bengkel by ID response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching bengkel by ID:', error);
      throw error;
    }
  },

  /**
   * Mengambil data bengkel berdasarkan jenis kendaraan
   * @param {string} jenis - Jenis kendaraan ('motor' atau 'mobil')
   * @returns {Promise} Response dengan data bengkel
   */
  async getBengkelByJenis(jenis) {
    try {
      const response = await authAPI.get(`/bengkel/jenis/${jenis}`);
      console.log('Get bengkel by jenis response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Error fetching bengkel by jenis:', error);
      throw error;
    }
  },

  /**
   * Membuat bengkel baru
   * @param {Object} bengkelData - Data bengkel baru
   * @returns {Promise} Response dengan data bengkel yang dibuat
   */
  async createBengkel(bengkelData) {
    try {
      // Validasi data wajib
      const requiredFields = ['nama_bengkel', 'alamat', 'telepon', 'jam_buka', 'jam_tutup', 'jenis_kendaraan'];
      const missingFields = requiredFields.filter(field => !bengkelData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Field wajib tidak lengkap: ${missingFields.join(', ')}`);
      }

      // Validasi jenis kendaraan
      if (!['motor', 'mobil'].includes(bengkelData.jenis_kendaraan)) {
        throw new Error('Jenis kendaraan harus "motor" atau "mobil"');
      }

      // Bersihkan data sebelum dikirim
      const cleanData = {
        nama_bengkel: bengkelData.nama_bengkel,
        alamat: bengkelData.alamat,
        telepon: bengkelData.telepon,
        jam_buka: bengkelData.jam_buka,
        jam_tutup: bengkelData.jam_tutup,
        jenis_kendaraan: bengkelData.jenis_kendaraan,
        rating: parseFloat(bengkelData.rating) || 4.0,
        deskripsi: bengkelData.deskripsi || '',
        layanan_tersedia: bengkelData.layanan_tersedia || '',
        koordinat_lat: bengkelData.koordinat_lat || null,
        koordinat_lng: bengkelData.koordinat_lng || null
      };

      const response = await authAPI.post('/bengkel', cleanData);
      console.log('Create bengkel response:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Bengkel berhasil dibuat'
      };
    } catch (error) {
      console.error('Error creating bengkel:', error);
      throw error;
    }
  },

  /**
   * Mengupdate data bengkel
   * @param {number} id - ID bengkel
   * @param {Object} bengkelData - Data bengkel yang akan diupdate
   * @returns {Promise} Response dengan data bengkel yang diupdate
   */
  async updateBengkel(id, bengkelData) {
    try {
      // Validasi jenis kendaraan jika ada
      if (bengkelData.jenis_kendaraan && !['motor', 'mobil'].includes(bengkelData.jenis_kendaraan)) {
        throw new Error('Jenis kendaraan harus "motor" atau "mobil"');
      }

      // Bersihkan data sebelum dikirim (hanya field yang ada)
      const cleanData = {};
      
      if (bengkelData.nama_bengkel) cleanData.nama_bengkel = bengkelData.nama_bengkel;
      if (bengkelData.alamat) cleanData.alamat = bengkelData.alamat;
      if (bengkelData.telepon) cleanData.telepon = bengkelData.telepon;
      if (bengkelData.jam_buka) cleanData.jam_buka = bengkelData.jam_buka;
      if (bengkelData.jam_tutup) cleanData.jam_tutup = bengkelData.jam_tutup;
      if (bengkelData.jenis_kendaraan) cleanData.jenis_kendaraan = bengkelData.jenis_kendaraan;
      if (bengkelData.rating !== undefined) cleanData.rating = parseFloat(bengkelData.rating);
      if (bengkelData.deskripsi !== undefined) cleanData.deskripsi = bengkelData.deskripsi;
      if (bengkelData.layanan_tersedia !== undefined) cleanData.layanan_tersedia = bengkelData.layanan_tersedia;
      if (bengkelData.koordinat_lat !== undefined) cleanData.koordinat_lat = bengkelData.koordinat_lat || null;
      if (bengkelData.koordinat_lng !== undefined) cleanData.koordinat_lng = bengkelData.koordinat_lng || null;
      if (bengkelData.status) cleanData.status = bengkelData.status;

      const response = await authAPI.put(`/bengkel/${id}`, cleanData);
      console.log('Update bengkel response:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Bengkel berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating bengkel:', error);
      throw error;
    }
  },

  /**
   * Menghapus bengkel
   * @param {number} id - ID bengkel
   * @returns {Promise} Response konfirmasi penghapusan
   */
  async deleteBengkel(id) {
    try {
      const response = await authAPI.delete(`/bengkel/${id}`);
      console.log('Delete bengkel response:', response.data);
      
      return {
        success: true,
        message: response.data.message || 'Bengkel berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting bengkel:', error);
      throw error;
    }
  },

  /**
   * Test koneksi endpoint bengkel
   * @returns {Promise} Response test
   */
  async testConnection() {
    try {
      const response = await authAPI.get('/bengkel/test');
      console.log('Test bengkel connection:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error testing bengkel connection:', error);
      throw error;
    }
  },

  // ===== PRODUK BENGKEL FUNCTIONS =====

  /**
   * Mengambil semua produk bengkel
   * @returns {Promise} Response dengan data produk bengkel
   */
  async getAllBengkelProduk() {
    try {
      console.log('🔄 Fetching ALL bengkel products...');
      const response = await authAPI.get('/bengkel-produk');
      console.log('✅ Raw API response:', response);
      console.log('📊 Response data:', response.data);

      // Handle new response format with success property
      if (response.data && response.data.success) {
        const products = response.data.data || [];
        console.log(`✅ Found ${products.length} total products from API`);

        // Log sample product for debugging
        if (products.length > 0) {
          console.log('📋 Sample product:', products[0]);
        }

        return {
          success: true,
          data: products,
          total: response.data.total || products.length
        };
      }

      // Fallback for old format (array directly)
      if (Array.isArray(response.data)) {
        console.log(`✅ Found ${response.data.length} products (legacy format)`);
        return {
          success: true,
          data: response.data
        };
      }

      // No data found
      console.log('⚠️ No products found or unexpected response format');
      return {
        success: true,
        data: [],
        message: 'Tidak ada produk ditemukan'
      };
    } catch (error) {
      console.error('❌ Error fetching all bengkel produk:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Gagal mengambil data produk bengkel'
      };
    }
  },

  /**
   * Mengambil produk bengkel berdasarkan ID bengkel
   * @param {number} bengkelId - ID bengkel
   * @returns {Promise} Response dengan data produk bengkel
   */
  async getProdukByBengkelId(bengkelId) {
    try {
      console.log(`🔄 Fetching produk for bengkel ID: ${bengkelId}`);
      const response = await authAPI.get(`/bengkel/${bengkelId}/produk`);
      console.log('✅ Raw API response:', response);
      console.log('📊 Response data:', response.data);

      // Handle new response format with success property
      if (response.data && response.data.success) {
        const products = response.data.data || [];
        console.log(`✅ Found ${products.length} products for bengkel ${bengkelId}`);

        // Log sample product for debugging
        if (products.length > 0) {
          console.log('📋 Sample product:', products[0]);
        }

        return {
          success: true,
          data: products,
          total: response.data.total || products.length
        };
      }

      // Fallback for old format (array directly)
      if (Array.isArray(response.data)) {
        console.log(`✅ Found ${response.data.length} products (legacy format)`);
        return {
          success: true,
          data: response.data
        };
      }

      // No data found
      console.log('⚠️ No products found for this bengkel');
      return {
        success: true,
        data: [],
        message: 'Tidak ada produk ditemukan untuk bengkel ini'
      };
    } catch (error) {
      console.error('❌ Error fetching produk by bengkel ID:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Gagal mengambil data produk bengkel'
      };
    }
  },

  /**
   * Mengambil produk bengkel berdasarkan ID
   * @param {number} id - ID produk bengkel
   * @returns {Promise} Response dengan data produk bengkel
   */
  async getBengkelProdukById(id) {
    try {
      const response = await authAPI.get(`/bengkel-produk/${id}`);
      console.log('Get bengkel produk by ID response:', response.data);

      // Handle response format - controller returns object directly
      if (response.data && !response.data.success) {
        return {
          success: true,
          data: response.data
        };
      }

      // Handle if response has success property
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching bengkel produk by ID:', error);
      throw error;
    }
  },

  /**
   * Mengambil produk bengkel berdasarkan jenis layanan
   * @param {string} jenisLayanan - Jenis layanan
   * @returns {Promise} Response dengan data produk bengkel
   */
  async getProdukByJenisLayanan(jenisLayanan) {
    try {
      const response = await authAPI.get(`/bengkel-produk/jenis/${jenisLayanan}`);
      console.log('Get produk by jenis layanan response:', response.data);

      // Handle response format - controller returns array directly
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }

      // Handle if response has success property
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }

      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Error fetching produk by jenis layanan:', error);
      throw error;
    }
  },

  /**
   * Membuat produk bengkel baru
   * @param {Object} produkData - Data produk bengkel baru
   * @returns {Promise} Response dengan data produk yang dibuat
   */
  async createBengkelProduk(produkData) {
    try {
      // Validasi data wajib
      const requiredFields = ['bengkel_id', 'nama_produk', 'harga', 'jenis_layanan'];
      const missingFields = requiredFields.filter(field => !produkData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Field wajib tidak lengkap: ${missingFields.join(', ')}`);
      }

      // Bersihkan data sebelum dikirim
      const cleanData = {
        bengkel_id: parseInt(produkData.bengkel_id),
        nama_produk: produkData.nama_produk,
        harga: parseFloat(produkData.harga),
        foto_produk: produkData.foto_produk || null,
        jenis_layanan: produkData.jenis_layanan,
        deskripsi: produkData.deskripsi || ''
      };

      const response = await authAPI.post('/bengkel-produk', cleanData);
      console.log('Create bengkel produk response:', response.data);

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Produk bengkel berhasil dibuat'
      };
    } catch (error) {
      console.error('Error creating bengkel produk:', error);
      throw error;
    }
  },

  /**
   * Mengupdate produk bengkel
   * @param {number} id - ID produk bengkel
   * @param {Object} produkData - Data produk bengkel yang akan diupdate
   * @returns {Promise} Response dengan data produk yang diupdate
   */
  async updateBengkelProduk(id, produkData) {
    try {
      // Bersihkan data sebelum dikirim (hanya field yang ada)
      const cleanData = {};

      if (produkData.bengkel_id !== undefined) cleanData.bengkel_id = parseInt(produkData.bengkel_id);
      if (produkData.nama_produk) cleanData.nama_produk = produkData.nama_produk;
      if (produkData.harga !== undefined) cleanData.harga = parseFloat(produkData.harga);
      if (produkData.foto_produk !== undefined) cleanData.foto_produk = produkData.foto_produk || null;
      if (produkData.jenis_layanan) cleanData.jenis_layanan = produkData.jenis_layanan;
      if (produkData.deskripsi !== undefined) cleanData.deskripsi = produkData.deskripsi;
      if (produkData.status) cleanData.status = produkData.status;

      const response = await authAPI.put(`/bengkel-produk/${id}`, cleanData);
      console.log('Update bengkel produk response:', response.data);

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Produk bengkel berhasil diupdate'
      };
    } catch (error) {
      console.error('Error updating bengkel produk:', error);
      throw error;
    }
  },

  /**
   * Menghapus produk bengkel
   * @param {number} id - ID produk bengkel
   * @returns {Promise} Response konfirmasi penghapusan
   */
  async deleteBengkelProduk(id) {
    try {
      const response = await authAPI.delete(`/bengkel-produk/${id}`);
      console.log('Delete bengkel produk response:', response.data);

      return {
        success: true,
        message: response.data.message || 'Produk bengkel berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting bengkel produk:', error);
      throw error;
    }
  }
};

export default bengkelService;
