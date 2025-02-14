import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSeller: null,
  sellers: [],
  error: null,
  loading: false,
};

// Helper functions for setting state
const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const setSuccess = (state) => {
  state.loading = false;
  state.error = null;
};

const sellerReducer = createSlice({
  name: "seller",
  initialState,
  reducers: {
    // Seller Sign-Up
    sellerSignUpStart: setLoading,
    sellerSignUpSuccess: (state, action) => {
      state.currentSeller = action.payload;
      setSuccess(state);
    },
    sellerSignUpFailure: setError,

    // Seller Login
    loginSellerStart: setLoading,
    loginSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      setSuccess(state);
    },
    loginSellerFailure: setError,

    // Get Seller
    getSellerStart: setLoading,
    getSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      setSuccess(state);
    },
    getSellerFailure: setError,

    // Update Seller
    updateSellerStart: setLoading,
    updateSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      setSuccess(state);
    },
    updateSellerFailure: setError,

    // Seller Logout
    logoutSellerStart: setLoading,
    logoutSellerSuccess: (state) => {
      state.currentSeller = null;
      state.loading = false;
      state.error = null;
    },
    logoutSellerFailure: setError,

    // Delete Seller
    deleteSellerStart: setLoading,
    deleteSellerSuccess: (state) => {
      state.currentSeller = null;
      setSuccess(state);
    },
    deleteSellerFailure: setError,

    // Delete Payment Method
    deletePaymentMethodRequest: setLoading,
    deletePaymentMethodSuccess: (state, action) => {
      state.currentSeller = action.payload;
      setSuccess(state);
    },
    deletePaymentMethodFailed: setError,

    // Get All Sellers (Admin)
    getAllSellersRequest: setLoading,
    getAllSellersSuccess: (state, action) => {
      state.sellers = action.payload;
      setSuccess(state);
    },
    getAllSellersFailed: setError,

    // Update Seller Balance (New action to update available balance)
    updateShopStatusStart: setLoading,
    updateShopStatusBalance: (state, action) => {
      if (state.currentSeller) {
        state.currentSeller.availableBalance = action.payload;
      }
      setSuccess(state);
    },
    updateShopStatusFailure: setError,

    // Clear Errors
    clearShopErrors: (state) => {
      state.error = null;
    },
  },
});

// Destructure seller reducer methods
export const {
  sellerSignUpStart,
  sellerSignUpSuccess,
  sellerSignUpFailure,

  loginSellerStart,
  loginSellerSuccess,
  loginSellerFailure,

  updateSellerStart,
  updateSellerSuccess,
  updateSellerFailure,

  logoutSellerStart,
  logoutSellerSuccess,
  logoutSellerFailure,

  deleteSellerStart,
  deleteSellerSuccess,
  deleteSellerFailure,

  deletePaymentMethodRequest,
  deletePaymentMethodSuccess,
  deletePaymentMethodFailed,

  getSellerStart,
  getSellerSuccess,
  getSellerFailure,

  getAllSellersRequest,
  getAllSellersSuccess,
  getAllSellersFailed,

  updateShopStatusStart,
  updateShopStatusBalance,
  updateShopStatusFailure,

  clearShopErrors,
} = sellerReducer.actions;

export default sellerReducer.reducer;
