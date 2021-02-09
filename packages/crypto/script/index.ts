import { generateKey } from './crypto';
import { Router } from './router';

const handleRequest = async (request: Request): Promise<Response> => {
  try {
    const router = new Router();

    router.get({
      pattern: '/key(/:bit)',
      handler: generateKey,
    });

    return router.route(request);
  } catch (e) {
    return new Response(e.message, {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    });
  }
};

addEventListener('fetch', (event) =>
  event.respondWith(handleRequest(event.request)),
);
