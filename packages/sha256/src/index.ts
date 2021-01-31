/**
 * The event handler - takes a Request object, extracts the body
 * and hashes the value of the 'text' property using the SHA-256 algorithm
 *
 * @callback handleEvent
 * @param {Request} request - The request object of the FetchEvent
 * @returns {Promise<Response>} - A Promise of a Fetch API Response
 */
const handleEvent = async (request: Request): Promise<Response> => {
  // extract value from the 'text' property of the Request body
  const { text }: { text: string } = await request.json();

  // encode utf-8 text into a Uint8Array
  const encoded = new TextEncoder().encode(text);

  // hash the encoded Uint8Array using SHA-256 into an ArrayBuffer
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  // transform the ArrayBuffer into a HEX-string (base16)
  const hex = [...new Uint8Array(digest)]
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('');

  // return the resulting string using a new Response object
  return new Response(hex, {
    headers: { 'Content-Type': 'text/plain' },
  });
};

/**
 * The main event handler for Cloudflare Workers
 *
 * @param {string} type - The event type, must be 'fetch'
 * @param {handleEvent} - The event handler
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event.request));
});
