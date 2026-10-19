import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { Search, ExternalLink, Sliders, Check, ArrowRight, Plus, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const Portfolio = () => {
  const { isAdmin, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedProject, setInspectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getCollection(COLLECTIONS.PROJECTS);
      if (data && data.length > 0) {
        setProjects(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.warn('Could not load projects from database:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    ...new Set(projects.map((p) => (p.category || 'OTHER').toUpperCase()).filter(Boolean)),
  ];

  const filtered = projects.filter((p) => {
    const pCat = (p.category || 'OTHER').toUpperCase();
    const matchesCategory = filter === 'ALL' || pCat === filter;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header Bar (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">PROJECTS & ARCHITECTURE CATALOG</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                SYSTEMS INVENTORY & ARCHITECTURES
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Catalogue of production-grade web systems, distributed microservices, APIs, and modern frontends.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_PROJECTS}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage Projects</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => {
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-150 active:scale-95 ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box with Icon */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH PROJECTS & TECH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-500 text-xs font-medium pl-9 pr-8 py-2.5 focus:outline-none focus:border-black uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
        {/* Result Counter */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            SHOWING <strong className="text-black">{filtered.length}</strong> VERIFIED ARCHITECTURES
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 hidden sm:inline">
            ALL SYSTEMS MANAGED VIA ADMIN
          </span>
        </div>

        {/* Skeleton Loading State */}
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
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-neutral-300 space-y-4">
            <p className="text-lg font-black uppercase text-black">NO MATCHING ARCHITECTURES FOUND</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              {projects.length === 0 ? 'No projects have been added yet in the Firestore database.' : 'Try adjusting your search or category filter.'}
            </p>
            {isAdmin ? (
              <Link
                to={ROUTES.ADMIN_PROJECTS}
                className="inline-block px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800"
              >
                + ADD FIRST PROJECT IN ADMIN
              </Link>
            ) : (
              <button
                onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
                className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800"
              >
                RESET ALL FILTERS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-neutral-200 hover:border-black flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                {/* Visual Area */}
                <div className="relative bg-neutral-100 aspect-[16/10] overflow-hidden border-b border-neutral-200 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between gap-2 z-10">
                    <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">
                      {project.category || 'SYSTEM'}
                    </span>
                    <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                      {project.status || 'VERIFIED'}
                    </span>
                  </div>

                  {/* Watermark Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 font-black text-6xl sm:text-7xl text-neutral-900 pointer-events-none select-none tracking-tighter">
                    {(project.title || '').slice(0, 4).toUpperCase()}
                  </div>

                  {/* Metrics Badge */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="relative z-10 flex gap-1.5 flex-wrap">
                      {project.metrics.slice(0, 2).map((m, idx) => (
                        <span key={idx} className="bg-white/95 text-black text-[10px] font-bold px-2 py-0.5 border border-neutral-300">
                          {m.label}: {m.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      SYSTEM ARCHITECTURE
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

                  {/* Tech Tags */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {(project.technologies || []).slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider border border-neutral-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        onClick={() => setInspectedProject(project)}
                        className="flex-1 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-colors duration-150 text-center active:scale-95"
                      >
                        QUICK VIEW
                      </button>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors duration-150 flex items-center gap-1"
                        >
                          <span>DEMO</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Zando Quick-View Modal ── */}
      {inspectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setInspectedProject(null)}
          />
          <div className="relative bg-white border-2 border-black max-w-2xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  SYSTEM SPECIFICATION • {inspectedProject.category}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mt-1">
                  {inspectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectedProject(null)}
                className="p-1 text-black hover:text-neutral-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {inspectedProject.description}
            </p>

            {/* Architecture Highlights */}
            {inspectedProject.architecture && inspectedProject.architecture.length > 0 && (
              <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-black block">
                  ARCHITECTURE SPECIFICATIONS:
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {inspectedProject.architecture.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics Grid */}
            {inspectedProject.metrics && (
              <div className="grid grid-cols-3 gap-3">
                {inspectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="border border-neutral-200 p-3 text-center bg-neutral-50">
                    <span className="block text-base font-black text-black">{m.value}</span>
                    <span className="text-[10px] font-bold uppercase text-neutral-500">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 block">
                INTEGRATED STACK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(inspectedProject.technologies || []).map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-3">
              {inspectedProject.liveUrl && (
                <a
                  href={inspectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>LAUNCH LIVE DEMO</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {inspectedProject.githubUrl && (
                <a
                  href={inspectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest border border-black transition-colors flex items-center gap-2 active:scale-95"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>GITHUB REPO</span>
                </a>
              )}
              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN_PROJECTS}
                  className="px-4 py-3 bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 hover:bg-neutral-200"
                >
                  Edit in Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Commercial CTA ── */}
      <section className="bg-black text-white py-14 px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          LOOKING FOR A CUSTOM ENTERPRISE SOLUTION?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-medium">
          I build tailored web applications, microservices, and databases for clients worldwide.
        </p>
        <div className="pt-2">
          <Link
            to={ROUTES.CONTACT}
            className="inline-block px-8 py-3.5 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            INQUIRE CUSTOM ARCHITECTURE &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
