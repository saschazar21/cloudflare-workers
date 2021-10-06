import router from './router';

/**
 * The main event handler for Cloudflare Workers
 *
 * @param {string} type - The event type, must be 'fetch'
 * @param {handleEvent} - The event handler
 */
addEventListener('fetch', event => event.respondWith(router(event.request)));
