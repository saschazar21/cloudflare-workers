import { Router } from 'itty-router';

import imgRouter, { BASE_PATH as IMG_BASE_PATH } from './routes/img';
import HTTPError from '../utils/http-error';

const router = Router();

router.all(IMG_BASE_PATH + '/*', imgRouter.handle);
router.all('*', () => {
  throw new HTTPError('Not Found', 404);
});

export default (request: Request, ...args: string[]) =>
  router
    .handle(request, ...args)
    .catch((e: Error) =>
      e.name === 'HTTPError'
        ? (e as HTTPError).response()
        : new Response('Internal Server Error', { status: 500 }),
    );
