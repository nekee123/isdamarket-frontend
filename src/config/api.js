// Simple API configuration for local development
const BASE_URL = '';  // Empty string because proxy handles it

const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  console.log(`API ${method}: ${url}`, options.body || '');

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('❌ Cannot connect to backend. Make sure:');
      console.error('1. Backend is running: uvicorn app.main:app --reload');
      console.error('2. Check terminal for "http://127.0.0.1:8000"');
      console.error('3. Try opening http://127.0.0.1:8000/docs in browser');
      throw new Error('Backend server is not running. Please start it.');
    }
    throw error;
  }
};

// API methods
const api = {
  get: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => 
    apiCall(endpoint, { ...options, method: 'POST', body: data }),
  put: (endpoint, data, options = {}) => 
    apiCall(endpoint, { ...options, method: 'PUT', body: data }),
  delete: (endpoint, options = {}) => 
    apiCall(endpoint, { ...options, method: 'DELETE' }),
};

export { api, BASE_URL };
export default api;