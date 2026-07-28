// Firebase Authentication Methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';

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
export const signin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then(result => result.user);
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
