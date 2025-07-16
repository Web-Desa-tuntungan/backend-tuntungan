import 'dotenv/config';
import fs from 'fs';
import pool from '../src/config/db.js';

const runMigration = async () => {
  try {
    console.log('🚀 Menjalankan migration perangkat_desa...');

    // Buat tabel perangkat_desa
    console.log('📋 Membuat tabel perangkat_desa...');
    await pool.query(`
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
      )
    `);

    // Buat index
    console.log('📋 Membuat index...');
    try {
      await pool.query('CREATE INDEX idx_perangkat_desa_status ON perangkat_desa(status)');
    } catch (err) {
      // Index mungkin sudah ada
    }

    try {
      await pool.query('CREATE INDEX idx_perangkat_desa_urutan ON perangkat_desa(urutan)');
    } catch (err) {
      // Index mungkin sudah ada
    }

    // Insert data contoh
    console.log('📋 Menambahkan data contoh...');
    await pool.query(`
      INSERT IGNORE INTO perangkat_desa (nama, jabatan, bio, urutan) VALUES
      ('Bapak Kepala Desa', 'Kepala Desa', 'Kepala Desa Tuntungan 1 yang berdedikasi melayani masyarakat dengan sepenuh hati.', 1),
      ('Ibu Sekretaris Desa', 'Sekretaris Desa', 'Sekretaris Desa yang bertanggung jawab dalam administrasi dan tata kelola desa.', 2),
      ('Bapak Kepala Urusan Keuangan', 'Kepala Urusan Keuangan', 'Mengelola keuangan desa dengan transparan dan akuntabel.', 3),
      ('Ibu Kepala Urusan Umum', 'Kepala Urusan Umum & Tata Usaha', 'Mengurus administrasi umum dan tata usaha desa.', 4)
    `);
    
    console.log('✅ Migration berhasil dijalankan!');
    console.log('📋 Tabel perangkat_desa telah dibuat dengan data contoh');
    
    // Verifikasi tabel dibuat
    const [tables] = await pool.query("SHOW TABLES LIKE 'perangkat_desa'");
    if (tables.length > 0) {
      console.log('✅ Tabel perangkat_desa berhasil dibuat');
      
      // Tampilkan data contoh
      const [rows] = await pool.query('SELECT id, nama, jabatan FROM perangkat_desa LIMIT 5');
      console.log('📋 Data contoh:');
      console.table(rows);
    }
    
  } catch (error) {
    console.error('❌ Error menjalankan migration:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

runMigration();
