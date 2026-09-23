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
      setError('Please provide or upload an image.');
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

  const inp = {
    padding: '9px 13px',
    background: 'rgba(15, 15, 30, 0.8)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '9px',
    color: '#e2e8f0',
    fontSize: '13.5px',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={md.backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={md.box}>
        <div style={md.head}>
          <h2 style={md.title}>{initial ? 'Edit Project Image' : 'Add Project Image'}</h2>
          <button style={md.xBtn} onClick={onClose}>✕</button>
        </div>

        {error && (
          <div style={{ margin: '16px 24px 0', padding: '10px 16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} style={md.form}>
          {/* Associated Project */}
          <div style={md.grid2}>
            <div style={md.field}>
              <label style={md.lbl}>Target Project *</label>
              {availableProjects && availableProjects.length > 0 ? (
                <select name="projectId" value={form.projectId} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
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
                  style={inp}
                />
              )}
            </div>
            {availableProjects && availableProjects.length > 0 && form.projectId === 'custom' && (
              <div style={md.field}>
                <label style={md.lbl}>Custom Project Name *</label>
                <input
                  name="projectName"
                  value={form.projectName}
                  onChange={handle}
                  required
                  placeholder="Enter project name..."
                  style={inp}
                />
              </div>
            )}
            <div style={md.field}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={md.lbl}>Image Category / Type *</label>
                {!isCreatingCat && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingCat(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '0 2px',
                    }}
                  >
                    + New Category
                  </button>
                )}
              </div>
              {isCreatingCat ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    style={{ ...inp, flex: 1 }}
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
                    style={{
                      padding: '0 14px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      borderRadius: '9px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCat(false);
                      setNewCatName('');
                    }}
                    style={{
                      padding: '0 10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '9px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
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
                  style={{ ...inp, cursor: 'pointer' }}
                >
                  {categories.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="__new__">+ Create New Category...</option>
                </select>
              )}
            </div>
          </div>

          {/* Title / Caption */}
          <div style={md.field}>
            <label style={md.lbl}>Image Title / Caption *</label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              required
              placeholder="e.g. Distributed Cluster Telemetry Dashboard"
              style={inp}
            />
          </div>

          {/* Image Upload & URL */}
          <div style={md.field}>
            <label style={md.lbl}>Project Image (Upload or Paste URL) *</label>
            <Base64UploadZone
              currentUrl={form.imageUrl}
              onUploaded={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              placeholder="Or paste direct image URL (https://...)"
              style={{ ...inp, marginTop: 8 }}
            />
          </div>

          {/* Aspect Ratio & Featured */}
          <div style={md.grid2}>
            <div style={md.field}>
              <label style={md.lbl}>Aspect Ratio</label>
              <select name="aspectRatio" value={form.aspectRatio} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                <option value="16:9">16:9 (Desktop Screen / Diagram)</option>
                <option value="9:16">9:16 (Mobile Screenshot)</option>
                <option value="4:3">4:3 (Standard Preview)</option>
                <option value="Auto">Auto (Preserve Original)</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handle}
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                />
                <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>
                  Feature as Key Project Preview
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div style={md.field}>
            <label style={md.lbl}>Technical Notes / Context</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              placeholder="Explain key architecture highlights, Figma design phase, or performance details..."
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 20px',
                background: 'transparent',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: '9px',
                color: '#94a3b8',
                fontSize: '13.5px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '9px',
                color: 'white',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              }}
            >
              {saving ? 'Saving...' : initial ? 'Update Image' : 'Save Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Preview Modal ─── */
const PreviewModal = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <div style={md.backdrop} onClick={onClose}>
      <div style={{ ...md.box, maxWidth: '900px', background: 'rgba(5, 7, 18, 0.96)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
              {image.projectName} • {image.imageType}
            </span>
            <h3 style={{ margin: '4px 0 0', color: '#f8fafc', fontSize: '18px', fontWeight: 800 }}>
              {image.title}
            </h3>
          </div>
          <button style={md.xBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ maxHeight: '65vh', overflow: 'hidden', borderRadius: '14px', display: 'flex', justifyContent: 'center', background: '#000' }}>
          <img src={image.imageUrl} alt={image.title} style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }} />
        </div>
        {image.description && (
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '14px 0 0', lineHeight: 1.5 }}>
            {image.description}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Main Admin Component ─── */
const ProjectImagesAdmin = () => {
  const { data: firestoreImages, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.PROJECT_IMAGES);
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [toast, setToast] = useState('');

  const handleAddCategory = (name) => {
    if (!name || !name.trim()) return '';
    const trimmed = name.trim();
    const updated = saveCustomCategory(trimmed);
    setCategories(updated);
    showToast(`✓ Category "${trimmed}" created!`);
    return trimmed;
  };

  const handleDeleteCategory = (catName) => {
    if (!catName) return;
    const assignedCount = images.filter((img) => img.imageType === catName).length;
    const confirmMsg = assignedCount > 0
      ? `Category "${catName}" is currently assigned to ${assignedCount} project image(s).\nDeleting this category will remove it from the filter bar.\n\nAre you sure you want to delete "${catName}"?`
      : `Are you sure you want to delete category "${catName}"?`;

    if (!window.confirm(confirmMsg)) return;

    const updated = deleteCustomCategory(catName);
    setCategories(updated);
    if (selectedType === catName) {
      setSelectedType('All');
    }
    showToast(`✓ Category "${catName}" deleted.`);
  };

  const handleResetCategories = () => {
    if (!window.confirm('Reset all categories back to default types?')) return;
    const defaults = resetCategoriesToDefault();
    setCategories(defaults);
    showToast('✓ Categories reset to defaults.');
  };


  useEffect(() => {
    getCollection();

    // Load real projects from Firestore for project association
    (async () => {
      try {
        const projs = await getCollectionRaw(COLLECTIONS.PROJECTS);
        if (projs && projs.length > 0) {
          setProjects(projs);
        }
      } catch (err) {
        console.warn('Could not load projects for dropdown:', err);
      }
    })();

    // Read local cache if Firestore is restricted
    try {
      const local = localStorage.getItem('custom_project_images');
      if (local) {
        setImages(JSON.parse(local));
      }
    } catch (e) {}
  }, [getCollection]);

  useEffect(() => {
    if (firestoreImages && firestoreImages.length > 0) {
      setImages(firestoreImages);
      try {
        localStorage.setItem('custom_project_images', JSON.stringify(firestoreImages));
      } catch (e) {}
    }
  }, [firestoreImages]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const copyUrl = (url, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('✓ Image URL copied to clipboard!');
    }
  };

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateDoc(editItem.id, data);
        const updated = images.map((item) => (item.id === editItem.id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item));
        setImages(updated);
        try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
        showToast('✓ Project image updated!');
      } else {
        const res = await addDoc(data);
        const newImg = res || { id: `pimg-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        const updated = [newImg, ...images];
        setImages(updated);
        try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
        showToast('✓ Project image added successfully!');
      }
    } catch (err) {
      console.warn('Firestore write warning, persisting locally:', err);
      const fallbackImg = {
        id: editItem ? editItem.id : `local-pimg-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      let updated;
      if (editItem) {
        updated = images.map((item) => (item.id === editItem.id ? fallbackImg : item));
        showToast('✓ Project image updated (Saved locally)!');
      } else {
        updated = [fallbackImg, ...images];
        showToast('✓ Project image added (Saved locally)!');
      }
      setImages(updated);
      try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project image asset?')) return;
    try {
      await deleteDoc(id);
    } catch (err) {
      console.warn('Firestore delete error, removing locally:', err);
    }
    const updated = images.filter((item) => item.id !== id);
    setImages(updated);
    try { localStorage.setItem('custom_project_images', JSON.stringify(updated)); } catch (e) {}
    showToast('Project image deleted.');
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
    <div style={pg.page}>
      {toast && <div style={pg.toast}>{toast}</div>}

      {/* Header */}
      <div style={pg.header}>
        <div>
          <h1 style={pg.title}>Project Images Vault</h1>
          <p style={pg.sub}>
            Manage and organize screenshots, architecture diagrams, and mobile mockups linked to your projects.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            style={pg.secondaryBtn}
            onClick={() => setShowCatModal(true)}
          >
            <span>⚙ Manage Categories</span>
          </button>
          <button
            style={pg.addBtn}
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
          >
            <span>+ Add Project Image</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: Only show if there are images */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Project Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {projectList.map((pName) => (
              <button
                key={pName}
                type="button"
                onClick={() => setSelectedProject(pName)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: selectedProject === pName ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(15, 17, 36, 0.8)',
                  color: selectedProject === pName ? '#ffffff' : '#94a3b8',
                  border: selectedProject === pName ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s',
                }}
              >
                {pName}
              </button>
            ))}
          </div>

          {/* Type Selector & Search */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '360px' }}>
              <input
                placeholder="Search images, projects, diagrams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={pg.sInput}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {dynamicCategories.map((type) => (
                <div
                  key={type}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: selectedType === type ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 17, 36, 0.7)',
                    border: selectedType === type ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedType(type)}
                    style={{
                      padding: '5px 12px',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: selectedType === type ? '#c7d2fe' : '#94a3b8',
                    }}
                  >
                    {type}
                  </button>
                  {type !== 'All' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(type);
                      }}
                      title={`Delete category "${type}"`}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#f87171',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        lineHeight: 1,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowCatModal(true)}
                title="Manage and create categories"
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: 'rgba(99, 102, 241, 0.12)',
                  borderColor: 'rgba(99, 102, 241, 0.35)',
                  border: '1px dashed',
                  color: '#a5b4fc',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                + Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Project Images */}
      {loading && images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Loading media vault...</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(12, 14, 28, 0.6)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🖼️</div>
          <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>Project Images Vault is Empty</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>No project images or architecture blueprints in the database. Upload your first asset.</p>
          <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>
            + Upload Project Image
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(12, 14, 28, 0.6)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📂</div>
          <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>No project images match your filter</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>Try selecting a different filter or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((img) => (
            <div
              key={img.id}
              onClick={() => setPreviewItem(img)}
              style={{
                background: 'rgba(12, 14, 28, 0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
            >
              {/* Media Preview Area */}
              <div style={{ position: 'relative', height: '180px', background: '#000', overflow: 'hidden' }}>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.7)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    {img.imageType}
                  </span>
                  {img.aspectRatio && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 6px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.7)', color: '#94a3b8' }}>
                      {img.aspectRatio}
                    </span>
                  )}
                </div>

                {img.featured && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '11px', fontWeight: 800, color: '#fbbf24', background: 'rgba(0, 0, 0, 0.75)', padding: '2px 8px', borderRadius: '6px' }}>
                    ★ Key Asset
                  </span>
                )}
              </div>

              {/* Info Body */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, marginBottom: '4px' }}>
                  {img.projectName}
                </div>
                <h4 style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
                  {img.title}
                </h4>

                {img.description && (
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {img.description}
                  </p>
                )}

                {/* Footer Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    type="button"
                    onClick={(e) => copyUrl(img.imageUrl, e)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      borderRadius: '6px',
                      color: '#a5b4fc',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    🔗 Copy URL
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditItem(img);
                        setModalOpen(true);
                      }}
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#94a3b8', fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(img.id, e)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: '#f87171', fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editItem}
        availableProjects={projects}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Category Management Modal */}
      {showCatModal && (
        <div style={md.backdrop} onClick={() => setShowCatModal(false)}>
          <div style={{ ...md.box, maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={md.head}>
              <h2 style={md.title}>Manage Image Categories</h2>
              <button style={md.xBtn} onClick={() => setShowCatModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Add Input */}
              <div style={md.field}>
                <label style={md.lbl}>Add New Category</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. Poster Design, 3D Render, Banner UI..."
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
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(15, 15, 30, 0.8)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      borderRadius: '9px',
                      color: '#e2e8f0',
                      fontSize: '13.5px',
                      outline: 'none',
                      flex: 1,
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatInput.trim()) {
                        handleAddCategory(newCatInput);
                        setNewCatInput('');
                      }
                    }}
                    style={{
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: '9px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Existing Categories List with Delete */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={md.lbl}>Current Categories ({categories.length})</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Click Delete to remove</span>
                </div>
                {categories.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    No categories defined. Add one above or reset to defaults.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                    {categories.map((c) => {
                      const count = images.filter((img) => img.imageType === c).length;
                      return (
                        <div
                          key={c}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: 'rgba(15, 18, 36, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{c}</span>
                            <span style={{ fontSize: '11px', color: count > 0 ? '#38bdf8' : '#64748b', fontWeight: 600 }}>
                              {count} {count === 1 ? 'image' : 'images'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c)}
                            title={`Delete category "${c}"`}
                            style={{
                              padding: '4px 10px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              borderRadius: '6px',
                              color: '#f87171',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={handleResetCategories}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ↺ Reset to Default Types
                </button>
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  style={{
                    padding: '8px 20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      <PreviewModal image={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
};

const md = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' },
  box: { width: '100%', maxWidth: '640px', background: 'rgba(12,14,28,0.96)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.8)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(99,102,241,0.1)' },
  title: { margin: 0, color: '#f1f5f9', fontSize: '17px', fontWeight: '700' },
  xBtn: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', fontSize: '16px' },
  form: { padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  lbl: { color: '#94a3b8', fontSize: '12px', fontWeight: '600' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
};

const pg = {
  page: { padding: '32px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' },
  title: { margin: '0 0 6px', color: '#f1f5f9', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em' },
  sub: { margin: 0, color: '#64748b', fontSize: '13px' },
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' },
  secondaryBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', color: '#818cf8', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
  sInput: { width: '100%', padding: '9px 14px', background: 'rgba(15,15,30,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  toast: { position: 'fixed', bottom: '28px', right: '28px', background: 'rgba(16,185,129,0.95)', color: 'white', padding: '12px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 2000 },
};

export default ProjectImagesAdmin;
