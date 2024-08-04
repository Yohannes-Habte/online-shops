import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { MdEmail } from 'react-icons/md';
import './ShopPassword.scss';
import { useDispatch, useSelector } from 'react-redux';
import { validEmail } from '../../../utils/validators/Validate.js';
import { API } from '../../../utils/security/secreteKey.js';

const ShopForgotpassword = () => {
  const navigate = useNavigate();
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  // If user is logged in, uer will not access the forgot password page
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [navigate, currentUser]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    try {
      const { data } = await axios.post(`${API}/shops/shop-forgot-password`, {
        email,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <main className="password-page">
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <section className="password-page-container">
        <h1 className="title">Forget Password</h1>
        <form onSubmit={handleSubmit} action="" className="form">
          <div className="input-container">
            <MdEmail className="icon" />

            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="input-field"
            />

            <label htmlFor="email" className="input-label">
              Email Address
            </label>

            <span className="input-highlight"></span>
          </div>

          <button className="password-btn">Submit</button>
        </form>
      </section>
    </main>
  );
};

export default ShopForgotpassword;
