const API_BASE_URL = 'http://localhost:2323/api';

export const API_ENDPOINTS = {
  CUSTOMERS: {
    LIST: `${API_BASE_URL}/customers`,
    GET: (id) => `${API_BASE_URL}/customers/${id}`,
    CREATE: `${API_BASE_URL}/customers`,
    UPDATE: (id) => `${API_BASE_URL}/customers/${id}`,
    DELETE: (id) => `${API_BASE_URL}/customers/${id}`,
  },
  UPLOAD: {
    IMAGE: (category) => `${API_BASE_URL}/upload/${category}`,
  },
};

export default API_ENDPOINTS; 