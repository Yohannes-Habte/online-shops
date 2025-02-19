import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishList: [],
};

const wishListReducer = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    // Add to wish list
    addToWishlist: (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishList.find(
        (i) =>
          (i._id === i._id) === item._id &&
          i.variant?.productColor === item.variant?.productColor &&
          i.variant?.size === item.variant?.size
      );

      if (isItemExist) {
        return {
          ...state,
          wishList: state.wishList.map((i) =>
            i._id === isItemExist._id &&
            i.variant.productColor === isItemExist.variant.productColor &&
            i.variant.size === isItemExist.variant.size
              ? item
              : i
          ),
        };
      } else {
        return {
          ...state,
          wishList: [...state.wishList, item],
        };
      }
    },

    // Remove from wish list
    removeFromWishlist: (state, action) => {
      return {
        ...state,
        wishList: state.wishList.filter((item) => item._id !== action.payload),
      };
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.wishList = [];
    },
  },
});

// Destructure wishlist reducer methods
export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishListReducer.actions;

// export wishlist reducer
export default wishListReducer.reducer;
