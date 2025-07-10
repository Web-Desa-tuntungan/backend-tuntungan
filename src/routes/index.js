import authRoutes from './auth.js';
import layananRoutes from './layanan.js';
import beritaRoutes from './berita.js';
import galeriRoutes from './galeri.js';

export default (server) => {
  server.route(authRoutes);
  server.route(layananRoutes);
  server.route(beritaRoutes);
  server.route(galeriRoutes);
};
