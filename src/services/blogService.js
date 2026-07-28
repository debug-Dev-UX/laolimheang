// src/services/blogService.js
// Firestore CRUD for blog posts

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
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteFile } from "./storageService";

const COLLECTION = "blogs";

/**
 * Get all published blog posts
 */
export const getBlogs = async (publishedOnly = true) => {
  try {
    let q;
    if (publishedOnly) {
      q = query(
        collection(db, COLLECTION),
        where("published", "==", true),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("getBlogs:", error);
    return [];
  }
};

/**
 * Get blog post by slug
 */
export const getBlogBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch (error) {
    console.error("getBlogBySlug:", error);
    return null;
  }
};

/**
 * Get blog post by ID
 */
export const getBlogById = async (id) => {
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (error) {
    console.error("getBlogById:", error);
    return null;
  }
};

/**
 * Increment view count for a blog post
 */
export const incrementBlogViews = async (id) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { views: increment(1) });
  } catch (error) {
    // Non-critical, ignore silently
  }
};

/**
 * Add a new blog post
 */
export const addBlog = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, error: null };
  } catch (error) {
    console.error("addBlog:", error);
    return { id: null, error: "Failed to add blog post." };
  }
};

/**
 * Update a blog post
 */
export const updateBlog = async (id, data) => {
  try {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return { error: null };
  } catch (error) {
    console.error("updateBlog:", error);
    return { error: "Failed to update blog post." };
  }
};

/**
 * Delete a blog post and its thumbnail
 */
export const deleteBlog = async (id, thumbnailUrl) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    if (thumbnailUrl) {
      await deleteFile(thumbnailUrl).catch(() => {});
    }
    return { error: null };
  } catch (error) {
    console.error("deleteBlog:", error);
    return { error: "Failed to delete blog post." };
  }
};

/**
 * Get unique blog categories
 */
export const getBlogCategories = async () => {
  const blogs = await getBlogs(false);
  return [...new Set(blogs.map((b) => b.category).filter(Boolean))];
};