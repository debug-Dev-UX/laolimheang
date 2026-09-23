// Auth Context
import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/firebase/auth';
import { setAdminSession, clearAdminSession, getAdminSession } from '../utils/sessionCookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const existingSession = getAdminSession();
  const [user, setUser] = useState(existingSession || null);
  const [loading, setLoading] = useState(!existingSession);
  const [isAdmin, setIsAdmin] = useState(!!existingSession);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(authUser => {
      setUser(authUser);
      setIsAdmin(!!authUser);
      if (authUser) {
        setAdminSession(authUser);
      } else if (!existingSession) {
        clearAdminSession();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const authUser = await authService.signin(email, password);
      setUser(authUser);
      setIsAdmin(true);
      setAdminSession(authUser);
      return authUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAdmin(false);
      clearAdminSession();
    } catch (error) {
      clearAdminSession();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
