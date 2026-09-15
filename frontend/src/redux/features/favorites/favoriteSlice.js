import { createSlice } from '@reduxjs/toolkit';
import { saveFavoriteToLocalStorage, loadFavoriteFromLocalStorage } from '../../../utils/localStorage';

const initialState = {
  favoriteLSPIds: loadFavoriteFromLocalStorage(),
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const id = action.payload;
      if (!state.favoriteLSPIds.includes(id)) {
        state.favoriteLSPIds.push(id);
        saveFavoriteToLocalStorage(state.favoriteLSPIds);
      }
    },
    removeFromFavorites: (state, action) => {
      const id = action.payload;
      state.favoriteLSPIds = state.favoriteLSPIds.filter(x => x !== id);
      saveFavoriteToLocalStorage(state.favoriteLSPIds);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;