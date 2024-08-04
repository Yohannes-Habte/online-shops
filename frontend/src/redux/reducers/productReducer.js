import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: null,
  error: null,
  loading: false,
};

const productReducer = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Post product
    productPostStart: (state) => {
      state.loading = true;
      state.error = null;
      state.products = null;
    },
    productPostSuccess: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    productPostFailure: (state, action) => {
      state.error = action.payload;
      state.products = null;
      state.loading = false;
    },

    // Get all products for a shop
    productsShopFetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.products = null;
    },
    productsShopFetchSuccess: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    productShopFetchFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.products = null;
    },

    // Delete single product from a specific shop
    productShopDeleteStart: (state) => {
      state.loading = true;
    },
    productShopDeleteSuccess: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    productShopDeleteFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Destructure product reducer methods under the reducers key
export const {
  // Create shop product
  productPostStart,
  productPostSuccess,
  productPostFailure,

  // Get all shop products
  productsShopFetchStart,
  productsShopFetchSuccess,
  productsShopFetchFailure,

  // Delete specific shop product
  productShopDeleteStart,
  productShopDeleteSuccess,
  productShopDeleteFailure,
} = productReducer.actions;

export default productReducer.reducer;
