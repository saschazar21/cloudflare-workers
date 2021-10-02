/**
 * The main event handler for Cloudflare Workers
 *
 * @param {string} type - The event type, must be 'fetch'
 * @param {handleEvent} - The event handler
 */
 addEventListener('fetch', (event) => event.respondWith(handleEvent(event.request)));

 const handleEvent = async (request: Request): Promise<Response> => {
   return new Response('Hello, world!', { headers: { 'Content-Type': 'text/plain'}});
 }
