import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

// Axios default configuration
axios.defaults.baseURL = 'http://localhost:2323/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Axios interceptor for adding token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor for handling token expiration and common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.AUTH.GET_ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      throw {
        success: false,
        message: error.response?.data?.message || 'İstifadəçi məlumatları yoxlanılarkən xəta baş verdi'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: 'Email və şifrə tələb olunur'
        };
      }

      // Validate email format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Düzgün email daxil edin'
        };
      }

      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (!token) {
        return {
          success: false,
          message: 'Server cavabında token tapılmadı'
        };
      }

      localStorage.setItem('token', token);
      await checkUser();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş zamanı xəta baş verdi'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Validate input
      if (!name || !email || !password) {
        return {
          success: false,
          message: 'Bütün sahələri doldurun'
        };
      }

      // Validate email format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Düzgün email daxil edin'
        };
      }

      // Validate password length
      if (password.length < 6) {
        return {
          success: false,
          message: 'Şifrə ən azı 6 simvol olmalıdır'
        };
      }

      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await checkUser();
        return { success: true };
      } else {
        return {
          success: false,
          message: 'Server cavabında token tapılmadı'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific errors
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || 'Qeydiyyat məlumatları yanlışdır'
        };
      }

      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'Bu email artıq istifadə olunub'
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 