import fs from 'fs';
import pool from '../config/db.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  compressImage
} from '../utils/upload.js';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxImageSize = 5 * 1024 * 1024; // 5MB

export const createPerangkatDesa = async (request, h) => {
  const { nama, jabatan, bio, urutan } = request.payload;
  const file = request.payload.foto;

  if (!nama || !jabatan) {
    return h.response({ message: 'Nama dan jabatan wajib diisi' }).code(400);
  }

  let fotoUrl = null;
  let public_id = null;

  // Handle foto upload jika ada
  if (file && file.hapi?.headers) {
    const contentType = file.hapi.headers['content-type'];
    let fileSize = 0;
    let tempPath = null;

    // Validasi tipe file
    if (!allowedImageTypes.includes(contentType)) {
      return h.response({ message: 'Hanya file JPG, PNG, atau WebP yang diizinkan' }).code(400);
    }

    // Handle stream upload
    if (file._data) {
      fileSize = file._data.length;
      if (fileSize > maxImageSize) {
        return h.response({ message: 'Ukuran foto maksimal 5MB' }).code(400);
      }

      tempPath = `./uploads/temp_${Date.now()}_${file.hapi.filename}`;
      try {
        fs.writeFileSync(tempPath, file._data);
      } catch (err) {
        return h.response({ message: 'Gagal memproses foto' }).code(500);
      }
    } else if (file.path) {
      try {
        const stats = fs.statSync(file.path);
        fileSize = stats.size;
        if (fileSize > maxImageSize) {
          return h.response({ message: 'Ukuran foto maksimal 5MB' }).code(400);
        }
        tempPath = file.path;
      } catch (err) {
        return h.response({ message: 'Foto tidak valid' }).code(400);
      }
    } else {
      return h.response({ message: 'Format foto tidak valid' }).code(400);
    }

    try {
      // Kompres foto
      const compressedPath = tempPath + '_compressed.jpg';
      await compressImage(tempPath, compressedPath);
      
      // Upload ke Cloudinary
      const uploaded = await uploadToCloudinary(compressedPath, 'perangkat-desa');
      fotoUrl = uploaded.url;
      public_id = uploaded.public_id;

      // Cleanup temporary files
      if (tempPath !== file.path) {
        fs.unlinkSync(tempPath);
      }
    } catch (err) {
      return h.response({ message: 'Gagal upload foto ke Cloudinary' }).code(500);
    }
  }

  try {
    await pool.query(
      'INSERT INTO perangkat_desa (nama, jabatan, foto, public_id, bio, urutan) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, jabatan, fotoUrl, public_id, bio || null, urutan || 0]
    );

    return h.response({ 
      message: 'Perangkat desa berhasil ditambahkan',
      data: { nama, jabatan, foto: fotoUrl, bio, urutan }
    }).code(201);
  } catch (err) {
    return h.response({ message: 'Gagal menambahkan perangkat desa' }).code(500);
  }
};

export const getAllPerangkatDesa = async (_, h) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM perangkat_desa WHERE status = "aktif" ORDER BY urutan ASC, created_at ASC'
    );
    return h.response(rows).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil data perangkat desa' }).code(500);
  }
};

export const getPerangkatDesaById = async (request, h) => {
  const { id } = request.params;

  try {
    const [[perangkat]] = await pool.query('SELECT * FROM perangkat_desa WHERE id = ?', [id]);
    if (!perangkat) {
      return h.response({ message: 'Perangkat desa tidak ditemukan' }).code(404);
    }
    return h.response(perangkat).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal mengambil data perangkat desa' }).code(500);
  }
};

export const updatePerangkatDesa = async (request, h) => {
  const { id } = request.params;
  const { nama, jabatan, bio, urutan } = request.payload;
  const file = request.payload.foto;

  if (!nama || !jabatan) {
    return h.response({ message: 'Nama dan jabatan wajib diisi' }).code(400);
  }

  try {
    // Cek apakah perangkat desa ada
    const [[existing]] = await pool.query('SELECT * FROM perangkat_desa WHERE id = ?', [id]);
    if (!existing) {
      return h.response({ message: 'Perangkat desa tidak ditemukan' }).code(404);
    }

    let newFotoUrl = existing.foto;
    let newPublicId = existing.public_id;

    // Handle foto upload jika ada file baru
    if (file && file.hapi?.headers) {
      const contentType = file.hapi.headers['content-type'];
      let fileSize = 0;
      let tempPath = null;

      if (!allowedImageTypes.includes(contentType)) {
        return h.response({ message: 'Hanya file JPG, PNG, atau WebP yang diizinkan' }).code(400);
      }

      // Handle stream upload
      if (file._data) {
        fileSize = file._data.length;
        if (fileSize > maxImageSize) {
          return h.response({ message: 'Ukuran foto maksimal 5MB' }).code(400);
        }

        tempPath = `./uploads/temp_${Date.now()}_${file.hapi.filename}`;
        try {
          fs.writeFileSync(tempPath, file._data);
        } catch (err) {
          return h.response({ message: 'Gagal memproses foto' }).code(500);
        }
      } else if (file.path) {
        try {
          const stats = fs.statSync(file.path);
          fileSize = stats.size;
          if (fileSize > maxImageSize) {
            return h.response({ message: 'Ukuran foto maksimal 5MB' }).code(400);
          }
          tempPath = file.path;
        } catch (err) {
          return h.response({ message: 'Foto tidak valid' }).code(400);
        }
      }

      if (tempPath) {
        try {
          // Kompres foto
          const compressedPath = tempPath + '_compressed.jpg';
          await compressImage(tempPath, compressedPath);
          
          // Upload ke Cloudinary
          const uploaded = await uploadToCloudinary(compressedPath, 'perangkat-desa');
          newFotoUrl = uploaded.url;
          newPublicId = uploaded.public_id;

          // Hapus foto lama dari Cloudinary
          if (existing.public_id) {
            try {
              await deleteFromCloudinary(existing.public_id);
            } catch (cloudErr) {
              // Silent fail untuk Cloudinary delete
            }
          }

          // Cleanup temporary files
          if (tempPath !== file.path) {
            fs.unlinkSync(tempPath);
          }
        } catch (err) {
          return h.response({ message: 'Gagal upload foto ke Cloudinary' }).code(500);
        }
      }
    }

    await pool.query(
      'UPDATE perangkat_desa SET nama = ?, jabatan = ?, foto = ?, public_id = ?, bio = ?, urutan = ? WHERE id = ?',
      [nama, jabatan, newFotoUrl, newPublicId, bio || null, urutan || 0, id]
    );

    return h.response({ message: 'Perangkat desa berhasil diperbarui' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal memperbarui perangkat desa' }).code(500);
  }
};

export const deletePerangkatDesa = async (request, h) => {
  const { id } = request.params;

  try {
    const [[perangkat]] = await pool.query('SELECT * FROM perangkat_desa WHERE id = ?', [id]);
    if (!perangkat) {
      return h.response({ message: 'Perangkat desa tidak ditemukan' }).code(404);
    }

    // Hapus foto dari Cloudinary jika ada
    if (perangkat.public_id) {
      try {
        await deleteFromCloudinary(perangkat.public_id);
      } catch (cloudErr) {
        // Silent fail untuk Cloudinary delete
      }
    }

    await pool.query('DELETE FROM perangkat_desa WHERE id = ?', [id]);
    return h.response({ message: 'Perangkat desa berhasil dihapus' }).code(200);
  } catch (err) {
    return h.response({ message: 'Gagal menghapus perangkat desa' }).code(500);
  }
};
