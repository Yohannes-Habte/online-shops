import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch } from 'react-icons/fa';
import { RiArrowRightSLine } from 'react-icons/ri';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BsCart } from 'react-icons/bs';
import './Header.scss';
import axios from 'axios';
import DropDown from '../dropDown/DropDown';
import Navbar from '../navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import {
  userLogoutFailure,
  userLogoutStart,
  userLogoutSuccess,
} from '../../../redux/reducers/userReducer';
import WishList from '../../wishLists/wichList.jsx/WishList';
import Cart from '../../cart/cart/Cart';
import { API } from '../../../utils/security/secreteKey';

const Header = () => {
  const navigate = useNavigate();

  // Global state variables using redux
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);
  const { wishList } = useSelector((state) => state.wishList); 

  const dispatch = useDispatch();

  // Local state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Displaying product data
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products`);

        setAllProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProducts();
  }, []);

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set('searchItem', searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  //! If you want to display on the search bar what you write on url, you need to apply useEffect hook
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  // Log out user function
  const handleLogout = async () => {
    try {
      dispatch(userLogoutStart());
      const { data } = await axios.get(
        `${API}/auths/logout/${currentUser._id}`
      );

      dispatch(userLogoutSuccess());

      navigate('/login');
    } catch (error) {
      dispatch(userLogoutFailure(error.response.data.message));
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  // Handle on click for the search bar
  const handleClick = () => {
    setSearchTerm('');
    setSearchData('');
  };

  return (
    <header className="header">
      <section className="wrapper">
        <NavLink to={'/'}>
          <h1 className="logo">
            Lisa <span className="shopping">Shopping</span>
          </h1>
        </NavLink>

        {/* Search bar form */}
        <form onSubmit={handleSubmit} action="" className="search-form">
          <div className="input-container">
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="input-field"
            />
            <span className="input-highlight"></span>
          </div>

          <button className="search-btn">
            <FaSearch className="search-icon" />
          </button>

          {/* Search Results */}
          {searchData && searchData.length !== 0 ? (
            <article className="search-results">
              {searchData &&
                searchData.map((product) => {
                  return (
                    <h3
                      onClick={handleClick}
                      key={product._id}
                      className="subTitle"
                    >
                      <Link to={`/products/${product._id}`}>
                        {product.name}
                      </Link>
                    </h3>
                  );
                })}
            </article>
          ) : null}
        </form>

        {/* Become Seller */}
        <article className="become-seller">
          <Link
            to={currentSeller ? '/dashboard' : '/login-shop'}
            className="link"
          >
            <h3 className="sub-title">
              {currentSeller ? 'Shop Dashboard' : 'Create Online Shop'}
            </h3>
          </Link>
          <RiArrowRightSLine className="icon" />
        </article>
      </section>

      {/* Navbar */}
      <div className="navbar-cart-user-wrapper">
        {/* All categories */}
        <div action="" className="categories">
          <FaBars onClick={() => setDropDown(!dropDown)} className="top-icon" />

          <button className="btn">All Categories</button>
          <MdKeyboardArrowDown
            onClick={() => setDropDown(!dropDown)}
            className="bottom-icon"
          />

          {dropDown ? (
            <DropDown products={allProducts} setDropDown={setDropDown} />
          ) : null}
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
                <img
                  className="image"
                  src={currentUser.image}
                  alt="Profile"
                  onClick={() => setOpenUser(!openUser)}
                />

                {openUser && (
                  <ul className="user-history">
                    <li className="list-item">
                      <NavLink to={`/profile`} className={'link'}>
                        User Profile
                      </NavLink>
                    </li>

                    {currentSeller && (
                      <li className="list-item">
                        <NavLink to={`/dashboard`} className={'link'}>
                          Shop Dashboard
                        </NavLink>
                      </li>
                    )}

                    <li onClick={handleLogout} className="list-item">
                      User Log Out
                    </li>
                  </ul>
                )}
              </React.Fragment>
            ) : (
              <Link to={'/login'} className="link">
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
