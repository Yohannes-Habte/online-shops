import axios from 'axios';

// get all sellers
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllSellersRequest',
    });

    const { data } = await axios.get(`http://localhost:5000/api/shops`, {
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
