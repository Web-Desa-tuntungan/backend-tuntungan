import {
  createGaleri,
  getGaleri,
  deleteGaleri
} from '../handlers/galeri.js';

import { authenticate, authorize } from '../middlewares/auth.js';

export default [
  // === ADMIN - UPLOAD GALERI ===
  {
    method: 'POST',
    path: '/tambah/galeri',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 25 * 1024 * 1024, // 25MB (cukup untuk video 20MB)
        allow: 'multipart/form-data'
      },
      pre: [authenticate, authorize(['admin'])],
      handler: createGaleri
    }
  },

  // === PUBLIC - LIHAT GALERI ===
  {
    method: 'GET',
    path: '/lihat/galeri',
    handler: getGaleri
  },

  // === ADMIN - HAPUS GALERI ===
  {
    method: 'DELETE',
    path: '/lihat/galeri/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: deleteGaleri
    }
  }
];
