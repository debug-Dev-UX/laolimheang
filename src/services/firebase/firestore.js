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
    console.error(`Error fetching ${collectionName}:`, error);
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
    console.error(`Error fetching document:`, error);
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
    console.error(`Error fetching documents:`, error);
    throw error;
  }
};

// CREATE: Add new document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = doc(collection(db, collectionName));
    const docData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(docRef, docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error(`Error adding document:`, error);
    throw error;
  }
};

// CREATE/UPDATE: Set document with specific ID
export const setDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docData = {
      ...data,
      updatedAt: new Date(),
    };
    await setDoc(docRef, docData);
    return { id: docId, ...docData };
  } catch (error) {
    console.error(`Error setting document:`, error);
    throw error;
  }
};

// UPDATE: Update existing document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    await updateDoc(docRef, updateData);
    return { id: docId, ...updateData };
  } catch (error) {
    console.error(`Error updating document:`, error);
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
    return onSnapshot(q, snapshot => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(docs);
    });
  } catch (error) {
    console.error(`Error subscribing to collection:`, error);
    throw error;
  }
};

// LISTEN: Real-time subscription to single document
export const subscribeToDocument = (collectionName, docId, callback) => {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, snapshot => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  } catch (error) {
    console.error(`Error subscribing to document:`, error);
    throw error;
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
