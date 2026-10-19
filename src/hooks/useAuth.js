// useAuth Hook
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as authService from '../services/firebase/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// useAuthState Hook
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(
      user => {
        setUser(user);
        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { user, loading, error };
};

// useSignIn Hook
export const useSignIn = () => {
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (context && context.signIn) {
        const user = await context.signIn(email, password);
        return user;
      }
      const user = await authService.signin(email, password);
      return user;
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'User not found'
        : err.code === 'auth/wrong-password'
        ? 'Wrong password'
        : err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
};

// useSignUp Hook
export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.signup(email, password, displayName);
      return user;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
};

// useLogout Hook
export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
