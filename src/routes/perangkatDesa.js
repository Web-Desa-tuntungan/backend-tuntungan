import {
  createPerangkatDesa,
  getAllPerangkatDesa,
  getPerangkatDesaById,
  updatePerangkatDesa,
  deletePerangkatDesa
} from '../handlers/perangkatDesa.js';

import { authenticate, authorize } from '../middlewares/auth.js';

const perangkatDesaRoutes = [
  // Public route - Lihat semua perangkat desa
  {
    method: 'GET',
    path: '/lihat/perangkat-desa',
    handler: getAllPerangkatDesa,
    options: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  },

  // Public route - Lihat perangkat desa by ID
  {
    method: 'GET',
    path: '/lihat/perangkat-desa/{id}',
    handler: getPerangkatDesaById,
    options: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  },

  // Admin route - Tambah perangkat desa
  {
    method: 'POST',
    path: '/tambah/perangkat-desa',
    options: {
      pre: [authenticate, authorize(['admin'])],
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        timeout: 60000
      },
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      handler: createPerangkatDesa
    }
  },

  // Admin route - Edit perangkat desa
  {
    method: 'PUT',
    path: '/edit/perangkat-desa/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        timeout: 60000
      },
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      handler: updatePerangkatDesa
    }
  },

  // Admin route - Hapus perangkat desa
  {
    method: 'DELETE',
    path: '/hapus/perangkat-desa/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      handler: deletePerangkatDesa
    }
  }
];

export default perangkatDesaRoutes;
