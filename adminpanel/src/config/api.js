const API_BASE_URL = 'http://localhost:2323/api';

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    GET_ME: `${API_BASE_URL}/auth/me`,
  },
  CUSTOMERS: {
    GET_ALL: `${API_BASE_URL}/customers`,
    GET_ONE: (id) => `${API_BASE_URL}/customers/${id}`,
    CREATE: `${API_BASE_URL}/customers`,
    UPDATE: (id) => `${API_BASE_URL}/customers/${id}`,
    DELETE: (id) => `${API_BASE_URL}/customers/${id}`,
    UPLOAD_PHOTOS: `${API_BASE_URL}/customers/upload-photos`,
  },
};

export default API_ENDPOINTS; 