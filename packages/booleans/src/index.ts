import HTTPError from './http-error';
import { corsHeaders, handleRequest } from './router';

/**
 * The main event handler for Cloudflare Workers
 *
 * @param {string} type - The event type, must be 'fetch'
 * @param {handleEvent} - The event handler
 */
addEventListener('fetch', event =>
  event.respondWith(handleEvent(event.request)),
);

const handleEvent = async (request: Request): Promise<Response> => {
  try {
    const result = await handleRequest(request);

    if (result instanceof Response) {
      return result;
    }

    return new Response(JSON.stringify(result), {
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        request.method !== 'GET' ? corsHeaders(request) : {},
      ),
    });
  } catch (e) {
    if ((e as Error).name === 'HTTPError') {
      return new Response((e as HTTPError).message, {
        status: (e as HTTPError).code,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};
