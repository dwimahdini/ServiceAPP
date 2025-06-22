# FUTURE X - Platform Layanan Terpadu

Platform web yang menyediakan 3 layanan utama:

1. **Bengkel** - Pencari bengkel berbasis lokasi
2. **Psikologi** - Konsultasi psikologi online
3. **Opo Wae** - Layanan kebutuhan sehari-hari

## Struktur Proyek

```
Future X website/
├── FrontEnd/          # React.js + Tailwind CSS
├── PintuKeluarAPI/    # Node.js + Express + MySQL
└── README.md
```

## Cara Menjalankan

### Backend

```bash
cd PintuKeluarAPI
npm install
npm start
```

Server berjalan di: http://localhost:3001

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Aplikasi berjalan di: http://localhost:5173

### Database

1. Buat database MySQL bernama `pintukeluar`
2. Import struktur database dari migration files
3. Konfigurasi koneksi di `PintuKeluarAPI/config/database.js`

## Fitur Utama

### User

- Registrasi & Login
- Dashboard user
- Booking layanan psikologi
- Sistem pembayaran sederhana
- Riwayat booking

### Admin

- Dashboard admin dengan statistik
- Manajemen dokter psikologi
- Manajemen bengkel & produk
- Konfirmasi pembayaran
- Manajemen layanan Opo Wae

## Teknologi

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL
- **Authentication**: JWT
- **File Upload**: Multer

## Status

✅ Sistem berjalan dengan baik
✅ Semua fitur utama berfungsi
✅ Database dan API terintegrasi
✅ Kode sudah dibersihkan dari debug/test files
