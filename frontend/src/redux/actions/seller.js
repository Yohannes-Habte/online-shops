import axios from "axios";
import Cookies from "js-cookie";
import {
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
  clearErrors,
} from "../reducers/sellerReducer";
import { API } from "../../utils/security/secreteKey";
import { toast } from "react-toastify";
import { handleError } from "../../utils/errorHandler/ErrorMessage";

//==============================================================================
// Action to create a new seller
//==============================================================================

export const createNewShop = (credentials) => async (dispatch) => {
  try {
    dispatch(sellerSignUpStart());

    const res = await axios.post(`${API}/shops/create`, credentials, {
      withCredentials: true,
    });

    const newShop = res.data.shop;
    dispatch(sellerSignUpSuccess(newShop));
    toast.success("Shop created successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(sellerSignUpFailure(message));
  }
};

//==============================================================================
// Action to log in a seller
//==============================================================================
export const loginShopOwner = (credentials) => async (dispatch) => {
  try {
    dispatch(loginSellerStart());

    const res = await axios.post(`${API}/shops/login`, credentials, {
      withCredentials: true,
    });

    const myShop = res.data.shop;
    dispatch(loginSellerSuccess(myShop));
    toast.success("Seller logged in successfully!");

    const token = res.data?.token;
    Cookies.set("token", token, {
      expires: 1,
      secure: true, // This should be true if served over HTTPS
      sameSite: "strict",
    });
  } catch (error) {
    const { message } = handleError(error);
    dispatch(loginSellerFailure(message));
  }
};

//==============================================================================
// Action to get seller details
//==============================================================================
export const fetchSingleSeller = () => async (dispatch) => {
  try {
    dispatch(getSellerStart());

    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No seller found");
    }

    const res = await axios.get(`${API}/shops/shop`, { withCredentials: true });

    if (!res.data || !res.data.seller) {
      throw new Error("Seller data not found");
    }

    const shopDetails = res.data.seller;

    dispatch(getSellerSuccess(shopDetails));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(getSellerFailure(message));
  }
};

//==============================================================================
// Action to update seller details
//==============================================================================
export const updateSeller = (sellerData) => async (dispatch) => {
  try {
    dispatch(updateSellerStart());

    const res = await axios.put(`${API}/shops/update`, sellerData, {
      withCredentials: true,
    });

    const seller = res.data.seller;
    dispatch(updateSellerSuccess(seller));
    toast.success("Seller updated successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(updateSellerFailure(message));
  }
};

//==============================================================================
// Action to log out a seller
//==============================================================================
export const logoutSeller = () => async (dispatch) => {
  try {
    dispatch(logoutSellerStart());

    await axios.post(`${API}/shops/logout`, {}, { withCredentials: true });

    dispatch(logoutSellerSuccess());
    toast.success("Seller logged out successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(logoutSellerFailure(message));
  }
};

//==============================================================================
// Action to delete a seller
//==============================================================================
export const deleteSeller = () => async (dispatch) => {
  try {
    dispatch(deleteSellerStart());

    await axios.delete(`${API}/shops/delete`, { withCredentials: true });

    dispatch(deleteSellerSuccess());
    toast.success("Seller deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(deleteSellerFailure(message));
  }
};

//==============================================================================
// Action to delete a payment method
//==============================================================================
export const deletePaymentMethod = (paymentMethodId) => async (dispatch) => {
  try {
    dispatch(deletePaymentMethodRequest());

    const res = await axios.delete(
      `${API}/shops/payment-method/${paymentMethodId}`,
      { withCredentials: true }
    );

    const seller = res.data.seller;
    dispatch(deletePaymentMethodSuccess(seller));
    toast.success("Payment method deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(deletePaymentMethodFailed(message));
  }
};

//==============================================================================
// Action to get all sellers (Admin only)
//==============================================================================
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellersRequest());

    const res = await axios.get(`${API}/shops`, {
      withCredentials: true,
    });

    const sellers = res.data.sellers;
    dispatch(getAllSellersSuccess(sellers));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(getAllSellersFailed(message));
  }
};

//==============================================================================
// Action to clear errors
//==============================================================================
export const clearSellerErrors = () => (dispatch) => {
  dispatch(clearErrors());
};
