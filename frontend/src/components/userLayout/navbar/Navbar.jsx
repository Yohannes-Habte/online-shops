import React, { useState } from 'react';
import './Navbar.scss';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const Navbar = () => {
  // Local state variables
  const [openNavbar, setOpenNavbar] = useState(false);

  const onClick = () => {
    setOpenNavbar(!openNavbar);
  };

  // Active NavLink styling
  const activeLink = ({ isActive }) => (isActive ? `active` : 'not-active');
  return (
    <nav className="navbar">
      {/* Navbar items*/}
      <ul
        className={
          openNavbar ? 'navbar-menu active-navbar-menu' : 'navbar-menu'
        }
      >
        <li className="list-item">
          <NavLink className={activeLink} to={'/'}>
            Home
          </NavLink>
        </li>

        <li className="list-item">
          <NavLink className={activeLink} to={'/best-sellings'}>
            Best Selling
          </NavLink>
        </li>

        <li className="list-item">
          <NavLink className={activeLink} to={'/products'}>
            Products
          </NavLink>
        </li>

        <li className="list-item">
          <NavLink className={activeLink} to={'/events'}>
            Events
          </NavLink>
        </li>

        <li className="list-item">
          <NavLink className={activeLink} to={'/contact'}>
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Screen size management */}
      <span onClick={onClick} className="icon-screen-size-handler-wrapper">
        {openNavbar ? (
          <MdClose className="close-menu-icon" />
        ) : (
          <FaBars className="open-menu-icon" />
        )}
      </span>
    </nav>
  );
};

export default Navbar;
