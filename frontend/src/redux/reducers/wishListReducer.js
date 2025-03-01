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
      // The product that the user is trying to add to the wishlist by clicking the "Add to Wishlist" button
      const item = action.payload;

      // Check if the item already exists in the wishlist array
      const exists = state.wishList.some(
        (product) =>
          product._id === item._id &&
          product.variant?.productColor === item.variant?.productColor &&
          product.variant?.size === item.variant?.size
      );

      // If the item does not exist in the wishlist array, add it
      if (!exists) {
        state.wishList.push(item);
      }
    },

    // Remove item from wishlist array
    removeFromWishlist: (state, action) => {
      const { productId, productColor, size } = action.payload;

      return {
        ...state,
        wishList: state.wishList.filter(
          (product) =>
            product._id !== productId ||
            product.variant?.productColor !== productColor ||
            product.variant?.size !== size
        ),
      };
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.wishList = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishListSlice.actions;
export default wishListSlice.reducer;
