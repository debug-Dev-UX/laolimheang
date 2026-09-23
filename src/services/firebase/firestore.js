// Firestore Database Methods
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

// GET: Fetch all documents from a collection
export const getCollection = async (collectionName, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`Firestore getCollection [${collectionName}] notice:`, error?.message || error);
    if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
      return [];
    }
    throw error;
  }
};

// GET: Fetch single document
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.warn(`Firestore getDocument [${collectionName}/${docId}] notice:`, error?.message || error);
    if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
      return null;
    }
    throw error;
  }
};

// GET: Fetch documents by field
export const getDocumentsByField = async (collectionName, field, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`Firestore getDocumentsByField [${collectionName}] notice:`, error?.message || error);
    if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
      return [];
    }
    throw error;
  }
};

// Sanitize object to remove undefined values that crash Firestore setDoc
const sanitizeData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
};

// CREATE: Add new document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = doc(collection(db, collectionName));
    const docData = sanitizeData({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// CREATE/UPDATE: Set document with specific ID
export const setDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docData = sanitizeData({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, docData);
    return { id: docId, ...docData };
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

// UPDATE: Update existing document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const updateData = sanitizeData({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(docRef, updateData);
    return { id: docId, ...updateData };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// DELETE: Delete document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document:`, error);
    throw error;
  }
};

// LISTEN: Real-time subscription to collection
export const subscribeToCollection = (collectionName, callback, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(
      q,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(docs);
      },
      error => {
        console.warn(`Firestore subscription notice [${collectionName}]:`, error?.message || error);
        callback([]);
      }
    );
  } catch (error) {
    console.warn(`Error subscribing to collection ${collectionName}:`, error?.message || error);
    callback([]);
    return () => {};
  }
};

// LISTEN: Real-time subscription to single document
export const subscribeToDocument = (collectionName, docId, callback) => {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      snapshot => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() });
        }
      },
      error => {
        console.warn(`Firestore document subscription notice [${collectionName}/${docId}]:`, error?.message || error);
      }
    );
  } catch (error) {
    console.warn(`Error subscribing to document ${collectionName}/${docId}:`, error?.message || error);
    return () => {};
  }
};

// BATCH: Fetch paginated results
export const getPaginatedCollection = async (collectionName, pageSize = 10, pageNumber = 1, constraints = []) => {
  try {
    const startIndex = (pageNumber - 1) * pageSize;
    const q = query(
      collection(db, collectionName),
      ...constraints,
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return {
      docs,
      hasMore: docs.length === pageSize,
      pageNumber,
      pageSize,
    };
  } catch (error) {
    console.error(`Error fetching paginated collection:`, error);
    throw error;
  }
};

// SEARCH: Search documents by multiple fields
export const searchDocuments = async (collectionName, searchTerm, searchFields = []) => {
  try {
    const allDocs = await getCollection(collectionName);
    return allDocs.filter(doc => {
      return searchFields.some(field => {
        const value = doc[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  } catch (error) {
    console.error(`Error searching documents:`, error);
    throw error;
  }
};
