import { Router } from 'itty-router';

import booleans from './booleans';
import {
  ExtendedRequest,
  withParsedBody,
  withDefaultHeaders,
} from './middleware';

const BASE_PATH = '/api/v1';

const router = Router({
  base: BASE_PATH,
});

router.all('*', withDefaultHeaders);

router.get('/:key', async (request: ExtendedRequest) => {
  const {
    params: { key } = {},
    response: { headers },
  } = request;
  const result = await booleans.get(key);

  return new Response(JSON.stringify(result), {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
});

router.post('*', withParsedBody);

// TODO: add POST/PUT

// TODO: add DELETE

export default router;
