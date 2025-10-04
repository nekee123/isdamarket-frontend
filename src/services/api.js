import axios from "axios";

// Replace with your FastAPI backend URL
const BASE_URL = "http://127.0.0.1:8000"; 

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
