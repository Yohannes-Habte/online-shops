import axios from "axios";
import Cookies from "js-cookie";
import {
  changeUserPasswordFailure,
  changeUserPasswordStart,
  changeUserPasswordSuccess,
  deleteUserAddressFailure,
  deleteUserAddressStart,
  deleteUserAddressSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  fetchUserFailure,
  fetchUserRequest,
  fetchUserSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  updateUserAddressFailure,
  updateUserAddressStart,
  updateUserAddressSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  userSignUpFailure,
  userSignUpStart,
  userSignUpSuccess,
} from "../reducers/userReducer";
import { API } from "../../utils/security/secreteKey";
import { toast } from "react-toastify";
import { handleError } from "../../utils/errorHandler/ErrorMessage";

//==============================================================================
// Action to sign up a new user
//==============================================================================
export const userSignUp = (userData) => async (dispatch) => {
  try {
    dispatch(userSignUpStart());

    const res = await axios.post(`${API}/auth/signup`, userData, {
      withCredentials: true,
    });

    const user = res.data.user;
    dispatch(userSignUpSuccess(user));
    toast.success("User signed up successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(userSignUpFailure(message));
  }
};

//==============================================================================
// Action to log in a user
//==============================================================================
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const res = await axios.post(`${API}/auth/login`, credentials, {
      withCredentials: true,
    });

    const user = res.data.user;
    dispatch(loginSuccess(user));
    toast.success("User logged in successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(loginFailure(message));
  }
};

//==============================================================================
// Fetch a Single User
//==============================================================================

export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(fetchUserRequest());
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No user found");
    }
    const res = await axios.get(`${API}/users/user`, {
      withCredentials: true,
    });

    const user = res.data.result;

    dispatch(fetchUserSuccess(user));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchUserFailure(message));
  }
};

//==============================================================================
// Action to update user profile
//==============================================================================
export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch(updateUserStart());

    const res = await axios.put(`${API}/users/update`, userData, {
      withCredentials: true,
    });

    const user = res.data.user;
    dispatch(updateUserSuccess(user));
    toast.success("User profile updated successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(updateUserFailure(message));
  }
};

//==============================================================================
// Action to change user password
//==============================================================================
export const changeUserPassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(changeUserPasswordStart());

    const res = await axios.put(`${API}/users/password`, passwordData, {
      withCredentials: true,
    });

    const feedback = res.data.message;
    dispatch(changeUserPasswordSuccess(feedback));
    toast.success("Password changed successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(changeUserPasswordFailure(message));
  }
};

//==============================================================================
// Action to delete user account
//==============================================================================
export const deleteUser = () => async (dispatch) => {
  try {
    dispatch(deleteUserStart());

    await axios.delete(`${API}/users/delete`, {
      withCredentials: true,
    });

    dispatch(deleteUserSuccess());
    toast.success("User account deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(deleteUserFailure(message));
  }
};

//==============================================================================
// Action to update user address
//==============================================================================
export const updateUserAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(updateUserAddressStart());

    const res = await axios.put(`${API}/users/address`, addressData, {
      withCredentials: true,
    });

    const user = res.data.user;
    dispatch(updateUserAddressSuccess(user));
    toast.success("Address updated successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(updateUserAddressFailure(message));
  }
};

//==============================================================================
// Action to delete user address
//==============================================================================
export const deleteUserAddress = (addressId) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressStart());

    const res = await axios.delete(`${API}/users/address/${addressId}`, {
      withCredentials: true,
    });

    const user = res.data.user;
    dispatch(deleteUserAddressSuccess(user));
    toast.success("Address deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(deleteUserAddressFailure(message));
  }
};
