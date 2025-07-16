import cloudinary from './cloudinary.js';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

// === Kompres gambar: resize ke max width 1024px & kompres ke JPEG ===
export const compressImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  } catch (err) {
    console.error('❌ Gagal kompres gambar:', err.message);
    throw err;
  }
};

// === Upload ke Cloudinary ===
export const uploadToCloudinary = async (filePath, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });

    // Hapus file lokal setelah berhasil upload
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (err) {
    console.error('❌ Gagal upload ke Cloudinary:', err.message);
    throw err;
  }
};

// === Hapus dari Cloudinary ===
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });
  } catch (err) {
    console.error('❌ Gagal hapus dari Cloudinary:', err.message);
    throw err;
  }
};
