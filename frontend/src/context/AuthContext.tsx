import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setTokenState(stored);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, [token]);

  const setToken = (token: string | null) => {
    setTokenState(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  const logout = () => setToken(null);

  let isTeacher = false;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      isTeacher = Boolean(decoded.is_teacher);
    } catch {
      isTeacher = false;
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token, isTeacher, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
