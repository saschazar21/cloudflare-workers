import { StringObject } from './router';

export const generateKey = async ({ bit }: StringObject): Promise<Response> => {
  try {
    const { Crypto } = await import('../pkg');

    const bitsize = parseInt(bit, 10);
    const crypto = new Crypto(!isNaN ? bitsize : 1024);

    const key = crypto.export_private();
    crypto.free();

    return new Response(key, { headers: { 'Content-Type': 'text/plain' } });
  } catch (e) {
    return new Response(e.message, {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    });
  }
};
