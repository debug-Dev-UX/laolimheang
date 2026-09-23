// src/services/serviceService.js
// Firestore CRUD for service/pricing plans

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "services";

// Default service plans if none exist in Firestore
export const DEFAULT_SERVICES = [
  {
    title: "Basic",
    description: "Perfect for personal projects and simple websites.",
    price: 299,
    currency: "USD",
    period: "project",
    features: [
      "5 Pages Website",
      "Responsive Design",
      "Basic SEO Setup",
      "Contact Form",
      "2 Revision Rounds",
      "1 Month Support",
    ],
    popular: false,
    buttonText: "Get Started",
    order: 1,
  },
  {
    title: "Pro",
    description: "Ideal for growing businesses needing more functionality.",
    price: 699,
    currency: "USD",
    period: "project",
    features: [
      "10 Pages Website",
      "Custom Animations",
      "Advanced SEO",
      "CMS Integration",
      "Firebase Backend",
      "5 Revision Rounds",
      "3 Months Support",
    ],
    popular: true,
    buttonText: "Most Popular",
    order: 2,
  },
  {
    title: "Premium",
    description: "Full-featured solution for established businesses.",
    price: 1499,
    currency: "USD",
    period: "project",
    features: [
      "Unlimited Pages",
      "3D Animations & Effects",
      "Full-Stack Development",
      "Admin Dashboard",
      "Analytics Integration",
      "Performance Optimization",
      "Unlimited Revisions",
      "6 Months Support",
    ],
    popular: false,
    buttonText: "Go Premium",
    order: 3,
  },
  {
    title: "Plus",
    description: "Ongoing maintenance and feature development partnership.",
    price: 299,
    currency: "USD",
    period: "month",
    features: [
      "Monthly Development Hours",
      "Priority Support",
      "Bug Fixes & Updates",
      "Performance Monitoring",
      "Security Updates",
      "New Feature Development",
      "Monthly Reports",
      "Direct Communication",
    ],
    popular: false,
    buttonText: "Subscribe",
    order: 4,
  },
];

/**
 * Get all services ordered by order field
 */
export const getServices = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("getServices:", error);
    return [];
  }
};

/**
 * Add a new service plan
 */
export const addService = async (data) => {
  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, error: null };
  } catch (error) {
    console.error("addService:", error);
    return { id: null, error: "Failed to add service." };
  }
};

/**
 * Update a service plan
 */
export const updateService = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    console.error("updateService:", error);
    return { error: "Failed to update service." };
  }
};

/**
 * Delete a service plan
 */
export const deleteService = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return { error: null };
  } catch (error) {
    console.error("deleteService:", error);
    return { error: "Failed to delete service." };
  }
};