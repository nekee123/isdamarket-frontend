import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { buyerAuth, sellerAuth } = useAuth();

  if (userType === 'buyer') {
    return buyerAuth.isAuthenticated ? children : <Navigate to="/buyer-login" replace />;
  }

  if (userType === 'seller') {
    return sellerAuth.isAuthenticated ? children : <Navigate to="/seller-login" replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
