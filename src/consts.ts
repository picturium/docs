export const VERSION = '0.2.0';
export const REPO = 'https://github.com/picturium/picturium';

// The site is static; picturium runs separately with public/ as its source dir.
// Override either origin with PUBLIC_PICTURIUM_URL.
export const PICTURIUM: string =
  import.meta.env.PUBLIC_PICTURIUM_URL ??
  (import.meta.env.PROD ? 'https://img.picturium.cc' : 'http://127.0.0.1:20048');
export const px = (path: string, params = '') =>
  `${PICTURIUM}${path}${params ? '?' + params : ''}`;
