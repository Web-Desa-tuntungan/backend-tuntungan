import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert'; 
import routes from './routes/index.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'] // 
      }
    }
  });

  await server.register(Inert);

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

  routes(server);

  await server.start();
  console.log('✅ Server running at:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Error:', err);
  process.exit(1);
});

init();
