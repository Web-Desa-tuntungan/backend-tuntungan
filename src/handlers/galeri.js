import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

const uploadDir = path.resolve('uploads');

export const createGaleri = async (request, h) => {
  const { tipe, deskripsi, file } = request.payload;

  if (!['foto', 'video'].includes(tipe)) {
    return h.response({ message: 'Tipe galeri tidak valid' }).code(400);
  }

  if (!file || !file.hapi) {
    return h.response({ message: 'File tidak ditemukan' }).code(400);
  }

  const filename = Date.now() + '_' + file.hapi.filename;
  const filepath = path.join(uploadDir, filename);

  try {
    const fileStream = fs.createWriteStream(filepath);
    await file.pipe(fileStream);

    const relativeUrl = `/uploads/${filename}`;
    await pool.query(
      'INSERT INTO galeri (tipe, url, deskripsi) VALUES (?, ?, ?)',
      [tipe, relativeUrl, deskripsi || null]
    );

    return h.response({ message: 'Galeri berhasil ditambahkan', url: relativeUrl }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Gagal menyimpan file' }).code(500);
  }
};

export const getGaleri = async (request, h) => {
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

    const filePath = path.resolve(`.${galeri.url}`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM galeri WHERE id = ?', [id]);
    return h.response({ message: 'Galeri berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal menghapus galeri' }).code(500);
  }
};
