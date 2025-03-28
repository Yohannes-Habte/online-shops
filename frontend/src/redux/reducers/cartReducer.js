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
      // The product that the user is trying to add to the cart by clicking the "Add to Cart" button
      const item = action.payload;
      // The shop ID of the product that the user is trying to add to the cart
      const itemShopId = item.shop._id;

      // Check if item in the shopping cart from the same shop
      if (state.cart.length > 0) {
        // Get the shop ID of the first item in the cart
        const currentShopId = state.cart[0].shop._id;

        if (currentShopId !== itemShopId) {
          alert(
            "For a single order, all items must be from the same shop. To purchase items from a different shop, please create a separate order. Consider saving items from the other shop to your wishlist for later purchase."
          );
          return state;
        }
      }

      // Check if the item already exists in the cart array
      const isItemExist = state.cart.find(
        (product) =>
          product._id === item._id &&
          product.variant?.productColor === item.variant?.productColor &&
          product.variant?.size === item.variant?.size
      );

      if (isItemExist) {
        // If the item already exists in the cart, update the quantity
        return {
          ...state,
          cart: state.cart.map((product) =>
            product._id === isItemExist._id &&
            product.variant.productColor === isItemExist.variant.productColor &&
            product.variant.size === isItemExist.variant.size
              ? item
              : product
          ),
        };
      } else {
        // If the item does not exist in the cart, add the item to the cart array
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

    // Add Event to Cart
    addEventToCart: (state, action) => {
      const eventItem = action.payload;
      const eventItemAddToCartShopId = eventItem.shop._id;

      if (state.cart.length > 0) {
        const currentCartEventItemShopId = state.cart[0].shop._id;

        if (currentCartEventItemShopId !== eventItemAddToCartShopId) {
          alert(
            "For a single order, all items must be from the same shop. To purchase items from a different shop, please create a separate order. Consider saving items from the other shop to your wishlist for later purchase."
          );
          return state;
        }
      }

      const existingEvent = state.cart.find(
        (event) =>
          event._id === eventItem._id &&
          event.selectedColor === eventItem.selectedColor &&
          event.selectedSize === eventItem.selectedSize
      );

      if (existingEvent) {
        return {
          ...state,
          cart: state.cart.map((event) =>
            event._id === existingEvent._id &&
            event.selectedColor === existingEvent.selectedColor &&
            event.selectedSize === existingEvent.selectedSize
              ? eventItem
              : event
          ),
        };
      } else {
        // If the event does not exist in the cart, add the event to the cart array
        return {
          ...state,
          cart: [...state.cart, eventItem],
        };
      }
    },

    // Remove Event from Cart
    removeEventFromCart: (state, action) => {
      const { productId, productColor, size } = action.payload;

      return {
        ...state,
        cart: state.cart.filter(
          (event) =>
            event._id !== productId ||
            event.selectedColor !== productColor ||
            event.selectedSize !== size
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
export const {
  addToCart,
  removeFromCart,
  addEventToCart,
  removeEventFromCart,
  clearFromCart,
} = cartReducer.actions;

// export wishlist reducer
export default cartReducer.reducer;
