import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allOrders: { data: [], loading: false, error: null },
  sellerOrders: { data: [], loading: false, error: null },
  customerOrders: { data: [], loading: false, error: null },
};

const setLoadingState = (state, key) => {
  console.log(`Setting loading state for ${key}`);
  state[key] = { ...state[key], loading: true, error: null };
};

const setSuccessState = (state, action, key) => {
  console.log(`Setting success state for ${key}`, action.payload); // Debugging
  state[key] = {
    ...state[key],
    data: action.payload ?? [], // Ensures `data` is always an array
    loading: false,
    error: null,
  };
};

const setFailureState = (state, action, key) => {
  console.log(`Setting failure state for ${key}`, action.payload); // Debugging
  state[key] = {
    ...state[key],
    loading: false,
    error: action.payload ?? "An error occurred",
  };
};

const orderReducer = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Fetch all orders (Admin)
    fetchOrdersRequest: (state) => setLoadingState(state, "allOrders"),
    fetchOrdersSuccess: (state, action) =>
      setSuccessState(state, action, "allOrders"),
    fetchOrdersFailure: (state, action) =>
      setFailureState(state, action, "allOrders"),

    // Fetch orders for a specific seller
    fetchSellerOrdersRequest: (state) => setLoadingState(state, "sellerOrders"),
    fetchSellerOrdersSuccess: (state, action) =>
      setSuccessState(state, action, "sellerOrders"),
    fetchSellerOrdersFailure: (state, action) =>
      setFailureState(state, action, "sellerOrders"),

    // Fetch orders for a specific customer
    fetchCustomerOrdersRequest: (state) =>
      setLoadingState(state, "customerOrders"),
    fetchCustomerOrdersSuccess: (state, action) =>
      setSuccessState(state, action, "customerOrders"),
    fetchCustomerOrdersFailure: (state, action) =>
      setFailureState(state, action, "customerOrders"),

    // Clear errors
    clearErrors: (state) => {
      console.log("Clearing errors...");
      state.allOrders.error = null;
      state.sellerOrders.error = null;
      state.customerOrders.error = null;
    },
  },
});

export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchSellerOrdersRequest,
  fetchSellerOrdersSuccess,
  fetchSellerOrdersFailure,
  fetchCustomerOrdersRequest,
  fetchCustomerOrdersSuccess,
  fetchCustomerOrdersFailure,
  clearErrors,
} = orderReducer.actions;

export default orderReducer.reducer;
