import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { label: 'HOME', href: ROUTES.HOME },
    { label: 'PROJECTS', href: ROUTES.PORTFOLIO },
    { label: 'SERVICES', href: ROUTES.SERVICES },
    { label: 'VAULT', href: ROUTES.PROJECT_IMAGES },
    { label: 'GALLERY', href: ROUTES.GALLERY },
    { label: 'BLOG', href: ROUTES.BLOG },
    { label: 'ABOUT', href: ROUTES.ABOUT },
    { label: 'CONTACT', href: ROUTES.CONTACT },
  ];

  return (
    <>
      {/* ── Top Announcement Bar (Zando Style) ── */}
      <div className="bg-black text-white text-[11px] sm:text-xs font-medium py-2 px-4 text-center tracking-widest uppercase border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline text-neutral-400">PHNOM PENH, CAMBODIA (UTC+7)</span>
          <span className="mx-auto md:mx-0 font-semibold tracking-wider">
            FREE INITIAL SYSTEM CONSULTATION • DELIVERING HIGH-IMPACT WEB ARCHITECTURE
          </span>
          <a
            href="https://t.me/laolimheang"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline text-neutral-300 hover:text-white underline underline-offset-2"
          >
            TELEGRAM DIRECT &rarr;
          </a>
        </div>
      </div>

      {/* ── Main Sticky Navigation (Zando Style) ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label="Open Navigation"
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 -ml-2 text-black hover:text-neutral-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* ZANDO Style High-End Monochromatic Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase text-black">
                LAOLIMHEANG
              </span>
            </Link>

            {/* Desktop Horizontal Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-xs font-bold tracking-[0.15em] transition-colors pb-1 relative ${
                      isActive
                        ? 'text-black border-b-2 border-black'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons (Zando E-Commerce Retail Look) */}
            <div className="flex items-center gap-3">
              {isAdmin && user && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 border border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Hire Me / Book Consultation Button */}
              <Link
                to={ROUTES.CONTACT}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span>HIRE ME</span>
                <span className="hidden sm:inline bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  OPEN
                </span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Drawer (Clean, Minimalist Zando Fashion Style) ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
                <span className="text-base font-black tracking-[0.2em] uppercase text-black">
                  LAOLIMHEANG
                </span>
                <button
                  type="button"
                  aria-label="Close Navigation"
                  onClick={() => setOpen(false)}
                  className="p-1 text-black hover:text-neutral-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <div className="divide-y divide-neutral-100 py-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase ${
                        isActive ? 'text-black bg-neutral-50 font-black' : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      <span>{link.label}</span>
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-neutral-200 space-y-3 bg-neutral-50">
              <Link
                to={ROUTES.CONTACT}
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                START A PROJECT
              </Link>
              <div className="text-center text-[11px] text-neutral-500 tracking-wider uppercase pt-2">
                Phnom Penh, Cambodia • Full-Stack Engineer
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
