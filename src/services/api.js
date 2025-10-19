import axios from "axios";

// Use environment variable for backend URL
import { BASE_URL } from "../config/api"; 

// Simple in-memory cache
const cache = {
  products: { data: null, timestamp: null },
  orders: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

// === Products ===
export const getAllProducts = async (useCache = true) => {
  try {
    // Check cache first
    if (useCache && isCacheValid(cache.products.timestamp)) {
      console.log('Using cached products');
      return cache.products.data;
    }

    console.log('Fetching fresh products from API');
    const res = await axios.get(`${BASE_URL}/products/`);
    
    // Update cache
    cache.products = {
      data: res.data,
      timestamp: Date.now(),
    };
    
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return cached data if available, even if stale
    if (cache.products.data) {
      console.log('API failed, using stale cache');
      return cache.products.data;
    }
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getProductsBySeller = async (sellerUid) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/seller/${sellerUid}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

// === Orders ===
export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders/`, orderData);
    // Invalidate orders cache
    delete cache.orders[orderData.buyer_uid];
    delete cache.orders[orderData.seller_uid];
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByBuyer = async (buyerUid, useCache = true) => {
  try {
    const cacheKey = `buyer_${buyerUid}`;
    
    if (useCache && cache.orders[cacheKey] && isCacheValid(cache.orders[cacheKey].timestamp)) {
      console.log('Using cached buyer orders');
      return cache.orders[cacheKey].data;
    }

    console.log('Fetching buyer orders from API');
    const res = await axios.get(`${BASE_URL}/orders/buyer/${buyerUid}`);
    
    cache.orders[cacheKey] = {
      data: res.data,
      timestamp: Date.now(),
    };
    
    return res.data;
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    if (cache.orders[`buyer_${buyerUid}`]?.data) {
      return cache.orders[`buyer_${buyerUid}`].data;
    }
    return [];
  }
};

export const getOrdersBySeller = async (sellerUid, useCache = true) => {
  try {
    const cacheKey = `seller_${sellerUid}`;
    
    if (useCache && cache.orders[cacheKey] && isCacheValid(cache.orders[cacheKey].timestamp)) {
      console.log('Using cached seller orders');
      return cache.orders[cacheKey].data;
    }

    console.log('Fetching seller orders from API');
    const res = await axios.get(`${BASE_URL}/orders/seller/${sellerUid}`);
    
    cache.orders[cacheKey] = {
      data: res.data,
      timestamp: Date.now(),
    };
    
    return res.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    if (cache.orders[`seller_${sellerUid}`]?.data) {
      return cache.orders[`seller_${sellerUid}`].data;
    }
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.put(`${BASE_URL}/orders/${orderId}`, { status });
    // Invalidate all order caches
    cache.orders = {};
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// === Messages ===
export const getMessages = async (user1_uid, user2_uid) => {
  try {
    const res = await axios.get(`${BASE_URL}/messages/${user1_uid}/${user2_uid}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const res = await axios.post(`${BASE_URL}/messages/`, messageData);
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getConversations = async (user_uid) => {
  try {
    const res = await axios.get(`${BASE_URL}/messages/conversations/${user_uid}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

// === Cache Management ===
export const clearCache = () => {
  cache.products = { data: null, timestamp: null };
  cache.orders = {};
  console.log('Cache cleared');
};

export const invalidateProductsCache = () => {
  cache.products = { data: null, timestamp: null };
};

export const invalidateOrdersCache = (userUid = null) => {
  if (userUid) {
    delete cache.orders[`buyer_${userUid}`];
    delete cache.orders[`seller_${userUid}`];
  } else {
    cache.orders = {};
  }
};
