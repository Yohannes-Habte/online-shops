import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { API } from "../security/secreteKey";
import {
  logoutSellerFailure,
  logoutSellerStart,
  logoutSellerSuccess,
} from "../../redux/reducers/sellerReducer";
import { handleError } from "../errorHandler/ErrorMessage";

const LogoutShowOwner = () => {
  const navigate = useNavigate();
  const { error, currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const sellerSignOut = async () => {
    try {
      dispatch(logoutSellerStart());

      const { data } = await axios.get(`${API}/shops/logout`);

      if (data.success) {
        dispatch(logoutSellerSuccess(data.message));
        toast.success(data.message);

        // Remove token from cookies
        Cookies.remove("token");

        navigate("/");
        window.location.reload(true);
      } else {
        dispatch(logoutSellerFailure("Logout failed"));
        toast.error("Seller could not logout");
      }
    } catch (error) {
      const { message } = handleError(error);
      dispatch(logoutSellerFailure(message));
      toast.error("Failed to logout. Please try again.");
    }
  };

  return { error, currentSeller, sellerSignOut };
};

export default LogoutShowOwner;
