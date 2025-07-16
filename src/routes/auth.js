import { register, login } from '../handlers/auth.js';
import { googleLogin } from '../handlers/googleAuth.js';

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
  },
  {
    method: 'POST',
    path: '/auth/google',
    handler: googleLogin
  }
];
