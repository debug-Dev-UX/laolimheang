// src/components/ui/Button.jsx
import React from "react";
import { motion } from "framer-motion";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 font-medium transition-all duration-200",
  danger: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200",
};

const sizes = {
  sm: "text-sm px-4 py-2",
  md: "",
  lg: "text-lg px-8 py-4",
};

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

// src/components/ui/Badge.jsx
export const Badge = ({ children, variant = "primary", className = "" }) => {
  const v = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    gray: "badge bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300",
    blue: "badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  };
  return <span className={`${v[variant] || v.gray} ${className}`}>{children}</span>;
};

// src/components/ui/Card.jsx
export const Card = ({ children, className = "", hover = false, glass = false }) => {
  const base = glass ? "glass rounded-2xl p-6" : hover ? "card-hover" : "card";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// src/components/ui/Modal.jsx
export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-dark-100 dark:border-dark-700 overflow-hidden max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-700">
          <h2 className="text-xl font-display font-bold text-dark-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// src/components/ui/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const s = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${s[size]} text-primary-500`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
      </svg>
    </div>
  );
};

// src/components/ui/Toast.jsx — simple notification
export const Toast = ({ message, type = "success", visible }) => {
  if (!visible) return null;
  const styles = {
    success: "bg-emerald-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-primary-500 text-white",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      className={`fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm ${styles[type]}`}
    >
      {message}
    </motion.div>
  );
};

export default Button;