import { Cloudinary, Transformation } from 'cloudinary-core';

export type UrlOptions = Transformation.Options & {
  placeholder?: string;
  accessibilty?: string;
};

export const DEFAULT_OPTIONS = {
  fetchFormat: 'auto',
};

const cl = new Cloudinary({ cloud_name: CLOUDINARY_CLOUD_NAME });

export const getImageUrl = (name: string, options?: UrlOptions): string =>
  cl.url(name, { ...DEFAULT_OPTIONS, ...options });
