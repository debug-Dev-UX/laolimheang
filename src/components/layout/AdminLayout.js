import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  FolderGit2,
  Image,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Cpu,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, end: true, label: 'Overview', icon: LayoutDashboard, badge: 'DASHBOARD' },
  { to: ROUTES.ADMIN_PROJECTS, label: 'Projects & Systems', icon: FolderGit2, badge: 'INVENTORY' },
  { to: ROUTES.ADMIN_SERVICES, label: 'Services & Pricing', icon: Briefcase, badge: 'COMMERCIAL' },
  { to: ROUTES.ADMIN_SKILLS, label: 'Technical Skills', icon: Cpu, badge: 'CAPABILITIES' },
  { to: ROUTES.ADMIN_BLOGS, label: 'Articles & Journal', icon: BookOpen, badge: 'EDITORIAL' },
  { to: ROUTES.ADMIN_GALLERY, label: 'Lookbook Gallery', icon: Image, badge: 'MEDIA' },
  { to: ROUTES.ADMIN_PROJECT_IMAGES, label: 'Project Vault', icon: Layers, badge: 'SCHEMAS' },
  { to: ROUTES.ADMIN_MESSAGES, label: 'Client Inquiries', icon: MessageSquare, badge: 'INBOX' },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Visitor Telemetry', icon: BarChart3, badge: 'METRICS' },
  { to: ROUTES.ADMIN_SETTINGS, label: 'System Settings', icon: Settings, badge: 'CONFIG' },
];

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.ADMIN_LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const currentNav = NAV_ITEMS.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between bg-white text-neutral-900 border-r border-neutral-200">
      {/* Brand Logo & Header */}
      <div>
        <div className="h-20 px-6 border-b border-neutral-200 flex items-center justify-between">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="flex items-center gap-2 group"
          >
            <span className="text-xl font-black tracking-tighter uppercase text-black">
              LAOLIMHEANG
            </span>
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5">
              ADMIN
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-neutral-500 hover:text-black"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Title */}
        <div className="px-6 pt-6 pb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block">
            MANAGEMENT MODULES
          </span>
        </div>

        {/* Vertical Navigation Links */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
          {NAV_ITEMS.map(({ to, label, end, icon: Icon, badge }) => {
            const active = end ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-neutral-500 group-hover:text-black'}`} />
                  <span className="truncate">{label}</span>
                </div>
                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-neutral-300 group-hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Area & Quick Exit */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2.5 bg-white border border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-black uppercase text-black block truncate">
              {user?.displayName || 'LEAD ADMIN'}
            </span>
            <span className="text-[10px] text-neutral-500 font-medium truncate block">
              {user?.email || 'admin@laolimheang.space'}
            </span>
          </div>
        </div>

        {/* Public Storefront Link */}
        <Link
          to={ROUTES.HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            <span>VIEW LIVE STORE</span>
          </div>
          <span className="text-[10px] text-neutral-400">OPEN ↗</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f9fafb] text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Fixed Desktop Left Sidebar ── */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30 shadow-xs">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-full h-full shadow-2xl animate-slide-up">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Right Main Area ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200">
          <div className="px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            
            {/* Left: Mobile hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-black hover:bg-neutral-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <Link to={ROUTES.ADMIN_DASHBOARD} className="hover:text-black">ADMIN CONSOLE</Link>
                <span>/</span>
                <span className="text-black font-black">{currentNav?.label || 'DASHBOARD'}</span>
              </div>
            </div>

            {/* Right: Telemetry pill & Direct Storefront button */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>CLUSTER OPERATIONAL</span>
              </span>

              <Link
                to={ROUTES.HOME}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-all active:scale-95"
              >
                <span>STOREFRONT</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 bg-white py-6 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <p>&copy; {new Date().getFullYear()} LAOLIMHEANG • ADMINISTRATIVE INFRASTRUCTURE</p>
            <div className="flex items-center gap-4">
              <Link to={ROUTES.HOME} className="hover:text-black">LIVE STOREFRONT</Link>
              <span>•</span>
              <Link to={ROUTES.ADMIN_SETTINGS} className="hover:text-black">SETTINGS</Link>
              <span>•</span>
              <Link to={ROUTES.ADMIN_MESSAGES} className="hover:text-black">INBOX</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;