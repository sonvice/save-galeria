import { API_BASE, ITEMS_PER_PAGE } from './constants.js';

const ALLOWED_HOST = 'picsum.photos';

/**
 * Validates that the API response is an array of photo objects.
 */
function validateResponse(data) {
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response format');
  }

  return data
    .filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.author === 'string' &&
        typeof item.download_url === 'string' &&
        typeof item.url === 'string'
    )
    .map((item) => ({
      id: String(item.id).slice(0, 10),
      author: String(item.author).slice(0, 100),
      download_url: String(item.download_url),
      url: String(item.url),
      width: Number(item.width) || 0,
      height: Number(item.height) || 0,
    }));
}

/**
 * Fetches photos from Picsum API with validation.
 * @param {number} page - Page number (1-15)
 * @returns {Promise<Array>} Array of validated photo objects
 */
export async function fetchPhotos(page = 1) {
  const safePage = Math.max(1, Math.min(15, Math.floor(Number(page))));

  const url = new URL(API_BASE);
  if (url.hostname !== ALLOWED_HOST) {
    throw new Error('Invalid API host');
  }

  url.searchParams.set('page', String(safePage));
  url.searchParams.set('limit', String(ITEMS_PER_PAGE));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return validateResponse(data);
  } finally {
    clearTimeout(timeout);
  }
}
