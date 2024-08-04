import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const SellerProtectedRoute = ({ children }) => {
  // Global state variables
  const { loading, currentSeller } = useSelector((state) => state.seller);

  if (loading === false) {
    if (!currentSeller) {
      return <Navigate to={`/login-shop`} />;
    }
    return children;
  }
};

export default SellerProtectedRoute;
