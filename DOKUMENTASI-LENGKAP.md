# 🚀 FUTURE X - Dokumentasi Sistem Lengkap

## 📋 Deskripsi Sistem

**Future X** adalah sistem marketplace layanan yang menghubungkan pengguna dengan penyedia layanan dalam 3 kategori utama:

- **🧠 Psikologi**: Konsultasi dengan dokter psikologi berpengalaman
- **🔧 Bengkel**: Layanan perbaikan kendaraan bermotor dan mobil
- **🏠 Opo Wae**: Layanan kebutuhan sehari-hari (driver, cleaning, babysitter, dll)

### Status Sistem: ✅ PRODUCTION READY

---

## 🏗️ Arsitektur Sistem

### Backend API Server

- **Framework**: Node.js + Express.js
- **Database**: MySQL (database: `pintukeluar`)
- **Authentication**: JWT-based dengan role admin/user
- **Port**: 3001
- **URL**: http://localhost:3001

### Frontend Application

- **Framework**: React.js + Vite
- **Styling**: Tailwind CSS
- **Port**: 5173
- **URL**: http://localhost:5173

## 📁 Struktur Proyek

```
future-x-system/
├── 📂 PintuKeluarAPI/          # Backend API Server
│   ├── config/                 # Database configuration
│   ├── controllers/            # Business logic
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication middleware
│   └── index.js               # Server entry point
├── 📂 FrontEnd/               # React Frontend
│   ├── src/components/        # React components
│   ├── src/pages/            # Page components
│   ├── src/services/         # API services
│   └── src/contexts/         # React contexts
├── database-complete.sql      # Complete database setup
└── DOKUMENTASI-LENGKAP.md    # This documentation
```

---

## 🔐 Authentication & Authorization

### Admin Login

- **Email**: `admin@futurex.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Access**: Full system management

### JWT Token

- **Endpoint**: `POST /login`
- **Header**: `Authorization: Bearer {token}`
- **Expiry**: 24 jam

---

## 🎯 FITUR ADMIN INTERFACE

### 1. 🧠 KELOLA LAYANAN PSIKOLOGI

#### Interface Admin:

- **Path**: `/admin/services` → Tab Psikologi
- **Component**: `DokterManagement.jsx`
- **Features**:
  - Tambah dokter/psikolog baru
  - Edit data dokter existing
  - Hapus dokter
  - Lihat daftar semua dokter

#### Form Fields:

- Nama Dokter/Psikolog (required)
- Spesialisasi
- Pengalaman/Deskripsi
- Tarif per Jam (Rp)
- Alamat Praktik
- Nomor Telepon
- URL Foto (optional)
- Jadwal Tersedia (checkbox)

### 2. 🔧 KELOLA LAYANAN BENGKEL

#### Interface Admin:

- **Path**: `/admin/services` → Tab Bengkel
- **Components**:
  - `BengkelManagement.jsx` (Data Bengkel)
  - `ProdukBengkelManagement.jsx` (Produk/Spare Part)

#### Sub-Features:

**A. Data Bengkel:**

- Tambah/edit/hapus bengkel
- Jenis kendaraan (Motor/Mobil)
- Alamat dan kontak
- Jam operasional
- Jenis layanan bengkel

**B. Produk/Spare Part:**

- Kelola produk per bengkel
- Nama produk dan harga
- Foto produk
- Stok dan deskripsi

### 3. 🏠 KELOLA LAYANAN OPO WAE

#### Interface Admin:

- **Path**: `/admin/services` → Tab Opo Wae
- **Component**: `LayananOpoWaeManagement.jsx`
- **Features**:
  - Tambah jenis layanan baru
  - Edit layanan existing
  - Hapus layanan
  - Kategorisasi layanan

#### Kategori Layanan:

- **Transport**: Driver pribadi, ojek, dll
- **Cleaning**: Cleaning service, laundry, dll
- **Childcare**: Babysitter, pengasuh anak
- **Maintenance**: Tukang, perbaikan rumah
- **Massage**: Pijat, spa, terapi

---

## 🔌 ENDPOINT API BACKEND

### Authentication Endpoints

#### Login Admin

```
POST /login
Content-Type: application/json

