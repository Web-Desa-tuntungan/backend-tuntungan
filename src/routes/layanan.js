import {
  createLayanan,
  getLayananUser,
  getAllLayanan,
  updateStatusLayanan
} from '../handlers/layanan.js';

import { authenticate, authorize } from '../middlewares/auth.js';

export default [
  // USER - Buat layanan
  {
    method: 'POST',
    path: '/layanan',
    options: {
      pre: [authenticate, authorize(['user'])],
      handler: createLayanan
    }
  },

  // USER - Lihat layanan miliknya
  {
    method: 'GET',
    path: '/layanan/user',
    options: {
      pre: [authenticate, authorize(['user'])],
      handler: getLayananUser
    }
  },

  // ADMIN - Lihat semua layanan
  {
    method: 'GET',
    path: '/layanan',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: getAllLayanan
    }
  },

  // ADMIN - Update status layanan
  {
    method: 'PATCH',
    path: '/layanan/{id}/status',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: updateStatusLayanan
    }
  }
];
