import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fk_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fk_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fk_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password, phone });
      setUser(data);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fk_user');
  };

  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put('/api/auth/profile', userData, config);
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
