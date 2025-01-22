import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // User Sign-Up
    userSignUpStart: setLoading,
    userSignUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    userSignUpFailure: setError,

    // User Login
    loginStart: setLoading,
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: setError,

    // Fetch Single User
    fetchUserRequest: setLoading,
    fetchUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    fetchUserFailure: setError,

    // Update User Profile
    updateUserStart: setLoading,
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: setError,

    // Change User Password
    changeUserPasswordStart: setLoading,
    changeUserPasswordSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    changeUserPasswordFailure: setError,

    // User Logout
    userLogoutStart: setLoading,
    userLogoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userLogoutFailure: setError,

    // Delete User
    deleteUserStart: setLoading,
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: setError,

    // Update User Address
    updateUserAddressStart: setLoading,
    updateUserAddressSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserAddressFailure: setError,

    // Delete User Address
    deleteUserAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    deleteUserAddressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch User Data
    fetchUserDataStart: setLoading,
    fetchUserDataSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserDataFailure: setError,

    // Clear Errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Destructure actions
export const {
  userSignUpStart,
  userSignUpSuccess,
  userSignUpFailure,

  loginStart,
  loginSuccess,
  loginFailure,

  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,

  updateUserStart,
  updateUserSuccess,
  updateUserFailure,

  changeUserPasswordStart,
  changeUserPasswordSuccess,
  changeUserPasswordFailure,

  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,

  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,

  updateUserAddressStart,
  updateUserAddressSuccess,
  updateUserAddressFailure,

  deleteUserAddressStart,
  deleteUserAddressSuccess,
  deleteUserAddressFailure,

  fetchUserDataStart,
  fetchUserDataSuccess,
  fetchUserDataFailure,

  clearErrors,
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
