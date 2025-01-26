import { createSlice } from "@reduxjs/toolkit";

// Initial state with added pagination and error handling
const initialState = {
  currentProduct: null,
  products: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  lastFetched: null, // Track the last fetch time
  error: null,
  loading: false,
};

const startLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const setSuccess = (state, action) => {
  state.totalCount = action.payload.totalCount;
  state.currentPage = action.payload.currentPage;
  state.totalPages = action.payload.totalPages;
  state.lastFetched = Date.now(); // Update last fetch timestamp
  state.loading = false;
  state.error = null;
};

const setSingleProductSuccess = (state, action) => {
  state.currentProduct = action.payload;
  state.loading = false;
  state.error = null;
};

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
    allProductsFetchSuccess: (state, action) => {
      // Check if it's the first page or subsequent pages
      if (action.payload.currentPage === 1) {
        // On the first page, replace the products list
        state.products = action.payload.products;
      } else {
        // On subsequent pages, append only new products that are not in the current list
        const newProducts = action.payload.products.filter(
          (newProduct) =>
            !state.products.some(
              (existingProduct) => existingProduct._id === newProduct._id
            )
        );
        state.products = [...state.products, ...newProducts];
      }

      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
      state.error = null;
    },

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

export default productReducer.reducer;
