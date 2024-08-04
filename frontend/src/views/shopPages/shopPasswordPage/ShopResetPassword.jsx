import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLockPasswordFill } from 'react-icons/ri';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { HiOutlineEye } from 'react-icons/hi';
import './ShopPassword.scss';
import { useDispatch, useSelector } from 'react-redux';
import { validPassword } from '../../../utils/validators/Validate';
import { API } from '../../../utils/security/secreteKey';

const ShopResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  console.log('token=', token);

  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local variables
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If the user is logged in, user cannot access forget password page
  useEffect(() => {
    if (currentUser || !token) {
      navigate('/');
    }
  }, [navigate, currentUser, token]);

  // Function to show/hide password
  const displayPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Reset all state variables for the login form
  const reset = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  // Handle submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validPassword(password)) {
      return toast.error(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axios.patch(`${API}/shops/shop-reset-password/${token}`, {
        password,
        token,
      });
      navigate('/login');
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <main className="password-page">
      <Helmet>
        <title> Reset password </title>
      </Helmet>
      <section className="password-page-container">
        <h1 className="title">Reset Password</h1>

        <form onSubmit={submitHandler} action="" className="form">
          {/* Password */}
          <div className="input-container">
            <RiLockPasswordFill className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              //onBlur={checkPasswordFormat}
              placeholder="Enter New Password"
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

          {/* Password */}
          <div className="input-container">
            <RiLockPasswordFill className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              //onBlur={checkPasswordFormat}
              placeholder="Enter Confirm Password"
              className="input-field"
            />
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <span className="input-highlight"></span>
            <span onClick={displayPassword} className="password-display">
              {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
            </span>
          </div>

          <button className="password-btn"> Reset Password </button>
        </form>
      </section>
    </main>
  );
};

export default ShopResetPassword;
