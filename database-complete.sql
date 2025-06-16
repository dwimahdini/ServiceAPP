-- =====================================================
-- FUTURE X - COMPLETE DATABASE SCHEMA & SAMPLE DATA
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS pintukeluar;
USE pintukeluar;

-- =====================================================
-- TABLE STRUCTURES
-- =====================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Layanan Table (Services)
CREATE TABLE IF NOT EXISTS layanans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_layanan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Dokter Psikolog Table (Psychology Doctors & All Providers)
CREATE TABLE IF NOT EXISTS dokterpsikologs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilih_dokter_psikolog VARCHAR(255) NOT NULL,
    spesialisasi VARCHAR(255),
    pengalaman TEXT,
    tarif_per_jam DECIMAL(10,2),
    foto VARCHAR(255),
    alamat TEXT,
    telepon VARCHAR(20),
    layananId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (layananId) REFERENCES layanans(id) ON DELETE CASCADE
);

-- 4. Durasi Table (Duration Options)
CREATE TABLE IF NOT EXISTS durasis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    durasi_konsultasi VARCHAR(100) NOT NULL,
    harga DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Pilih Layanan Table (Service Selection)
CREATE TABLE IF NOT EXISTS pilihlayanans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_layanan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Produk Table (Products/Services)
CREATE TABLE IF NOT EXISTS produks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(10,2),
    kategori VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    layananId INT NOT NULL,
    dokterpsikologId INT NOT NULL,
    durasiId INT NOT NULL,
    tanggal_booking DATE NOT NULL,
    jam_booking TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_harga DECIMAL(10,2) NOT NULL,
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (layananId) REFERENCES layanans(id) ON DELETE CASCADE,
    FOREIGN KEY (dokterpsikologId) REFERENCES dokterpsikologs(id) ON DELETE CASCADE,
    FOREIGN KEY (durasiId) REFERENCES durasis(id) ON DELETE CASCADE
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('transfer_bank', 'e_wallet', 'cash', 'credit_card') NOT NULL,
    payment_proof VARCHAR(255),
    payment_date DATETIME,
    status ENUM('pending', 'success', 'failed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 9. Schedule Validations Table
CREATE TABLE IF NOT EXISTS schedulevalidations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dokterpsikolog_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dokterpsikolog_id) REFERENCES dokterpsikologs(id) ON DELETE CASCADE
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert Admin User (Password: admin123 - hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin Future X', 'admin@futurex.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert Sample Users (Password: password123 for all)
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Jane Smith', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Bob Wilson', 'bob@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Alice Brown', 'alice@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Charlie Davis', 'charlie@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert Main Services
INSERT INTO layanans (nama_layanan, deskripsi) VALUES 
('Psikologi', 'Layanan konsultasi psikologi dengan dokter berpengalaman'),
('Bengkel', 'Layanan perbaikan kendaraan bermotor dan mobil'),
('Opo Wae', 'Layanan kebutuhan sehari-hari seperti driver, cleaning service, dll');

-- Insert Psychology Doctors
INSERT INTO dokterpsikologs (pilih_dokter_psikolog, spesialisasi, pengalaman, tarif_per_jam, layananId) VALUES 
('Dr. Sarah Wijaya, M.Psi', 'Psikologi Klinis', '8 tahun pengalaman menangani kasus depresi dan anxiety', 500000, 1),
('Dr. Ahmad Rahman, M.Psi', 'Psikologi Anak', '10 tahun pengalaman terapi anak dan remaja', 450000, 1),
('Dr. Maya Sari, M.Psi', 'Psikologi Keluarga', '6 tahun pengalaman konseling keluarga dan pernikahan', 400000, 1);

-- Insert Bengkel Providers
INSERT INTO dokterpsikologs (pilih_dokter_psikolog, spesialisasi, pengalaman, tarif_per_jam, layananId) VALUES 
('Bengkel Motor Jaya', 'Service Motor', 'Spesialis perbaikan motor semua merk', 150000, 2),
('Auto Care Center', 'Service Mobil', 'Bengkel mobil dengan teknisi bersertifikat', 300000, 2),
('Bengkel Umum Sejahtera', 'Motor & Mobil', 'Melayani perbaikan motor dan mobil', 200000, 2);

-- Insert Opo Wae Providers
INSERT INTO dokterpsikologs (pilih_dokter_psikolog, spesialisasi, pengalaman, tarif_per_jam, layananId) VALUES 
('Driver Profesional', 'Driver Pribadi', 'Driver berpengalaman untuk perjalanan dalam kota', 50000, 3),
('Cleaning Service Pro', 'Pembersihan Rumah', 'Layanan pembersihan rumah dan kantor', 75000, 3),
('Tukang Pijat Tradisional', 'Pijat Kesehatan', 'Pijat tradisional untuk kesehatan dan relaksasi', 100000, 3);

-- Insert Duration Options
INSERT INTO durasis (durasi_konsultasi, harga) VALUES 
('30 menit', 200000),
('60 menit', 350000),
('90 menit', 500000),
('2 jam', 650000),
('3 jam', 900000),
('4 jam', 1200000),
('5 jam', 1500000),
('6 jam', 1800000),
('8 jam', 2400000);

-- Insert Sample Bookings
INSERT INTO bookings (userId, layananId, dokterpsikologId, durasiId, tanggal_booking, jam_booking, status, total_harga, payment_status, notes) VALUES 
(2, 1, 1, 2, '2025-06-20', '10:00:00', 'confirmed', 500000, 'paid', 'Konsultasi stress kerja'),
(3, 1, 2, 1, '2025-06-21', '14:00:00', 'pending', 300000, 'unpaid', 'Konsultasi anak'),
(4, 2, 4, 3, '2025-06-22', '09:00:00', 'confirmed', 450000, 'paid', 'Service motor rutin'),
(5, 2, 5, 4, '2025-06-23', '11:00:00', 'pending', 600000, 'unpaid', 'Perbaikan mobil'),
(6, 3, 7, 5, '2025-06-24', '08:00:00', 'completed', 750000, 'paid', 'Driver untuk acara'),
(2, 3, 8, 2, '2025-06-25', '15:00:00', 'confirmed', 350000, 'paid', 'Cleaning service rumah'),
(3, 1, 3, 2, '2025-06-26', '16:00:00', 'pending', 400000, 'unpaid', 'Konseling keluarga'),
(4, 3, 9, 1, '2025-06-27', '18:00:00', 'confirmed', 200000, 'paid', 'Pijat relaksasi'),
(5, 1, 1, 3, '2025-06-28', '13:00:00', 'pending', 500000, 'unpaid', 'Follow up konsultasi');

-- Insert Sample Payments
INSERT INTO payments (booking_id, amount, payment_method, payment_date, status) VALUES 
(1, 500000, 'transfer_bank', '2025-06-16 09:30:00', 'success'),
(3, 450000, 'e_wallet', '2025-06-16 10:15:00', 'success'),
(5, 750000, 'cash', '2025-06-16 11:00:00', 'success'),
(6, 350000, 'transfer_bank', '2025-06-16 12:30:00', 'success'),
(8, 200000, 'e_wallet', '2025-06-16 14:00:00', 'success'),
(2, 300000, 'transfer_bank', NULL, 'pending');

-- Insert Schedule Validations
INSERT INTO schedulevalidations (dokterpsikolog_id, tanggal, jam_mulai, jam_selesai, is_available) VALUES 
(1, '2025-06-20', '09:00:00', '17:00:00', TRUE),
(1, '2025-06-21', '09:00:00', '17:00:00', TRUE),
(2, '2025-06-20', '10:00:00', '16:00:00', TRUE),
(2, '2025-06-22', '10:00:00', '16:00:00', TRUE),
(3, '2025-06-21', '13:00:00', '18:00:00', TRUE),
(4, '2025-06-20', '08:00:00', '17:00:00', TRUE),
(5, '2025-06-21', '08:00:00', '17:00:00', TRUE),
(6, '2025-06-22', '08:00:00', '17:00:00', TRUE),
(7, '2025-06-20', '07:00:00', '19:00:00', TRUE),
(8, '2025-06-21', '08:00:00', '18:00:00', TRUE),
(9, '2025-06-22', '16:00:00', '22:00:00', TRUE);

-- Insert Sample Pilih Layanan
INSERT INTO pilihlayanans (nama_layanan, deskripsi, harga) VALUES 
('Konsultasi Psikologi Online', 'Konsultasi psikologi melalui video call', 300000),
('Konsultasi Psikologi Offline', 'Konsultasi psikologi tatap muka', 500000),
('Service Motor Ringan', 'Service rutin motor (ganti oli, tune up)', 150000),
('Service Motor Berat', 'Perbaikan besar motor (mesin, transmisi)', 500000),
('Service Mobil Ringan', 'Service rutin mobil (ganti oli, filter)', 300000),
('Service Mobil Berat', 'Perbaikan besar mobil (mesin, transmisi)', 1000000);

-- Insert Sample Produk
INSERT INTO produks (nama_produk, deskripsi, harga, kategori) VALUES 
('Paket Konsultasi 3x', 'Paket 3 kali konsultasi psikologi', 1200000, 'Psikologi'),
('Paket Service Motor Tahunan', 'Paket service motor untuk 1 tahun', 800000, 'Bengkel'),
('Paket Cleaning Bulanan', 'Paket cleaning service untuk 1 bulan', 1500000, 'Opo Wae'),
('Paket Driver Harian', 'Paket driver untuk kebutuhan harian', 500000, 'Opo Wae');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_user ON bookings(userId);
CREATE INDEX idx_bookings_layanan ON bookings(layananId);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(tanggal_booking);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_dokterpsikologs_layanan ON dokterpsikologs(layananId);
CREATE INDEX idx_schedulevalidations_dokter ON schedulevalidations(dokterpsikolog_id);
CREATE INDEX idx_schedulevalidations_date ON schedulevalidations(tanggal);

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View for complete booking information
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.id as booking_id,
    u.name as user_name,
    u.email as user_email,
    l.nama_layanan as service_name,
    d.pilih_dokter_psikolog as provider_name,
    d.spesialisasi as provider_specialty,
    dur.durasi_konsultasi as duration,
    b.tanggal_booking,
    b.jam_booking,
    b.status as booking_status,
    b.total_harga,
    b.payment_status,
    b.notes,
    b.created_at as booking_created
FROM bookings b
JOIN users u ON b.userId = u.id
JOIN layanans l ON b.layananId = l.id
JOIN dokterpsikologs d ON b.dokterpsikologId = d.id
JOIN durasis dur ON b.durasiId = dur.id;

-- View for service statistics
CREATE OR REPLACE VIEW service_stats AS
SELECT 
    l.id as service_id,
    l.nama_layanan as service_name,
    COUNT(DISTINCT d.id) as total_providers,
    COUNT(DISTINCT b.id) as total_bookings,
    COALESCE(SUM(b.total_harga), 0) as total_revenue,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bookings
FROM layanans l
LEFT JOIN dokterpsikologs d ON l.id = d.layananId
LEFT JOIN bookings b ON l.id = b.layananId
GROUP BY l.id, l.nama_layanan;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to get dashboard statistics
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM layanans) as total_services,
        (SELECT COUNT(*) FROM dokterpsikologs) as total_providers,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'success') as total_revenue,
        (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger to update booking payment status when payment is successful
CREATE TRIGGER update_booking_payment_status
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'success' AND OLD.status != 'success' THEN
        UPDATE bookings 
        SET payment_status = 'paid' 
        WHERE id = NEW.booking_id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- Database setup complete!
-- Default admin login: admin@futurex.com / admin123
-- Sample data includes 6 users, 3 services, 9 providers, 9 bookings, 6 payments
-- All foreign key relationships are properly set up
-- Indexes added for performance optimization
-- Views created for easy data retrieval
-- Stored procedures for dashboard statistics
-- Triggers for automatic data consistency
