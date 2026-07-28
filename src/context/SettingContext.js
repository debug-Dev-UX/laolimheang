// src/context/SettingsContext.jsx
// Site-wide settings context — loads from Firestore on mount

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettings, DEFAULT_SETTINGS } from "../services/settingsService";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
      // Update document title
      if (s.seo?.title) document.title = s.seo.title;
    });
  }, []);

  const refreshSettings = async () => {
    const s = await getSettings();
    setSettings(s);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

export default SettingsContext;