import axios from 'axios';
import { API } from '../../utils/security/secreteKey';

// get all sellers
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllSellersRequest',
    });

    const { data } = await axios.get(`${API}/shops`, {
      withCredentials: true,
    });

    dispatch({
      type: 'getAllSellersSuccess',
      payload: data.shops,
    });
  } catch (error) {
    dispatch({
      type: 'getAllSellerFailed',
      payload: error.response.data.message,
    });
  }
};
