import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ChangePassword.scss';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { HiOutlineEye } from 'react-icons/hi';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  changeUserPasswordFilure,
  changeUserPasswordStart,
  changeUserPasswordSuccess,
} from '../../../redux/reducers/userReducer';
import { validEmail, validPassword } from '../../../utils/validators/Validate';
import { API } from '../../../utils/security/secreteKey';

const ChangePassword = () => {
  const navigate = useNavigate();
  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local state variables
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If user is logged in, uer will not see the login page
  useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
  }, [navigate, currentUser]);

  // Update input data
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'oldPassword':
        setOldPassword(e.target.value);
        break;
      case 'newPassword':
        setNewPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  // Function to show/hide password
  const displayPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Reset all state variables for the login form
  const resetVariables = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Submit logged in user Function
  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (!validPassword(oldPassword)) {
      return toast.error('Old password is invalid!');
    }

    if (!validPassword(newPassword)) {
      return toast.error(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }

    try {
      // dispatch(changeUserPasswordStart());
      // The body
      const changeUserpassword = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };
      const { data } = await axios.put(
        `${API}/auths/${currentUser._id}/change-user-password`,
        changeUserpassword
      );
      // dispatch(changeUserPasswordSuccess(data));
      toast.success(data);
      resetVariables();
    } catch (error) {
      // dispatch(changeUserPasswordFilure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };
  return (
    <section className="change-password">
      <h2 className="subTitle">Change Password</h2>
      <form onSubmit={passwordChangeHandler} action="" className="form">
        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="oldPassword"
            id="oldPassword"
            autoComplete="current-password"
            required
            value={oldPassword}
            onChange={updateChange}
            placeholder="Enter Old Password"
            className="input-field"
          />
          <label htmlFor="oldPassword" className="input-label">
            Old Password
          </label>
          <span className="input-highlight"></span>
          <span onClick={displayPassword} className="password-display">
            {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
          </span>
        </div>

        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            id="newPassword"
            autoComplete="current-password"
            required
            value={newPassword}
            onChange={updateChange}
            placeholder="Enter New Password"
            className="input-field"
          />
          <label htmlFor="password" className="input-label">
            New Password
          </label>
          <span className="input-highlight"></span>
          <span onClick={displayPassword} className="password-display">
            {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
          </span>
        </div>

        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="current-password"
            required
            value={confirmPassword}
            onChange={updateChange}
            placeholder="Confirm New Password"
            className="input-field"
          />
          <label htmlFor="confirmPassword" className="input-label">
            Confirm New Password
          </label>
          <span className="input-highlight"></span>
          <span onClick={displayPassword} className="password-display">
            {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
          </span>
        </div>

        <button className="change-password-btn">Submit</button>
      </form>
    </section>
  );
};

export default ChangePassword;
