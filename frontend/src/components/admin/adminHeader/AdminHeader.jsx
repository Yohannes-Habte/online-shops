import { useState } from "react";
import "./AdminHeader.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BiMoneyWithdraw } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import {
  logoutSellerFailure,
  logoutSellerStart,
  logoutSellerSuccess,
} from "../../../redux/reducers/sellerReducer";
import { FaProductHunt, FaShoppingBag, FaUsers } from "react-icons/fa";
import { FaShopSlash } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { API } from "../../../utils/security/secreteKey";

const AdminHeader = () => {
  const navigate = useNavigate();

  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local state variables
  const [open, setOpen] = useState(false);

  // Logout seller
  const logoutSeller = async () => {
    try {
      dispatch(logoutSellerStart());
      const { data } = await axios.get(`${API}/shops/logout-shop`);

      dispatch(logoutSellerSuccess());

      toast.success(data.message);
      window.location.reload(true);
      navigate("/shop/login");
    } catch (error) {
      dispatch(logoutSellerFailure(error.response.data.message));
      console.log(error);
    }
  };

  // Style active and none active link
  const active = ({ isActive }) =>
    isActive
      ? "active-admin-header-dashboard-icon"
      : "passive-admin-header-dashboard-icon";

  return (
    <header className="admin-dashboard-header">
      {/* Logo */}
      <h1 className="admin-logo">
        <Link to="/admin/dashboard">Admin Dashboard</Link>
      </h1>

      {/* Links to various pages */}
      <span className="admin-dashboard-header-icons">
        <NavLink to="/admin-orders" className={active}>
          <FaShoppingBag
            className="admin-header-dashboard-icon"
            title="All Orders"
          />
        </NavLink>

        <NavLink to="/admin-shops" className={active}>
          <FaShopSlash
            className="admin-header-dashboard-icon"
            title="All Shops"
          />
        </NavLink>

        <NavLink to="/admin-products" className={active}>
          <FaProductHunt
            className="admin-header-dashboard-icon"
            title="All Products"
          />
        </NavLink>

        <NavLink to="/admin-events" className={active}>
          <BiMoneyWithdraw
            className="admin-header-dashboard-icon"
            title="All Events"
          />
        </NavLink>

        <NavLink to="/admin-users" className={active}>
          <FaUsers className="admin-header-dashboard-icon" title="All Users" />
        </NavLink>

        <NavLink to="/profile" className={active}>
          <IoSettings
            className="admin-header-dashboard-icon"
            title="Settings"
          />
        </NavLink>

        <figure onClick={() => setOpen(!open)} className="image-container">
          <img
            src={
              currentUser
                ? currentUser.image
                : "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt={currentUser.name}
            className="image"
          />
        </figure>

        {currentUser && open && (
          <ul className="shop-profile-logout-wrapper">
            <li className="item shop-profile">
              <Link
                to={`/admin/${currentUser._id}`}
                onClick={() => setOpen(false)}
                className="link"
              >
                Shop Profile
              </Link>
            </li>

            <li className="item user-profile">
              <NavLink to={`/profile`} className={"link"}>
                User Profile
              </NavLink>
            </li>

            <li className="item shop-board">
              <Link
                to={`/dashboard`}
                onClick={() => setOpen(false)}
                className="link"
              >
                Shop Dashboard
              </Link>
            </li>

            <li onClick={logoutSeller} className="item shop-logout">
              <Link to={"/shop/login"} className="link">
                Shop Log Out
              </Link>
            </li>
          </ul>
        )}
      </span>
    </header>
  );
};

export default AdminHeader;
