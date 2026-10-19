// Firestore Database Methods with Real-Time Multi-Device Sync & Resilient Fallback
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
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { ensureFirebaseAuth } from './auth';

const getLocalCache = (collectionName) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`firestore_cache_${collectionName}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLocalCache = (collectionName, items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`firestore_cache_${collectionName}`, JSON.stringify(items));
  } catch (e) {}
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

// GET: Fetch all documents from a collection
export const getCollection = async (collectionName, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    const remoteDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Merge remote with any locally-created items not yet upstreamed
    const localDocs = getLocalCache(collectionName);
    const map = new Map();
    remoteDocs.forEach(d => map.set(d.id, d));
    localDocs.forEach(d => {
      if (!map.has(d.id)) {
        map.set(d.id, d);
      }
    });

    const merged = Array.from(map.values());
    setLocalCache(collectionName, merged);
    return merged;
  } catch (error) {
    console.warn(`Firestore getCollection [${collectionName}] notice, loading local cache:`, error?.message || error);
    const local = getLocalCache(collectionName);
    return local;
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
    const local = getLocalCache(collectionName);
    return local.find(i => i.id === docId) || null;
  } catch (error) {
    console.warn(`Firestore getDocument [${collectionName}/${docId}] notice:`, error?.message || error);
    const local = getLocalCache(collectionName);
    return local.find(i => i.id === docId) || null;
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
    const local = getLocalCache(collectionName);
    return local.filter(d => d[field] === value);
  }
};

// CREATE: Add new document (authenticated & synced across devices)
export const addDocument = async (collectionName, data) => {
  const docData = sanitizeData({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const localItems = getLocalCache(collectionName);

  try {
    await ensureFirebaseAuth();
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, docData);
    const created = { id: docRef.id, ...docData };
    setLocalCache(collectionName, [created, ...localItems.filter(i => i.id !== docRef.id)]);
    return created;
  } catch (error) {
    console.warn(`Firestore remote add note (${error?.message || error}), committing locally:`, collectionName);
    const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const created = { id: localId, ...docData };
    setLocalCache(collectionName, [created, ...localItems]);
    return created;
  }
};

// CREATE/UPDATE: Set document with specific ID
export const setDocument = async (collectionName, docId, data) => {
  const docData = sanitizeData({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const localItems = getLocalCache(collectionName);
  const existsIndex = localItems.findIndex(i => i.id === docId);
  let updatedList;
  if (existsIndex >= 0) {
    updatedList = localItems.map(i => i.id === docId ? { ...i, ...docData, id: docId } : i);
  } else {
    updatedList = [{ ...docData, id: docId }, ...localItems];
  }
  setLocalCache(collectionName, updatedList);

  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, docData, { merge: true });
    return { id: docId, ...docData };
  } catch (error) {
    console.warn(`Firestore remote set note (${error?.message || error}), committed locally:`, collectionName);
    return { id: docId, ...docData };
  }
};

// UPDATE: Update existing document
export const updateDocument = async (collectionName, docId, data) => {
  const updateData = sanitizeData({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const localItems = getLocalCache(collectionName);
  const updatedList = localItems.map(i => i.id === docId ? { ...i, ...updateData } : i);
  setLocalCache(collectionName, updatedList);

  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateData);
    return { id: docId, ...updateData };
  } catch (error) {
    console.warn(`Firestore remote update note (${error?.message || error}), committed locally:`, collectionName);
    return { id: docId, ...updateData };
  }
};

// DELETE: Delete document
export const deleteDocument = async (collectionName, docId) => {
  const localItems = getLocalCache(collectionName);
  const filtered = localItems.filter(i => i.id !== docId);
  setLocalCache(collectionName, filtered);

  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`Firestore remote delete note (${error?.message || error}), removed locally:`, collectionName);
    return true;
  }
};

// LISTEN: Real-time subscription to collection (Multi-device live sync)
export const subscribeToCollection = (collectionName, callback, constraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(
      q,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocalCache(collectionName, docs);
        callback(docs);
      },
      error => {
        console.warn(`Firestore real-time subscription notice [${collectionName}]:`, error?.message || error);
        callback(getLocalCache(collectionName));
      }
    );
  } catch (error) {
    console.warn(`Error initiating real-time subscription for ${collectionName}:`, error?.message || error);
    callback(getLocalCache(collectionName));
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
        const cached = getLocalCache(collectionName).find(i => i.id === docId);
        if (cached) callback(cached);
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
    const local = getLocalCache(collectionName);
    return {
      docs: local.slice(0, pageSize),
      hasMore: false,
      pageNumber,
      pageSize,
    };
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
    return [];
  }
};
