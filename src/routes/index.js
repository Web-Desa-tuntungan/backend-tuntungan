import authRoutes from './auth.js';
import layananRoutes from './layanan.js';
import beritaRoutes from './berita.js';
import galeriRoutes from './galeri.js';
import perangkatDesaRoutes from './perangkatDesa.js';

export default (server) => {
  server.route(authRoutes);
  server.route(layananRoutes);
  server.route(beritaRoutes);
  server.route(galeriRoutes);
  server.route(perangkatDesaRoutes);
};
