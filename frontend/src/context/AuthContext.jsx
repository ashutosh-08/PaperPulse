import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

/**
 * Authentication Context Provider for the PaperPulse React SPA.
 * Manages user state and JWT token persistence in localStorage.
 * 
 * @param {children} React nodes comprising the children elements.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hydrates user state from localStorage on application load.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Authenticates a retailer and stores the JWT securely in localStorage.
   * 
   * @param {string} email - User email address.
   * @param {string} password - User password.
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login Failed' };
    }
  };

  /**
   * Purges the authentication session and clears sensitive data from storage.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
