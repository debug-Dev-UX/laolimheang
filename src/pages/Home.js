import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import {
  Code,
  Server,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Check,
  Sparkles,
  Sliders,
  Terminal,
  Database,
  Globe,
  Edit3
} from 'lucide-react';
import { FaGithub, FaTelegram } from 'react-icons/fa';

const Home = () => {
  const { settings, loading: settingsLoading } = useContext(SettingsContext);
  const { isAdmin, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      getCollection(COLLECTIONS.PROJECTS),
      getCollection(COLLECTIONS.SERVICES),
      getCollection(COLLECTIONS.SKILLS),
    ]).then(([pr, sr, sk]) => {
      if (!isMounted) return;
      if (pr.status === 'fulfilled' && pr.value) {
        setProjects(pr.value.sort((a, b) => (b.order || 0) - (a.order || 0)));
      }
      if (sr.status === 'fulfilled' && sr.value) {
        setServices(sr.value);
      }
      if (sk.status === 'fulfilled' && sk.value) {
        setSkills(sk.value.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const categories = ['ALL', ...new Set(projects.map((p) => (p.category || 'OTHER').toUpperCase()).filter(Boolean))];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return (p.category || '').toUpperCase() === activeFilter;
  });

  const siteName = settings?.siteName || 'LAOLIMHEANG';
  const siteTagline = settings?.siteDescription || 'Full-Stack Software Engineer & Digital Solutions Architect';
  const telegram = settings?.telegramUsername || 'laolimheang';

  const stats = [
    { value: settings?.stat1Value || '3+', label: settings?.stat1Label || 'Years of Experience' },
    { value: settings?.stat2Value || '20+', label: settings?.stat2Label || 'Projects Built' },
    { value: settings?.stat3Value || '100%', label: settings?.stat3Label || 'Client Satisfaction' },
    { value: '<50ms', label: 'Average Response Time' },
  ];

  return (
    <div className="bg-white text-neutral-900 selection:bg-black selection:text-white">
      
      {/* ── Admin Shortcut Quick Bar (When Logged in as Admin) ── */}
      {isAdmin && user && (
        <div className="bg-neutral-900 text-white text-xs py-2 px-4 border-b border-neutral-700 animate-fade-in flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold tracking-wider uppercase text-[11px]">ADMIN CONTROL MODE ACTIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.ADMIN_SETTINGS} className="hover:underline flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white">
              <Edit3 className="w-3 h-3" /> Edit Site Settings
            </Link>
            <span>•</span>
            <Link to={ROUTES.ADMIN_PROJECTS} className="hover:underline flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white">
              <Edit3 className="w-3 h-3" /> Manage Projects
            </Link>
            <span>•</span>
            <Link to={ROUTES.ADMIN_SERVICES} className="hover:underline flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white">
              <Edit3 className="w-3 h-3" /> Manage Services
            </Link>
          </div>
        </div>
      )}

      {/* ── HERO BANNER: EDITORIAL LOOKBOOK STYLE (ZANDO AESTHETIC) ── */}
      <section className="border-b border-neutral-200 bg-[#f9fafb] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Headline & Editorial Description */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Drop Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>NEW COLLECTION 2026</span>
                <span>•</span>
                <span>PRODUCTION SYSTEMS</span>
              </div>

              {/* Huge Bold Monochromatic Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-black leading-[1.08]">
                  ENGINEERED FOR <br />
                  <span className="underline decoration-4 underline-offset-8 decoration-black">
                    PERFORMANCE & SCALE
                  </span>
                </h1>
                <p className="text-base sm:text-lg font-medium text-neutral-600 max-w-xl leading-relaxed pt-2">
                  Full-stack software engineering by <strong className="text-black font-bold">{siteName}</strong>. Developing resilient web platforms, high-throughput microservices, and pixel-perfect digital user experiences.
                </p>
              </div>

              {/* Action Buttons: High-Contrast Zando Retail CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:scale-95"
                >
                  <span>EXPLORE WORK</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to={ROUTES.CONTACT}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-neutral-50 text-black text-xs font-bold tracking-[0.2em] uppercase border-2 border-black transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <span>START AN INQUIRY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Trust Specs (Zando Quality Badges) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-neutral-200">
                {stats.map((st, i) => (
                  <div key={i} className="border-l-2 border-black pl-3 transition-transform duration-200 hover:translate-x-1">
                    <span className="block text-2xl font-black text-black">{st.value}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editorial Lookbook Card / Feature Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-2xl relative transition-all duration-300 hover:-translate-y-1">
                {/* Lookbook Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-black" />
                    <span className="text-[11px] font-black tracking-widest uppercase text-neutral-500">
                      EDITION: ARCHITECTURE 2026
                    </span>
                  </div>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    HOT DROP
                  </span>
                </div>

                {/* Profile Specs */}
                <div className="py-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">ENGINEER PROFILE</span>
                    <h3 className="text-2xl font-black uppercase text-black tracking-tight">{siteName}</h3>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">{siteTagline}</p>
                  </div>

                  <div className="border-t border-b border-neutral-100 py-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-500 uppercase">Location:</span>
                      <span className="font-bold text-black">{settings?.location || 'Phnom Penh, Cambodia'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-500 uppercase">Contact Email:</span>
                      <span className="font-bold text-black">{settings?.email || 'contact@laolimheang.space'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-500 uppercase">Telegram:</span>
                      <span className="font-bold text-black">@{telegram.replace('@', '')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-500 uppercase">Availability:</span>
                      <span className="font-bold text-emerald-600 uppercase">Immediate / Open for Hire</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">VERIFIED DELIVERABLES</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold tracking-wider uppercase border border-neutral-300">
                        Zero Downtime
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold tracking-wider uppercase border border-neutral-300">
                        O(1) Data Structures
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-100 text-black text-[11px] font-bold tracking-wider uppercase border border-neutral-300">
                        Mobile Responsive
                      </span>
                      <span className="px-2.5 py-1 bg-black text-white text-[11px] font-bold tracking-wider uppercase">
                        Clean Code
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <Link
                  to={ROUTES.PORTFOLIO}
                  className="block text-center w-full py-3 bg-neutral-100 hover:bg-black hover:text-white text-black font-bold text-xs uppercase tracking-[0.2em] border border-black transition-colors duration-200"
                >
                  VIEW FULL ARCHITECTURE CATALOG &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY / DISCIPLINES GRID (ZANDO STYLE) ── */}
      <section className="py-14 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[0.15em] text-black">
              EXPLORE BY DISCIPLINE
            </h2>
            {isAdmin && user && (
              <Link to={ROUTES.ADMIN_SKILLS} className="text-xs font-bold text-black hover:underline flex items-center gap-1 uppercase tracking-wider">
                <Edit3 className="w-3.5 h-3.5" /> Manage Skills
              </Link>
            )}
          </div>

          {loading ? (
            /* Skeleton Loading for Disciplines */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border border-neutral-200 p-6 space-y-3 skeleton-shimmer h-40" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-300">
              <p className="text-xs uppercase font-bold text-neutral-500">NO SKILL DISCIPLINES CONFIGURED YET</p>
              {isAdmin && (
                <Link to={ROUTES.ADMIN_SKILLS} className="mt-2 inline-block text-xs font-bold underline uppercase">
                  Add Skills in Admin Panel &rarr;
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {skills.map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="group border border-neutral-200 bg-neutral-50 hover:border-black p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-black tracking-widest text-neutral-400">0{idx + 1}</span>
                      <span className="w-2 h-2 rounded-full bg-black group-hover:scale-125 transition-transform" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-black group-hover:underline">
                      {s.category}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                      {(s.items || []).slice(0, 3).join(' • ')}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                    <span>{(s.items || []).length} TECHNOLOGIES</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECT CATALOG GRID (ZANDO PRODUCT CARD STYLE) ── */}
      <section id="catalog" className="py-16 sm:py-20 border-b border-neutral-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b-2 border-black">
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-neutral-500 block mb-1">
                FEATURED INVENTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                PROJECTS & ARCHITECTURE
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && user && (
                <Link to={ROUTES.ADMIN_PROJECTS} className="text-xs font-bold text-black hover:underline flex items-center gap-1 uppercase tracking-wider mr-2">
                  <Edit3 className="w-3.5 h-3.5" /> Manage Projects
                </Link>
              )}

              {/* Zando Filter Tabs (Horizontal Pill Bar) */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isActive = activeFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors duration-150 ${
                        isActive
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-white text-neutral-600 hover:text-black border border-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skeleton Loading State for Projects */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
                  <div className="aspect-[16/10] skeleton-shimmer rounded-sm" />
                  <div className="h-5 skeleton-shimmer w-3/4 rounded-sm" />
                  <div className="h-4 skeleton-shimmer w-1/2 rounded-sm" />
                  <div className="h-16 skeleton-shimmer w-full rounded-sm" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-neutral-300 space-y-3">
              <p className="text-lg font-black uppercase text-black">NO PROJECTS AVAILABLE IN THIS CATEGORY</p>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Add new projects via the admin dashboard to display them here.</p>
              {isAdmin && (
                <Link to={ROUTES.ADMIN_PROJECTS} className="inline-block px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider">
                  + Add Project in Admin
                </Link>
              )}
            </div>
          ) : (
            /* Product Grid: Zando Retail Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-neutral-200 hover:border-black flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  {/* Top Image / Visual Area (Zando Product Display) */}
                  <div className="relative bg-neutral-100 aspect-[16/10] overflow-hidden border-b border-neutral-200 flex flex-col justify-between p-4">
                    {/* Status / Category Badges */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">
                        {project.category || 'SYSTEM'}
                      </span>
                      <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        {project.status || 'VERIFIED'}
                      </span>
                    </div>

                    {/* Geometric Monochromatic Accent Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 font-black text-7xl text-neutral-900 pointer-events-none select-none tracking-tighter">
                      {(project.title || '').slice(0, 4).toUpperCase()}
                    </div>

                    {/* Architecture Metrics Overlay */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="relative z-10 flex gap-2">
                        {project.metrics.slice(0, 2).map((m, idx) => (
                          <span key={idx} className="bg-white/95 text-black text-[10px] font-bold px-2 py-0.5 border border-neutral-300 shadow-sm">
                            {m.label}: {m.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        {siteName} STUDIO • VERIFIED
                      </span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:underline">
                        {project.title}
                      </h3>
                      {project.tagline && (
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                          {project.tagline}
                        </p>
                      )}
                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 pt-1">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies || []).slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider border border-neutral-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Bar (Zando Shop CTA Buttons) */}
                      <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-colors duration-150 active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <span>LIVE PREVIEW</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors duration-150 flex items-center gap-1"
                          >
                            <FaGithub className="w-3.5 h-3.5" />
                            <span>CODE</span>
                          </a>
                        ) : (
                          <Link
                            to={ROUTES.PORTFOLIO}
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors duration-150"
                          >
                            SPECS
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Full Catalog Navigation Button */}
          <div className="mt-12 text-center">
            <Link
              to={ROUTES.PORTFOLIO}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-[0.25em] border-2 border-black hover:bg-black hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span>EXPLORE ALL ARCHITECTURES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── SERVICES / SOLUTIONS (ZANDO RETAIL CARDS) ── */}
      <section className="py-16 sm:py-20 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black tracking-widest uppercase text-neutral-500">
              COMMERCIAL PACKAGES
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black">
              ENGINEERING SERVICES
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Turnkey software engineering deliverables for modern companies and venture-backed teams.
            </p>
          </div>

          {loading ? (
            /* Skeleton Loading for Services */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border-2 border-neutral-200 p-8 space-y-4 skeleton-shimmer h-96" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300">
              <p className="text-xs uppercase font-bold text-neutral-500">NO SERVICES CURRENTLY CONFIGURED</p>
              {isAdmin && (
                <Link to={ROUTES.ADMIN_SERVICES} className="mt-2 inline-block text-xs font-bold underline uppercase">
                  Add Services in Admin Panel &rarr;
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((svc, idx) => (
                <div
                  key={svc.id || idx}
                  className="border-2 border-black p-8 bg-neutral-50 flex flex-col justify-between hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-black">
                        {idx === 0 ? <Code className="w-4 h-4" /> : idx === 1 ? <Server className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
                          {svc.category || 'PACKAGE'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider bg-black text-white">
                        {svc.tag || 'AVAILABLE'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-black">
                        {svc.title}
                      </h3>
                      {svc.price && (
                        <p className="text-sm font-black text-black mt-1">
                          ${Number(svc.price).toLocaleString()} / {svc.period || 'PROJECT'}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                      {svc.description}
                    </p>

                    {svc.features && svc.features.length > 0 && (
                      <div className="pt-4 border-t border-neutral-200 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">
                          INCLUDED DELIVERABLES:
                        </span>
                        {svc.features.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-8">
                    <Link
                      to={`${ROUTES.CONTACT}?service=${encodeURIComponent(svc.title)}`}
                      className="block text-center w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-150 active:scale-95"
                    >
                      INQUIRE PACKAGE &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROMOTIONAL / CONTACT BANNER (ZANDO HIGH-CONTRAST) ── */}
      <section className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 animate-fade-in">
          <span className="inline-block px-3 py-1 bg-white text-black text-xs font-black tracking-[0.25em] uppercase">
            COMMERCIAL AVAILABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
            START YOUR SYSTEM BUILD TODAY
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Need an enterprise web application, high-throughput backend APIs, or immediate full-stack development? Connect directly with {siteName}.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={ROUTES.CONTACT}
              className="px-8 py-4 bg-white text-black hover:bg-neutral-200 text-xs font-black tracking-[0.2em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              SCHEDULE SYSTEM INQUIRY
            </Link>
            <a
              href={`https://t.me/${telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-black tracking-[0.2em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <FaTelegram className="w-4 h-4 text-sky-400" />
              <span>TELEGRAM DIRECT</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
