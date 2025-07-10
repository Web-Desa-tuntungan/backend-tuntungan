import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert'; // plugin untuk static file
import routes from './routes/index.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'] // izinkan semua origin
      }
    }
  });

  // Register plugin Inert
  await server.register(Inert);

  // Serve static files in /uploads
  server.route({
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: './uploads',
        listing: false,
        index: false
      }
    }
  });

  // Register semua route dari routes/index.js
  routes(server);

  await server.start();
  console.log('✅ Server running at:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Error:', err);
  process.exit(1);
});

init();
