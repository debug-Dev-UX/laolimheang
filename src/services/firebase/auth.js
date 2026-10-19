// Firebase Authentication Methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';

// Ensure user has valid Firebase credentials for rules enforcement
export const ensureFirebaseAuth = async () => {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous auth initialization notice:', err?.message || err);
    return null;
  }
};

// Sign Up
export const signup = (email, password, displayName = '') => {
  return createUserWithEmailAndPassword(auth, email, password).then(result => {
    if (displayName) {
      return updateProfile(result.user, { displayName }).then(() => result.user);
    }
    return result.user;
  });
};

// Sign In
export const signin = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.warn('Direct signin error, checking fallback signup or auth:', error?.code);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (createErr) {
      // If user exists or creation disabled, attach session credentials
      await ensureFirebaseAuth();
      throw error;
    }
  }
};

// Sign Out
export const logout = () => {
  return signOut(auth);
};

// Get Current User
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Listen to Auth State Changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get Current User Synchronously
export const getCurrentUserSync = () => {
  return auth.currentUser;
};

// Update User Profile
export const updateUserProfile = (displayName, photoURL = null) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  return updateProfile(user, {
    displayName,
    ...(photoURL && { photoURL }),
  });
};
