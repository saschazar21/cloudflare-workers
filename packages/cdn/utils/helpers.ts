// https://www.urlregex.com/
export const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export const USER_AGENT_FIELDS = [
  'user-agent',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
];

export const extractUserAgentHeaders = (
  headers: Headers,
): Record<string, string | null> =>
  USER_AGENT_FIELDS.reduce(
    (
      fields: Record<string, string | null>,
      current: string,
    ): Record<string, string | null> => {
      return headers.get(current)?.length
        ? { ...fields, [current]: headers.get(current) }
        : fields;
    },
    {} as Record<string, string>,
  );

export const hasUrlFormat = (sample: string): boolean => URL_REGEX.test(sample);
