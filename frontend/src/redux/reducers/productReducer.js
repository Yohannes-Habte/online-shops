import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentProduct: null,
  products: [],
  lastFetched: null, // Track the last fetch time
  error: null,
  loading: false,
};

// Helper functions
const startLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const setSuccess = (state, action) => {
  state.products = action.payload;
  state.lastFetched = Date.now(); // Update the timestamp
  state.loading = false;
  state.error = null;
};

const setSingleProductSuccess = (state, action) => {
  state.currentProduct = action.payload;
  state.loading = false;
  state.error = null;
};

// Create slice
const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Post product
    productPostStart: startLoading,
    productPostSuccess: setSingleProductSuccess,
    productPostFailure: setError,

    // Get single product
    productFetchStart: startLoading,
    productFetchSuccess: setSingleProductSuccess,
    productFetchFailure: setError,

    // Update single product
    productUpdateStart: startLoading,
    productUpdateSuccess: setSingleProductSuccess,
    productUpdateFailure: setError,

    // Delete single product from a specific shop
    productShopDeleteStart: startLoading,
    productShopDeleteSuccess: setSingleProductSuccess,
    productShopDeleteFailure: setError,

    // Get all products for a shop
    productsShopFetchStart: startLoading,
    productsShopFetchSuccess: setSuccess,
    productsShopFetchFailure: setError,

    // Get all products for all shops
    allProductsFetchStart: startLoading,
    allProductsFetchSuccess: setSuccess,
    allProductsFetchFailure: setError,

    // Get all products for a category
    productsCategoryFetchStart: startLoading,
    productsCategoryFetchSuccess: setSuccess,
    productsCategoryFetchFailure: setError,

    // Clear Error
    clearProductErrors: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  productPostStart,
  productPostSuccess,
  productPostFailure,

  productFetchStart,
  productFetchSuccess,
  productFetchFailure,

  productUpdateStart,
  productUpdateSuccess,
  productUpdateFailure,

  productShopDeleteStart,
  productShopDeleteSuccess,
  productShopDeleteFailure,

  productsShopFetchStart,
  productsShopFetchSuccess,
  productsShopFetchFailure,

  productsCategoryFetchStart,
  productsCategoryFetchSuccess,
  productsCategoryFetchFailure,

  allProductsFetchStart,
  allProductsFetchSuccess,
  allProductsFetchFailure,

  clearProductErrors,
} = productReducer.actions;

// Export reducer
export default productReducer.reducer;
