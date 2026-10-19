import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Check,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const CATEGORY_OPTIONS = ['Web App', 'Mobile App', 'E-Commerce', 'Portfolio', 'Dashboard', 'API', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  category: '',
  liveUrl: '',
  githubUrl: '',
  imageUrl: '',
  technologies: '',
  featured: false,
};

/* ─── Modal ───────────────────────────────────────────────── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { ...emptyForm, ...initial, technologies: (initial.technologies || []).join(', ') }
          : emptyForm
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };
    await onSave(payload);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white border-2 border-black max-w-2xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              SYSTEM REPOSITORY
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {initial ? 'EDIT PROJECT SPEC' : 'ADD NEW ARCHITECTURE'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-black hover:text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                PROJECT TITLE *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handle}
                required
                placeholder="NEXUS CLOUD ERP"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                CATEGORY
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handle}
                className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              >
                <option value="">SELECT CATEGORY...</option>
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                LIVE DEMO URL
              </label>
              <input
                name="liveUrl"
                value={form.liveUrl}
                onChange={handle}
                placeholder="https://preview.laolimheang.space"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black tracking-wider"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                GITHUB REPOSITORY URL
              </label>
              <input
                name="githubUrl"
                value={form.githubUrl}
                onChange={handle}
                placeholder="https://github.com/heang-dev/project"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              COVER SCREENSHOT / DIAGRAM *
            </label>
            <Base64UploadZone
              currentUrl={form.imageUrl}
              onUploaded={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              placeholder="Or paste direct image URL..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black tracking-wider mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              PROJECT ARCHITECTURE DESCRIPTION
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              placeholder="Describe microservice topology, data layers, and engineering deliverables..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              TECH STACK (COMMA-SEPARATED)
            </label>
            <input
              name="technologies"
              value={form.technologies}
              onChange={handle}
              placeholder="React, Next.js, Node.js, PostgreSQL, Docker"
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="proj-featured"
              name="featured"
              checked={form.featured}
              onChange={handle}
              className="w-4 h-4 accent-black rounded-none cursor-pointer"
            />
            <label htmlFor="proj-featured" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
              MARK AS FEATURED ON HOME PAGE
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'SAVE PROJECT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────── */
const ProjectsAdmin = () => {
  const { data: projects, loading, add, update, remove } = useFirestore(COLLECTIONS.PROJECTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setEditProject(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditProject(p);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      if (editProject) {
        await update(editProject.id, payload);
        showToast('Project updated successfully.');
      } else {
        await add(payload);
        showToast('Project created successfully.');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await remove(id);
      showToast('Project deleted.');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const usedCategories = ['all', ...new Set((projects || []).map((p) => p.category).filter(Boolean))];

  const filtered = (projects || []).filter((p) => {
    const matchCat = filterCat === 'all' || p.category === filterCat;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 text-xs font-black tracking-wider uppercase border border-neutral-700 shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CORE ARCHITECTURES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              PROJECTS & PRODUCTION SYSTEMS
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Manage all engineering projects, GitHub repositories, live demo links, and technical specifications.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW PROJECT</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {usedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                filterCat === cat
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'ALL ARCHITECTURES' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            placeholder="SEARCH PROJECTS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium pl-9 pr-3 py-2 focus:outline-none focus:border-black uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
              <div className="aspect-[16/10] skeleton-shimmer" />
              <div className="h-5 w-3/4 skeleton-shimmer" />
              <div className="h-3 w-1/2 skeleton-shimmer" />
              <div className="h-10 w-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-3 bg-white">
          <FolderGit2 className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
          <p className="text-base font-black uppercase text-black">NO PROJECTS FOUND</p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Add a new project to display it on the public catalog.
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-neutral-200 hover:border-black flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] bg-neutral-100 border-b border-neutral-200 overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-4xl text-neutral-300 select-none">
                      {project.title.slice(0, 4).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {project.category || 'SYSTEM'}
                    </span>
                    {project.featured && (
                      <span className="bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>FEATURED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:underline">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Tech stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.technologies.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-neutral-100 bg-[#fafafa] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-600 hover:text-black"
                      title="Live Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-600 hover:text-black"
                      title="GitHub Repository"
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>EDIT</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editProject} />
    </div>
  );
};

export default ProjectsAdmin;
