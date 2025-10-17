import axios from "axios";

// Use environment variable for backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"; 

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
