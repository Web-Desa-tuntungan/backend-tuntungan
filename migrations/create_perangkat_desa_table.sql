-- Migration: Create perangkat_desa table
-- Created: 2025-07-16

CREATE TABLE IF NOT EXISTS perangkat_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  foto VARCHAR(500) NULL,
  public_id VARCHAR(255) NULL,
  bio TEXT NULL,
  urutan INT DEFAULT 0,
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index untuk optimasi query
CREATE INDEX idx_perangkat_desa_status ON perangkat_desa(status);
CREATE INDEX idx_perangkat_desa_urutan ON perangkat_desa(urutan);

-- Insert data contoh (opsional)
INSERT INTO perangkat_desa (nama, jabatan, bio, urutan) VALUES 
('Bapak Kepala Desa', 'Kepala Desa', 'Kepala Desa Tuntungan 1 yang berdedikasi melayani masyarakat dengan sepenuh hati.', 1),
('Ibu Sekretaris Desa', 'Sekretaris Desa', 'Sekretaris Desa yang bertanggung jawab dalam administrasi dan tata kelola desa.', 2),
('Bapak Kepala Urusan Keuangan', 'Kepala Urusan Keuangan', 'Mengelola keuangan desa dengan transparan dan akuntabel.', 3),
('Ibu Kepala Urusan Umum', 'Kepala Urusan Umum & Tata Usaha', 'Mengurus administrasi umum dan tata usaha desa.', 4);
