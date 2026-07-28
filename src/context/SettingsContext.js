// Settings Context
import React, { createContext, useState, useEffect } from 'react';
import { getCollection } from '../services/firebase/firestore';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'LaolimHeang',
    description: 'Premium Professional Portfolio',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getCollection('settings');
      if (result && result.length > 0) {
        setSettings(result[0]);
      }
    } catch (err) {
      setError(err);
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    error,
    refreshSettings: loadSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