Body:
{
  "email": "admin@futurex.com",
  "password": "admin123"
}

Response:
{
  "msg": "Login berhasil!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin Future X",
    "email": "admin@futurex.com",
    "role": "admin"
  }
}
```

### Psikologi Endpoints

#### GET - Ambil Semua Dokter

```
GET /simple/dokter
Content-Type: application/json

Response:
[
  {
    "id": 14,
    "pilih_dokter_psikolog": "Dwi Mahdini",
    "spesialisasi": "Psikolog Cinta",
    "pengalaman": "Dokter Psikologi Cinta Ternama",
    "tarif_per_jam": "400000.00",
    "foto": null,
    "alamat": null,
    "telepon": null,
    "layananId": 1,
    "createdAt": "2025-06-16T21:03:26.000Z",
    "updatedAt": "2025-06-16T21:03:26.000Z"
  }
]
```

#### POST - Tambah Dokter Baru

```
POST /simple/dokter
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "pilih_dokter_psikolog": "Dr. Sarah Psikolog",
  "layananId": 1,
  "spesialisasi": "Psikolog Klinis",
  "pengalaman": "10 tahun pengalaman dalam terapi kognitif",
  "tarif_per_jam": 500000
}

Response:
{
  "message": "Dokter berhasil ditambahkan",
  "data": { ... }
}
```

#### PUT - Update Dokter

```
PUT /simple/dokter/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "pilih_dokter_psikolog": "Dr. Sarah Updated",
  "spesialisasi": "Psikolog Klinis Senior",
  "pengalaman": "15 tahun pengalaman",
  "tarif_per_jam": 600000
}

Response:
{
  "message": "Dokter berhasil diupdate"
}
```

#### DELETE - Hapus Dokter

```
DELETE /simple/dokter/{id}
Authorization: Bearer {admin_token}

Response:
{
  "message": "Dokter berhasil dihapus"
}
```

### Bengkel Endpoints

#### GET - Ambil Semua Bengkel

```
GET /bengkel
Content-Type: application/json

Response:
[
  {
    "id": 1,
    "nama_bengkel": "Bengkel Jaya Motor",
    "jenis_kendaraan": "motor",
    "alamat": "Jl. Raya No. 123",
    "telepon": "081234567890",
    "jam_buka": "08:00",
    "jam_tutup": "17:00",
    "jenis_layanan": "semua jenis",
    "layananId": 2
  }
]
```

#### POST - Tambah Bengkel Baru

```
POST /bengkel
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "nama_bengkel": "Bengkel ABC",
  "jenis_kendaraan": "mobil",
  "alamat": "Jl. Sudirman No. 456",
  "telepon": "081987654321",
  "jam_buka": "09:00",
  "jam_tutup": "18:00",
  "jenis_layanan": "service rutin",
  "layananId": 2
}
```

#### GET - Ambil Semua Produk Bengkel

```
GET /bengkel-produk
Content-Type: application/json

Response:
[
  {
    "id": 1,
    "nama_produk": "Oli Mesin",
    "harga": 50000,
    "foto_produk": "oli.jpg",
    "bengkel_id": 1,
    "Bengkel": {
      "nama_bengkel": "Bengkel Jaya Motor"
    }
  }
]
```

### Opo Wae Endpoints

#### GET - Ambil Semua Layanan Opo Wae

```
GET /getpilihlayanan
Content-Type: application/json

Response:
{
  "data": [
    {
      "id": 1,
      "nama_pilihan": "Driver Pribadi",
      "harga": 100000,
      "kategori": "transport",
      "layananId": 3
    }
  ]
}
```

#### POST - Tambah Layanan Opo Wae

```
POST /pilihlayanan
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "nama_pilihan": "Cleaning Service",
  "harga": 150000,
  "kategori": "cleaning",
  "layananId": 3
}
```

---

## 🗄️ DATABASE SCHEMA

### Core Tables

#### users

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(100))
- email (VARCHAR(100), UNIQUE)
- password (VARCHAR(255))
- role (ENUM('admin', 'user'))
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### layanans

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nama_layanan (VARCHAR(100))
- deskripsi (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

Data:
1. Psikologi
2. Bengkel
3. Opo Wae
```

