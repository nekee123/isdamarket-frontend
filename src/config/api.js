// API Configuration
// This file centralizes API URL configuration and provides fallback handling

const getApiUrl = () => {
  // First, try to get from environment variable
  const envUrl = process.env.REACT_APP_API_URL;
  
  if (envUrl) {
    console.log('Using API URL from environment:', envUrl);
    return envUrl;
  }
  
  // Fallback for production if environment variable is not set
  if (process.env.NODE_ENV === 'production') {
    const productionUrl = 'https://isdamarket-3.onrender.com';
    console.warn('REACT_APP_API_URL not set, using production fallback:', productionUrl);
    return productionUrl;
  }
  
  // Fallback for development
  const devUrl = 'http://localhost:8000';
  console.warn('REACT_APP_API_URL not set, using development fallback:', devUrl);
  return devUrl;
};

export const BASE_URL = getApiUrl();

// Helper function for API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log('API Call:', url);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return response;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default BASE_URL;
