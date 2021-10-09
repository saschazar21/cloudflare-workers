import { Router } from 'itty-router';

import { getImageUrl, UrlOptions } from '../ext/cloudinary';
import { extractUserAgentHeaders } from '../../utils/helpers';
import HTTPError from '../../utils/http-error';

export const BASE_PATH = '/img';

const router = Router({
  base: BASE_PATH,
});

router.get('/:name', async ({ headers, params, query }: ExtendedRequest) => {
  try {
    const url = getImageUrl(params.name, query as UrlOptions);
    console.log(url);
    return fetch(url, {
      headers: extractUserAgentHeaders(headers) as Record<string, string>,
    });
  } catch (e) {
    console.error(e);
    throw new HTTPError(`Error fetching image "${params.name}" from CDN.`, 500);
  }
});

export default router;
