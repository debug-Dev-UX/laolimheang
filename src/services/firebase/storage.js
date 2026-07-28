// Firebase Storage Methods
import {
  ref,
  uploadBytes,
  downloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './config';

// UPLOAD: Upload file to Storage
export const uploadFile = async (folderPath, fileName, file) => {
  try {
    const fileRef = ref(storage, `${folderPath}/${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await downloadURL(snapshot.ref);
    return {
      path: snapshot.ref.fullPath,
      url,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// UPLOAD: Upload multiple files
export const uploadMultipleFiles = async (folderPath, files) => {
  try {
    const uploadPromises = files.map(({ fileName, file }) =>
      uploadFile(folderPath, fileName, file)
    );
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

// GET: Get download URL for file
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    return await downloadURL(fileRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// DELETE: Delete file from Storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// LIST: List all files in a folder
export const listFiles = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    return result.items.map(item => ({
      name: item.name,
      path: item.fullPath,
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Helper: Generate unique filename
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
};

// Helper: Validate file type
export const isValidFileType = (file, allowedTypes = []) => {
  return allowedTypes.length === 0 || allowedTypes.includes(file.type);
};

// Helper: Validate file size
export const isValidFileSize = (file, maxSizeMB = 5) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Helper: Validate image
export const isValidImage = (file, maxSizeMB = 5) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFileType(file, validImageTypes) && isValidFileSize(file, maxSizeMB);
};
