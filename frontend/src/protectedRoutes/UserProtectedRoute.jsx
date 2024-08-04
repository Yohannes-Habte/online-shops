import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  // Global state variables using redux
  const { loading, currentUser } = useSelector((state) => state.user);
  if (loading === false) {
    if (!currentUser) {
      return <Navigate to={'/login'} />;
    }
    return children;
  }
};

export default UserProtectedRoute;
