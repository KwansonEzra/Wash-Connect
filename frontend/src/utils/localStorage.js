// src/utils/localStorage.js
const FAVORITES_KEY = 'washconnect_favorites';

export const saveFavoriteToLocalStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn('localStorage write failed', e);
  }
};

export const loadFavoriteFromLocalStorage = () => {
  try {
    const item = localStorage.getItem(FAVORITES_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.warn('localStorage read failed', e);
    return [];
  }
};