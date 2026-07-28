// src/services/storageService.js
// Firebase Storage upload/delete helpers

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param {File} file - The file to upload
 * @param {string} folder - Storage folder (e.g. "projects", "blogs", "logos")
 * @param {Function} onProgress - Callback(percent) for progress updates
 * @returns {Promise<{url: string, error: string}>}
 */
export const uploadFile = (file, folder = "uploads", onProgress = null) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ url: null, error: "No file provided." });
      return;
    }

    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("uploadFile:", error);
        resolve({ url: null, error: "Upload failed. Please try again." });
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, error: null });
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage by its download URL
 * @param {string} url - The download URL of the file to delete
 */
export const deleteFile = async (url) => {
  try {
    if (!url) return;
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    // File may not exist — fail silently
    console.debug("deleteFile:", error);
  }
};

/**
 * Validate file before upload
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) return "Please select a file.";
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, WebP, and GIF images are allowed.";
  }
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File size must be less than ${maxSizeMB}MB.`;
  }
  return null;
};