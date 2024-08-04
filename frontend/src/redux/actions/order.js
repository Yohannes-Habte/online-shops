import axios from 'axios';
import { API } from '../../utils/security/secreteKey';

// All shops orders
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: 'adminOrdersRequest',
    });

    const { data } = await axios.get(`${API}/orders`, {
      withCredentials: true,
    });

    dispatch({
      type: 'adminOrdersSuccess',
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: 'adminOrdersFail',
      payload: error.response.data.message,
    });
  }
};
