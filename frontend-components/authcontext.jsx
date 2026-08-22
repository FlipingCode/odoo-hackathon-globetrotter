import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(null);
const API_BASE_URL = 'http://localhost:5000/api';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('globetrotter_token') || null);
  const [loading, setLoading] = useState(true);
  // Configure axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('globetrotter_token', token);
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('globetrotter_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/profile`);
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };
  // Login
  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };
  // Signup / Register
  const register = async (name, email, password, preferred_currency = 'USD') => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
      preferred_currency
    });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };
  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('globetrotter_token');
    delete axios.defaults.headers.common['Authorization'];
  };
  // Update Profile
  const updateProfile = async (updates) => {
    const res = await axios.put(`${API_BASE_URL}/auth/profile`, updates);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      return res.data;
    }
  };
  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return res.data;
  };
  // Reset Password
  const resetPassword = async (email, reset_code, new_password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      email,
      reset_code,
      new_password
    });
    return res.data;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        refreshProfile: fetchUserProfile
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
