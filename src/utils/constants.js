// Application Constants
export const APP_NAME = process.env.REACT_APP_SITE_NAME || 'LaolimHeang';
export const APP_DESCRIPTION = process.env.REACT_APP_SITE_DESCRIPTION || 'Premium Professional Portfolio';
export const APP_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:3000';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio',
  GALLERY: '/gallery',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  CONTACT: '/contact',
  DONATE: '/donate',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SKILLS: '/admin/skills',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_PROJECT_IMAGES: '/admin/project-images',
  PROJECT_IMAGES: '/project-images',
  ADMIN_ADS: '/admin/ads',
  NOT_FOUND: '*',
};

// API
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  SERVICES: 'services',
  PROJECTS: 'projects',
  BLOGS: 'blogs',
  MESSAGES: 'messages',
  VISITORS: 'visitors',
  SETTINGS: 'settings',
  SKILLS: 'skills',
  ADS: 'ads',
  GALLERY: 'gallery',
  PROJECT_IMAGES: 'project_images',
};

// Storage Folders
export const STORAGE_FOLDERS = {
  PROJECTS: 'projects',
  BLOGS: 'blogs',
  SETTINGS: 'settings',
  AVATARS: 'avatars',
  GALLERY: 'gallery',
  PROJECT_IMAGES: 'project_images',
};

// Page Size
export const PAGE_SIZE = 10;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Sort Orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

// Message Status
export const MESSAGE_STATUS = {
  READ: 'read',
  UNREAD: 'unread',
};

// Device Types
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
};

// Service Plans
export const SERVICE_PLANS = [
  { id: 'basic', name: 'Basic', price: 99 },
  { id: 'pro', name: 'Pro', price: 199 },
  { id: 'premium', name: 'Premium', price: 299 },
  { id: 'plus', name: 'Plus', price: 499 },
];

// Common Tags
export const COMMON_TAGS = [
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Python',
  'Django',
  'Flask',
  'Java',
  'C++',
  'JavaScript',
  'TypeScript',
  'Firebase',
  'MongoDB',
  'PostgreSQL',
];

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 1,
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1280,
};
