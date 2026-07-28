// Analytics Service
import { addDocument, getCollection, updateDocument } from '../firebase/firestore';

// Generate unique visitor ID
export const generateVisitorId = () => {
  if (typeof localStorage !== 'undefined') {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }
  return null;
};

// Get device type
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/mobile|android|iphone|ipad/i.test(ua)) {
    return /ipad/.test(ua) ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

// Track page view
export const trackPageView = async (page) => {
  try {
    const visitorId = generateVisitorId();
    if (!visitorId || process.env.REACT_APP_ENABLE_ANALYTICS_TRACKING !== 'true') {
      return;
    }

    const analyticsData = {
      visitorId,
      page,
      userAgent: navigator.userAgent,
      referer: document.referrer || '',
      deviceType: getDeviceType(),
      country: '', // Could be populated from IP geolocation API
      city: '', // Could be populated from IP geolocation API
      timestamp: new Date(),
    };

    await addDocument('visitors', analyticsData);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Get analytics summary
export const getAnalyticsSummary = async () => {
  try {
    const visitors = await getCollection('visitors');
    const messages = await getCollection('messages');
    const projects = await getCollection('projects');
    const blogs = await getCollection('blogs');
    const services = await getCollection('services');

    const uniqueVisitors = new Set(visitors.map(v => v.visitorId)).size;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisits = visitors.filter(v => {
      const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
      visitDate.setHours(0, 0, 0, 0);
      return visitDate.getTime() === today.getTime();
    }).length;

    return {
      totalVisits: visitors.length,
      uniqueVisitors,
      todayVisits,
      totalMessages: messages.length,
      unreadMessages: messages.filter(m => !m.read).length,
      totalProjects: projects.length,
      totalBlogs: blogs.length,
      totalServices: services.length,
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return null;
  }
};

// Get page views
export const getPageViews = async () => {
  try {
    const visitors = await getCollection('visitors');
    const pageViews = {};

    visitors.forEach(visitor => {
      const page = visitor.page || 'unknown';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });

    return Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views);
  } catch (error) {
    console.error('Error getting page views:', error);
    return [];
  }
};

// Get device statistics
export const getDeviceStats = async () => {
  try {
    const visitors = await getCollection('visitors');
    const stats = { mobile: 0, tablet: 0, desktop: 0 };

    visitors.forEach(visitor => {
      const device = visitor.deviceType || 'desktop';
      stats[device] = (stats[device] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting device stats:', error);
    return { mobile: 0, tablet: 0, desktop: 0 };
  }
};

// Get visitor growth (last 7 days)
export const getVisitorGrowth = async () => {
  try {
    const visitors = await getCollection('visitors');
    const growth = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayVisitors = visitors.filter(v => {
        const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() === date.getTime();
      });

      const key = date.toLocaleDateString();
      growth[key] = dayVisitors.length;
    }

    return growth;
  } catch (error) {
    console.error('Error getting visitor growth:', error);
    return {};
  }
};
