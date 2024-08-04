import React, { useState } from 'react';
import './AdminHeader.scss';
import { AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BiMessageSquareDetail, BiMoneyWithdraw } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  logoutSellerFailure,
  logoutSellerStart,
  logoutSellerSuccess,
} from '../../../redux/reducers/sellerReducer';
import { FaProductHunt, FaShoppingBag, FaUsers } from 'react-icons/fa';
import { FaShopSlash } from 'react-icons/fa6';
import { IoSettings } from 'react-icons/io5';
import { API } from '../../../utils/security/secreteKey';

const AdminHeader = ({ isOwner }) => {
  const navigate = useNavigate();

  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
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
      navigate('/login-shop');
    } catch (error) {
      dispatch(logoutSellerFailure(error.response.data.message));
      console.log(error);
    }
  };

  // Style active and none active link
  const active = ({ isActive }) =>
    isActive
      ? 'active-admin-header-dashboard-icon'
      : 'passive-admin-header-dashboard-icon';

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
              currentSeller
                ? currentSeller.image
                : 'https://i.ibb.co/4pDNDk1/avatar.png'
            }
            alt={currentSeller.name}
            className="image"
          />
        </figure>

        {currentSeller && open && (
          <ul className="shop-profile-logout-wrapper">
            <li className="item shop-profile">
              <Link
                to={`/shop/${currentSeller._id}`}
                onClick={() => setOpen(false)}
                className="link"
              >
                Shop Profile
              </Link>
            </li>

            <li className="item user-profile">
              <NavLink to={`/profile`} className={'link'}>
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
              <Link to={'/login-shop'} className="link">
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
