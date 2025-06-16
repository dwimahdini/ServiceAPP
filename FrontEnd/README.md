# PintuKeluar Frontend - React.js Authentication System

Frontend aplikasi PintuKeluar dengan sistem autentikasi dan otorisasi berbasis role (User & Admin).

## Fitur

### 🔐 Authentication & Authorization

- **Login System**: Form login dengan validasi
- **Registration System**: Form pendaftaran user baru
- **Token Management**: Penyimpanan token di localStorage
- **Role-based Access**: Pembedaan akses User dan Admin
- **Protected Routes**: Route protection berdasarkan role
- **Auto Redirect**: Redirect otomatis berdasarkan role setelah login

### 👤 User Dashboard

- Overview layanan yang tersedia
- Daftar booking pribadi
- Statistik akun user

### 👨‍💼 Admin Dashboard

- Overview sistem lengkap
- Statistik users, layanan, bookings, dan produk
- Manajemen users
- Quick actions untuk admin

## Teknologi

- **React.js 18** - Frontend framework
- **Vite** - Build tool dan dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client untuk API calls
- **Context API** - State management untuk authentication

## Setup & Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Konfigurasi API

Edit file `src/services/api.js` untuk mengatur base URL backend:

```javascript
const API_BASE_URL = "http://localhost:3000"; // Sesuaikan dengan backend Anda
```

## Demo Credentials

Untuk testing, gunakan credentials berikut:

### Admin

- **Email**: admin@example.com
- **Password**: password

### User

- **Email**: user@example.com
- **Password**: password

## Struktur Project

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx              # Komponen login
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── Dashboard/
│   │   ├── UserDashboard.jsx      # Dashboard user
│   │   └── AdminDashboard.jsx     # Dashboard admin
│   └── Layout/
│       └── Navbar.jsx             # Navigation bar
├── contexts/
│   └── AuthContext.jsx            # Authentication context
├── services/
│   └── api.js                     # API service layer
├── App.jsx                        # Main app component
├── main.jsx                       # Entry point
└── index.css                      # Global styles
```

## Fitur Authentication

### 1. Login Process

- User memasukkan email dan password
- System mengirim request ke `/login` endpoint
- Jika berhasil, token dan data user disimpan di localStorage
- User diarahkan ke dashboard sesuai role

### 2. Token Management

- Token disimpan di localStorage
- Setiap API request otomatis menyertakan token di header
- Token expired akan otomatis logout user

### 3. Role-based Routing

- **User**: Akses ke `/user/dashboard`
- **Admin**: Akses ke `/admin/dashboard`
- Unauthorized access akan redirect ke dashboard yang sesuai

### 4. Protected Routes

- Semua route dashboard dilindungi
- User harus login untuk mengakses
- Role validation untuk setiap route

## Testing dengan Mock API

Aplikasi ini sudah dilengkapi dengan Mock API untuk testing tanpa backend:

### Mock Users:

1. **Admin**: admin@example.com / password
2. **User**: user@example.com / password

### Cara Testing:

1. Buka aplikasi di browser: http://localhost:5173/
2. **Test Registration**:
   - Klik "Create one here" di halaman login
   - Isi form registrasi dengan data baru
   - Verify redirect ke login setelah berhasil
3. **Test Login**: Gunakan credentials di atas atau akun yang baru dibuat
4. Test fitur-fitur berikut:
   - Registration dengan validasi form
   - Login dengan role berbeda
   - Redirect otomatis ke dashboard sesuai role
   - Logout functionality
   - Protected routes (coba akses URL langsung tanpa login)

### Mengganti ke Real API:

Untuk menggunakan backend real, edit file berikut:

- `src/contexts/AuthContext.jsx` - ganti `mockAuthAPI` dengan `authAPI`
- `src/components/Dashboard/UserDashboard.jsx` - ganti mock API dengan real API
- `src/components/Dashboard/AdminDashboard.jsx` - ganti mock API dengan real API

## Fitur yang Sudah Diimplementasi

✅ **Authentication System**

- Login form dengan validasi
- Registration form untuk user baru
- Form validation (email format, password confirmation, dll)
- Token-based authentication
- Auto-logout pada token expired
- Error handling untuk login/register gagal
- Success messages dan redirect

✅ **Authorization System**

- Role-based access control (User/Admin)
- Protected routes dengan role validation
- Automatic redirect berdasarkan role
- Unauthorized access protection

✅ **User Dashboard**

- Overview layanan tersedia
- Statistik booking user
- Responsive design
- Loading states

✅ **Admin Dashboard**

- System overview dengan statistik
- User management view
- Quick action buttons
- Comprehensive data display

✅ **UI/UX Features**

- Responsive design (mobile-friendly)
- Loading spinners
- Error messages
- Clean, modern interface
- Consistent styling

## Struktur File Lengkap

```
FrontEnd/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx              # Form login
│   │   │   ├── Register.jsx           # Form registrasi
│   │   │   └── ProtectedRoute.jsx     # Route protection component
│   │   ├── Dashboard/
│   │   │   ├── UserDashboard.jsx      # Dashboard untuk user
│   │   │   └── AdminDashboard.jsx     # Dashboard untuk admin
│   │   └── Layout/
│   │       └── Navbar.jsx             # Navigation bar
│   ├── contexts/
│   │   └── AuthContext.jsx            # Authentication context
│   ├── services/
│   │   ├── api.js                     # Real API service
│   │   └── mockAuth.js                # Mock API untuk testing
│   ├── App.jsx                        # Main app dengan routing
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

Buat file `.env` untuk konfigurasi:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=PintuKeluar System
```

## Troubleshooting

### Common Issues:

1. **CORS Error**

   - Pastikan backend mengizinkan CORS dari frontend URL
   - Check network tab di browser developer tools

2. **Token Issues**

   - Clear localStorage: `localStorage.clear()`
   - Check token format di backend
   - Verify token expiration handling

3. **Route Issues**

   - Check React Router setup
   - Verify protected route logic
   - Ensure proper role validation

4. **Styling Issues**
   - Verify CSS classes are applied correctly
   - Check responsive breakpoints
   - Test on different screen sizes

### Debug Mode:

Tambahkan console.log di AuthContext untuk debug:

```javascript
console.log("User:", user);
console.log("Token:", localStorage.getItem("token"));
```
