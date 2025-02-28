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
      // item comes from action.payload, meaning it is the product that the user is trying to add to the wishlist
      const item = action.payload;
      // console.log("Current state.wishList before adding =", state.wishList.map(item => ({ ...item })));
      // console.log("Updated state.wishList =", state.wishList.map(item => ({ ...item })));

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

    clearWishlist: (state) => {
      state.wishList = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishListSlice.actions;
export default wishListSlice.reducer;
