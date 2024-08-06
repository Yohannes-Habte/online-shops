import { createSlice } from '@reduxjs/toolkit';
import Cookies from "js-cookie";
import axios from "axios";
import { API } from '../../utils/security/secreteKey';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  addressLoading: false,
  successMessage: null,
};

const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setError = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // User Login
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.currentUser = null;
      state.loading = false;
    },

    // Update user profile
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Change user password
    changeUserPasswordStart: (state) => {
      state.loading = true;
    },
    changeUserPasswordSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    changeUserPasswordFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // User log out
    userLogoutStart: (state) => {
      state.loading = true;
    },
    userLogoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userLogoutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Delete user
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update user address
    updateUserAddressStart: (state) => {
      state.loading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserAddressFilure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // delete user address
    deleteUserAddressStart: (state) => {
      state.addressLoading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressLoading = false;
      state.currentUser = action.payload;
    },
    deleteUserAddressFilure: (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    },

     // Fetch User Data 
     fetchUserDataStart: setLoading,
     fetchUserDataSuccess: (state, action) => {
       state.currentUser = action.payload;
       state.loading = false;
     },
     fetchUserDataFailure: setError,

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

// Destructure user reducer methods
export const {
  loginStart,
  loginSuccess,
  loginFailure,

  updateUserStart,
  updateUserSuccess,
  updateUserFailure,

  changeUserPasswordStart,
  changeUserPasswordSuccess,
  changeUserPasswordFilure,

  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,

  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,

  updateUserAddressStart,
  updateUserAddressSuccess,
  updateUserAddressFilure,

  deleteUserAddressStart,
  deleteUserAddressSuccess,
  deleteUserAddressFilure,

  fetchUserDataStart,
  fetchUserDataSuccess,
  fetchUserDataFailure,

  clearErrors,
} = userReducer.actions;

// export const fetchUserData = () => async (dispatch) => {
//   dispatch(fetchUserDataStart());

//   try {
//     const token = Cookies.get("token");
//     console.log("token from redux =", token)

//     if (!token) throw new Error("No token found");
//     const res = await axios.get(`${API}/users/user`, {
//       withCredentials: true,
//     });

//     dispatch(fetchUserDataSuccess(res.data.user));
//   } catch (error) {
//     dispatch(fetchUserDataFailure(error.message));
//   }
// };

// export userSlice
export default userReducer.reducer;
