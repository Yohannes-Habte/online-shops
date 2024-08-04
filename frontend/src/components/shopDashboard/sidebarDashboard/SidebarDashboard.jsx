import React from 'react';
import './SidebarDashboard.scss';
import { AiOutlineGift } from 'react-icons/ai';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { MdCreateNewFolder, MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { VscNewFile } from 'react-icons/vsc';
import { CiSettings } from 'react-icons/ci';
import { NavLink } from 'react-router-dom';
import { BiMessageSquareDetail, BiMoneyWithdraw } from 'react-icons/bi';
import { HiOutlineReceiptRefund } from 'react-icons/hi';

const SidebarDashboard = () => {
  // Active NavLinks text styling
  const activeText = ({ isActive }) =>
    isActive
      ? `active-sidebar-dashboard-link`
      : 'passive-sidebar-dashboard-link';

  // active NavLink icons
  const activeIcon = ({ isActive }) =>
    isActive
      ? 'active-sidebar-dashboard-icon'
      : 'passive-sidebar-dashboard-icon';

  return (
    <nav className="sidebar-dashboar">
      {/* single item */}
      <ul className="sidebar-dashboard-items">
        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard'} className={activeIcon}>
            <RxDashboard
              title=" Shop Dashboard"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard'} className={activeText}>
            Shop Dashboard
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to="/dashboard-create-product" className={activeIcon}>
            <MdCreateNewFolder
              title="Create Product"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-create-product'} className={activeText}>
            Create Product
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-products'} className={activeIcon}>
            <FiPackage title="Products" className="sidebar-dashboard-icon" />
          </NavLink>

          <NavLink to={'/dashboard-products'} className={activeText}>
            All Products
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-create-event'} className={activeIcon}>
            <VscNewFile
              title="Create Event"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-create-event'} className={activeText}>
            Create Event
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-events'} className={activeIcon}>
            <MdOutlineLocalOffer
              title="Events"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-events'} className={activeText}>
            All Events
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-coupouns'} className={activeIcon}>
            <AiOutlineGift
              title="Discount Codes"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-coupouns'} className={activeText}>
            Discount Codes
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-orders'} className={activeIcon}>
            <FiShoppingBag title="Orders" className="sidebar-dashboard-icon" />{' '}
          </NavLink>

          <NavLink to={'/dashboard-orders'} className={activeText}>
            All Orders
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to="/shop-withdraw-money" className={activeIcon}>
            <BiMoneyWithdraw
              title="Withdraw Money"
              className="sidebar-dashboard-icon"
            />{' '}
          </NavLink>

          <NavLink to="/shop-withdraw-money" className={activeText}>
            Withdraw Money
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-messages'} className={activeIcon}>
            <BiMessageSquareDetail
              title="Shop Inbox"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-messages'} className={activeText}>
            Shop Inbox
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/dashboard-refunds'} className={activeIcon}>
            <HiOutlineReceiptRefund
              title="Refunds"
              className="sidebar-dashboard-icon"
            />
          </NavLink>

          <NavLink to={'/dashboard-refunds'} className={activeText}>
            Refunds
          </NavLink>
        </li>

        <li className="sidebar-dashboard-item">
          <NavLink to={'/settings'} className={activeIcon}>
            <CiSettings title="Settings" className="sidebar-dashboard-icon" />
          </NavLink>

          <NavLink to={'/settings'} className={activeText}>
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarDashboard;
