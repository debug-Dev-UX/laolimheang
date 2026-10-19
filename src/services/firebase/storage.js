// Firebase Storage Methods - High-Capacity Upload Engine (100MB+)
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './config';
import { ensureFirebaseAuth } from './auth';

// UPLOAD: Resumable chunked upload for high-capacity files (+100MB)
export const uploadFileWithProgress = async (folderPath, fileName, file, onProgress = () => {}) => {
  try {
    await ensureFirebaseAuth();
    const cleanName = fileName || generateUniqueFileName(file.name || 'asset.webp');
    const fileRef = ref(storage, `${folderPath}/${cleanName}`);

    const metadata = {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        originalName: file.name || 'upload',
        uploadedAt: new Date().toISOString(),
      },
    };

    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress(progress, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (error) => {
          console.warn('Storage resumable upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              path: uploadTask.snapshot.ref.fullPath,
              url,
              name: cleanName,
              size: file.size,
            });
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error initiating uploadWithProgress:', error);
    throw error;
  }
};

// UPLOAD: Basic upload file to Storage
export const uploadFile = async (folderPath, fileName, file) => {
  try {
    await ensureFirebaseAuth();
    const cleanName = fileName || generateUniqueFileName(file.name || 'asset.webp');
    const fileRef = ref(storage, `${folderPath}/${cleanName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return {
      path: snapshot.ref.fullPath,
      url,
    };
  } catch (error) {
    console.warn('Error in uploadFile, fallback to progress uploader:', error);
    return uploadFileWithProgress(folderPath, fileName, file);
  }
};

// UPLOAD: Upload multiple files
export const uploadMultipleFiles = async (folderPath, files, onFileProgress = () => {}) => {
  try {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const { fileName, file } = files[i];
      const res = await uploadFileWithProgress(folderPath, fileName, file, (pct) => {
        onFileProgress(i, pct, files.length);
      });
      results.push(res);
    }
    return results;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

// GET: Get download URL for file
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
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
    console.warn('Notice deleting file from storage:', error?.message || error);
    return true;
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
    return [];
  }
};

// Helper: Generate unique filename
export const generateUniqueFileName = (originalName = 'media.webp') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'webp';
  return `${timestamp}_${random}.${extension}`;
};

// Helper: Validate file size (supports up to +150MB)
export const isValidFileSize = (file, maxSizeMB = 150) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Helper: Validate image or video
export const isValidImage = (file, maxSizeMB = 150) => {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
    'image/tiff',
    'image/bmp',
    'video/mp4',
    'video/webm',
  ];
  const typeValid = validTypes.includes(file.type) || file.type.startsWith('image/');
  return typeValid && isValidFileSize(file, maxSizeMB);
};
