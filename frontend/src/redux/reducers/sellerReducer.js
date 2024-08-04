import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSeller: null,
  sellers: [],
  error: null,
  loading: false,
};

const sellerReducer = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    // Seller Login
    loginSellerStart: (state) => {
      state.loading = true;
    },
    loginSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginSellerFailure: (state, action) => {
      state.error = action.payload;
      state.currentSeller = null;
      state.loading = false;
    },

    // Update Seller
    updateSellerStart: (state) => {
      state.loading = true;
    },
    updateSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateSellerFilure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // seller log out
    logoutSellerStart: (state) => {
      state.loading = true;
    },
    logoutSellerSuccess: (state) => {
      state.currentSeller = null;
      state.loading = false;
      state.error = null;
    },
    logoutSellerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // delete shop
    deleteSellerStart: (state) => {
      state.loading = true;
    },
    deleteSellerSuccess: (state) => {
      state.currentSeller = null;
      state.loading = false;
      state.error = null;
    },
    deleteSellerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // delete shop payment method
    deletePaymentMethodRequest: (state) => {
      state.loading = true;
    },
    deletePaymentMethodSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    deletePaymentMethodFailed: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Get seller
    getSellerStart: (state) => {
      state.error = true;
    },
    getSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    getSellerFailer: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // get all sellers ---admin
    getAllSellersRequest: (state) => {
      state.loading = true;
    },
    getAllSellersSuccess: (state, action) => {
      state.loading = false;
      state.sellers = action.payload;
    },
    getAllSellerFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Destructure user reducer methods
export const {
  loginSellerStart,
  loginSellerSuccess,
  loginSellerFailure,

  updateSellerStart,
  updateSellerSuccess,
  updateSellerFilure,

  logoutSellerStart,
  logoutSellerSuccess,
  logoutSellerFailure,

  deleteSellerStart,
  deleteSellerSuccess,
  deleteSellerFailure,

  getSellerStart,
  getSellerSuccess,
  getSellerFailer,

  deletePaymentMethodRequest,
  deletePaymentMethodSuccess,
  deletePaymentMethodFailed,

  // Get all sellers
  getAllSellersRequest,
  getAllSellersSuccess,
  getAllSellerFailed,
} = sellerReducer.actions;

// exoirt userSlice
export default sellerReducer.reducer;
