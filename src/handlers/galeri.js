import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  compressImage
} from '../utils/upload.js';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedVideoTypes = ['video/mp4'];
const maxImageSize = 5 * 1024 * 1024; // 5MB
const maxVideoSize = 20 * 1024 * 1024; // 20MB

export const createGaleri = async (request, h) => {
  const { tipe, deskripsi } = request.payload;
  const file = request.payload.file;



  if (!['foto', 'video'].includes(tipe)) {
    return h.response({ message: 'Tipe galeri tidak valid' }).code(400);
  }

  if (!file) {
    return h.response({ message: 'File tidak ditemukan' }).code(400);
  }

  if (!file.hapi?.headers) {
    return h.response({ message: 'File headers tidak valid' }).code(400);
  }

  const contentType = file.hapi.headers['content-type'];
  let fileSize = 0;
  let tempPath = null;

  // Handle stream upload (bukan file path)
  if (file._data) {
    fileSize = file._data.length;
    // Buat temporary file dari buffer
    tempPath = `./uploads/temp_${Date.now()}_${file.hapi.filename}`;
    try {
      fs.writeFileSync(tempPath, file._data);
    } catch (err) {
      return h.response({ message: 'Gagal memproses file' }).code(500);
    }
  } else if (file.path) {
    // Handle file path upload
    try {
      const stats = fs.statSync(file.path);
      fileSize = stats.size;
      tempPath = file.path;
    } catch (err) {
      return h.response({ message: 'File tidak valid' }).code(400);
    }
  } else {
    return h.response({ message: 'Format file tidak valid' }).code(400);
  }

  if (tipe === 'foto') {
    if (!allowedImageTypes.includes(contentType)) {
      return h.response({ message: 'Hanya file JPG, PNG, atau WebP yang diizinkan' }).code(400);
    }
    if (fileSize > maxImageSize) {
      return h.response({ message: 'Ukuran gambar maksimal 5MB' }).code(400);
    }
  } else {
    if (!allowedVideoTypes.includes(contentType)) {
      return h.response({ message: 'Hanya video MP4 yang diizinkan' }).code(400);
    }
    if (fileSize > maxVideoSize) {
      return h.response({ message: 'Ukuran video maksimal 20MB' }).code(400);
    }
  }

  try {
    const folder = tipe === 'foto' ? 'galeri/foto' : 'galeri/video';
    let uploadPath = tempPath;

    if (tipe === 'foto') {
      const compressedPath = uploadPath + '_compressed.jpg';
      await compressImage(uploadPath, compressedPath);
      uploadPath = compressedPath;
      // Hapus file temporary original
      if (tempPath !== file.path) {
        fs.unlinkSync(tempPath);
      }
    }

    const { url, public_id } = await uploadToCloudinary(uploadPath, folder);



    await pool.query(
      'INSERT INTO galeri (tipe, url, public_id, deskripsi) VALUES (?, ?, ?, ?)',
      [tipe, url, public_id, deskripsi || null]
    );

    return h.response({ message: 'Galeri berhasil ditambahkan', url }).code(201);
  } catch (err) {
    // Cleanup temporary file jika ada error
    if (tempPath && tempPath !== file.path && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return h.response({ message: 'Gagal upload file' }).code(500);
  }
};

export const getGaleri = async (_, h) => {
  try {
    const [rows] = await pool.query('SELECT * FROM galeri ORDER BY created_at DESC');
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil data galeri' }).code(500);
  }
};

export const deleteGaleri = async (request, h) => {
  const { id } = request.params;

  try {
    const [[galeri]] = await pool.query('SELECT * FROM galeri WHERE id = ?', [id]);
    if (!galeri) return h.response({ message: 'Data galeri tidak ditemukan' }).code(404);

    if (galeri.public_id) {
      try {
        await deleteFromCloudinary(galeri.public_id);
      } catch (cloudErr) {
        // Silent fail untuk Cloudinary delete
      }
    }

    await pool.query('DELETE FROM galeri WHERE id = ?', [id]);
    return h.response({ message: 'Galeri berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal menghapus galeri' }).code(500);
  }
};
