import UrlPattern from 'url-pattern';
import { parse } from 'query-string';

import HTTPError from './http-error';
import booleans, { Boolean } from './booleans';

const HOST = 'https://booleans.saschazar.workers.dev';
const API_PREFIX = HOST + '/api/v1';
const pattern = new UrlPattern(
  API_PREFIX.replace(/^https:/, 'https\\:') + '(/:key(/:value))',
);

const parseBody = async (
  request: Request,
): Promise<Map<string, FormDataEntryValue>> => {
  const { headers } = request;
  const contentType = headers.get('content-type');

  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      const formData = await request.formData();
      return new Map(formData.entries());
    case 'application/json':
      const data = await request.json();
      return new Map(Object.entries(data));
    default:
      throw new HTTPError(
        'Only "application/json" & "application/x-www-form-urlencoded" values allowed for Content-Type.',
        400,
      );
  }
};

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
  const { expires, label } = parse(query);
  const expiresAfterSeconds = parseInt(expires as string, 10);

  const options = Object.assign(
    {},
    !isNaN(expiresAfterSeconds) ? { expires: expiresAfterSeconds } : {},
    label ? { label: label as string } : {},
  );

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
        const data = await parseBody(request);
        if (data.has('key') && !data.has('value')) {
          throw new HTTPError('Key is present, but value is missing.', 400);
        }

        return booleans.put(
          JSON.parse(data.get('value') as string),
          data.get('key') as string,
          options,
        );
      }
      if (key && !value) {
        throw new HTTPError('Key is present, but value is missing.', 400);
      }
      return booleans.put(JSON.parse(value), key, options);
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
