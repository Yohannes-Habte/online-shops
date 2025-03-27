import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allOrders: { data: [], loading: false, error: null },
  sellerOrders: {
    data: { orders: [], monthlyOrderCount: [] },
    loading: false,
    error: null,
  },
  customerOrders: { data: [], loading: false, error: null },
};

const setLoadingState = (state, key) => {
  state[key] = { ...state[key], loading: true, error: null };
};

const setSuccessState = (state, action, key) => {
  state[key] = {
    ...state[key],
    data: action.payload ?? { orders: [], monthlyOrderCount: [] }, // Ensures `orders` and `monthlyOrderCount` are always arrays
    loading: false,
    error: null,
  };
};

const setFailureState = (state, action, key) => {
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
    fetchSellerOrdersSuccess: (state, action) => {
      state.sellerOrders = {
        ...state.sellerOrders,
        data: {
          orders: action.payload.orders ?? [], // Ensure orders is always an array
          monthlyOrderCount: action.payload.monthlyOrderCount ?? [], // Ensure monthlyOrderCount is always an array
        },
        loading: false,
        error: null,
      };
    },
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
    clearOrderErrors: (state) => {
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
  clearOrderErrors,
} = orderReducer.actions;

export default orderReducer.reducer;
