import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [buyerAuth, setBuyerAuth] = useState({
    isAuthenticated: false,
    token: null,
    uid: null,
    name: null,
  });

  const [sellerAuth, setSellerAuth] = useState({
    isAuthenticated: false,
    token: null,
    uid: null,
    name: null,
  });

  // Check for existing tokens on mount
  useEffect(() => {
    const buyerToken = localStorage.getItem('buyer_token');
    const buyerUid = localStorage.getItem('buyer_uid');
    const buyerName = localStorage.getItem('buyer_name');

    if (buyerToken && buyerUid) {
      setBuyerAuth({
        isAuthenticated: true,
        token: buyerToken,
        uid: buyerUid,
        name: buyerName,
      });
    }

    const sellerToken = localStorage.getItem('seller_token');
    const sellerUid = localStorage.getItem('seller_uid');
    const sellerName = localStorage.getItem('seller_name');

    if (sellerToken && sellerUid) {
      setSellerAuth({
        isAuthenticated: true,
        token: sellerToken,
        uid: sellerUid,
        name: sellerName,
      });
    }
  }, []);

  const loginBuyer = (token, uid, name) => {
    localStorage.setItem('buyer_token', token);
    localStorage.setItem('buyer_uid', uid);
    localStorage.setItem('buyer_name', name);
    setBuyerAuth({
      isAuthenticated: true,
      token,
      uid,
      name,
    });
  };

  const loginSeller = (token, uid, name) => {
    localStorage.setItem('seller_token', token);
    localStorage.setItem('seller_uid', uid);
    localStorage.setItem('seller_name', name);
    setSellerAuth({
      isAuthenticated: true,
      token,
      uid,
      name,
    });
  };

  const logoutBuyer = () => {
    localStorage.removeItem('buyer_token');
    localStorage.removeItem('buyer_uid');
    localStorage.removeItem('buyer_name');
    setBuyerAuth({
      isAuthenticated: false,
      token: null,
      uid: null,
      name: null,
    });
  };

  const logoutSeller = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_uid');
    localStorage.removeItem('seller_name');
    setSellerAuth({
      isAuthenticated: false,
      token: null,
      uid: null,
      name: null,
    });
  };

  const value = {
    buyerAuth,
    sellerAuth,
    loginBuyer,
    loginSeller,
    logoutBuyer,
    logoutSeller,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
