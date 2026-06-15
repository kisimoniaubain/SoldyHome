import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem('soldyWishlist');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem('soldyWishlist');
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((i) => i._id === product._id);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      try {
        localStorage.setItem('soldyWishlist', JSON.stringify(state.items));
      } catch {
        // ignore storage quota/privacy errors to avoid breaking UI
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      try {
        localStorage.removeItem('soldyWishlist');
      } catch {
        // ignore storage quota/privacy errors to avoid breaking UI
      }
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
