import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishList: [],
};

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    // Add to wishlist
    addToWishlist: (state, action) => {
      const item = action.payload;

      const exists = state.wishList.some(
        (i) =>
          i._id === item._id &&
          i.variant?.productColor === item.variant?.productColor &&
          i.variant?.size === item.variant?.size
      );

      if (!exists) {
        state.wishList.push(item);
      }
    },

    // Remove from wishlist

    removeFromWishlist: (state, action) => {
      const item = action.payload;
      console.log("item =", item);
      state.wishList = state.wishList.filter(
        (product) => product._id !== item
      );
    },

    clearWishlist: (state) => {
      state.wishList = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishListSlice.actions;
export default wishListSlice.reducer;
