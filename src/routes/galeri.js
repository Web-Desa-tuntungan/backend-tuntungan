import {
  createGaleri,
  getGaleri,
  deleteGaleri
} from '../handlers/galeri.js';

import { authenticate, authorize } from '../middlewares/auth.js';

export default [
  {
    method: 'POST',
    path: '/galeri',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        allow: 'multipart/form-data'
      },
      pre: [authenticate, authorize(['admin'])],
      handler: createGaleri
    }
  },
  {
    method: 'GET',
    path: '/galeri',
    handler: getGaleri
  },
  {
    method: 'DELETE',
    path: '/galeri/{id}',
    options: {
      pre: [authenticate, authorize(['admin'])],
      handler: deleteGaleri
    }
  }
];
