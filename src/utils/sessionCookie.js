// Cookie & Session Management Utility for Users & Admin
export const COOKIE_KEYS = {
  USER_SESSION: 'portfolio_user_session',
  COOKIE_CONSENT: 'portfolio_cookie_consent',
  ADMIN_SESSION: 'portfolio_admin_token',
  THEME_PREFERENCE: 'portfolio_theme_pref',
};

/**
 * Set a cookie with specified name, value, and expiration in days
 */
export const setCookie = (name, value, days = 7, path = '/') => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const serialized = encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : String(value));
  document.cookie = `${name}=${serialized}; expires=${expires}; path=${path}; SameSite=Lax`;
};

/**
 * Get cookie value by name
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[1]);
    try {
      return JSON.parse(decoded);
    } catch {
      return decoded;
    }
  } catch {
    return null;
  }
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name, path = '/') => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`;
};

/**
 * Detect device type for session telemetry
 */
const detectDevice = () => {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
};

/**
 * Initialize or restore a user session
 * Persists in both document.cookie (7 days) and sessionStorage
 */
export const initUserSession = () => {
  if (typeof window === 'undefined') return null;

  // Check existing session in cookie or sessionStorage
  let session = getCookie(COOKIE_KEYS.USER_SESSION);
  if (!session) {
    try {
      const stored = sessionStorage.getItem(COOKIE_KEYS.USER_SESSION);
      if (stored) session = JSON.parse(stored);
    } catch (e) {}
  }

  const now = new Date().toISOString();

  if (session && session.sessionId) {
    // Update existing session activity
    session.lastActive = now;
    session.visitCount = (session.visitCount || 1) + 1;
  } else {
    // Generate new unique session
    const randomHex = Math.random().toString(16).substring(2, 10);
    session = {
      sessionId: `sess_${Date.now()}_${randomHex}`,
      startTime: now,
      lastActive: now,
      device: detectDevice(),
      visitCount: 1,
      language: navigator.language || 'en-US',
      platform: navigator.platform || 'unknown',
      role: 'visitor',
    };
  }

  // Save in cookie (7 days)
  setCookie(COOKIE_KEYS.USER_SESSION, session, 7);

  // Save in sessionStorage
  try {
    sessionStorage.setItem(COOKIE_KEYS.USER_SESSION, JSON.stringify(session));
  } catch (e) {}

  return session;
};

/**
 * Get current user session
 */
export const getUserSession = () => {
  if (typeof window === 'undefined') return null;
  let session = getCookie(COOKIE_KEYS.USER_SESSION);
  if (!session) {
    try {
      const stored = sessionStorage.getItem(COOKIE_KEYS.USER_SESSION);
      if (stored) session = JSON.parse(stored);
    } catch (e) {}
  }
  return session;
};

/**
 * Update user session attributes
 */
export const updateUserSession = (updates) => {
  const current = getUserSession() || {};
  const updated = { ...current, ...updates, lastActive: new Date().toISOString() };
  setCookie(COOKIE_KEYS.USER_SESSION, updated, 7);
  try {
    sessionStorage.setItem(COOKIE_KEYS.USER_SESSION, JSON.stringify(updated));
  } catch (e) {}
  return updated;
};

/**
 * Set Admin Auth Session in Cookie
 */
export const setAdminSession = (userData) => {
  if (!userData) return;
  const adminSession = {
    uid: userData.uid || 'admin-user',
    email: userData.email || '',
    displayName: userData.displayName || 'Administrator',
    role: 'admin',
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 864e5).toISOString(),
  };
  setCookie(COOKIE_KEYS.ADMIN_SESSION, adminSession, 7);
  try {
    sessionStorage.setItem(COOKIE_KEYS.ADMIN_SESSION, JSON.stringify(adminSession));
  } catch (e) {}
  return adminSession;
};

/**
 * Get Admin Auth Session
 */
export const getAdminSession = () => {
  let session = getCookie(COOKIE_KEYS.ADMIN_SESSION);
  if (!session) {
    try {
      const stored = sessionStorage.getItem(COOKIE_KEYS.ADMIN_SESSION);
      if (stored) session = JSON.parse(stored);
    } catch (e) {}
  }
  return session;
};

/**
 * Clear Admin Auth Session
 */
export const clearAdminSession = () => {
  deleteCookie(COOKIE_KEYS.ADMIN_SESSION);
  try {
    sessionStorage.removeItem(COOKIE_KEYS.ADMIN_SESSION);
  } catch (e) {}
};
