import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';
import ImageZoomModal from '../components/common/ImageZoomModal';
import {
  Image,
  Plus,
  Edit3,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Star,
  Eye,
  ZoomIn,
  Tag,
  FolderPlus,
  SlidersHorizontal,
} from 'lucide-react';

const DEFAULT_CATEGORIES = ['Photography', 'Design', 'Web Development', 'Branding', 'Art', 'UI/UX', 'Other'];
const emptyForm = { title: '', category: 'Design', description: '', imageUrl: '', featured: false, order: 0 };

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial, availableCategories, onAddCategory }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
      setShowNewCatInput(false);
      setNewCatName('');
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const clean = newCatName.trim();
    if (onAddCategory) {
      await onAddCategory(clean);
    }
    setForm((p) => ({ ...p, category: clean }));
    setNewCatName('');
    setShowNewCatInput(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return;
    setSaving(true);
    await onSave({ ...form, order: Number(form.order) || 0 });
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
              LOOKBOOK REPOSITORY
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {initial ? 'EDIT GALLERY EXHIBIT' : 'ADD NEW GALLERY ITEM'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-black hover:text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                TITLE *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handle}
                required
                placeholder="SPATIAL HUD TELEMETRY"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  CATEGORY
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                  className="text-[10px] font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showNewCatInput ? 'SELECT EXISTING' : '+ NEW CATEGORY'}</span>
                </button>
              </div>

              {showNewCatInput ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="ENTER CATEGORY NAME..."
                    className="flex-1 bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-2.5 focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={!newCatName.trim()}
                    className="px-3 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                  >
                    ADD
                  </button>
                </div>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handle}
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              GALLERY IMAGE *
            </label>
            <Base64UploadZone
              currentUrl={form.imageUrl}
              onUploaded={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              required
              placeholder="Or paste direct image URL..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              EXHIBIT CAPTION / DESCRIPTION
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              placeholder="Visual design breakdown, component tokens, spatial layout details..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="gal-featured"
              name="featured"
              checked={form.featured}
              onChange={handle}
              className="w-4 h-4 accent-black rounded-none cursor-pointer"
            />
            <label htmlFor="gal-featured" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
              PIN AS FEATURED EXHIBIT
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
              disabled={saving || !form.imageUrl}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'SAVE EXHIBIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const GalleryAdmin = () => {
  const { data: items, loading, add, update, remove } = useFirestore(COLLECTIONS.GALLERY);
  const {
    data: customCategoryDocs,
    add: addCategoryDoc,
    remove: removeCategoryDoc,
  } = useFirestore(COLLECTIONS.GALLERY_CATEGORIES);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [zoomItem, setZoomItem] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState('');

  // Category management toolbar state
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Merge default categories, custom categories from Firestore, and any active exhibit categories
  const customCatNames = (customCategoryDocs || []).map((c) => c.name).filter(Boolean);
  const exhibitCatNames = (items || []).map((i) => i.category).filter(Boolean);
  const allAvailableCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...customCatNames, ...exhibitCatNames])
  );

  const handleAddCategory = async (name) => {
    const clean = name.trim();
    if (!clean) return;
    try {
      const exists = (customCategoryDocs || []).some(
        (c) => (c.name || '').toLowerCase() === clean.toLowerCase()
      );
      if (!exists) {
        await addCategoryDoc({ name: clean, createdAt: new Date().toISOString() });
      }
      showToast(`Category "${clean}" created successfully.`);
      setNewCategoryInput('');
    } catch (err) {
      showToast('Error creating category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (catDocId, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await removeCategoryDoc(catDocId);
      showToast(`Category "${catName}" deleted.`);
    } catch (err) {
      showToast('Error deleting category: ' + err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      if (editItem) {
        await update(editItem.id, payload);
        showToast('Gallery item updated.');
      } else {
        await add(payload);
        showToast('Gallery item created.');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await remove(id);
      showToast('Gallery item deleted.');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const usedCategories = ['all', ...allAvailableCategories];

  const filtered = (items || []).filter((i) => {
    if (filterCat === 'all') return true;
    return (i.category || '').toLowerCase() === filterCat.toLowerCase();
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
              <span>VISUAL LOOKBOOK &amp; MEDIA REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              DESIGN GALLERY &amp; LOOKBOOK EXHIBITS
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Upload and organize UI screenshots, visual design prototypes, architecture models, and lookbook media.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors cursor-pointer"
            >
              <Tag className="w-4 h-4" />
              <span>{showCategoryManager ? 'HIDE CATEGORIES' : 'MANAGE CATEGORIES'}</span>
            </button>
            <button
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>UPLOAD GALLERY ITEM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Management Bar */}
      {showCategoryManager && (
        <div className="bg-white border-2 border-black p-6 space-y-4 shadow-sm animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>CATEGORY ARCHITECTURE (CREATED BY ADMIN)</span>
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                Create new categories here. They sync in real-time across devices and appear on the public Lookbook filter.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory(newCategoryInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="NEW CATEGORY NAME..."
                className="bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium px-3 py-2 focus:outline-none focus:border-black uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={!newCategoryInput.trim()}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>CREATE</span>
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {allAvailableCategories.map((cat) => {
              const customMatch = (customCategoryDocs || []).find(
                (c) => (c.name || '').toLowerCase() === cat.toLowerCase()
              );
              return (
                <div
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-black"
                >
                  <span>{cat}</span>
                  {customMatch && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(customMatch.id, cat)}
                      className="text-neutral-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                      title={`Delete category ${cat}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-neutral-200 p-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
              filterCat.toLowerCase() === cat.toLowerCase()
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            {cat === 'all' ? 'ALL EXHIBITS' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
              <div className="aspect-[4/3] skeleton-shimmer" />
              <div className="h-5 w-1/2 skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-3 bg-white">
          <Image className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
          <p className="text-base font-black uppercase text-black">NO GALLERY ITEMS PUBLISHED</p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Upload your first design exhibit to display it in the public lookbook.
          </p>
          <button
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload First Exhibit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 hover:border-black flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div
                  className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-neutral-200 cursor-pointer"
                  onClick={() => setZoomItem(item)}
                >
                  <img
                    src={item.imageUrl || item.image || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                    <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {item.category || 'EXHIBIT'}
                    </span>
                    {item.featured && (
                      <span className="bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>FEATURED</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>INSPECT &amp; ZOOM</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:underline">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-neutral-100 bg-[#fafafa] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setEditItem(item);
                    setModalOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 transition-colors cursor-pointer"
                  title="Delete exhibit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editItem}
        availableCategories={allAvailableCategories}
        onAddCategory={handleAddCategory}
      />

      {/* Image Zoom Inspection Modal */}
      {zoomItem && (
        <ImageZoomModal
          isOpen={!!zoomItem}
          onClose={() => setZoomItem(null)}
          imageUrl={zoomItem.imageUrl || zoomItem.image || zoomItem.url}
          title={zoomItem.title}
          category={zoomItem.category}
          description={zoomItem.description}
        />
      )}
    </div>
  );
};

export default GalleryAdmin;
