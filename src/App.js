import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider, SettingsContext } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { ROUTES } from './utils/constants';

// Pages
import Home from './pages/Home';
import Home3D from './pages/Home3D';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import ProjectImages from './pages/ProjectImages';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import ServicesAdmin from './admin/ServicesAdmin';
import ProjectsAdmin from './admin/ProjectsAdmin';
import ProjectImagesAdmin from './admin/ProjectImagesAdmin';
import BlogsAdmin from './admin/BlogsAdmin';
import MessagesAdmin from './admin/MessagesAdmin';
import AnalyticsAdmin from './admin/AnalyticsAdmin';
import SettingsAdmin from './admin/SettingsAdmin';
import SkillsAdmin from './admin/SkillsAdmin';
import GalleryAdmin from './admin/GalleryAdmin';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import CookieConsentBanner from './components/common/CookieConsentBanner';
import { initUserSession } from './utils/sessionCookie';

// Layouts
import AdminLayout from './components/layout/AdminLayout';

// Protected Routes
import ProtectedRoute from './components/layout/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    // Initialize visitor session token in cookie and sessionStorage
    initUserSession();
  }, []);

  useEffect(() => {
    if (settings?.siteName) {
      document.title = `${settings.siteName} — Portfolio & Digital Services`;
    }
  }, [settings]);

  return (
    <div className={isAdminRoute ? 'min-h-screen' : 'min-h-screen flex flex-col bg-[#05050A] text-slate-200'}>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'flex-grow'}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Home3D />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.SERVICES} element={<Services />} />
          <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
          <Route path={ROUTES.PROJECT_IMAGES} element={<ProjectImages />} />
          <Route path={ROUTES.GALLERY} element={<Gallery />} />
          <Route path={ROUTES.BLOG} element={<Blog />} />
          <Route path={ROUTES.BLOG_POST} element={<BlogPost />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.DONATE} element={<Donate />} />

          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

          {/* Protected Admin Routes — wrapped with AdminLayout */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_SERVICES}
            element={
              <ProtectedRoute>
                <AdminLayout><ServicesAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PROJECTS}
            element={
              <ProtectedRoute>
                <AdminLayout><ProjectsAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PROJECT_IMAGES}
            element={
              <ProtectedRoute>
                <AdminLayout><ProjectImagesAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_BLOGS}
            element={
              <ProtectedRoute>
                <AdminLayout><BlogsAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_MESSAGES}
            element={
              <ProtectedRoute>
                <AdminLayout><MessagesAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ANALYTICS}
            element={
              <ProtectedRoute>
                <AdminLayout><AnalyticsAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_SETTINGS}
            element={
              <ProtectedRoute>
                <AdminLayout><SettingsAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_SKILLS}
            element={
              <ProtectedRoute>
                <AdminLayout><SkillsAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_GALLERY}
            element={
              <ProtectedRoute>
                <AdminLayout><GalleryAdmin /></AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieConsentBanner />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
