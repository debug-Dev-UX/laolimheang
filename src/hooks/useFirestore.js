// useFirestore Hook
import { useState, useCallback } from 'react';
import * as firestoreService from '../services/firebase/firestore';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCollection = useCallback(async (constraints = []) => {
    setLoading(true);
    setError(null);
    try {
      const result = await firestoreService.getCollection(collectionName, constraints);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const addDoc = useCallback(async (docData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await firestoreService.addDocument(collectionName, docData);
      setData(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const updateDoc = useCallback(async (docId, docData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await firestoreService.updateDocument(collectionName, docId, docData);
      setData(prev => prev.map(item => item.id === docId ? { ...item, ...result } : item));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const deleteDoc = useCallback(async (docId) => {
    setLoading(true);
    setError(null);
    try {
      await firestoreService.deleteDocument(collectionName, docId);
      setData(prev => prev.filter(item => item.id !== docId));
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return { data, loading, error, getCollection, addDoc, updateDoc, deleteDoc };
};
