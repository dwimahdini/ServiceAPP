import axios from 'axios';

// Base URL untuk API backend
const API_BASE_URL = 'http://localhost:3001'; // Backend berjalan di port 3001

// Membuat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response dan error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Authentication methods
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  resetPassword: (email) => api.post('/reset-password', { email }),
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  getRegister: () => api.get('/getregister'),

  // Generic HTTP methods for admin interface
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};

// Layanan API functions
export const layananAPI = {
  create: (data) => api.post('/layanan', data),
  getAll: () => api.get('/getlayanan'),
  getById: (id) => api.get(`/layanan/${id}`),
};

// Pilih Layanan API functions
export const pilihLayananAPI = {
  create: (data) => api.post('/pilihlayanan', data),
  getAll: () => api.get('/getpilihlayanan'),
};

// Produk API functions (legacy)
export const produkLegacyAPI = {
  create: (data) => api.post('/tambahproduk', data),
  getAll: () => api.get('/getproduk'),
};

// Produk Detail API functions
export const produkDetailAPI = {
  create: (data) => api.post('/tambahprodukdetail', data),
  getAll: () => api.get('/getprodukdetail'),
};

// Produk Merek API functions
export const produkMerekAPI = {
  create: (data) => api.post('/tambahprodukmerek', data),
  getAll: () => api.get('/getprodukmerek'),
};

// Dokter/Psikolog API functions
export const dokterPsikologAPI = {
  create: (data) => api.post('/tambahpilihdokterpsikolog', data),
  getAll: () => api.get('/getpilihdokterpsikolog'),
};

// Durasi API functions
export const durasiAPI = {
  create: (data) => api.post('/tambahdurasi', data),
  getAll: () => api.get('/getdurasi'),
};

// Booking API functions
export const bookingAPI = {
  create: (data) => api.post('/tambahbooking', data),
  getAll: () => api.get('/getbooking'),
};

// Bengkel API functions
export const bengkelAPI = {
  create: (data) => api.post('/bengkel', data),
  getAll: () => api.get('/bengkel'),
  getByJenis: (jenis) => api.get(`/bengkel/jenis/${jenis}`),
  getById: (id) => api.get(`/bengkel/${id}`),
  getProdukByBengkel: (bengkelId) => api.get(`/bengkel/${bengkelId}/produk`),
};

// Bengkel Produk API functions
export const bengkelProdukAPI = {
  getAll: () => api.get('/bengkel-produk'),
  getByBengkel: (bengkelId) => api.get(`/bengkel/${bengkelId}/produk`),
  getByJenisLayanan: (jenisLayanan) => api.get(`/bengkel-produk/jenis/${jenisLayanan}`),
};

// Alias untuk backward compatibility
export const produkAPI = bengkelProdukAPI;

export default api;
