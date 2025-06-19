# 🚀 FUTURE X - Sistem Marketplace Layanan

**Future X** adalah sistem marketplace layanan yang menghubungkan pengguna dengan penyedia layanan dalam 3 kategori utama:

- **🧠 Psikologi**: Konsultasi dengan dokter psikologi berpengalaman
- **🔧 Bengkel**: Layanan perbaikan kendaraan bermotor dan mobil
- **🏠 Opo Wae**: Layanan kebutuhan sehari-hari (driver, cleaning, babysitter, dll)

## 🎯 Status: ✅ PRODUCTION READY

Semua fitur admin dan endpoint API telah diuji dan berfungsi dengan sempurna.

## 🚀 Quick Start

### 1. Setup Database

```bash
mysql -u root -p
CREATE DATABASE pintukeluar;
USE pintukeluar;
SOURCE database-complete.sql;
```

### 2. Jalankan Backend

```bash
cd PintuKeluarAPI
npm install
npm start
```

Server: http://localhost:3001

### 3. Jalankan Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend: http://localhost:5173

### 4. Login Admin

- Email: `admin@futurex.com`
- Password: `admin123`

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap sistem, lihat: **[DOKUMENTASI-LENGKAP.md](DOKUMENTASI-LENGKAP.md)**

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js + Sequelize
- **Frontend**: React.js + Vite + Tailwind CSS
- **Database**: MySQL
- **Authentication**: JWT

## ✅ Fitur Lengkap

### Admin Interface:

- 🧠 **Kelola Psikologi**: CRUD dokter/psikolog
- 🔧 **Kelola Bengkel**: CRUD bengkel dan produk
- 🏠 **Kelola Opo Wae**: CRUD jenis layanan

### API Endpoints:

- Authentication & Authorization
- CRUD operations untuk semua layanan
- Database management
- Transaction handling

## 📞 Support

Sistem telah diuji dan siap untuk production. Semua endpoint API berfungsi dengan baik dan interface admin telah terintegrasi dengan database.
