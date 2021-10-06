import { ExtendedRequest } from './middleware';
import { Boolean, BooleanResponse } from './booleans';

export const mapResult = (
  result: Boolean,
  request: ExtendedRequest,
): BooleanResponse =>
  Object.assign(
    {
      data: {
        id: result.key,
        attributes: {
          value: result.value,
        },
        links: {
          self: `${request.basePath}/${result.key}`,
        },
        type: 'boolean',
      },
    },
    result.metadata ? { meta: result.metadata } : {},
  );
