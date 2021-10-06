import { Router } from 'itty-router';
import { error, json, withParams, status } from 'itty-router-extras';

import booleans from './booleans';
import { mapResult } from './helpers';
import HTTPError from './http-error';
import {
  ExtendedRequest,
  withParsedBody,
  withCreateOrUpdateBoolean,
  withDefaultHeaders,
} from './middleware';

const HOST = 'https://booleans.saschazar.workers.dev';
const BASE_PATH = '/api/v1';

const router = Router({
  base: BASE_PATH,
});

router.all('*', withDefaultHeaders, (request: ExtendedRequest) => {
  request.basePath = HOST + BASE_PATH;
});

router.head(
  '*',
  (request: ExtendedRequest) =>
    new Response(null, {
      headers: { ...request.response.headers },
      status: 204,
    }),
);

router.get(
  '/:key',
  withParams,
  async (request: ExtendedRequest): Promise<Response> => {
    const {
      params: { key } = {},
      response: { headers },
    } = request;

    const result = await booleans.get(key);

    return json(mapResult(result, request), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
);

router.post('/:key/:value', withParams, withCreateOrUpdateBoolean);
router.put('/:key/:value', withParams, withCreateOrUpdateBoolean);

router.post('/', withParsedBody, withCreateOrUpdateBoolean);
router.put('/', withParsedBody, withCreateOrUpdateBoolean);

router.delete('/:key', withParams, async ({ params }: ExtendedRequest) => {
  const { key } = params;
  await booleans.delete(key);

  return status(200);
});

router.all('*', () => {
  throw new HTTPError('Not Found', 404);
});

export default (request: Request, ...args: any) =>
  router.handle(request, ...args).catch((e: HTTPError) => {
    console.error(e.message);
    const err =
      e.name === 'HTTPError' ? e : new HTTPError('Internal Server Error', 500);
    return error(err.code, err.toObject());
  });
