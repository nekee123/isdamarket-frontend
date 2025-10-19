import axios from "axios";

// Use environment variable for backend URL
import { BASE_URL } from "../config/api"; 

// === Products ===
export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/products/`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// === Orders ===
export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders/`, orderData);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
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
