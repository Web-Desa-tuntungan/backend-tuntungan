import pool from '../config/db.js';

export const createBerita = async (request, h) => {
  const { judul, konten, kategori } = request.payload;
  if (!['artikel', 'agenda', 'pengumuman'].includes(kategori)) {
    return h.response({ message: 'Kategori tidak valid' }).code(400);
  }
  try {
    await pool.query(
      'INSERT INTO berita (judul, konten, kategori) VALUES (?, ?, ?)',
      [judul, konten, kategori]
    );
    return h.response({ message: 'Berita berhasil ditambahkan' }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Gagal menambahkan berita' }).code(500);
  }
};

export const getAllBerita = async (request, h) => {
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
  try {
    await pool.query(
      'UPDATE berita SET judul = ?, konten = ?, kategori = ? WHERE id = ?',
      [judul, konten, kategori, id]
    );
    return h.response({ message: 'Berita berhasil diperbarui' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal memperbarui berita' }).code(500);
  }
};

export const deleteBerita = async (request, h) => {
  const { id } = request.params;
  try {
    await pool.query('DELETE FROM berita WHERE id = ?', [id]);
    return h.response({ message: 'Berita berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal menghapus berita' }).code(500);
  }
};
