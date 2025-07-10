import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (request, h) => {
  const { name, email, password } = request.payload;

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return h.response({ message: 'Email sudah terdaftar' }).code(409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    return h.response({ message: 'Registrasi berhasil' }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: 'Gagal registrasi' }).code(500);
  }
};

export const login = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return h.response({ message: 'Email tidak ditemukan' }).code(404);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return h.response({ message: 'Password salah' }).code(401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return h.response({ message: 'Login berhasil', token }).code(200);
  } catch (err) {
    return h.response({ message: 'Login gagal' }).code(500);
  }
};
