import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';
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
} from 'lucide-react';

const CATEGORIES = ['Photography', 'Design', 'Web Development', 'Branding', 'Art', 'UI/UX', 'Other'];
const emptyForm = { title: '', category: 'Design', description: '', imageUrl: '', featured: false, order: 0 };

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
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
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                CATEGORY
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handle}
                className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
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

  const usedCategories = ['all', ...new Set((items || []).map((i) => i.category).filter(Boolean))];

  const filtered = (items || []).filter((i) => {
    if (filterCat === 'all') return true;
    return i.category === filterCat;
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
              <span>VISUAL LOOKBOOK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              DESIGN GALLERY & LOOKBOOK EXHIBITS
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Upload and organize UI screenshots, visual design prototypes, architecture models, and lookbook media.
            </p>
          </div>

          <button
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>UPLOAD GALLERY ITEM</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-neutral-200 p-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
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
                <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-neutral-200">
                  <img
                    src={item.imageUrl || item.image || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
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
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 transition-colors"
                  title="Delete exhibit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editItem} />
    </div>
  );
};

export default GalleryAdmin;
