import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { subscribeToDocument, setDocument } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone, processLargeImage } from '../components/admin/Base64UploadZone';
import ImageZoomModal from '../components/common/ImageZoomModal';
import { ImageCropModal } from '../components/common/ImageCropModal';
import {
  Image,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  Sparkles,
  CheckCircle2,
  Star,
  Eye,
  ZoomIn,
  Tag,
  ArrowUpDown,
  Pin,
  Calendar,
  HardDrive,
  Layers,
  Crop,
  UploadCloud,
  Loader2,
} from 'lucide-react';

const emptyForm = { title: '', category: '', description: '', imageUrl: '', images: [], featured: false, order: 0, size: 0 };

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial, availableCategories, onAddCategory }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [validationError, setValidationError] = useState('');

  // Album & Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetIndex, setCropTargetIndex] = useState(null);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [batchUploading, setBatchUploading] = useState(false);
  const [newUrlInput, setNewUrlInput] = useState('');

  useEffect(() => {
    if (open) {
      const defaultCategory = initial?.category || (availableCategories && availableCategories[0]) || '';
      const existingImg = initial?.imageUrl || initial?.image || initial?.url || '';
      const existingImages = Array.isArray(initial?.images) && initial.images.length > 0
        ? initial.images
        : (existingImg ? [existingImg] : []);

      setForm(
        initial
          ? { ...emptyForm, ...initial, imageUrl: existingImg, images: existingImages }
          : { ...emptyForm, category: defaultCategory, images: [] }
      );
      setShowNewCatInput(availableCategories.length === 0);
      setNewCatName('');
      setValidationError('');
      setCropModalOpen(false);
      setCropTargetIndex(null);
      setCropImageUrl('');
      setNewUrlInput('');
    }
  }, [open, initial, availableCategories]);

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

  // Batch upload multiple photos into the album
  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBatchUploading(true);
    setValidationError('');

    try {
      const converted = [];
      for (const file of files) {
        const dataUrl = await processLargeImage(file);
        if (dataUrl) converted.push(dataUrl);
      }

      setForm((p) => {
        const combined = [...(p.images || []), ...converted];
        return {
          ...p,
          images: combined,
          imageUrl: p.imageUrl || combined[0] || '',
        };
      });
    } catch (err) {
      setValidationError('Failed to process photos: ' + err.message);
    } finally {
      setBatchUploading(false);
      e.target.value = '';
    }
  };

  // Add individual URL to album
  const handleAddUrl = (e) => {
    e.preventDefault();
    const clean = newUrlInput.trim();
    if (!clean) return;
    setForm((p) => {
      const combined = [...(p.images || []), clean];
      return {
        ...p,
        images: combined,
        imageUrl: p.imageUrl || combined[0] || '',
      };
    });
    setNewUrlInput('');
  };

  // Set an image as the album cover
  const handleSetCover = (url) => {
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  // Open cropper on a specific photo
  const handleOpenCrop = (url, index = null) => {
    setCropImageUrl(url);
    setCropTargetIndex(index);
    setCropModalOpen(true);
  };

  // Apply crop result
  const handleCropDone = (croppedUrl) => {
    if (cropTargetIndex !== null && cropTargetIndex >= 0) {
      setForm((p) => {
        const updated = [...(p.images || [])];
        const wasCover = p.imageUrl === updated[cropTargetIndex] || cropTargetIndex === 0;
        updated[cropTargetIndex] = croppedUrl;
        return {
          ...p,
          images: updated,
          imageUrl: wasCover ? croppedUrl : p.imageUrl,
        };
      });
    } else {
      setForm((p) => {
        const currentList = p.images || [];
        const isAlreadyIn = currentList.includes(p.imageUrl);
        return {
          ...p,
          imageUrl: croppedUrl,
          images: isAlreadyIn
            ? currentList.map((img) => (img === p.imageUrl ? croppedUrl : img))
            : [croppedUrl, ...currentList],
        };
      });
    }
    setCropModalOpen(false);
  };

  // Remove photo from album
  const handleRemovePhoto = (idx) => {
    setForm((p) => {
      const updated = (p.images || []).filter((_, i) => i !== idx);
      const isRemovingCover = p.imageUrl === (p.images || [])[idx];
      return {
        ...p,
        images: updated,
        imageUrl: isRemovingCover ? (updated[0] || '') : p.imageUrl,
      };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const finalImages = form.images && form.images.length > 0
      ? form.images
      : (form.imageUrl ? [form.imageUrl] : []);
    const coverImage = form.imageUrl || finalImages[0] || '';

    if (!coverImage && finalImages.length === 0) {
      setValidationError('Please select or upload at least one image before saving.');
      return;
    }
    setValidationError('');
    setSaving(true);
    await onSave({
      ...form,
      imageUrl: coverImage,
      images: finalImages,
      order: Number(form.order) || 0,
      size: Number(form.size) || (coverImage ? Math.round(coverImage.length * 0.75) : 0),
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white border-2 border-black max-w-3xl w-full p-5 sm:p-8 z-10 max-h-[95vh] sm:max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              LOOKBOOK REPOSITORY
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>{initial ? 'EDIT GALLERY EXHIBIT' : 'ADD NEW GALLERY ITEM'}</span>
              {form.images?.length > 1 && (
                <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  ALBUM ({form.images.length} PHOTOS)
                </span>
              )}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-black hover:text-neutral-500 cursor-pointer" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider">
            {validationError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
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
                  CATEGORY *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                  className="text-[10px] font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showNewCatInput ? 'SELECT EXISTING' : '+ NEW CATEGORY'}</span>
                </button>
              </div>

              {showNewCatInput || availableCategories.length === 0 ? (
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
                    className="px-3 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                  >
                    ADD
                  </button>
                </div>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handle}
                  required
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* ── Multi-Image Album Section ── */}
          <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-black" />
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  ALBUM PHOTOS ({form.images?.length || 0} IMAGES)
                </span>
              </div>

              {/* Upload Multiple Photos Button */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs active:scale-95 transition-all">
                {batchUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>+ ADD PHOTOS TO ALBUM</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBatchUpload}
                  disabled={batchUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Primary Cover Upload Zone */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                PRIMARY EXHIBIT COVER PHOTO
              </span>
              <Base64UploadZone
                currentUrl={form.imageUrl}
                onUploaded={(url, size) => {
                  setForm((p) => {
                    const currentList = p.images || [];
                    const combined = currentList.includes(url) ? currentList : [url, ...currentList];
                    return {
                      ...p,
                      imageUrl: url,
                      images: combined,
                      size: size || p.size || 0,
                    };
                  });
                  setValidationError('');
                }}
              />
            </div>

            {/* Add photo by direct URL input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                placeholder="Or paste image URL to append into album..."
                className="flex-1 bg-white border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-2.5 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!newUrlInput.trim()}
                className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                + ADD URL
              </button>
            </div>

            {/* Album Images Grid with Cover selector, Cropper & Delete */}
            {form.images && form.images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                  MANAGE ALBUM PHOTOS (CLICK TO CROP / RE-CENTER OR SET AS COVER):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {form.images.map((imgUrl, idx) => {
                    const isCover = (form.imageUrl && form.imageUrl === imgUrl) || (!form.imageUrl && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`relative group bg-white border-2 p-1.5 flex flex-col justify-between ${
                          isCover ? 'border-black ring-2 ring-amber-400' : 'border-neutral-200'
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={`Album ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isCover && (
                            <span className="absolute top-1 left-1 bg-amber-400 text-black text-[8px] font-black uppercase px-1.5 py-0.5 tracking-wider shadow-xs">
                              COVER
                            </span>
                          )}
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-mono px-1">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Action buttons under thumbnail */}
                        <div className="mt-1.5 flex items-center justify-between gap-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(imgUrl)}
                              className="text-[9px] font-black uppercase text-neutral-600 hover:text-black hover:underline cursor-pointer"
                              title="Set as album cover"
                            >
                              SET COVER
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenCrop(imgUrl, idx)}
                            className="text-[9px] font-black uppercase bg-neutral-100 hover:bg-neutral-200 text-black px-1.5 py-0.5 flex items-center gap-0.5 cursor-pointer"
                            title="Crop and center this photo"
                          >
                            <Crop className="w-2.5 h-2.5" />
                            <span>CROP</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer ml-auto"
                            title="Remove photo from album"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

          <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200">
            <input
              type="checkbox"
              id="gal-featured"
              name="featured"
              checked={form.featured}
              onChange={handle}
              className="w-5 h-5 accent-black rounded-none cursor-pointer"
            />
            <div>
              <label htmlFor="gal-featured" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 fill-black" />
                <span>PIN AS FEATURED EXHIBIT (ALWAYS STAYS ON TOP)</span>
              </label>
              <p className="text-[11px] text-neutral-500 font-medium">
                Pinned items will always stay at the top of the gallery on both mobile and desktop.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {saving ? 'SAVING...' : 'SAVE EXHIBIT'}
            </button>
          </div>
        </form>
      </div>

      {/* Individual Photo Cropping Modal */}
      {cropModalOpen && cropImageUrl && (
        <ImageCropModal
          isOpen={cropModalOpen}
          imageUrl={cropImageUrl}
          onClose={() => {
            setCropModalOpen(false);
            setCropTargetIndex(null);
            setCropImageUrl('');
          }}
          onCropComplete={handleCropDone}
        />
      )}
    </div>
  );
};

/* ─── Main Component ─── */
const GalleryAdmin = () => {
  const { data: items, loading, add, update, remove } = useFirestore(COLLECTIONS.GALLERY);
  const [categories, setCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [zoomItem, setZoomItem] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'size-desc' | 'size-asc'
  const [toast, setToast] = useState('');

  // Category management toolbar state
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(true);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Real-time synchronization of categories from Firebase Cloud (settings/gallery_categories)
  useEffect(() => {
    try {
      localStorage.removeItem('firestore_cache_gallery_categories');
    } catch (e) {}

    const unsubscribe = subscribeToDocument(COLLECTIONS.SETTINGS, 'gallery_categories', (doc) => {
      if (doc && Array.isArray(doc.list)) {
        const parsed = doc.list.map((c, idx) =>
          typeof c === 'string' ? { id: `cat-${idx}-${c.toLowerCase()}`, name: c } : c
        );
        setCategories(parsed);
      } else {
        setCategories([]);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const availableCategories = categories.map((c) => c.name?.trim()).filter(Boolean);

  const handleAddCategory = async (name) => {
    const clean = name.trim();
    if (!clean) return;
    const exists = categories.some((c) => c.name.toLowerCase() === clean.toLowerCase());
    if (exists) {
      showToast(`Category "${clean}" already exists.`);
      return;
    }
    const newCat = { id: `cat-${Date.now()}`, name: clean };
    const updated = [...categories, newCat];
    try {
      await setDocument(COLLECTIONS.SETTINGS, 'gallery_categories', {
        list: updated,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Category "${clean}" created in cloud.`);
      setNewCategoryInput('');
    } catch (err) {
      showToast('Error creating category: ' + err.message);
    }
  };

  const handleStartEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEditCategory = async (catId, oldName) => {
    const clean = editingCatName.trim();
    if (!clean || clean.toLowerCase() === oldName.toLowerCase()) {
      setEditingCatId(null);
      return;
    }
    const updated = categories.map((c) => (c.id === catId ? { ...c, name: clean } : c));
    try {
      await setDocument(COLLECTIONS.SETTINGS, 'gallery_categories', {
        list: updated,
        updatedAt: new Date().toISOString(),
      });

      // Synchronize any exhibits that were tagged with the old category name
      const affectedItems = (items || []).filter(
        (i) => (i.category || '').toLowerCase() === oldName.toLowerCase()
      );
      for (const it of affectedItems) {
        await update(it.id, { category: clean });
      }

      showToast(`Category updated to "${clean}".`);
      setEditingCatId(null);
      setEditingCatName('');
    } catch (err) {
      showToast('Error updating category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}" across all devices?`)) return;
    const updated = categories.filter((c) => c.id !== catId);
    try {
      await setDocument(COLLECTIONS.SETTINGS, 'gallery_categories', {
        list: updated,
        updatedAt: new Date().toISOString(),
      });
      showToast(`Category "${catName}" deleted from cloud.`);
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

  const usedCategories = ['all', ...availableCategories];

  const filtered = (items || []).filter((i) => {
    if (filterCat === 'all') return true;
    return (i.category || '').toLowerCase() === filterCat.toLowerCase();
  });

  // SORTING ALGORITHM: PINNED / FEATURED ITEMS ALWAYS STAY ON TOP!
  const sorted = [...filtered].sort((a, b) => {
    // 1. PINNED ITEMS ALWAYS STAY ON TOP
    const aPinned = a.featured ? 1 : 0;
    const bPinned = b.featured ? 1 : 0;
    if (aPinned !== bPinned) {
      return bPinned - aPinned; // pinned first!
    }

    // 2. Secondary sort criteria
    if (sortBy === 'newest') {
      const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return dateA - dateB;
    }
    if (sortBy === 'size-desc') {
      const sizeA = Number(a.size || (a.imageUrl ? a.imageUrl.length : 0)) || 0;
      const sizeB = Number(b.size || (b.imageUrl ? b.imageUrl.length : 0)) || 0;
      return sizeB - sizeA;
    }
    if (sortBy === 'size-asc') {
      const sizeA = Number(a.size || (a.imageUrl ? a.imageUrl.length : 0)) || 0;
      const sizeB = Number(b.size || (b.imageUrl ? b.imageUrl.length : 0)) || 0;
      return sizeA - sizeB;
    }
    return (b.order || 0) - (a.order || 0);
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    const num = Number(bytes);
    if (num > 1024 * 1024) return (num / (1024 * 1024)).toFixed(1) + ' MB';
    if (num > 1024) return Math.round(num / 1024) + ' KB';
    return num + ' B';
  };

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
                <span>CATEGORY ARCHITECTURE (CLOUD SYNCED ACROSS DEVICES)</span>
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                Create, edit, or delete categories here. They sync in real-time across all devices with zero demo data.
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

          <div className="flex flex-wrap gap-2.5 pt-1">
            {categories.length === 0 ? (
              <div className="p-4 border border-dashed border-neutral-300 text-center w-full text-neutral-400 text-xs font-medium uppercase tracking-wider">
                NO CATEGORIES CREATED YET. ENTER A NAME ABOVE AND CLICK "CREATE" TO ADD YOUR FIRST CATEGORY.
              </div>
            ) : (
              categories.map((cat) => {
                const isEditing = editingCatId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-black hover:border-black transition-colors"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="bg-white border border-neutral-400 text-black text-xs font-bold px-2 py-0.5 focus:outline-none focus:border-black uppercase"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditCategory(cat.id, cat.name)}
                          className="text-emerald-600 hover:text-emerald-700 p-0.5 cursor-pointer"
                          title="Save category name"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="text-neutral-400 hover:text-black p-0.5 cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-1 border-l border-neutral-300 pl-1.5 ml-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(cat)}
                            className="text-neutral-400 hover:text-black transition-colors p-0.5 cursor-pointer"
                            title={`Edit category ${cat.name}`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                            title={`Delete category ${cat.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs & Real-Time Sort Controls */}
      <div className="bg-white border border-neutral-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
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

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-100 border border-neutral-300 text-black text-xs font-bold p-2 focus:outline-none focus:border-black uppercase tracking-wider cursor-pointer"
          >
            <option value="newest">LATEST DATE (NEWEST)</option>
            <option value="oldest">OLDEST DATE</option>
            <option value="size-desc">LARGEST FILE SIZE</option>
            <option value="size-asc">SMALLEST FILE SIZE</option>
          </select>
        </div>
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
      ) : sorted.length === 0 ? (
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
          {sorted.map((item) => (
            <div
              key={item.id}
              className={`bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between ${
                item.featured ? 'border-2 border-black' : 'border-neutral-200 hover:border-black'
              }`}
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
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {item.category || 'EXHIBIT'}
                    </span>
                    {item.featured && (
                      <span className="bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1 shadow-xs">
                        <Pin className="w-2.5 h-2.5 fill-black" />
                        <span>PINNED TO TOP</span>
                      </span>
                    )}
                    {item.images && item.images.length > 1 && (
                      <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1 shadow-xs border border-white/20">
                        <Layers className="w-2.5 h-2.5" />
                        <span>{item.images.length} PHOTOS</span>
                      </span>
                    )}
                  </div>
                  {item.size && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <span className="bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5">
                        {formatFileSize(item.size)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>INSPECT &amp; ZOOM</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:underline">
                      {item.title}
                    </h3>
                  </div>
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
        availableCategories={availableCategories}
        onAddCategory={handleAddCategory}
      />

      {/* Image Zoom Inspection Modal */}
      {zoomItem && (
        <ImageZoomModal
          isOpen={!!zoomItem}
          onClose={() => setZoomItem(null)}
          imageUrl={zoomItem.imageUrl || zoomItem.image || zoomItem.url}
          images={zoomItem.images || []}
          title={zoomItem.title}
          category={zoomItem.category}
          description={zoomItem.description}
        />
      )}
    </div>
  );
};

export default GalleryAdmin;
