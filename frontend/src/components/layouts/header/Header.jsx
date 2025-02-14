import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsCart } from "react-icons/bs";
import "./Header.scss";
import DropDown from "../../userLayout/dropDown/DropDown";
import Navbar from "../navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import WishList from "../../wishLists/wichList.jsx/WishList";
import Cart from "../../cart/cart/Cart";
import Logout from "../../../utils/globalFunctions/Logout";
import { fetchUser } from "../../../redux/actions/user";

const Header = () => {
  // Global state variables using redux
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishList } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();
  const { signOut } = Logout();

  // Local state variables
  const [dropDown, setDropDown] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="header">
      <section className="wrapper">
        <NavLink to={"/"}>
          <h1 className="logo">
            Lisa <span className="shopping">Shopping</span>
          </h1>
        </NavLink>

        {/* Become Seller */}
        <article className="become-seller">
          <Link
            to={currentSeller ? "/shop/dashboard" : "/shop/login"}
            className="link"
          >
            <h3 className="sub-title">
              {currentSeller ? "Shop Dashboard" : "Login Seller"}
            </h3>
          </Link>
        </article>
      </section>

      {/* Navbar */}
      <div className="navbar-cart-user-wrapper">
        {/* All categories */}
        <div action="" className="categories">
          <p className="select-category">Select Category</p>
          <MdKeyboardArrowDown
            onClick={() => setDropDown(!dropDown)}
            className="bottom-icon"
          />
          {dropDown ? <DropDown setDropDown={setDropDown} /> : null}
        </div>

        {/* Navbar Component*/}
        <Navbar />

        {/* Wish list, Cart and Logged in User*/}
        <div className="wish-list-cart-user-wrapper">
          {/* Wish List Popup */}
          <div
            onClick={() => setOpenWishList(true)}
            className="wishlist-wrapper"
          >
            <AiOutlineHeart className="icon" />

            <span className="wishlist-item">
              {wishList && wishList.length !== 0 && wishList.length}
            </span>
          </div>

          {/* Cart Popup */}
          <div className="cart-wrapper">
            <BsCart onClick={() => setOpenCart(true)} className="icon" />

            <span className="cart-item">
              {cart.length > 0 && cart.reduce((acc, curr) => acc + curr.qty, 0)}
            </span>
          </div>

          {/* Logged in user details */}
          <div className="logged-in-user">
            {currentUser ? (
              <React.Fragment>
                <figure className="user-image-container">
                  <img
                    className="image"
                    src={currentUser.image}
                    alt="Profile"
                    onClick={() => setOpenUser(!openUser)}
                  />
                  <figcaption>{currentUser.name.split(" ")[0]}</figcaption>
                </figure>

                {openUser && (
                  <ul className="user-history">
                    <li className="list-item">
                      <NavLink to={`/profile`} className={"link"}>
                        Profile
                      </NavLink>
                    </li>

                    {currentUser && currentUser.role === "admin" && (
                      <li className="list-item">
                        <NavLink to={`/admin/dashboard`} className={"link"}>
                          Admin Dashboard
                        </NavLink>
                      </li>
                    )}

                    {currentUser && currentUser.role === "seller" && (
                      <li className="list-item">
                        <NavLink to={`/shop/dashboard`} className={"link"}>
                          Shop Dashboard
                        </NavLink>
                      </li>
                    )}

                    <li onClick={handleLogout} className="list-item">
                      Log Out
                    </li>
                  </ul>
                )}
              </React.Fragment>
            ) : (
              <Link to={"/login"} className="link">
                <BiUserCircle className="icon" />
              </Link>
            )}
          </div>

          {/* Open cart and open wish list */}

          {openWishList ? <WishList setOpenWishList={setOpenWishList} /> : null}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
