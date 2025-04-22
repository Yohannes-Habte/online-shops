import { useEffect, useState } from "react";
import "./ShopSidebar.scss";
import { MdDashboard, MdOutlineClose } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCategory } from "react-icons/md";
import { SiBrandfolder } from "react-icons/si";
import { FaProductHunt } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { RiRefundFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSeller } from "../../../redux/actions/seller";
import LogoutShowOwner from "../../../utils/globalFunctions/LogoutShopOwner";

const ShopSidebar = ({ isActive, setIsActive }) => {
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const { sellerSignOut } = LogoutShowOwner();

  // Local state variables
  const [openAdminDashboardMenu, setOpenAdminDashboardMenu] = useState(false);

  const handleOpenAdminDashboardMenu = () => {
    setOpenAdminDashboardMenu(!openAdminDashboardMenu);
  };

  // Shop owner Details
  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

  // Handle Seller logout
  const handleSellerLogout = async () => {
    await sellerSignOut();
  };

  return (
    <div
      className={`shop-dashboard-sidebar-wrapper ${
        openAdminDashboardMenu ? "shop-hamburger-menu-opened" : ""
      }`}
    >
      {/* Hamburger icon for small screens */}
      <div
        className="shop-hamburger-menu"
        onClick={handleOpenAdminDashboardMenu}
      >
        {openAdminDashboardMenu ? <MdOutlineClose /> : <GiHamburgerMenu />}
      </div>
      <section className="shop-dashboard-menu-container">
        <h2 className="shop-dashboard-sidebar-title">
          {" "}
          {currentSeller?.name}{" "}
        </h2>

        {/* Summary of Admin Dashboard */}
        <aside
          onClick={() => setIsActive(1) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdDashboard
            title="Dashboard Overview"
            className={isActive === 1 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 1 ? "active-text" : "passive-text"}>
            Shop Overview
          </h4>
        </aside>

        {/* Categories */}
        <aside
          onClick={() => setIsActive(2) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdOutlineCategory
            title="Categories"
            className={isActive === 2 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 2 ? "active-text" : "passive-text"}>
            Categories
          </h4>
        </aside>

        {/* Subcategories */}
        <aside
          onClick={() => setIsActive(17) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdOutlineCategory
            title="Sub Categories"
            className={isActive === 17 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 17 ? "active-text" : "passive-text"}>
            Subcategories
          </h4>
        </aside>

        {/* Brands */}
        <aside
          onClick={() => setIsActive(3) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <SiBrandfolder
            title="Brands"
            className={isActive === 3 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 3 ? "active-text" : "passive-text"}>
            Brands
          </h4>
        </aside>

        {/*  New Product */}
        <aside
          onClick={() => setIsActive(4) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <FaProductHunt
            title="New Product"
            className={isActive === 4 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 4 ? "active-text" : "passive-text"}>
            New Product
          </h4>
        </aside>

        {/* Products */}

        <aside
          onClick={() => setIsActive(5) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <FaProductHunt
            title="Products"
            className={isActive === 5 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 5 ? "active-text" : "passive-text"}>
            Products
          </h4>
        </aside>

        {/*  New Event */}

        <aside
          onClick={() => setIsActive(6) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdEvent
            title="New Event"
            className={isActive === 6 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 6 ? "active-text" : "passive-text"}>
            New Event
          </h4>
        </aside>

        {/* Events */}

        <aside
          onClick={() => setIsActive(7) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdEvent
            title="Events"
            className={isActive === 7 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 7 ? "active-text" : "passive-text"}>
            Events
          </h4>
        </aside>

        {/* Orders */}

        <aside
          onClick={() => setIsActive(9) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <FaFirstOrderAlt
            title="Orders"
            className={isActive === 9 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 9 ? "active-text" : "passive-text"}>
            Orders
          </h4>
        </aside>

        {/* Transactions */}

        <aside
          onClick={() => setIsActive(10) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <FaFirstOrderAlt
            title="Transactions"
            className={isActive === 10 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 10 ? "active-text" : "passive-text"}>
            Transactions
          </h4>
        </aside>

        {/* Refund Requests */}
        <aside
          onClick={() => setIsActive(18) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdOutlineMessage
            title="Refund Requests"
            className={isActive === 18 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 18 ? "active-text" : "passive-text"}>
            Refund Requests
          </h4>
        </aside>

        {/*  Returned Items */}
        <aside
          onClick={() => setIsActive(21) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdOutlineMessage
            title="Returned Items"
            className={isActive === 21 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 21 ? "active-text" : "passive-text"}>
            Returned Items
          </h4>
        </aside>

        {/* Refunds */}
        <aside
          onClick={() => setIsActive(12) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <RiRefundFill
            title="Refunds"
            className={isActive === 12 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 12 ? "active-text" : "passive-text"}>
            Refunds
          </h4>
        </aside>

        {/*  Shop Inbox*/}
        <aside
          onClick={() => setIsActive(11) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <MdOutlineMessage
            title="Add Video"
            className={isActive === 11 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 11 ? "active-text" : "passive-text"}>
            Shop Inbox
          </h4>
        </aside>

        {/* Supplier */}
        <aside
          onClick={() => setIsActive(13) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <RiRefundFill
            title="Suppliers"
            className={isActive === 13 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 13 ? "active-text" : "passive-text"}>
            Suppliers
          </h4>
        </aside>

        {/* Update Shop*/}
        <aside
          onClick={() => setIsActive(14) || setOpenAdminDashboardMenu(false)}
          className="shop-dashboard-sidebar-item"
        >
          <RiRefundFill
            title="Update Shop"
            className={isActive === 14 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 14 ? "active-text" : "passive-text"}>
            Update Shop
          </h4>
        </aside>

        {/* Shop Profile */}

        <Link
          to={`/shop/${currentSeller?._id}`}
          className="shop-dashboard-sidebar-item"
        >
          <IoSettings
            title="Shop Profile"
            className={isActive === 15 ? "active-icon" : "passive-icon"}
          />

          <h4 className={isActive === 15 ? "active-text" : "passive-text"}>
            Shop Profile
          </h4>
        </Link>

        {/* Log Out */}

        <aside className="shop-dashboard-sidebar-item">
          <IoMdLogOut
            title="Log Out"
            className={isActive === 16 ? "active-icon" : "passive-icon"}
          />

          <h4 onClick={handleSellerLogout} className="passive-text">
            Log Out
          </h4>
        </aside>
      </section>
    </div>
  );
};

export default ShopSidebar;
