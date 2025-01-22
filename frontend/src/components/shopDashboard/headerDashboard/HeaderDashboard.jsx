import { useEffect, useState } from "react";
import "./HeaderDashboard.scss";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";

import { fetchSingleSeller } from "../../../redux/actions/seller";
import LogoutShowOwner from "../../../utils/globalFunctions/LogoutShopOwner";

const HeaderDashboard = () => {
  const { sellerSignOut } = LogoutShowOwner();

  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // Local state variables
  const [open, setOpen] = useState(false);

  // Shop owner Details
  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

  // Handle Seller logout
  const handleSellerLogout = async () => {
    await sellerSignOut();
  };

  // Style active and none active link
  const active = ({ isActive }) =>
    isActive ? "active-header-dashboard-icon" : "passive-header-dashboard-icon";

  return (
    <header className="header-shop-dashboard">
      {/* Logo */}
      <h1 className="shop-logo">
        <Link to={`/shop/${currentSeller?._id}`}> {currentSeller?.name} </Link>
      </h1>

      {/* Links to various pages */}
      <span className="dashboard-header-icons">
        <NavLink to="/dashboard-coupouns" className={active}>
          <AiOutlineGift className="header-dashboard-icon" title="Coupons" />
        </NavLink>

        <NavLink to="/dashboard-events" className={active}>
          <MdOutlineLocalOffer
            className="header-dashboard-icon"
            title="Events"
          />
        </NavLink>

        <NavLink to="/dashboard-products" className={active}>
          <FiShoppingBag className="header-dashboard-icon" title="Products" />
        </NavLink>

        <NavLink to="/dashboard-orders" className={active}>
          <FiPackage className="header-dashboard-icon" title="Orders" />
        </NavLink>

        <NavLink to="/dashboard-messages" className={active}>
          <BiMessageSquareDetail
            className="header-dashboard-icon"
            title="Messages"
          />
        </NavLink>

        <figure onClick={() => setOpen(!open)} className="image-container">
          <img
            src={
              currentSeller
                ? currentSeller?.LogoImage
                : "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt={currentSeller?.name}
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

            <li onClick={handleSellerLogout} className="item shop-logout">
              <button>Log Out</button>
            </li>
          </ul>
        )}
      </span>
    </header>
  );
};

export default HeaderDashboard;
