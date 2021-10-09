export const userAgentFields = [
  'user-agent',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
];

export const extractUserAgentHeaders = (
  headers: Headers,
): Record<string, string | null> =>
  userAgentFields.reduce(
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
