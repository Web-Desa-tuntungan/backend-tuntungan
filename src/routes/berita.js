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
  {
    method: 'POST',
    path: '/berita',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: createBerita
  },
  {
    method: 'GET',
    path: '/berita',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: getAllBerita
  },
  {
    method: 'GET',
    path: '/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: getBeritaById
  },
  {
    method: 'GET',
    path: '/berita/kategori/{kategori}',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: getBeritaByKategori
  },
  {
    method: 'PUT',
    path: '/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: updateBerita
  },
  {
    method: 'DELETE',
    path: '/berita/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])]
    },
    handler: deleteBerita
  }
];
