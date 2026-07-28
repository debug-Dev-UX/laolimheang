// src/services/visitorService.js
// Visitor tracking and analytics

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { detectDevice } from "../utils/deviceDetect";

const COLLECTION = "visitors";

/**
 * Generate or retrieve visitor UUID from localStorage
 */
const getVisitorId = () => {
  let id = localStorage.getItem("lh_visitor_id");
  if (!id) {
    id = "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("lh_visitor_id", id);
  }
  return id;
};

/**
 * Track a page view for the current visitor
 */
export const trackPageView = async (pathname) => {
  try {
    const visitorId = getVisitorId();
    const ref = doc(db, COLLECTION, visitorId);
    const snap = await getDoc(ref);
    const device = detectDevice();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (snap.exists()) {
      // Update existing visitor
      await updateDoc(ref, {
        lastVisit: serverTimestamp(),
        visitCount: increment(1),
        pages: arrayUnion(pathname),
        [`pageViews.${today}.${pathname.replace(/\//g, "_") || "home"}`]: increment(1),
      });
    } else {
      // Create new visitor record
      await setDoc(ref, {
        visitorId,
        firstVisit: serverTimestamp(),
        lastVisit: serverTimestamp(),
        visitCount: 1,
        device,
        pages: [pathname],
        pageViews: {
          [today]: {
            [pathname.replace(/\//g, "_") || "home"]: 1,
          },
        },
      });
    }
  } catch (error) {
    // Analytics tracking is non-critical — fail silently
    console.debug("trackPageView error:", error);
  }
};

/**
 * Get all visitor records (admin only)
 */
export const getAllVisitors = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("lastVisit", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("getAllVisitors:", error);
    return [];
  }
};

/**
 * Compute analytics summary from visitor records
 */
export const computeAnalytics = (visitors) => {
  const total = visitors.reduce((sum, v) => sum + (v.visitCount || 1), 0);
  const unique = visitors.length;

  // Device breakdown
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  visitors.forEach((v) => {
    const d = v.device || "desktop";
    if (devices[d] !== undefined) devices[d]++;
    else devices.desktop++;
  });

  // Page popularity
  const pageCounts = {};
  visitors.forEach((v) => {
    (v.pages || []).forEach((p) => {
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  // Daily visitors for last 30 days
  const dailyMap = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = 0;
  }
  visitors.forEach((v) => {
    if (!v.pageViews) return;
    Object.keys(v.pageViews).forEach((day) => {
      if (dailyMap[day] !== undefined) {
        const dayTotal = Object.values(v.pageViews[day] || {}).reduce(
          (s, c) => s + c,
          0
        );
        dailyMap[day] += dayTotal;
      }
    });
  });
  const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

  // Period summaries
  const now7 = new Date(now); now7.setDate(now.getDate() - 7);
  const now30 = new Date(now); now30.setDate(now.getDate() - 30);

  const weekly = visitors.filter((v) => {
    if (!v.lastVisit) return false;
    const d = v.lastVisit.toDate ? v.lastVisit.toDate() : new Date(v.lastVisit);
    return d >= now7;
  }).length;

  const monthly = visitors.filter((v) => {
    if (!v.lastVisit) return false;
    const d = v.lastVisit.toDate ? v.lastVisit.toDate() : new Date(v.lastVisit);
    return d >= now30;
  }).length;

  return { total, unique, weekly, monthly, devices, topPages, daily };
};