#### dokterpsikologs

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- pilih_dokter_psikolog (VARCHAR(255))
- spesialisasi (VARCHAR(255))
- pengalaman (TEXT)
- tarif_per_jam (DECIMAL(10,2))
- foto (VARCHAR(255))
- alamat (TEXT)
- telepon (VARCHAR(20))
- layananId (INT, FOREIGN KEY → layanans.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### bengkels

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nama_bengkel (VARCHAR(255))
- jenis_kendaraan (ENUM('motor', 'mobil'))
- alamat (TEXT)
- telepon (VARCHAR(20))
- jam_buka (TIME)
- jam_tutup (TIME)
- jenis_layanan (VARCHAR(255))
- layananId (INT, FOREIGN KEY → layanans.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### bengkelproduks

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nama_produk (VARCHAR(255))
- harga (DECIMAL(10,2))
- foto_produk (VARCHAR(255))
- bengkel_id (INT, FOREIGN KEY → bengkels.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### pilihlayanans

```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nama_pilihan (VARCHAR(255))
- harga (DECIMAL(10,2))
- kategori (VARCHAR(100))
- layananId (INT, FOREIGN KEY → layanans.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

---

## 🚀 CARA MENJALANKAN SISTEM

### 1. Setup Database

```sql
-- Import database lengkap
mysql -u root -p pintukeluar < database-complete.sql
```

### 2. Setup Environment Variables

**Backend:**

```bash
cd PintuKeluarAPI
cp .env.example .env
# Default configuration sudah sesuai untuk development
```

**Frontend:**

```bash
cd FrontEnd
cp .env.example .env
# Default configuration sudah sesuai untuk development
```

### 3. Jalankan Backend

```bash
cd PintuKeluarAPI
npm install
npm start
```

Server berjalan di: http://localhost:3001

### 4. Jalankan Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Aplikasi berjalan di: http://localhost:5173

### 5. Login Admin

- Buka: http://localhost:5173
- Login dengan: admin@futurex.com / admin123
- Akses: Kelola Layanan

---

## ✅ STATUS FITUR

### Psikologi: 100% SELESAI

- ✅ CRUD Dokter/Psikolog
- ✅ Interface Admin
- ✅ Database Integration
- ✅ API Endpoints

### Bengkel: 100% SELESAI

- ✅ CRUD Bengkel
- ✅ CRUD Produk/Spare Part
- ✅ Interface Admin
- ✅ Database Integration
- ✅ API Endpoints

### Opo Wae: 100% SELESAI

- ✅ CRUD Jenis Layanan
- ✅ Kategorisasi Layanan
- ✅ Interface Admin
- ✅ Database Integration
- ✅ API Endpoints

### System: 100% PRODUCTION READY

- ✅ Authentication & Authorization
- ✅ Error Handling
- ✅ Data Validation
- ✅ Responsive UI/UX
- ✅ Database Relations
- ✅ API Documentation

---

## 🧪 TESTING ENDPOINTS

### Test dengan Postman

#### 1. Test Login Admin

```
POST http://localhost:3001/login
{
  "email": "admin@futurex.com",
  "password": "admin123"
}
```

#### 2. Test GET Dokter

```
GET http://localhost:3001/simple/dokter
```

#### 3. Test POST Dokter (dengan token)

```
POST http://localhost:3001/simple/dokter
Authorization: Bearer {token}
{
  "pilih_dokter_psikolog": "Dr. Test",
  "layananId": 1,
  "spesialisasi": "Test Spesialis",
  "pengalaman": "Test pengalaman",
  "tarif_per_jam": 300000
}
```

#### 4. Test GET Bengkel

```
GET http://localhost:3001/bengkel
```

#### 5. Test GET Opo Wae

```
GET http://localhost:3001/getpilihlayanan
```

### Test Interface Admin

#### 1. Login ke Admin Panel

- Buka: http://localhost:5173
- Login: admin@futurex.com / admin123
- Verifikasi redirect ke dashboard

#### 2. Test Kelola Psikologi

- Navigasi: Kelola Layanan → Psikologi
- Test: Tambah, Edit, Hapus dokter
- Verifikasi: Data tersimpan di database

#### 3. Test Kelola Bengkel

- Navigasi: Kelola Layanan → Bengkel
- Test: Tambah bengkel dan produk
- Verifikasi: Data tersimpan di database

#### 4. Test Kelola Opo Wae

- Navigasi: Kelola Layanan → Opo Wae
- Test: Tambah layanan dengan kategori
- Verifikasi: Data tersimpan di database

---

## 🔧 TROUBLESHOOTING

### Backend Issues

#### Server tidak bisa start

```bash
# Check port 3001
netstat -an | findstr :3001

# Kill process jika ada
taskkill /f /pid {PID}

# Restart server
cd PintuKeluarAPI
node index.js
```

#### Database connection error

```bash
# Check MySQL service
net start mysql

# Check database exists
mysql -u root -p
USE pintukeluar;
SHOW TABLES;
```

#### JWT Token error

```javascript
// Check token di localStorage browser
localStorage.getItem("token");

// Clear token jika corrupt
localStorage.removeItem("token");
localStorage.removeItem("user");
```

### Frontend Issues

#### Build error

```bash
cd FrontEnd
rm -rf node_modules
npm install
npm run dev
```

#### API connection error

```javascript
// Check API base URL di src/services/api.js
const API_BASE_URL = "http://localhost:3001";
```

### Database Issues

#### Reset database

```sql
DROP DATABASE pintukeluar;
CREATE DATABASE pintukeluar;
USE pintukeluar;
SOURCE database-complete.sql;
```

#### Check admin user

```sql
SELECT * FROM users WHERE role = 'admin';
-- Should return: admin@futurex.com
```

---

## 📊 MONITORING & LOGS

### Backend Logs

- Server startup: Console output saat `node index.js`
- API requests: Automatic logging di terminal
- Database queries: Sequelize query logs
- Authentication: Login attempt logs

### Frontend Logs

- Browser console: F12 → Console
- Network requests: F12 → Network
- React errors: Console error messages

### Database Monitoring

```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'dokterpsikologs', COUNT(*) FROM dokterpsikologs
UNION ALL
SELECT 'bengkels', COUNT(*) FROM bengkels
UNION ALL
SELECT 'pilihlayanans', COUNT(*) FROM pilihlayanans;
```

---

## 🎯 PRODUCTION CHECKLIST

### ✅ Backend Ready

- [x] Server starts without errors
- [x] Database connection established
- [x] All endpoints responding
- [x] Authentication working
- [x] CORS configured
- [x] Error handling implemented

### ✅ Frontend Ready

- [x] Build successful
- [x] All pages loading
- [x] Admin interface functional
- [x] API integration working
- [x] Responsive design
- [x] Error boundaries implemented

### ✅ Database Ready

- [x] All tables created
- [x] Sample data inserted
- [x] Foreign keys working
- [x] Admin user exists
- [x] Indexes optimized

### ✅ Security Ready

- [x] JWT authentication
- [x] Password hashing
- [x] Role-based access
- [x] Input validation
- [x] SQL injection protection

---

## 📞 SUPPORT

**Sistem Future X telah diuji dan siap untuk production.**

### Fitur Lengkap:

- ✅ 3 Layanan Utama (Psikologi, Bengkel, Opo Wae)
- ✅ Admin Interface Lengkap
- ✅ API Endpoints Terintegrasi
- ✅ Database Schema Optimal
- ✅ Authentication & Authorization
- ✅ Error Handling & Validation
- ✅ Responsive UI/UX

### Tech Stack:

- **Backend**: Node.js + Express.js + Sequelize
- **Frontend**: React.js + Vite + Tailwind CSS
- **Database**: MySQL
- **Authentication**: JWT

**Status: 🚀 PRODUCTION READY**
