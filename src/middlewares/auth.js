import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return h.response({ message: 'Unauthorized: Token not provided' }).code(401).takeover();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    request.auth = { user: decoded };
    return h.continue;

  } catch (err) {
    return h.response({ message: 'Unauthorized: Invalid token' }).code(401).takeover();
  }
};

export const authorize = (allowedRoles = []) => {
  return async (request, h) => {
    const user = request.auth?.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return h.response({ message: 'Forbidden: Access denied' }).code(403).takeover();
    }

    return h.continue;
  };
};

export const authorizeAdmin = async (request, h) => {
  const user = request.auth?.user;

  if (!user || user.role !== 'admin') {
    return h.response({ message: 'Forbidden: Admin access only' }).code(403).takeover();
  }

  return h.continue;
};
