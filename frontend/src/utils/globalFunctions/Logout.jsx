import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { API } from "../security/secreteKey";
import {
  userLogoutFailure,
  userLogoutStart,
  userLogoutSuccess,
} from "../../redux/reducers/userReducer";

const Logout = () => {
  const navigate = useNavigate();
  const { error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      dispatch(userLogoutStart());

      const { data } = await axios.get(`${API}/auth/logout`);

      if (data.success) {
        dispatch(userLogoutSuccess(data.message));
        toast.success(data.message);

        // Remove token from cookies
        Cookies.remove("token");

        navigate("/");
      } else {
        dispatch(userLogoutFailure("Logout failed"));
        toast.error("User could not logout");
      }
    } catch (error) {
      dispatch(
        userLogoutFailure(
          error.response ? error.response.data.message : "Network error"
        )
      );
      toast.error("Failed to logout. Please try again.");
    }
  };

  return { error, currentUser, signOut };
};

export default Logout;
