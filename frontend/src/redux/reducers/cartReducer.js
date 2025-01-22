import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add to cart

    addToCart: (state, action) => {
      const item = action.payload;

      const isItemExist = state.cart.find(
        (i) =>
          i._id === item._id &&
          i.variant?.productColor === item.variant?.productColor
      );

      if (isItemExist) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i._id === isItemExist._id &&
            i.variant.productColor === isItemExist.variant.productColor
              ? item
              : i
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        };
      }
    },

    // Remove from cart
    removeFromCart: (state, action) => {
      return {
        ...state,
        cart: state.cart.filter((product) => product._id !== action.payload),
      };
    },

    // Clear cart after placing an order
    clearFromCart: (state) => {
      return { ...state, cart: [] };
    },
  },
});

// Destructure wishlist reducer methods
export const { addToCart, removeFromCart, clearFromCart } = cartReducer.actions;

// export wishlist reducer
export default cartReducer.reducer;
