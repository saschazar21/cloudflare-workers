export {};

declare global {
  type ExtendedRequest = Request & {
    params: Record<string, string>;
    query: Record<string, string>;
  };

  const CLOUDINARY_CLOUD_NAME: string;
}
