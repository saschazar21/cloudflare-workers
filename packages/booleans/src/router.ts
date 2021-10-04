import UrlPattern from 'url-pattern';
import { parse } from 'query-string';

import HTTPError from './http-error';
import booleans, { Boolean } from './booleans';

const HOST = 'https://booleans.saschazar.workers.dev';
const API_PREFIX = HOST + '/api/v1';
const pattern = new UrlPattern(
  API_PREFIX.replace(/^https:/, 'https\\:') + '(/:key(/:value))',
);

export const corsHeaders = (request: Request): HeadersInit => ({
  'Content-Length': '0',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Methods': 'HEAD, OPTIONS, GET, POST, PUT, DELETE',
  'Access-Control-Allow-Origin': request.headers.get('origin') || HOST,
  Vary: 'Origin',
});

export const handleRequest = async (
  request: Request,
): Promise<Boolean | Response> => {
  const { method, url } = request;
  const [path, query] = url.split('?');
  const matched = pattern.match(path);

  if (!matched) {
    throw new HTTPError('Not Found', 404);
  }

  const { key, value } = matched;
  const { expires } = parse(query);
  const expiresAfterSeconds = parseInt(expires as string, 10);

  switch (method) {
    case 'HEAD':
    case 'OPTIONS':
      const headers = corsHeaders(request);
      return new Response(null, { status: 204, headers });
    case 'GET':
      if (!key) {
        throw new HTTPError('Missing boolean key.', 400);
      }
      return booleans.get(key);
    case 'PUT':
    case 'POST':
      if (!key) {
        const formData = await request.formData();
        const data = new Map(formData.entries());

        if (data.has('key') && !data.has('value')) {
          throw new HTTPError('Key is present, but value is missing.', 400);
        }

        return booleans.put(
          JSON.parse(data.get('value') as string),
          data.get('key') as string,
          !isNaN(expiresAfterSeconds) ? expiresAfterSeconds : undefined,
        );
      }
      if (key && !value) {
        throw new HTTPError('Key is present, but value is missing.', 400);
      }
      return booleans.put(
        JSON.parse(value),
        key,
        !isNaN(expiresAfterSeconds) ? expiresAfterSeconds : undefined,
      );
    case 'DELETE':
      await booleans.delete(key);
      return new Response(null, {
        headers: { 'Content-Length': '0', 'Content-Type': 'text/plain' },
        status: 200,
      });
    default:
      throw new HTTPError('Bad Request', 400);
  }
};
