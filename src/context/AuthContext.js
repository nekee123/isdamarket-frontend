import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { preloadCriticalRoutes } from '../utils/preloadRoutes';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log('🔐 AuthProvider rendering');
  
  const [buyerAuth, setBuyerAuth] = useState({
    isAuthenticated: false,
    token: null,
    uid: null,
    name: null,
    profile_picture: null,
  });

  const [sellerAuth, setSellerAuth] = useState({
    isAuthenticated: false,
    token: null,
    uid: null,
    name: null,
    profile_picture: null,
  });

  // Check for existing tokens on mount
  useEffect(() => {
    console.log('🔍 AuthProvider: Checking localStorage for tokens...');
    const buyerToken = localStorage.getItem('buyer_token');
    const buyerUid = localStorage.getItem('buyer_uid');
    const buyerName = localStorage.getItem('buyer_name');
    const buyerProfilePicture = localStorage.getItem('buyer_profile_picture');

    if (buyerToken && buyerUid) {
      setBuyerAuth({
        isAuthenticated: true,
        token: buyerToken,
        uid: buyerUid,
        name: buyerName,
        profile_picture: buyerProfilePicture,
      });
      // Preload buyer routes for faster navigation
      preloadCriticalRoutes('buyer');
    }

    const sellerToken = localStorage.getItem('seller_token');
    const sellerUid = localStorage.getItem('seller_uid');
    const sellerName = localStorage.getItem('seller_name');
    const sellerProfilePicture = localStorage.getItem('seller_profile_picture');

    if (sellerToken && sellerUid) {
      setSellerAuth({
        isAuthenticated: true,
        token: sellerToken,
        uid: sellerUid,
        name: sellerName,
        profile_picture: sellerProfilePicture,
      });
      // Preload seller routes for faster navigation
      preloadCriticalRoutes('seller');
    }
  }, []);

  const loginBuyer = (token, uid, name, profile_picture = null) => {
    localStorage.setItem('buyer_token', token);
    localStorage.setItem('buyer_uid', uid);
    localStorage.setItem('buyer_name', name);
    if (profile_picture) {
      localStorage.setItem('buyer_profile_picture', profile_picture);
    }
    setBuyerAuth({
      isAuthenticated: true,
      token,
      uid,
      name,
      profile_picture,
    });
    // Preload buyer routes for faster navigation
    preloadCriticalRoutes('buyer');
  };

  const loginSeller = (token, uid, name, profile_picture = null) => {
    localStorage.setItem('seller_token', token);
    localStorage.setItem('seller_uid', uid);
    localStorage.setItem('seller_name', name);
    if (profile_picture) {
      localStorage.setItem('seller_profile_picture', profile_picture);
    }
    setSellerAuth({
      isAuthenticated: true,
      token,
      uid,
      name,
      profile_picture,
    });
    // Preload seller routes for faster navigation
    preloadCriticalRoutes('seller');
  };

  const logoutBuyer = () => {
    localStorage.removeItem('buyer_token');
    localStorage.removeItem('buyer_uid');
    localStorage.removeItem('buyer_name');
    localStorage.removeItem('buyer_profile_picture');
    setBuyerAuth({
      isAuthenticated: false,
      token: null,
      uid: null,
      name: null,
      profile_picture: null,
    });
  };

  const logoutSeller = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_uid');
    localStorage.removeItem('seller_name');
    localStorage.removeItem('seller_profile_picture');
    setSellerAuth({
      isAuthenticated: false,
      token: null,
      uid: null,
      name: null,
      profile_picture: null,
    });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    buyerAuth,
    sellerAuth,
    loginBuyer,
    loginSeller,
    logoutBuyer,
    logoutSeller,
  }), [buyerAuth, sellerAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
