import { OAuth2Client } from 'google-auth-library';
import pool from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (request, h) => {
  const { token } = request.payload;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    const [[existingUser]] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR google_id = ?', 
      [email, googleId]
    );

    let user;
    if (existingUser) {
      // Update Google ID if not set
      if (!existingUser.google_id) {
        await pool.query(
          'UPDATE users SET google_id = ?, avatar = ? WHERE id = ?',
          [googleId, picture, existingUser.id]
        );
      }
      user = { ...existingUser, google_id: googleId, avatar: picture };
    } else {
      // Create new user
      const [result] = await pool.query(
        'INSERT INTO users (name, email, google_id, avatar, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, googleId, picture, 'user']
      );
      
      user = {
        id: result.insertId,
        name,
        email,
        google_id: googleId,
        avatar: picture,
        role: 'user'
      };
    }

    const jwtToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return h.response({
      message: 'Login Google berhasil',
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    }).code(200);

  } catch (err) {
    console.error('Google login error:', err);
    return h.response({ message: 'Login Google gagal' }).code(401);
  }
};