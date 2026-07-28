// src/services/settingsService.js
// Site-wide settings stored in Firestore settings/main

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const SETTINGS_DOC = "main";
const COLLECTION = "settings";

// Default settings used if none exist in Firestore
export const DEFAULT_SETTINGS = {
  siteName: "LaolimHeang",
  tagline: "Full Stack Developer & Digital Architect",
  email: "hello@laolimheang.com",
  phone: "+855 12 345 678",
  location: "Phnom Penh, Cambodia",
  telegramUsername: "@laolimheang",
  logoUrl: "",
  socialLinks: {
    github: "https://github.com/laolimheang",
    linkedin: "https://linkedin.com/in/laolimheang",
    twitter: "https://twitter.com/laolimheang",
    instagram: "https://instagram.com/laolimheang",
    facebook: "https://facebook.com/laolimheang",
  },
  seo: {
    title: "LaolimHeang — Portfolio & Digital Services",
    description:
      "Full Stack Developer specializing in modern web applications, 3D experiences, and digital solutions.",
    keywords: "web developer, portfolio, react, firebase, fullstack, Cambodia",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} LaolimHeang. All rights reserved.`,
    text: "Crafted with passion in Phnom Penh, Cambodia.",
  },
};

/**
 * Get site settings from Firestore
 */
export const getSettings = async () => {
  try {
    const ref = doc(db, COLLECTION, SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...snap.data() };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("getSettings:", error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Update site settings in Firestore
 */
export const updateSettings = async (data) => {
  try {
    const ref = doc(db, COLLECTION, SETTINGS_DOC);
    await setDoc(
      ref,
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return { error: null };
  } catch (error) {
    console.error("updateSettings:", error);
    return { error: "Failed to update settings." };
  }
};