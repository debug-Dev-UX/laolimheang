// src/services/authService.js
// Firebase Authentication service layer

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

/**
 * Sign in admin with email and password
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    const messages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
      "auth/user-disabled": "This account has been disabled.",
    };
    return {
      user: null,
      error: messages[error.code] || "Login failed. Please try again.",
    };
  }
};

/**
 * Sign out the current user
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: "Logout failed." };
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = () => auth.currentUser;

/**
 * Create/update user document in Firestore
 */
export const upsertUserDoc = async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || "Admin",
      role: "admin",
      createdAt: serverTimestamp(),
    });
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: "Failed to send reset email." };
  }
};