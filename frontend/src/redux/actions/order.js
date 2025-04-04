import axios from "axios";
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchSellerOrdersRequest,
  fetchSellerOrdersSuccess,
  fetchSellerOrdersFailure,
  fetchCustomerOrdersRequest,
  fetchCustomerOrdersSuccess,
  fetchCustomerOrdersFailure,
} from "../reducers/orderReducer";
import { API } from "../../utils/security/secreteKey";
import { handleError } from "../../utils/errorHandler/ErrorMessage";

//==============================================================================
// Fetch all orders (Admin)
//==============================================================================
export const fetchAllOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersRequest());

    const { data } = await axios.get(`${API}/orders/admin`, {
      withCredentials: true,
    });

    console.log("✅ All Orders Data:", data.orders);

    dispatch(fetchOrdersSuccess(data.orders));
  } catch (error) {
    const { message } = handleError(error);

    dispatch(fetchOrdersFailure(message));
  }
};

//==============================================================================
// Fetch orders for a specific seller/shop
//==============================================================================
export const fetchSellerOrders = () => async (dispatch) => {
  try {
    dispatch(fetchSellerOrdersRequest());

    const response = await axios.get(`${API}/orders/seller`, {
      withCredentials: true,
    });

    const { orders, monthlyOrderCount } = response.data;

    dispatch(
      fetchSellerOrdersSuccess({
        orders,
        monthlyOrderCount,
      })
    );

    dispatch(fetchSellerOrdersSuccess({ orders, monthlyOrderCount }));
  } catch (error) {
    const { message } = handleError(error);

    dispatch(fetchSellerOrdersFailure(message));
  }
};

//==============================================================================
// Fetch orders for a specific customer
//==============================================================================
export const fetchCustomerOrders = () => async (dispatch) => {
  try {
    dispatch(fetchCustomerOrdersRequest());

    const { data } = await axios.get(`${API}/orders/customer`, {
      withCredentials: true,
    });

    dispatch(fetchCustomerOrdersSuccess(data.orders));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchCustomerOrdersFailure(message));
  }
};

//==============================================================================
// Delete all orders for a specific seller/shop
//==============================================================================
export const deleteShopOrders = () => async (dispatch) => {
  try {
    dispatch(fetchSellerOrdersRequest());

    const { data } = await axios.delete(`${API}/orders`, {
      withCredentials: true,
    });

    dispatch(fetchSellerOrdersSuccess(data.message));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(fetchSellerOrdersFailure(message));
  }
};
