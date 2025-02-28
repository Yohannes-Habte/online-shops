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
      // item comes from action.payload, meaning it is the product that the user is trying to add to the cart
      const item = action.payload;
      console.log("cart item from action.payload =", item);
      console.log("state.cart =", state.cart);

      // Check if item in the shopping cart from the same shop
      if (state.cart.length > 0) {
        const currentShopId = state.cart[0].shop._id; // Get the shop ID of the first item in the cart

        console.log("currentShopId =", currentShopId);
        console.log("const item = action.payload =", item);

        if (currentShopId !== item.shop._id) {
          alert(
            "For a single order, all items must be from the same shop. To purchase items from a different shop, please create a separate order. Consider saving items from the other shop to your wishlist for later purchase."
          );
          return state;
        }
      }

      const isItemExist = state.cart.find(
        (i) =>
          i._id === item._id &&
          i.variant?.productColor === item.variant?.productColor &&
          i.variant?.size === item.variant?.size // Match size as well
      );

      if (isItemExist) {
        return {
          ...state,
          cart: state.cart.map((i) =>
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
          cart: [...state.cart, item],
        };
      }
    },

    // Remove from cart
    removeFromCart: (state, action) => {
      const item = action.payload;
      console.log("item const item = action.payload =", item);
      const { productId, productColor, size } = action.payload;

      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            product._id !== productId ||
            product.variant?.productColor !== productColor ||
            product.variant?.size !== size
        ),
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
