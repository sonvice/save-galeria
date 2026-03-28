import './style.css';
import { fetchPhotos } from './modules/api.js';
import { TOTAL_PAGES } from './modules/constants.js';
import {
  getFavorites,
  getFavoritesArray,
  getFavoritesCount,
  addFavorite,
  removeFavorite,
  isFavorite,
} from './modules/storage.js';
import { renderGrid, markFavorites } from './modules/dom.js';

// State
let currentPage = 1;
let currentView = 'gallery'; // 'gallery' | 'favorites'
let photos = [];

// DOM refs
const grid = document.getElementById('grid');
const counter = document.getElementById('counter');
const loader = document.getElementById('loader');
const titleText = document.getElementById('title-text');
const select = document.getElementById('select');
const btnFotos = document.getElementById('fotos');
const btnFavoritos = document.getElementById('favoritos');

// --- UI helpers ---

function showLoader() {
  loader.style.display = 'flex';
}

function hideLoader() {
  loader.style.display = 'none';
}

function updateCounter() {
  counter.textContent = String(getFavoritesCount());
}

function setActiveNav(view) {
  const fotosItem = document.querySelector('.list__item-fotos');
  const favItem = document.querySelector('.list__item-favoritos');

  fotosItem.classList.toggle('active', view === 'gallery');
  favItem.classList.toggle('active', view === 'favorites');
  select.style.display = view === 'gallery' ? 'block' : 'none';
}

function setTitle(text) {
  titleText.textContent = text;
}

// --- Callbacks for cards ---

function handleFavorite(photo) {
  if (isFavorite(photo.id)) {
    removeFavorite(photo.id);
    const svg = document.getElementById(photo.id);
    if (svg) {
      svg.classList.remove('colorFill');
      const footer = svg.closest('.footer-card');
      if (footer) {
        footer.style.backgroundColor = '';
      }
    }
  } else {
    addFavorite(photo);
    const svg = document.getElementById(photo.id);
    if (svg) {
      svg.classList.add('colorFill');
      const footer = svg.closest('.footer-card');
      if (footer) {
        footer.style.backgroundColor = 'var(--secondary-dark)';
      }
    }
  }
  updateCounter();
}

function handleRemove(id) {
  removeFavorite(id);
  updateCounter();
  showFavorites();
}

const cardCallbacks = {
  onFavorite: handleFavorite,
  onRemove: handleRemove,
};

// --- Views ---

async function loadGallery() {
  currentView = 'gallery';
  setActiveNav('gallery');
  setTitle('Todas las fotos');
  showLoader();

  try {
    photos = await fetchPhotos(currentPage);
    renderGrid(grid, photos, 'gallery', cardCallbacks);

    // Mark already-favorited photos
    const favIds = Object.keys(getFavorites());
    markFavorites(favIds);
  } catch (err) {
    grid.textContent = '';
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Error loading photos. Please try again.';
    errorMsg.style.cssText = 'text-align:center; padding:2rem; grid-column:1/-1; color:red;';
    grid.appendChild(errorMsg);
    console.error('Fetch error:', err);
  } finally {
    hideLoader();
  }
}

function showFavorites() {
  currentView = 'favorites';
  setActiveNav('favorites');
  setTitle('Favoritos');

  const favPhotos = getFavoritesArray();
  renderGrid(grid, favPhotos, 'favorites', cardCallbacks);
  hideLoader();
}

// --- Event listeners (no inline onclick) ---

btnFotos.addEventListener('click', (e) => {
  e.preventDefault();
  loadGallery();
});

btnFavoritos.addEventListener('click', (e) => {
  e.preventDefault();
  showFavorites();
});

select.addEventListener('change', (e) => {
  const val = Number(e.target.value);
  if (val >= 1 && val <= TOTAL_PAGES) {
    currentPage = val;
    loadGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// --- Init ---
updateCounter();
loadGallery();
