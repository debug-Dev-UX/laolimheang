// src/components/layout/PageLayout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { trackPageView } from "../../services/visitorService";

const PageLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;