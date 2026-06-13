import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('soldyWishlist');

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: saved ? JSON.parse(saved) : [] },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((i) => i._id === product._id);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('soldyWishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('soldyWishlist');
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
