-- Script untuk menambahkan kolom kategori ke tabel pilihlayanans
-- Jalankan script ini di phpMyAdmin atau MySQL client

USE pintukeluar;

-- Tambahkan kolom kategori ke tabel pilihlayanans
ALTER TABLE pilihlayanans 
ADD COLUMN kategori VARCHAR(100) DEFAULT 'other' AFTER harga;

-- Update data yang sudah ada dengan kategori default
UPDATE pilihlayanans SET kategori = 'other' WHERE kategori IS NULL;

-- Tampilkan struktur tabel yang sudah diupdate
DESCRIBE pilihlayanans;

-- Tampilkan data untuk verifikasi
SELECT * FROM pilihlayanans;
