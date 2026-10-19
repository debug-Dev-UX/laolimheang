// Admin Management for Project Images & Architectural Media
import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import {
  getStoredCategories,
  saveCustomCategory,
  deleteCustomCategory,
  resetCategoriesToDefault,
} from '../data/projectImagesData';
import { getCollection as getCollectionRaw } from '../services/firebase/firestore';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Eye,
  X,
  Settings2,
  Sparkles,
  FolderGit2,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const emptyForm = {
  projectName: '',
  projectId: '',
  title: '',
  imageType: 'Desktop UI',
  aspectRatio: '16:9',
  imageUrl: '',
  description: '',
  featured: false,
};

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial, availableProjects, categories = [], onAddCategory }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setIsCreatingCat(false);
      setNewCatName('');
      if (initial) {
        setForm({ ...emptyForm, ...initial });
      } else {
        const defaultProj = availableProjects && availableProjects.length > 0 ? availableProjects[0] : null;
        setForm({
          ...emptyForm,
          projectId: defaultProj ? defaultProj.id : 'custom',
          projectName: defaultProj ? defaultProj.title : '',
        });
      }
    }
  }, [open, initial, availableProjects]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: type === 'checkbox' ? checked : value };
      if (name === 'projectId') {
        const selected = (availableProjects || []).find((proj) => proj.id === value);
        if (selected) {
          next.projectName = selected.title;
        } else if (value === 'custom') {
          next.projectName = '';
        }
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.imageUrl) {
      setError('Please provide or upload an image asset.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        projectName: (form.projectName || 'General Project').trim(),
        projectId: form.projectId || 'proj-general',
        title: (form.title || 'Project Screenshot').trim(),
        imageType: form.imageType || 'Desktop UI',
        aspectRatio: form.aspectRatio || '16:9',
        imageUrl: form.imageUrl,
        description: (form.description || '').trim(),
        featured: Boolean(form.featured),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error saving project image:', err);
      setError(err?.message || 'Failed to save project image. Check connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white border-2 border-black max-w-2xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              PROJECT REPOSITORY
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {initial ? 'EDIT PROJECT ASSET' : 'ADD NEW PROJECT ASSET'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-black hover:text-neutral-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-neutral-100 border border-neutral-300 text-xs font-bold text-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-black shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Target Project Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                TARGET PROJECT *
              </label>
              {availableProjects && availableProjects.length > 0 ? (
                <select
                  name="projectId"
                  value={form.projectId}
                  onChange={handle}
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black cursor-pointer uppercase"
                >
                  {availableProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                  <option value="custom">-- Custom / Other Project --</option>
                </select>
              ) : (
                <input
                  name="projectName"
                  value={form.projectName}
                  onChange={handle}
                  required
                  placeholder="Enter project name..."
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black uppercase"
                />
              )}
            </div>

            {availableProjects && availableProjects.length > 0 && form.projectId === 'custom' && (
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  CUSTOM PROJECT NAME *
                </label>
                <input
                  name="projectName"
                  value={form.projectName}
                  onChange={handle}
                  required
                  placeholder="Enter project name..."
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black uppercase"
                />
              </div>
            )}

            {/* Category / Type */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  ASSET CATEGORY *
                </label>
                {!isCreatingCat && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCat(true)}
                    className="text-[10px] font-black uppercase tracking-wider text-black hover:underline"
                  >
                    + NEW CATEGORY
                  </button>
                )}
              </div>
              {isCreatingCat ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Mobile UI..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-bold px-3 py-2 focus:outline-none focus:border-black"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      const added = onAddCategory(newCatName);
                      setForm((p) => ({ ...p, imageType: added }));
                      setNewCatName('');
                      setIsCreatingCat(false);
                    }}
                    className="px-3 bg-black text-white text-xs font-bold uppercase"
                  >
                    ADD
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCat(false);
                      setNewCatName('');
                    }}
                    className="px-2 border border-neutral-300 text-neutral-600 hover:text-black flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <select
                  name="imageType"
                  value={form.imageType}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setIsCreatingCat(true);
                    } else {
                      handle(e);
                    }
                  }}
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black cursor-pointer uppercase"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__new__">+ Create New Category...</option>
                </select>
              )}
            </div>
          </div>

          {/* Asset Title */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              ASSET TITLE / LABEL *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              required
              placeholder="e.g. High-Volume Checkout Flow..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black"
            />
          </div>

          {/* Image Upload Zone */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              MEDIA ASSET *
            </label>
            <Base64UploadZone
              label="Asset File"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
              maxSizeKB={3072}
            />
          </div>

          {/* Aspect Ratio & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                ASPECT RATIO
              </label>
              <select
                name="aspectRatio"
                value={form.aspectRatio}
                onChange={handle}
                className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-3 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="16:9">16:9 (Landscape Desktop)</option>
                <option value="9:16">9:16 (Vertical Mobile)</option>
                <option value="4:3">4:3 (Standard Preview)</option>
                <option value="Auto">Auto (Original)</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handle}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  FEATURE AS KEY PREVIEW
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              TECHNICAL CONTEXT / ARCHITECTURE HIGHLIGHTS
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              placeholder="Describe components, state machine, figma specifications, or throughput..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black resize-vertical"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {saving ? 'SAVING...' : initial ? 'UPDATE ASSET' : 'SAVE ASSET'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Preview Modal ─── */
const PreviewModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white border-2 border-black p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              {item.projectName} &bull; {item.imageType}
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-black">
              {item.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-black hover:text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-neutral-100 border border-neutral-200">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[68vh] w-auto object-contain"
          />
        </div>
        {item.description && (
          <p className="text-xs text-neutral-600 font-medium">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ProjectImagesAdmin() {
  const { data: rawImages, loading, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.PROJECT_IMAGES);
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [toast, setToast] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setCategories(getStoredCategories());
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const list = await getCollectionRaw(COLLECTIONS.PROJECTS);
        if (list && list.length > 0) {
          setProjects(list);
        }
      } catch (e) {
        console.warn('Projects fetch fallback:', e);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (rawImages && rawImages.length > 0) {
      setImages(rawImages);
    } else {
      try {
        const saved = localStorage.getItem('custom_project_images');
        if (saved) {
          setImages(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, [rawImages]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddCategory = (name) => {
    const updated = saveCustomCategory(name);
    setCategories(updated);
    showToast(`Category "${name}" created.`);
    return name;
  };

  const handleDeleteCategory = (name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    const updated = deleteCustomCategory(name);
    setCategories(updated);
    if (selectedType === name) setSelectedType('All');
    showToast(`Category "${name}" removed.`);
  };

  const copyUrl = (url, id, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      showToast('Image URL copied to clipboard.');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateDoc(editItem.id, data);
        const updated = images.map((item) =>
          item.id === editItem.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
        );
        setImages(updated);
        try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
        showToast('Project asset updated.');
      } else {
        const res = await addDoc(data);
        const newImg = res || { id: `pimg-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        const updated = [newImg, ...images];
        setImages(updated);
        try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
        showToast('Project asset created successfully.');
      }
    } catch (err) {
      console.warn('Firestore fallback write:', err);
      const fallbackImg = {
        id: editItem ? editItem.id : `local-pimg-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      let updated;
      if (editItem) {
        updated = images.map((item) => (item.id === editItem.id ? fallbackImg : item));
        showToast('Asset updated (Saved locally).');
      } else {
        updated = [fallbackImg, ...images];
        showToast('Asset added (Saved locally).');
      }
      setImages(updated);
      try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project asset permanently?')) return;
    try {
      await deleteDoc(id);
    } catch (err) {
      console.warn('Firestore delete fallback:', err);
    }
    const updated = images.filter((item) => item.id !== id);
    setImages(updated);
    try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
    showToast('Asset deleted.');
  };

  const projectList = images.length > 0
    ? ['All', ...new Set(images.map((img) => img.projectName).filter(Boolean))]
    : [];

  const filtered = images.filter((img) => {
    const matchProject = selectedProject === 'All' || img.projectName === selectedProject;
    const matchType = selectedType === 'All' || img.imageType === selectedType;
    const matchSearch =
      !search ||
      img.title?.toLowerCase().includes(search.toLowerCase()) ||
      img.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      img.description?.toLowerCase().includes(search.toLowerCase());
    return matchProject && matchType && matchSearch;
  });

  const dynamicCategories = ['All', ...categories];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 text-xs font-black uppercase tracking-wider bg-black text-white border border-neutral-700 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-3">
            <Layers className="w-3 h-3" />
            <span>ARCHITECTURAL ASSETS &amp; SCHEMAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            PROJECT VAULT
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Manage screenshots, architecture blueprints, and mobile UI mockups mapped to projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-4 py-3 border border-neutral-300 hover:border-black text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>CATEGORIES</span>
          </button>
          <button
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>ADD ASSET</span>
          </button>
        </div>
      </div>

      {/* Filters Ribbon */}
      <div className="space-y-4">
        {/* Project Filter Pills */}
        {projectList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 shrink-0 mr-1">
              PROJECT:
            </span>
            {projectList.map((pName) => (
              <button
                key={pName}
                onClick={() => setSelectedProject(pName)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                  selectedProject === pName
                    ? 'bg-black text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                }`}
              >
                {pName}
              </button>
            ))}
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH ASSETS, BLUEPRINTS, SCHEMAS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 text-black placeholder-neutral-400 text-xs font-medium focus:outline-none focus:border-black uppercase tracking-wider"
            />
          </div>

          {/* Categories Pill list */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {dynamicCategories.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedType === type
                    ? 'bg-black text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Assets */}
      {loading && images.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 p-4 space-y-3 animate-pulse">
              <div className="aspect-video bg-neutral-100" />
              <div className="h-4 bg-neutral-100 w-3/4" />
              <div className="h-3 bg-neutral-100 w-1/2" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-black">
            PROJECT VAULT IS EMPTY
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto font-medium">
            No architecture diagrams, UI mockups, or screenshots stored yet. Click below to add your first asset.
          </p>
          <button
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>UPLOAD FIRST ASSET</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center space-y-3">
          <Search className="w-6 h-6 text-neutral-400 mx-auto" />
          <h3 className="text-base font-black uppercase tracking-tight text-black">
            NO MATCHING ASSETS FOUND
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            Try adjusting your search criteria or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="bg-white border border-neutral-200 hover:border-black transition-all group flex flex-col"
            >
              {/* Asset Media Preview */}
              <div
                className="relative aspect-video bg-neutral-100 overflow-hidden cursor-pointer"
                onClick={() => setPreviewItem(img)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <span className="bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
                    {img.imageType}
                  </span>
                  {img.featured && (
                    <span className="bg-white text-black border border-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      KEY
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">EXPAND</span>
                </div>
              </div>

              {/* Asset Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block truncate">
                    {img.projectName || 'GENERAL ASSET'}
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-tight text-black truncate mt-0.5">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-xs text-neutral-500 font-medium line-clamp-2 mt-1">
                      {img.description}
                    </p>
                  )}
                </div>

                {/* Toolbar */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={(e) => copyUrl(img.imageUrl, img.id, e)}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
                  >
                    {copiedId === img.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY LINK</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditItem(img);
                        setModalOpen(true);
                      }}
                      className="p-1.5 border border-neutral-200 hover:border-black text-black transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(img.id, e)}
                      className="p-1.5 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editItem}
        availableProjects={projects}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Preview Lightbox Modal */}
      <PreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      {/* Category Management Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setShowCatModal(false)} />
          <div className="relative bg-white border-2 border-black max-w-lg w-full p-6 sm:p-8 z-10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  CLASSIFICATION
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  MANAGE ASSET CATEGORIES
                </h3>
              </div>
              <button onClick={() => setShowCatModal(false)} className="p-1 text-black hover:text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add Category Form */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                CREATE NEW CATEGORY
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 3D Render, Blueprint..."
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCatInput.trim()) {
                        handleAddCategory(newCatInput);
                        setNewCatInput('');
                      }
                    }
                  }}
                  className="flex-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-2.5 focus:outline-none focus:border-black uppercase"
                />
                <button
                  onClick={() => {
                    if (newCatInput.trim()) {
                      handleAddCategory(newCatInput);
                      setNewCatInput('');
                    }
                  }}
                  className="px-4 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider"
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                EXISTING CATEGORIES ({categories.length})
              </label>
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 border border-neutral-200">
                {categories.map((c) => (
                  <div key={c} className="flex items-center justify-between p-2.5 hover:bg-neutral-50">
                    <span className="text-xs font-bold uppercase text-black">{c}</span>
                    <button
                      onClick={() => handleDeleteCategory(c)}
                      className="p-1 text-neutral-400 hover:text-black transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
              <button
                onClick={() => {
                  if (window.confirm('Reset all categories back to default taxonomy?')) {
                    const res = resetCategoriesToDefault();
                    setCategories(res);
                    showToast('Categories reset to defaults.');
                  }
                }}
                className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black underline"
              >
                RESET TO DEFAULTS
              </button>
              <button
                onClick={() => setShowCatModal(false)}
                className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
