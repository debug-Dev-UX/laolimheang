// useAnalytics Hook
import { useState, useEffect, useCallback } from 'react';
import * as analyticsService from '../services/api/analyticsService';

export const useAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const page = window.location.pathname;
      analyticsService.trackPageView(page).catch(err => {
        console.error('Error tracking page view:', err);
      });
    }
  }, []);

  const trackPageView = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const page = window.location.pathname;
        await analyticsService.trackPageView(page);
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    }
  }, []);

  const getAnalyticsSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getAnalyticsSummary();
      setSummary(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPageViews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await analyticsService.getPageViews();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeviceStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await analyticsService.getDeviceStats();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVisitorGrowth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await analyticsService.getVisitorGrowth();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    loading,
    error,
    trackPageView,
    getAnalyticsSummary,
    getPageViews,
    getDeviceStats,
    getVisitorGrowth,
  };
};
