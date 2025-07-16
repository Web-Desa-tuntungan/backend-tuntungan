import {
  createBerita,
  getAllBerita,
  getBeritaById,
  getBeritaByKategori,
  updateBerita,
  deleteBerita
} from '../handlers/berita.js';

import { authenticate, authorize } from '../middlewares/auth.js';

export default [
  // === ADMIN ROUTES ===
  {
    method: 'POST',
    path: '/tambah/berita',
    options: {
      pre: [authenticate, authorize(['admin'])],
      payload: {
        output: 'stream', 
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        allow: 'multipart/form-data'
      },
      handler: createBerita
    }
  },
  {
    method: 'PUT',
    path: '/edit/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      payload: {
        output: 'stream', 
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024,
        allow: 'multipart/form-data'
      },
      handler: updateBerita
    }
  },
  {
    method: 'DELETE',
    path: '/hapus/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: deleteBerita
    }
  },
  {
    method: 'GET',
    path: '/lihat/berita',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: getAllBerita
    }
  },
  {
    method: 'GET',
    path: '/lihat/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: getBeritaById
    }
  },
  {
    method: 'GET',
    path: '/berita/kategori/{kategori}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: getBeritaByKategori
    }
  },

  // === PUBLIC ROUTES ===
  {
    method: 'GET',
    path: '/public/berita',
    handler: getAllBerita
  },
  {
    method: 'GET',
    path: '/public/berita/{id}',
    handler: getBeritaById
  },
  {
    method: 'GET',
    path: '/public/berita/kategori/{kategori}',
    handler: getBeritaByKategori
  }
];
