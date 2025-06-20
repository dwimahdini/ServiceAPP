-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 18 Jun 2025 pada 00.43
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pintukeluar`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bengkels`
--

CREATE TABLE `bengkels` (
  `id` int(11) NOT NULL,
  `nama_bengkel` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `telepon` varchar(20) NOT NULL,
  `jam_buka` time NOT NULL,
  `jam_tutup` time NOT NULL,
  `jenis_kendaraan` enum('motor','mobil') NOT NULL DEFAULT 'motor',
  `rating` decimal(2,1) DEFAULT 4.0,
  `deskripsi` text DEFAULT NULL,
  `layanan_tersedia` text DEFAULT NULL,
  `koordinat_lat` varchar(50) DEFAULT NULL,
  `koordinat_lng` varchar(50) DEFAULT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `layananId` int(11) NOT NULL DEFAULT 2,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bengkels`
--

INSERT INTO `bengkels` (`id`, `nama_bengkel`, `alamat`, `telepon`, `jam_buka`, `jam_tutup`, `jenis_kendaraan`, `rating`, `deskripsi`, `layanan_tersedia`, `koordinat_lat`, `koordinat_lng`, `status`, `layananId`, `created_at`, `updated_at`) VALUES
(8, 'Bengkel Ahmad', 'Jl. Yang Lurus Sekali', '081215660192', '06:15:00', '19:00:00', 'motor', 4.0, 'Keren', 'Service Rutin', NULL, NULL, 'aktif', 2, '2025-06-17 21:12:19', '2025-06-17 21:13:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bengkel_produk`
--

CREATE TABLE `bengkel_produk` (
  `id` int(11) NOT NULL,
  `bengkel_id` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `foto_produk` varchar(255) DEFAULT NULL,
  `jenis_layanan` enum('semua_jenis_layanan','service_rutin','perbaikan_mesin','ganti_ban','ganti_oli','tune_up','service_berkala') NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bengkel_produk`
--

INSERT INTO `bengkel_produk` (`id`, `bengkel_id`, `nama_produk`, `harga`, `foto_produk`, `jenis_layanan`, `deskripsi`, `status`, `created_at`, `updated_at`) VALUES
(1, 8, 'Ban', 30000.00, '', 'service_rutin', 'ban', 'aktif', '2025-06-17 21:12:59', '2025-06-17 21:12:59'),
(2, 8, 'Ban', 200000.00, NULL, 'perbaikan_mesin', 'keren', 'aktif', '2025-06-17 22:39:32', '2025-06-17 22:39:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `jam_booking` time NOT NULL,
  `tanggal_booking` date NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `userId` int(11) NOT NULL,
  `layananId` int(11) NOT NULL,
  `dokterpsikologId` int(11) NOT NULL,
  `durasiId` int(11) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `payment_status` enum('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `jam_booking`, `tanggal_booking`, `status`, `userId`, `layananId`, `dokterpsikologId`, `durasiId`, `total_harga`, `payment_status`, `notes`, `created_at`, `updated_at`) VALUES
(4, '09:00:00', '2024-12-20', 'confirmed', 2, 2, 4, 4, 300000.00, 'paid', 'Service rutin motor', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(5, '13:00:00', '2024-12-20', 'pending', 3, 2, 5, 5, 900000.00, 'unpaid', 'Tune up mobil lengkap', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(6, '15:00:00', '2024-12-20', 'confirmed', 4, 2, 6, 6, 300000.00, 'paid', 'Ganti oli dan filter', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(7, '07:00:00', '2024-12-20', 'confirmed', 2, 3, 7, 7, 400000.00, 'paid', 'Driver untuk perjalanan ke Bandung', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(8, '10:00:00', '2024-12-20', 'pending', 3, 3, 8, 8, 240000.00, 'unpaid', 'Bersih-bersih rumah', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(9, '16:00:00', '2024-12-20', 'confirmed', 4, 3, 9, 9, 240000.00, 'paid', 'Pijat tradisional di rumah', '2025-06-16 19:47:08', '2025-06-16 19:47:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dokterpsikologs`
--

CREATE TABLE `dokterpsikologs` (
  `id` int(11) NOT NULL,
  `pilih_dokter_psikolog` varchar(255) NOT NULL,
  `spesialisasi` varchar(255) DEFAULT NULL,
  `pengalaman` text DEFAULT NULL,
  `tarif_per_jam` decimal(10,2) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `jadwal_tersedia` text DEFAULT NULL,
  `layananId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `dokterpsikologs`
--

INSERT INTO `dokterpsikologs` (`id`, `pilih_dokter_psikolog`, `spesialisasi`, `pengalaman`, `tarif_per_jam`, `foto`, `alamat`, `telepon`, `jadwal_tersedia`, `layananId`, `createdAt`, `updatedAt`) VALUES
(4, 'Bengkel Jaya Motor', 'Service Motor', 'Bengkel motor terpercaya sejak 2010', 150000.00, NULL, NULL, NULL, NULL, 2, '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(5, 'Auto Care Center', 'Service Mobil', 'Spesialis service mobil dan tune up', 300000.00, NULL, NULL, NULL, NULL, 2, '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(6, 'Bengkel Mitra Sejati', 'Service Umum', 'Melayani service motor dan mobil', 200000.00, NULL, NULL, NULL, NULL, 2, '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(7, 'Driver Profesional', 'Jasa Driver', 'Driver berpengalaman untuk perjalanan dalam dan luar kota', 100000.00, NULL, NULL, NULL, NULL, 3, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(8, 'Cleaning Service Pro', 'Jasa Bersih-bersih', 'Layanan pembersihan rumah dan kantor', 80000.00, NULL, NULL, NULL, NULL, 3, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(9, 'Tukang Pijat Tradisional', 'Jasa Pijat', 'Pijat tradisional untuk kesehatan dan relaksasi', 120000.00, NULL, NULL, NULL, NULL, 3, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(14, 'Dwi Mahdini', 'Psikolog Cinta', 'Dokter Psikologi Cinta Ternama', 400000.00, NULL, NULL, NULL, '["Senin", "Rabu", "Jumat"]', 1, '2025-06-16 21:03:26', '2025-06-16 21:03:26'),
(15, 'Dr. Sarah Wijaya', 'Psikolog Klinis', 'Spesialis gangguan kecemasan dan depresi dengan pengalaman 8 tahun', 350000.00, NULL, 'Jl. Sudirman No. 123, Jakarta', '081234567890', '["Senin", "Selasa", "Kamis"]', 1, '2025-06-20 10:00:00', '2025-06-20 10:00:00'),
(16, 'Dr. Ahmad Rizki', 'Psikolog Anak', 'Ahli dalam menangani masalah psikologi anak dan remaja', 300000.00, NULL, 'Jl. Gatot Subroto No. 456, Jakarta', '081234567891', '["Rabu", "Kamis", "Sabtu"]', 1, '2025-06-20 10:00:00', '2025-06-20 10:00:00'),
(17, 'Dr. Maya Sari', 'Psikolog Keluarga', 'Konselor pernikahan dan terapi keluarga berpengalaman 10 tahun', 450000.00, NULL, 'Jl. Thamrin No. 789, Jakarta', '081234567892', '["Selasa", "Jumat", "Sabtu"]', 1, '2025-06-20 10:00:00', '2025-06-20 10:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `durasis`
--

CREATE TABLE `durasis` (
  `id` int(11) NOT NULL,
  `durasi` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `layananId` int(11) NOT NULL,
  `dokterpsikologId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `durasis`
--

INSERT INTO `durasis` (`id`, `durasi`, `userId`, `layananId`, `dokterpsikologId`, `createdAt`, `updatedAt`) VALUES
(4, 120, 2, 2, 4, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(5, 180, 3, 2, 5, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(6, 90, 4, 2, 6, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(7, 240, 2, 3, 7, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(8, 180, 3, 3, 8, '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(9, 120, 4, 3, 9, '2025-06-16 19:47:08', '2025-06-16 19:47:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `layanans`
--

CREATE TABLE `layanans` (
  `id` int(11) NOT NULL,
  `nama_layanan` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `layanans`
--

INSERT INTO `layanans` (`id`, `nama_layanan`, `deskripsi`, `createdAt`, `updatedAt`) VALUES
(1, 'Psikologi', 'Layanan konsultasi psikologi dengan dokter berpengalaman', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(2, 'Bengkel', 'Layanan pencarian bengkel berdasarkan lokasi terdekat', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(3, 'Opo Wae', 'Layanan kebutuhan sehari-hari seperti driver dan cleaning service', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(4, 'Test Service CRUD', 'Layanan untuk testing CRUD functionality', '2025-06-16 20:42:34', '2025-06-16 20:42:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('transfer_bank','e_wallet','cash','credit_card') NOT NULL,
  `payment_proof` varchar(255) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `payment_method`, `payment_proof`, `payment_date`, `status`, `created_at`, `updated_at`) VALUES
(3, 4, 300000.00, 'cash', NULL, '2024-12-20 02:00:00', 'success', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(4, 6, 300000.00, 'transfer_bank', NULL, '2024-12-19 13:15:00', 'success', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(5, 7, 400000.00, 'e_wallet', NULL, '2024-12-19 11:20:00', 'success', '2025-06-16 19:47:08', '2025-06-16 19:47:08'),
(6, 9, 240000.00, 'cash', NULL, '2024-12-20 09:00:00', 'success', '2025-06-16 19:47:08', '2025-06-16 19:47:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pilihlayanans`
--

CREATE TABLE `pilihlayanans` (
  `id` int(11) NOT NULL,
  `nama_pilihan` varchar(255) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `layananId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `produks`
--

CREATE TABLE `produks` (
  `id` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga` decimal(10,2) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `layananId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedulevalidations`
--

CREATE TABLE `schedulevalidations` (
  `id` int(11) NOT NULL,
  `dokterpsikolog_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `schedulevalidations`
--

INSERT INTO `schedulevalidations` (`id`, `dokterpsikolog_id`, `tanggal`, `jam_mulai`, `jam_selesai`, `is_available`, `created_at`) VALUES
(6, 4, '2024-12-20', '08:00:00', '18:00:00', 1, '2025-06-16 19:47:08'),
(7, 5, '2024-12-20', '07:00:00', '19:00:00', 1, '2025-06-16 19:47:08'),
(8, 6, '2024-12-20', '08:30:00', '17:30:00', 1, '2025-06-16 19:47:08'),
(9, 7, '2024-12-20', '06:00:00', '22:00:00', 1, '2025-06-16 19:47:08'),
(10, 8, '2024-12-20', '08:00:00', '17:00:00', 1, '2025-06-16 19:47:08'),
(11, 9, '2024-12-20', '10:00:00', '20:00:00', 1, '2025-06-16 19:47:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin Future X', 'admin@futurex.com', '$2b$10$Ymptu63vHnJqyOr5xlMRa.yc0ohaBW5hRjIqIM8K0QMIDof88G6ZK', 'admin', '2025-06-16 19:47:07', '2025-06-16 20:21:05'),
(2, 'John Doe', 'john@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi$2y$10$Hhq09YrQk38ozhqkP4dcVe5Q914x2A.M75Z6M6BIroC1MIge0Sqeq', 'user', '2025-06-16 19:47:07', '2025-06-16 20:16:49'),
(3, 'Jane Smith', 'jane@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(4, 'Ahmad Rizki', 'ahmad@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(5, 'Siti Nurhaliza', 'siti@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2025-06-16 19:47:07', '2025-06-16 19:47:07'),
(6, 'dwi', 'dwimahdini12@gmail.com', '$2b$10$MK3l9ZHpzs2zFzi7i6FT4ep5lOON4FCzJT.X4yHm0jrNvFDfGiV7q', 'user', '2025-06-16 20:18:07', '2025-06-16 20:18:07');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bengkels`
--
ALTER TABLE `bengkels`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `bengkel_produk`
--
ALTER TABLE `bengkel_produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bengkel_id` (`bengkel_id`);

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `layananId` (`layananId`),
  ADD KEY `dokterpsikologId` (`dokterpsikologId`),
  ADD KEY `durasiId` (`durasiId`);

--
-- Indeks untuk tabel `dokterpsikologs`
--
ALTER TABLE `dokterpsikologs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layananId` (`layananId`);

--
-- Indeks untuk tabel `durasis`
--
ALTER TABLE `durasis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `layananId` (`layananId`),
  ADD KEY `dokterpsikologId` (`dokterpsikologId`);

--
-- Indeks untuk tabel `layanans`
--
ALTER TABLE `layanans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indeks untuk tabel `pilihlayanans`
--
ALTER TABLE `pilihlayanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layananId` (`layananId`);

--
-- Indeks untuk tabel `produks`
--
ALTER TABLE `produks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layananId` (`layananId`);

--
-- Indeks untuk tabel `schedulevalidations`
--
ALTER TABLE `schedulevalidations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dokterpsikolog_id` (`dokterpsikolog_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bengkels`
--
ALTER TABLE `bengkels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `bengkel_produk`
--
ALTER TABLE `bengkel_produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `dokterpsikologs`
--
ALTER TABLE `dokterpsikologs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `durasis`
--
ALTER TABLE `durasis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `layanans`
--
ALTER TABLE `layanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `pilihlayanans`
--
ALTER TABLE `pilihlayanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `produks`
--
ALTER TABLE `produks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `schedulevalidations`
--
ALTER TABLE `schedulevalidations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bengkel_produk`
--
ALTER TABLE `bengkel_produk`
  ADD CONSTRAINT `bengkel_produk_ibfk_1` FOREIGN KEY (`bengkel_id`) REFERENCES `bengkels` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`layananId`) REFERENCES `layanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`dokterpsikologId`) REFERENCES `dokterpsikologs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`durasiId`) REFERENCES `durasis` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `dokterpsikologs`
--
ALTER TABLE `dokterpsikologs`
  ADD CONSTRAINT `dokterpsikologs_ibfk_1` FOREIGN KEY (`layananId`) REFERENCES `layanans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `durasis`
--
ALTER TABLE `durasis`
  ADD CONSTRAINT `durasis_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `durasis_ibfk_2` FOREIGN KEY (`layananId`) REFERENCES `layanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `durasis_ibfk_3` FOREIGN KEY (`dokterpsikologId`) REFERENCES `dokterpsikologs` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pilihlayanans`
--
ALTER TABLE `pilihlayanans`
  ADD CONSTRAINT `pilihlayanans_ibfk_1` FOREIGN KEY (`layananId`) REFERENCES `layanans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `produks`
--
ALTER TABLE `produks`
  ADD CONSTRAINT `produks_ibfk_1` FOREIGN KEY (`layananId`) REFERENCES `layanans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `schedulevalidations`
--
ALTER TABLE `schedulevalidations`
  ADD CONSTRAINT `schedulevalidations_ibfk_1` FOREIGN KEY (`dokterpsikolog_id`) REFERENCES `dokterpsikologs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
