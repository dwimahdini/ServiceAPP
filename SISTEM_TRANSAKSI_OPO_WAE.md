# Sistem Transaksi Opo Wae - Future X

## Overview

Sistem transaksi sederhana untuk layanan "Opo Wae" yang memungkinkan user untuk booking layanan harian dan admin untuk mengelola pembayaran.

## Fitur Utama

### 1. User Side

- **Pilih Layanan**: User dapat melihat daftar layanan Opo Wae yang tersedia
- **Konfirmasi Booking**: Popup konfirmasi dengan detail lengkap dan perhitungan harga
- **Pembayaran**: Halaman pembayaran dengan upload bukti pembayaran
- **Status Tracking**: User dapat melihat status pembayaran (unpaid, pending, paid, rejected)

### 2. Admin Side

- **Kelola Layanan**: Admin dapat menambah, edit, dan hapus layanan Opo Wae
- **Konfirmasi Pembayaran**: Admin dapat menerima atau menolak pembayaran
- **Monitoring Transaksi**: Melihat semua transaksi yang pending

## Alur Transaksi

### User Flow:

1. User masuk ke halaman Opo Wae (`/opo-wae`)
2. Pilih layanan yang diinginkan
3. Klik "Book Sekarang" → Muncul popup konfirmasi
4. Isi detail booking (tanggal, jam, catatan)
5. Konfirmasi booking → Redirect ke halaman pembayaran
6. Upload bukti pembayaran
7. Menunggu konfirmasi admin

### Admin Flow:

1. Admin masuk ke dashboard admin
2. Kelola layanan di menu "Layanan Opo Wae Management"
3. Monitor pembayaran pending di menu pembayaran
4. Terima atau tolak pembayaran dengan catatan

## Struktur Database

### Tabel `pilihlayanans`

- `id`: Primary key
- `nama_pilihan`: Nama layanan
- `harga`: Harga layanan
- `kategori`: Kategori layanan (transport, cleaning, childcare, dll)
- `layananId`: 3 (untuk Opo Wae)

### Tabel `bookings`

- `id`: Primary key
- `userId`: ID user yang booking
- `layananId`: 3 (untuk Opo Wae)
- `tanggal_booking`: Tanggal booking
- `jam_booking`: Jam booking
- `total_harga`: Total harga (harga layanan + admin fee)
- `payment_status`: Status pembayaran (unpaid, pending, paid, rejected)
- `notes`: Catatan booking

## API Endpoints

### User Endpoints:

- `GET /getpilihlayanan` - Ambil semua layanan
- `POST /tambahbooking` - Buat booking baru
- `GET /payment/detail/:bookingId` - Detail pembayaran
- `POST /payment/submit/:bookingId` - Upload bukti pembayaran

### Admin Endpoints:

- `POST /pilihlayanan` - Tambah layanan baru
- `PUT /pilihlayanan/:id` - Update layanan
- `DELETE /pilihlayanan/:id` - Hapus layanan
- `GET /admin/payments/pending` - Pembayaran pending
- `POST /admin/payments/confirm/:bookingId` - Konfirmasi pembayaran

## Komponen Frontend

### User Components:

- `OpoWaePage.jsx` - Halaman utama Opo Wae
- `BookingConfirmation.jsx` - Modal konfirmasi booking
- `Payment.jsx` - Halaman pembayaran

### Admin Components:

- `LayananOpoWaeManagement.jsx` - Kelola layanan Opo Wae

## Fitur Keamanan

- Autentikasi token untuk semua API yang memerlukan login
- Validasi data booking di backend
- Verifikasi ownership booking (user hanya bisa akses booking sendiri)

## Perhitungan Harga

- Harga Layanan: Sesuai yang diset admin
- Total: Harga Layanan (tanpa biaya tambahan)

## Status Pembayaran

- `unpaid`: Belum upload bukti pembayaran
- `pending`: Sudah upload, menunggu konfirmasi admin
- `paid`: Dikonfirmasi admin (approved)
- `rejected`: Ditolak admin

## Testing

1. Jalankan backend: `cd PintuKeluarAPI && npm start` (port 3001)
2. Jalankan frontend: `cd FrontEnd && npm run dev` (port 5175)
3. Login sebagai admin untuk menambah layanan
4. Login sebagai user untuk test booking
5. Test flow pembayaran lengkap

## Catatan Implementasi

- Sistem ini menggunakan booking table yang sama dengan layanan psikologi
- Untuk Opo Wae, `dokterpsikologId` diset ke 1 sebagai placeholder
- `durasi_menit` diset ke 60 sebagai default
- Sistem pembayaran menggunakan SimplePaymentController yang sudah ada
