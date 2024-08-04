import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  // Global state variables

  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

export default AdminProtectedRoute;
