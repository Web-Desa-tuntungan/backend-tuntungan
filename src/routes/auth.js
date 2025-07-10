import { register, login } from '../handlers/auth.js';

export default [
  {
    method: 'POST',
    path: '/auth/register',
    handler: register
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: login
  }
];
