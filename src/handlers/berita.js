import fs from 'fs';
import pool from '../config/db.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  compressImage
} from '../utils/upload.js';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxImageSize = 5 * 1024 * 1024; // 5MB

export const createBerita = async (request, h) => {
  const { judul, konten, kategori } = request.payload;
  const file = request.payload.image;



  if (!['artikel', 'agenda', 'pengumuman'].includes(kategori)) {
    return h.response({ message: 'Kategori tidak valid' }).code(400);
  }

  let imageUrl = null;
  let public_id = null;

  if (file && file.hapi?.filename && file._readableState) {

    const tempPath = `./uploads/${Date.now()}_${file.hapi.filename}`;

    const writeStream = fs.createWriteStream(tempPath);
    await new Promise((resolve, reject) => {
      file.pipe(writeStream);
      file.on('end', resolve);
      file.on('error', reject);
    });

    const contentType = file.hapi.headers['content-type'];
    const stats = fs.statSync(tempPath);
    const fileSize = stats.size;

    if (!allowedImageTypes.includes(contentType)) {
      fs.unlinkSync(tempPath);
      return h.response({ message: 'Hanya file JPG, PNG, atau WebP yang diizinkan' }).code(400);
    }
    if (fileSize > maxImageSize) {
      fs.unlinkSync(tempPath);
      return h.response({ message: 'Ukuran gambar maksimal 5MB' }).code(400);
    }

    try {
      const compressedPath = tempPath + '_compressed.jpg';
      await compressImage(tempPath, compressedPath);
      fs.unlinkSync(tempPath);

      const uploaded = await uploadToCloudinary(compressedPath, 'berita');


      imageUrl = uploaded.url;
      public_id = uploaded.public_id;
    } catch (err) {
      return h.response({ message: 'Gagal upload gambar ke Cloudinary' }).code(500);
    }
  }

  try {


    await pool.query(
      'INSERT INTO berita (judul, konten, kategori, gambar, public_id) VALUES (?, ?, ?, ?, ?)',
      [judul, konten, kategori, imageUrl, public_id]
    );

    return h.response({
      message: 'Berita berhasil ditambahkan',
      data: {
        judul, konten, kategori,
        gambar: imageUrl || 'Tidak ada gambar',
        public_id: public_id || null
      }
    }).code(201);
  } catch (err) {
    return h.response({ message: 'Gagal menambahkan berita' }).code(500);
  }
};

export const getAllBerita = async (_, h) => {
  try {
    const [rows] = await pool.query('SELECT * FROM berita ORDER BY created_at DESC');
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil data' }).code(500);
  }
};

export const getBeritaById = async (request, h) => {
  try {
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [request.params.id]);
    if (rows.length === 0) return h.response({ message: 'Berita tidak ditemukan' }).code(404);
    return h.response(rows[0]).code(200);
  } catch (err) {
    return h.response({ message: 'Error mengambil berita' }).code(500);
  }
};

export const getBeritaByKategori = async (request, h) => {
  const kategori = request.params.kategori;
  if (!['artikel', 'agenda', 'pengumuman'].includes(kategori)) {
    return h.response({ message: 'Kategori tidak valid' }).code(400);
  }
  try {
    const [rows] = await pool.query('SELECT * FROM berita WHERE kategori = ?', [kategori]);
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil berita' }).code(500);
  }
};

export const updateBerita = async (request, h) => {
  const { judul, konten, kategori } = request.payload;
  const { id } = request.params;
  const file = request.payload.image;

  try {
    const [existingRows] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
    if (existingRows.length === 0) return h.response({ message: 'Berita tidak ditemukan' }).code(404);
    const existing = existingRows[0];

    let newImageUrl = existing.gambar;
    let newPublicId = existing.public_id;

    if (file && file.hapi?.filename && file._readableState) {
      const tempPath = `./uploads/${Date.now()}_${file.hapi.filename}`;
      const writeStream = fs.createWriteStream(tempPath);
      await new Promise((resolve, reject) => {
        file.pipe(writeStream);
        file.on('end', resolve);
        file.on('error', reject);
      });

      const contentType = file.hapi.headers['content-type'];
      const stats = fs.statSync(tempPath);
      const fileSize = stats.size;

      if (!allowedImageTypes.includes(contentType)) {
        fs.unlinkSync(tempPath);
        return h.response({ message: 'Hanya file JPG, PNG, atau WebP yang diizinkan' }).code(400);
      }
      if (fileSize > maxImageSize) {
        fs.unlinkSync(tempPath);
        return h.response({ message: 'Ukuran gambar maksimal 5MB' }).code(400);
      }

      const compressedPath = tempPath + '_compressed.jpg';
      await compressImage(tempPath, compressedPath);
      fs.unlinkSync(tempPath);

      const uploaded = await uploadToCloudinary(compressedPath, 'berita');
      newImageUrl = uploaded.url;
      newPublicId = uploaded.public_id;

      if (existing.public_id) {
        await deleteFromCloudinary(existing.public_id);
      }
    }

    await pool.query(
      'UPDATE berita SET judul = ?, konten = ?, kategori = ?, gambar = ?, public_id = ? WHERE id = ?',
      [judul, konten, kategori, newImageUrl, newPublicId, id]
    );

    return h.response({ message: 'Berita berhasil diperbarui' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal memperbarui berita' }).code(500);
  }
};

export const deleteBerita = async (request, h) => {
  const { id } = request.params;

  try {
    const [[berita]] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
    if (!berita) return h.response({ message: 'Berita tidak ditemukan' }).code(404);

    if (berita.public_id) {
      try {
        await deleteFromCloudinary(berita.public_id);
      } catch (err) {
        // Silent fail untuk Cloudinary delete
      }
    }

    await pool.query('DELETE FROM berita WHERE id = ?', [id]);
    return h.response({ message: 'Berita berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal menghapus berita' }).code(500);
  }
};