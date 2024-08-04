import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShopLogin from '../../../components/shop/shopLogin/ShopLogin';

const ShopLoginPage = () => {
  const navigate = useNavigate();
  // Global state variables using redux
  const { currentSeller } = useSelector((state) => state.seller);

  // If seller is logged in, seller will not see the shop login page
  useEffect(() => {
    if (currentSeller) {
      navigate(`/shop/${currentSeller._id}`);
    }
  }, [navigate, currentSeller]);

  return (
    <main className="shop-login-page">
      <ShopLogin />
    </main>
  );
};

export default ShopLoginPage;
