import { IMG_BASE, IMG_WIDTH, IMG_HEIGHT } from './constants.js';
import { createStarIcon, createDeleteIcon, createDownloadIcon } from './icons.js';

/**
 * Escapes text content for safe display.
 * Using textContent already prevents XSS, but this adds an extra layer.
 */
function escapeText(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.textContent;
}

/**
 * Validates a URL is from an allowed origin.
 */
function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return ['picsum.photos', 'unsplash.com'].some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith('.' + host)
    );
  } catch {
    return false;
  }
}

/**
 * Shows a confirmation dialog before removing a favorite.
 */
function showConfirmDialog(photo, onConfirm) {
  // Prevent multiple dialogs
  if (document.querySelector('.confirm-overlay')) return;

  const overlay = document.createElement('div');
  overlay.classList.add('confirm-overlay');

  const dialog = document.createElement('div');
  dialog.classList.add('confirm-dialog');
  dialog.setAttribute('role', 'alertdialog');
  dialog.setAttribute('aria-label', 'Confirmar eliminacion');

  const msg = document.createElement('p');
  msg.textContent = `Eliminar la foto de ${photo.author} de tus favoritos?`;

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('confirm-buttons');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('confirm-btn', 'confirm-btn--cancel');
  btnCancel.textContent = 'Cancelar';

  const btnConfirm = document.createElement('button');
  btnConfirm.classList.add('confirm-btn', 'confirm-btn--delete');
  btnConfirm.textContent = 'Eliminar';

  const close = () => overlay.remove();

  btnCancel.addEventListener('click', close);
  btnConfirm.addEventListener('click', () => {
    close();
    onConfirm(photo.id);
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Close on Escape
  const handleKey = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleKey);
    }
  };
  document.addEventListener('keydown', handleKey);

  btnGroup.append(btnCancel, btnConfirm);
  dialog.append(msg, btnGroup);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  btnConfirm.focus();
}

/**
 * Creates a photo card element using only DOM API (no innerHTML).
 *
 * @param {Object} photo - Validated photo object
 * @param {string} mode - 'gallery' or 'favorites'
 * @param {Object} callbacks - { onFavorite, onRemove }
 * @returns {HTMLElement}
 */
export function createCard(photo, mode, callbacks) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.photoId = photo.id;

  // Image link
  const boxImg = document.createElement('a');
  if (isAllowedUrl(photo.download_url)) {
    boxImg.href = photo.download_url;
  } else {
    boxImg.href = '#';
  }
  boxImg.target = '_blank';
  boxImg.rel = 'noopener noreferrer';
  boxImg.classList.add('img-box');

  const img = document.createElement('img');
  img.width = IMG_WIDTH / 2;
  img.height = IMG_HEIGHT / 2;
  img.loading = 'lazy';
  img.alt = `Photo by ${escapeText(photo.author)}`;
  img.style.backgroundColor = 'hsl(34, 100%, 71%)';
  img.src = `${IMG_BASE}/${encodeURIComponent(photo.id)}/${IMG_WIDTH}/${IMG_HEIGHT}.jpg`;
  img.addEventListener('error', () => {
    img.alt = 'Image unavailable';
    img.style.minHeight = '200px';
  });

  boxImg.appendChild(img);

  // Footer
  const footerCard = document.createElement('div');
  footerCard.classList.add('footer-card', 'd-flex');

  // Author info
  const nameContent = document.createElement('div');
  nameContent.classList.add('name', 'd-flex');

  const avatar = document.createElement('span');
  avatar.classList.add('avatar', 'd-flex');
  avatar.textContent = photo.author.charAt(0).toUpperCase();

  const nameAuthor = document.createElement('span');
  nameAuthor.classList.add('name');
  nameAuthor.textContent = escapeText(photo.author);

  nameContent.append(avatar, nameAuthor);

  // Action button (star or delete)
  const actionBtn = document.createElement('span');
  actionBtn.classList.add('star-favorite');
  actionBtn.setAttribute('role', 'button');
  actionBtn.setAttribute('tabindex', '0');

  if (mode === 'gallery') {
    actionBtn.setAttribute('aria-label', `Add ${escapeText(photo.author)} to favorites`);
    actionBtn.appendChild(createStarIcon(photo.id));
    actionBtn.addEventListener('click', () => callbacks.onFavorite(photo));
    actionBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callbacks.onFavorite(photo);
      }
    });
  } else {
    actionBtn.setAttribute('aria-label', `Remove ${escapeText(photo.author)} from favorites`);
    actionBtn.appendChild(createDeleteIcon());
    const triggerRemove = () => showConfirmDialog(photo, callbacks.onRemove);
    actionBtn.addEventListener('click', triggerRemove);
    actionBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerRemove();
      }
    });
  }

  footerCard.append(nameContent, actionBtn);

  // Download icon
  const downloadLink = document.createElement('a');
  downloadLink.classList.add('download');
  if (isAllowedUrl(photo.url)) {
    downloadLink.href = photo.url;
  } else {
    downloadLink.href = '#';
  }
  downloadLink.target = '_blank';
  downloadLink.rel = 'noopener noreferrer';
  downloadLink.setAttribute('aria-label', `View photo by ${escapeText(photo.author)}`);
  downloadLink.appendChild(createDownloadIcon());

  card.append(boxImg, footerCard, downloadLink);
  return card;
}

/**
 * Renders a list of photo cards into the grid.
 */
export function renderGrid(grid, photos, mode, callbacks) {
  grid.textContent = '';

  if (photos.length === 0 && mode === 'favorites') {
    const empty = document.createElement('p');
    empty.textContent = 'No tienes favoritos guardados.';
    empty.style.cssText = 'text-align:center; padding:2rem; grid-column:1/-1; opacity:0.6;';
    grid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const photo of photos) {
    fragment.appendChild(createCard(photo, mode, callbacks));
  }
  grid.appendChild(fragment);
}

/**
 * Marks favorite cards in the gallery view.
 */
export function markFavorites(favoriteIds) {
  for (const id of favoriteIds) {
    const svg = document.getElementById(id);
    if (svg) {
      svg.classList.add('colorFill');
      const footer = svg.closest('.footer-card');
      if (footer) {
        footer.style.backgroundColor = 'var(--secondary-dark)';
      }
    }
  }
}
