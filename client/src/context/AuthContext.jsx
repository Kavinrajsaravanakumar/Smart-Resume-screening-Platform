import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('srs-auth-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate existing token on load
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('srs-auth-token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('srs-auth-user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or server unavailable:', err.message);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token } = res.data;
    setUser(userData);
    localStorage.setItem('srs-auth-token', token);
    localStorage.setItem('srs-auth-user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    if (!data.email || !data.password) {
      throw new Error('All fields are required');
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const res = await api.post('/auth/register', data);
    const { user: userData, token } = res.data;
    setUser(userData);
    localStorage.setItem('srs-auth-token', token);
    localStorage.setItem('srs-auth-user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('srs-auth-token');
    localStorage.removeItem('srs-auth-user');
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('srs-auth-user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
