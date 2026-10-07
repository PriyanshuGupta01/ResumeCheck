import React, { createContext, useContext, useState, useEffect } from 'react';
import { authGetMe, authLogin, authSignUp, authLogout } from '../api';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await authGetMe();
      if (res.ok && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const res = await authLogin(email, password);
    if (res.ok && res.data) {
      setUser(res.data);
      return { ok: true };
    }
    return { ok: false, error: res.error || 'Login failed' };
  };

  const signup = async (email, password) => {
    const res = await authSignUp(email, password);
    if (res.ok && res.data) {
      setUser(res.data);
      return { ok: true };
    }
    return { ok: false, error: res.error || 'Sign up failed' };
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
