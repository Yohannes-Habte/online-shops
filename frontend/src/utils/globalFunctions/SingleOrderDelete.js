// utils/SingleOrderDelete.js
import axios from "axios";
import { API } from "../security/secreteKey";
import { toast } from "react-toastify";
import { handleError } from "../errorHandler/ErrorMessage";
import { fetchSellerOrders } from "../../redux/actions/order";

const SingleOrderDelete = async (orderId, dispatch) => {
  if (!orderId) {
    toast.error("Invalid order ID.");
    return;
  }

  const isConfirmed = window.confirm(
    "Are you sure you want to delete this order? This action is irreversible."
  );

  if (!isConfirmed) return;

  try {
    const { data } = await axios.delete(`${API}/orders/${orderId}`, {
      withCredentials: true,
    });

    toast.success(data.message);

    // Update Redux state
    dispatch(fetchSellerOrders());
  } catch (error) {
    const { errorMessage } = handleError(error);
    toast.error(errorMessage);
  }
};

export default SingleOrderDelete;
