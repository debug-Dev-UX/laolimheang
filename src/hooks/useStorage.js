// useStorage Hook
import { useState, useCallback } from 'react';
import * as storageService from '../services/firebase/storage';

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (folderPath, file) => {
    setLoading(true);
    setError(null);
    try {
      const fileName = storageService.generateUniqueFileName(file.name);
      const result = await storageService.uploadFile(folderPath, fileName, file);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (filePath) => {
    setLoading(true);
    setError(null);
    try {
      await storageService.deleteFile(filePath);
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileURL = useCallback(async (filePath) => {
    setLoading(true);
    setError(null);
    try {
      const url = await storageService.getFileURL(filePath);
      return url;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadFile, deleteFile, getFileURL, loading, error };
};
