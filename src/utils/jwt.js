import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // fallback kalau .env belum diatur

// Generate JWT
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

// Verify JWT
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
