import pool from '../config/db.js';

export const createLayanan = async (request, h) => {
  const { jenis, isi } = request.payload;
  const userId = request.auth.user.id;

  if (!['surat', 'kependudukan', 'formulir', 'jadwal'].includes(jenis)) {
    return h.response({ message: 'Jenis layanan tidak valid' }).code(400);
  }

  try {
    await pool.query(
      'INSERT INTO layanan (user_id, jenis, isi) VALUES (?, ?, ?)',
      [userId, jenis, isi]
    );
    return h.response({ message: 'Pengajuan layanan berhasil dibuat' }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Gagal membuat layanan' }).code(500);
  }
};

export const getLayananUser = async (request, h) => {
  const userId = request.auth.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM layanan WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil data layanan user' }).code(500);
  }
};

export const getAllLayanan = async (request, h) => {
  try {
    const [rows] = await pool.query('SELECT * FROM layanan ORDER BY created_at DESC');
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil semua data layanan' }).code(500);
  }
};

export const updateStatusLayanan = async (request, h) => {
  const { id } = request.params;
  const { status } = request.payload;

  if (!['pending', 'diterima', 'ditolak'].includes(status)) {
    return h.response({ message: 'Status tidak valid' }).code(400);
  }

  try {
    const [result] = await pool.query('UPDATE layanan SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return h.response({ message: 'Layanan tidak ditemukan' }).code(404);
    }
    return h.response({ message: 'Status layanan berhasil diperbarui' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal memperbarui status layanan' }).code(500);
  }
};
