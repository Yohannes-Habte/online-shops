import React from 'react';
import './AdminSidebar.scss';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FaShoppingBag } from 'react-icons/fa';
import { FaShopSlash } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa6';
import { FaProductHunt } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { IoSettings } from 'react-icons/io5';

const AdminSidebar = () => {
  // Styling of NavLink items
  const tabIconStatus = ({ isActive }) =>
    isActive ? 'active-icon-status' : 'passive-icon-status';

  const activeTabText = ({ isActive }) =>
    isActive ? 'active-tab-text' : 'passive-tab-text';

  return (
    <nav className="admin-dashboard-shidebar-wrapper">
      {/* single item */}
      <ul className="admin-dashboard-sidebar-items">
        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/admin/dashboard'} className={tabIconStatus}>
            <RxDashboard title="Admin Dashboard" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin/dashboard'} className={activeTabText}>
            Dashboard
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to="/admin-orders" className={tabIconStatus}>
            <FaShoppingBag title="All Orders" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin-orders'} className={activeTabText}>
            All Orders
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/admin-shops'} className={tabIconStatus}>
            <FaShopSlash title="All Shops" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin-shops'} className={activeTabText}>
            All Shops
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/admin-users'} className={tabIconStatus}>
            <FaUsers title="Products" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin-users'} className={activeTabText}>
            All Users
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/admin-products'} className={tabIconStatus}>
            <FaProductHunt title="Products" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin-products'} className={activeTabText}>
            All Products
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/admin-events'} className={tabIconStatus}>
            <MdLocalOffer title="Events" className="admin-icon" />
          </NavLink>

          <NavLink to={'/admin-events'} className={activeTabText}>
            All Events
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to="/admin-withdraw-request" className={tabIconStatus}>
            <BiMoneyWithdraw title="Withdraw Money" className="admin-icon" />{' '}
          </NavLink>

          <NavLink to="/admin-withdraw-request" className={activeTabText}>
            Withdraw Request
          </NavLink>
        </li>

        <li className="admin-dashboard-sidebar-item">
          <NavLink to={'/profile'} className={tabIconStatus}>
            <IoSettings title="Settings" className="admin-icon" />
          </NavLink>

          <NavLink to={'/profile'} className={activeTabText}>
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
