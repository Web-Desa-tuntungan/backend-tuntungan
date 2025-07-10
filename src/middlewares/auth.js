import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (request, h) => {
  const authHeader = request.headers.authorization;

  // Jika header tidak ada atau tidak dimulai dengan "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return h.response({ message: 'Unauthorized: Token not provided' }).code(401).takeover();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Simpan data user ke dalam request.auth.user
    request.auth = { user: decoded };
    return h.continue;

  } catch (err) {
    return h.response({ message: 'Unauthorized: Invalid token' }).code(401).takeover();
  }
};


export const authorize = (allowedRoles = []) => {
  return async (request, h) => {
    const user = request.auth?.user;

    // Jika tidak ada user atau rolenya tidak termasuk yang diizinkan
    if (!user || !allowedRoles.includes(user.role)) {
      return h.response({ message: 'Forbidden: Access denied' }).code(403).takeover();
    }

    return h.continue;
  };
};
