import UrlPattern from 'url-pattern';
import { parse } from 'qs';

import HTTPError from './http-error';
import booleans, { Boolean } from './booleans';

const HOST = 'https://booleans.saschazar.workers.dev';
const API_PREFIX = HOST + '/api/v1';
const pattern = new UrlPattern(API_PREFIX + '(/:key(/:value))');

export const handleRequest = async (request: Request): Promise<Boolean> => {
  const { method, url } = request;
  const [path, query] = url.split('?');
  const { key, value } = pattern.match(path);
  const { expires } = parse(query);

  switch (method) {
    case 'GET':
      if (key) {
        throw new HTTPError('Missing boolean ID.', 400);
      }
      return booleans.get(key);
    case 'POST':
      if (!key) {
        // TODO: body parse application/x-www-form-urlencoded
      }
    case 'DELETE':
    case 'PUT':
    default:
  }
};
