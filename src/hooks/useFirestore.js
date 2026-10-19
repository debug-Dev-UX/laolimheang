// useFirestore Hook with Live Multi-Device Real-Time Synchronization
import { useState, useEffect, useCallback, useRef } from 'react';
import * as firestoreService from '../services/firebase/firestore';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set up live real-time WebSocket listener across all devices
  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
    const unsubscribe = firestoreService.subscribeToCollection(collectionName, (realtimeDocs) => {
      if (isMountedRef.current) {
        setData(realtimeDocs || []);
        setLoading(false);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [collectionName]);

  const getCollection = useCallback(async (constraints = []) => {
    setLoading(true);
    setError(null);
    try {
      const result = await firestoreService.getCollection(collectionName, constraints);
      if (isMountedRef.current) {
        setData(result || []);
      }
      return result || [];
    } catch (err) {
      console.warn(`useFirestore [${collectionName}]:`, err?.message || err);
      if (isMountedRef.current) {
        setError(err);
      }
      return [];
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [collectionName]);

  const addDoc = useCallback(async (docData) => {
    setError(null);
    try {
      const result = await firestoreService.addDocument(collectionName, docData);
      if (isMountedRef.current) {
        setData(prev => [result, ...prev.filter(item => item.id !== result.id)]);
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) setError(err);
      throw err;
    }
  }, [collectionName]);

  const updateDoc = useCallback(async (docId, docData) => {
    setError(null);
    try {
      const result = await firestoreService.updateDocument(collectionName, docId, docData);
      if (isMountedRef.current) {
        setData(prev => prev.map(item => item.id === docId ? { ...item, ...result } : item));
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) setError(err);
      throw err;
    }
  }, [collectionName]);

  const deleteDoc = useCallback(async (docId) => {
    setError(null);
    try {
      await firestoreService.deleteDocument(collectionName, docId);
      if (isMountedRef.current) {
        setData(prev => prev.filter(item => item.id !== docId));
      }
      return true;
    } catch (err) {
      if (isMountedRef.current) setError(err);
      throw err;
    }
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    getCollection,
    fetchData: getCollection,
    addDoc,
    updateDoc,
    deleteDoc,
    // Aliases for admin modules
    add: addDoc,
    update: updateDoc,
    remove: deleteDoc,
  };
};
