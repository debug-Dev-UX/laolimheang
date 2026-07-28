// src/services/projectService.js
// Firestore CRUD for portfolio projects

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteFile } from "./storageService";

const COLLECTION = "projects";

/**
 * Get all projects ordered by createdAt desc
 */
export const getProjects = async (featuredOnly = false) => {
  try {
    let q;
    if (featuredOnly) {
      q = query(
        collection(db, COLLECTION),
        where("featured", "==", true),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("getProjects:", error);
    return [];
  }
};

/**
 * Get single project by ID
 */
export const getProjectById = async (id) => {
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (error) {
    console.error("getProjectById:", error);
    return null;
  }
};

/**
 * Add a new project
 */
export const addProject = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, error: null };
  } catch (error) {
    console.error("addProject:", error);
    return { id: null, error: "Failed to add project." };
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (id, data) => {
  try {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return { error: null };
  } catch (error) {
    console.error("updateProject:", error);
    return { error: "Failed to update project." };
  }
};

/**
 * Delete a project and its image
 */
export const deleteProject = async (id, imageUrl) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    if (imageUrl) {
      await deleteFile(imageUrl).catch(() => {});
    }
    return { error: null };
  } catch (error) {
    console.error("deleteProject:", error);
    return { error: "Failed to delete project." };
  }
};

/**
 * Get unique categories from all projects
 */
export const getProjectCategories = async () => {
  const projects = await getProjects();
  const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];
  return cats;
};