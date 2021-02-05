const handleRequest = async (request: Request): Promise<Response> => {
  const { Crypto } = await import('../pkg');

  const key = new Crypto(1024).export_private();

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};

addEventListener('fetch', (event) =>
  event.respondWith(handleRequest(event.request)),
);
