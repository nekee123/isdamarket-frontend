import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { buyerAuth, sellerAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Give AuthContext time to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show nothing while checking auth
  if (isChecking) {
    return null;
  }

  if (userType === 'buyer') {
    return buyerAuth.isAuthenticated ? children : <Navigate to="/buyer-login" replace />;
  }

  if (userType === 'seller') {
    return sellerAuth.isAuthenticated ? children : <Navigate to="/seller-login" replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
