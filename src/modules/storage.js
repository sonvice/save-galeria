import { STORAGE_KEY } from './constants.js';

/**
 * Validates that a photo object has the expected shape.
 * Prevents storing malicious or malformed data.
 */
function isValidPhoto(photo) {
  return (
    photo &&
    typeof photo === 'object' &&
    typeof photo.id === 'string' &&
    typeof photo.author === 'string' &&
    typeof photo.download_url === 'string' &&
    typeof photo.url === 'string'
  );
}

/**
 * Sanitizes a photo object keeping only safe fields.
 */
function sanitizePhoto(photo) {
  return {
    id: String(photo.id).slice(0, 10),
    author: String(photo.author).slice(0, 100),
    download_url: String(photo.download_url),
    url: String(photo.url),
    width: Number(photo.width) || 0,
    height: Number(photo.height) || 0,
  };
}

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    // Validate each entry
    const valid = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isValidPhoto(value)) {
        valid[key] = sanitizePhoto(value);
      }
    }
    return valid;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function writeFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites:', e.message);
  }
}

export function getFavorites() {
  return readFavorites();
}

export function getFavoritesArray() {
  return Object.values(readFavorites());
}

export function getFavoritesCount() {
  return Object.keys(readFavorites()).length;
}

export function isFavorite(id) {
  const favs = readFavorites();
  return id in favs;
}

export function addFavorite(photo) {
  if (!isValidPhoto(photo)) return false;

  const favs = readFavorites();
  if (favs[photo.id]) return false;

  favs[photo.id] = sanitizePhoto(photo);
  writeFavorites(favs);
  return true;
}

export function removeFavorite(id) {
  const favs = readFavorites();
  if (!favs[id]) return false;

  delete favs[id];
  writeFavorites(favs);
  return true;
}
