import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from '../../../components/shop/createShop/CreateShop';

const CreateNewShop = () => {
  const navigate = useNavigate();
  const { currentSeller } = useSelector((state) => state.seller);

  // If seller is logged in, seller will not see the shop login page
  useEffect(() => {
    if (currentSeller) {
      navigate(`/shop/${currentSeller._id}`);
    }
  }, [navigate, currentSeller]);

  return <ShopCreate />;
};

export default CreateNewShop;
