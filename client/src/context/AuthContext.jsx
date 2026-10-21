import { createContext, useContext, useState, useCallback } from 'react';

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

  const login = useCallback((email, password) => {
    // Simulated authentication — replace with real API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }
        const userData = {
          id: crypto.randomUUID(),
          email,
          firstName: email.split('@')[0].split('.')[0],
          lastName: email.split('@')[0].split('.')[1] || '',
          role: 'HR Recruiter',
          avatar: null,
          loginAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('srs-auth-user', JSON.stringify(userData));
        resolve(userData);
      }, 800);
    });
  }, []);

  const register = useCallback((data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.email || !data.password) {
          reject(new Error('All fields are required'));
          return;
        }
        if (data.password !== data.confirmPassword) {
          reject(new Error('Passwords do not match'));
          return;
        }
        const userData = {
          id: crypto.randomUUID(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || 'HR Recruiter',
          company: data.company || '',
          avatar: null,
          loginAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('srs-auth-user', JSON.stringify(userData));
        resolve(userData);
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('srs-auth-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
