import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { type, message } = response.data;
      if (type === "Successfully" && message?.token) {
        setToken(message.token);
        setUser(message.user);
        localStorage.setItem("user", JSON.stringify(message.user));
        return { success: true };
      }
      return { success: false, error: response.data.message || "Error al iniciar sesión" };
    } catch (error) {
      let message = "Error al conectar con el servidor";
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          message = error.response.data.message[0].message;
        } else {
          message = error.response.data.message;
        }
      }
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);