import pkg from '../../../package.json';

import booleans from './booleans';
import HTTPError from './http-error';

export type ExtendedRequest = Request & {
  parsedBody: Map<string, FormDataEntryValue>;
  params: Record<string, string>;
  query: Record<string, string>;
  response: { headers: Record<string, string> };
};

export const withDefaultHeaders = (request: ExtendedRequest): void => {
  request.response = {
    headers: {
      'X-Source-Code-Repository': pkg.repository.url,
    },
  };
};

export const withParsedBody = async (
  request: ExtendedRequest,
): Promise<void> => {
  const { headers } = request;
  const contentType = headers.get('content-type');

  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      const formData = await request.formData();
      request.parsedBody = new Map(formData.entries());
    case 'application/json':
      const data = await request.json();
      request.parsedBody = new Map(Object.entries(data));
    default:
      request.parsedBody = new Map<string, string>();
  }
};

export const withCreateOrUpdateBoolean = async (
  request: ExtendedRequest,
): Promise<Response> => {
  const { expires, label } = request.query || {};
  const { key: paramKey, value: paramValue } = request.params || {};
  const bodyKey = request.parsedBody.get('key');
  const bodyValue = request.parsedBody.get('value');

  const key = paramKey || bodyKey;
  const value = paramValue || bodyValue;

  const allowedValues = [undefined, 'true', 'false'];

  if (allowedValues.indexOf(value as string | undefined) < 0) {
    throw new HTTPError(
      `Only true or false allowed for value, but received "${value}".`,
      400,
    );
  }

  const exp = parseInt(expires, 10);
  if (isNaN(exp) || exp < 60) {
    throw new HTTPError(
      `Expiry must be a number and greater or equal 60. Received ${expires}.`,
      400,
    );
  }

  const options = Object.assign(
    {},
    expires ? { expires: exp } : {},
    label?.length > 0 ? { label } : {},
  );

  const result = await booleans.put(
    value ? JSON.parse(value as string) : undefined,
    key as string,
    options,
  );

  return new Response(JSON.stringify(result), {
    headers: {
      ...request.response.headers,
      'Content-Type': 'application/json',
    },
  });

  // TODO: add error handling
};
