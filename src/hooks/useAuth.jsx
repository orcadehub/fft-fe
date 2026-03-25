import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import api, { API_BASE_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ff_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('ff_token');
      const storedUser = localStorage.getItem('ff_user');

      if (storedToken) {
        setToken(storedToken);
        // Load from local storage first to prevent logout
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch(e) {}
        }

        try {
          const res = await api.get('/api/auth/profile');
          setUser(res.data);
          localStorage.setItem('ff_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Profile refresh failed:', err.response?.status, err.message);
          // Background refresh failed, but we keep the current localStorage user
          // We won't force logout here to prevent refresh-logouts.
        }
      }
      setLoading(false);
    };
    checkUser();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'ff_user') {
        const updated = JSON.parse(e.newValue);
        setUser(updated);
      }
      if (e.key === 'ff_token' && !e.newValue) {
        logout();
      }
    });
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    
    console.log(`[Socket] Connecting to ${API_BASE_URL} for User: ${user._id}`);
    const socket = io(API_BASE_URL);
    
    socket.emit('join_user', user._id);

    socket.on('wallet_balance_update', (newBalance) => {
      console.log('[Socket] Real-time wallet update:', newBalance);
      setUser(prev => {
        const updated = { ...prev, walletBalance: newBalance };
        localStorage.setItem('ff_user', JSON.stringify(updated));
        return updated;
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket Error]', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const login = async (ffUid, password) => {
    try {
      const res = await api.post('/api/auth/login', { ffUid, password });
      const { token, user: userData } = res.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('ff_token', token);
      localStorage.setItem('ff_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (ffUid, password, inGameName, level) => {
    try {
      const res = await api.post('/api/auth/register', { 
        ffUid, 
        password,
        inGameName,
        level
      });
      const { token, user: userData } = res.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('ff_token', token);
      localStorage.setItem('ff_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    // Use window.location as the surest way to reset all state and navigate
    window.location.href = '/'; 
  };

  const updateUserWallet = (newBalance) => {
    setUser(prev => {
      const updated = { ...prev, walletBalance: newBalance };
      localStorage.setItem('ff_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUserWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
