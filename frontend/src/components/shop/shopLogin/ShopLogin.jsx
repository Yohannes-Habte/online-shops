import { React, useState } from 'react';
import './ShopLogin.scss';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { HiOutlineEye } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSellerFailure,
  loginSellerStart,
  loginSellerSuccess,
} from '../../../redux/reducers/sellerReducer';
import { validEmail, validPassword } from '../../../utils/validators/Validate';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';
import ButtonLoader from '../../../utils/loader/ButtonLoader';

const ShopLogin = () => {
  const navigate = useNavigate();

  // Global state variales
  const { loading, error, currentSeller } = useSelector(
    (state) => state.seller
  );
  const dispatch = useDispatch();

  // Local state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to show/hide password
  const displayPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Update input data
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  // Reset all state variables for the login form
  const reset = () => {
    setEmail('');
    setPassword('');
  };

  // Hanlde submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    if (!validPassword(password)) {
      return toast.error(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }

    try {
      dispatch(loginSellerStart());
      // The body
      const loginUser = {
        email: email,
        password: password,
      };
      const { data } = await axios.post(`${API}/shops/login-shop`, loginUser);

      dispatch(loginSellerSuccess(data.shop));
      // Reset
      reset();
    } catch (error) {
      dispatch(loginSellerFailure(error.response.data.message));
    }
  };

  return (
    <section className="shop-login-wrapper">
      <h2 className="title">Log in to your shop</h2>

      {error ? <p className="error-message"> {error} </p> : null}

      <form className="seller-login-form" onSubmit={handleSubmit}>
        <figure className="image-container">
          <img
            className="image"
            src={
              currentSeller
                ? currentSeller.image
                : 'https://i.ibb.co/4pDNDk1/avatar.png'
            }
            alt="Profile"
          />
        </figure>
        <p className="seller-name">
          {currentSeller ? currentSeller.name : 'Shop Profile'}{' '}
        </p>
        {/* email */}
        <div className="input-container">
          <MdEmail className="icon" />
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            value={email}
            onChange={updateChange}
            placeholder="Enter Email"
            className="input-field"
          />
          <label htmlFor="email" className="input-label">
            Email address
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* password */}
        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={updateChange}
            placeholder="Enter Password"
            className="input-field"
          />
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <span className="input-highlight"></span>
          <span onClick={displayPassword} className="password-display">
            {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
          </span>
        </div>

        <div className="keep-me-login--and-forgot-password-wrapper">
          <div className="keep-me-login-wrapper">
            <input type="checkbox" name="login" className="login-checkbox" />
            <span className="keep-me-login">Keep me login</span>
          </div>

          <div className="forgot-password-wrapper">
            <Link className="link" to={'/shop-forgot-password'}>
              Forgot your password?
            </Link>
          </div>
        </div>

        <button type="submit" disabled={loading} className="shop-login-button">
          {loading && <ButtonLoader />}
          {loading && <span>Loading...</span>}
          {!loading && <span>Log In</span>}
        </button>

        <p className="haveNoAccount">
          Don't have an account?
          <NavLink to="/create-shop" className={'link'}>
            Sign Up
          </NavLink>
        </p>
      </form>
    </section>
  );
};

export default ShopLogin;
