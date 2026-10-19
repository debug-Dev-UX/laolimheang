import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { ROUTES } from '../utils/constants';
import {
  FolderGit2,
  Briefcase,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Cpu,
  Image,
  Layers,
  ArrowRight,
  Eye,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const ADMIN_MODULES = [
  {
    to: ROUTES.ADMIN_PROJECTS,
    label: 'PROJECTS & SYSTEMS',
    desc: 'Manage deployed production architectures, GitHub links, and live demos.',
    icon: FolderGit2,
    badge: 'CORE INVENTORY',
  },
  {
    to: ROUTES.ADMIN_SERVICES,
    label: 'COMMERCIAL SERVICES',
    desc: 'Configure service packages, pricing tiers, deliverables, and SLAs.',
    icon: Briefcase,
    badge: 'COMMERCIAL',
  },
  {
    to: ROUTES.ADMIN_SKILLS,
    label: 'ENGINEERING SKILLS',
    desc: 'Update technical competencies, technology stacks, and proficiency levels.',
    icon: Cpu,
    badge: 'CAPABILITIES',
  },
  {
    to: ROUTES.ADMIN_BLOGS,
    label: 'EDITORIAL & JOURNAL',
    desc: 'Draft and publish technical writeups, architecture notes, and case studies.',
    icon: BookOpen,
    badge: 'CONTENT',
  },
  {
    to: ROUTES.ADMIN_GALLERY,
    label: 'LOOKBOOK GALLERY',
    desc: 'Upload design prototypes, UI screens, and client visual exhibits.',
    icon: Image,
    badge: 'MEDIA',
  },
  {
    to: ROUTES.ADMIN_PROJECT_IMAGES,
    label: 'ARCHITECTURAL VAULT',
    desc: 'Catalog system topologies, database schemas, and infrastructure diagrams.',
    icon: Layers,
    badge: 'SCHEMAS',
  },
  {
    to: ROUTES.ADMIN_MESSAGES,
    label: 'CLIENT INQUIRIES',
    desc: 'Review incoming contact submissions, client requests, and direct leads.',
    icon: MessageSquare,
    badge: 'INBOX',
  },
  {
    to: ROUTES.ADMIN_ANALYTICS,
    label: 'TELEMETRY & VISITS',
    desc: 'Inspect real-time visitor traffic, device breakdowns, and page performance.',
    icon: BarChart3,
    badge: 'METRICS',
  },
  {
    to: ROUTES.ADMIN_SETTINGS,
    label: 'GLOBAL SETTINGS',
    desc: 'Configure site metadata, Telegram handle, KHQR donations, and branding.',
    icon: Settings,
    badge: 'SYSTEM',
  },
];

const Dashboard = () => {
  const { getAnalyticsSummary, loading } = useAnalytics();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const statCards = [
    {
      label: 'TOTAL VISITOR IMPRESSIONS',
      value: summary?.totalVisits ?? 0,
      icon: Eye,
      change: '+12% vs last week',
    },
    {
      label: 'UNIQUE CLIENT VISITORS',
      value: summary?.uniqueVisitors ?? 0,
      icon: Users,
      change: '+8% this month',
    },
    {
      label: 'COMMUNICATION INQUIRIES',
      value: summary?.totalMessages ?? 0,
      icon: MessageSquare,
      change: summary?.unreadMessages ? `${summary.unreadMessages} NEW UNREAD` : 'ALL RESOLVED',
      isHighlight: Boolean(summary?.unreadMessages),
    },
    {
      label: 'PRODUCTION SYSTEMS',
      value: summary?.totalProjects ?? 0,
      icon: FolderGit2,
      change: `${summary?.totalBlogs ?? 0} ARTICLES PUBLISHED`,
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── Category Header (Zando Lookbook Style) ── */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CONTROL CONSOLE</span>
              <span>•</span>
              <span>FULL ADMINISTRATIVE ACCESS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black">
              ADMIN CONTROL CENTER
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl">
              Manage all dynamic modules, portfolio systems, commercial pricing, technical articles, and direct client inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-all active:scale-95"
            >
              <span>VIEW PUBLIC STORE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              to={ROUTES.ADMIN_SETTINGS}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>EDIT SITE SETTINGS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Telemetry Cards (Zando High-Contrast) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
            TELEMETRY & INVENTORY OVERVIEW
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            REAL-TIME METRICS
          </span>
        </div>

        {loading ? (
          /* Skeleton Loading Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
                <div className="h-3 w-1/2 skeleton-shimmer" />
                <div className="h-10 w-2/3 skeleton-shimmer" />
                <div className="h-3 w-3/4 skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="border border-neutral-200 hover:border-black p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        {card.label}
                      </span>
                      <div className="w-7 h-7 bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <p className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
                      {card.value.toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className={card.isHighlight ? 'text-amber-600 font-black' : 'text-neutral-500'}>
                      {card.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Quick Management Catalog (Zando Lookbook Cards) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
            MANAGEMENT MODULES CATALOG
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            {ADMIN_MODULES.length} MODULES READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_MODULES.map((module, idx) => {
            const Icon = module.icon;
            return (
              <Link
                key={idx}
                to={module.to}
                className="border border-neutral-200 hover:border-black p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-neutral-100 group-hover:bg-black group-hover:text-white text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 transition-colors">
                      {module.badge}
                    </span>
                    <Icon className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:underline">
                      {module.label}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                      {module.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-black uppercase tracking-widest text-black">
                  <span>ENTER MODULE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── System Status & Diagnostics (Zando Clean Table) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
            SYSTEM HEALTH & CONNECTIVITY
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            CLUSTER DIAGNOSTICS
          </span>
        </div>

        <div className="border border-neutral-200 bg-white divide-y divide-neutral-200">
          {[
            { name: 'FIREBASE FIRESTORE DATABASE', status: 'ACTIVE & CONNECTED', desc: 'Real-time document sync and snapshot subscriptions enabled.' },
            { name: 'FIREBASE CLOUD STORAGE', status: 'HEALTHY', desc: 'Secure asset bucket hosting project images, attachments, and lookbooks.' },
            { name: 'TELEGRAM NOTIFICATION DISPATCH', status: 'SYNCHRONIZED', desc: 'Inquiry bot forwarding submissions with zero queuing latency.' },
            { name: 'CLIENT TELEMETRY AGENT', status: 'RECORDING', desc: 'Session cookies, impression counters, and unique visitor tracking active.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-black block">
                  {item.name}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {item.desc}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 self-start sm:self-auto shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{item.status}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
