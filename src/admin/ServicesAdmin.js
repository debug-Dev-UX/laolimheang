import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Star,
  Check,
} from 'lucide-react';

const CATEGORIES = ['Design', 'Development', 'Marketing', 'Consulting', 'E-Commerce', 'Support', 'Other'];
const emptyForm = { title: '', description: '', price: '', currency: 'USD', period: 'project', category: '', features: '', featured: false };

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { ...emptyForm, ...initial, features: (initial.features || []).join(', '), price: initial.price ?? '' }
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
      price: parseFloat(form.price) || 0,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
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
              COMMERCIAL CATALOG
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {initial ? 'EDIT SERVICE PACKAGE' : 'ADD NEW SERVICE OFFERING'}
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
                SERVICE TITLE *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handle}
                required
                placeholder="FULL-STACK WEB PLATFORM"
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
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                PRICE *
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handle}
                placeholder="1200"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                CURRENCY
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handle}
                className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              >
                {['USD', 'EUR', 'GBP', 'JPY', 'KHR', 'THB'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                BILLING PERIOD
              </label>
              <select
                name="period"
                value={form.period}
                onChange={handle}
                className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              >
                <option value="project">PER PROJECT</option>
                <option value="month">PER MONTH</option>
                <option value="hour">PER HOUR</option>
                <option value="fixed">FIXED PRICE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              SERVICE SCOPE & DESCRIPTION
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              rows={3}
              placeholder="Architecture planning, database schema modeling, zero-downtime deployment..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              DELIVERABLES / FEATURES (COMMA-SEPARATED)
            </label>
            <input
              name="features"
              value={form.features}
              onChange={handle}
              placeholder="Production Next.js, PostgreSQL cluster, CI/CD Pipeline, 1-Year Support"
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="svc-featured"
              name="featured"
              checked={form.featured}
              onChange={handle}
              className="w-4 h-4 accent-black rounded-none cursor-pointer"
            />
            <label htmlFor="svc-featured" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
              MARK AS FEATURED TIER ON SERVICES PAGE
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
              {saving ? 'SAVING...' : 'SAVE SERVICE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ServicesAdmin = () => {
  const { data: services, loading, add, update, remove } = useFirestore(COLLECTIONS.SERVICES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const openAdd = () => {
    setEditService(null);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditService(s);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      if (editService) {
        await update(editService.id, payload);
        showToast('Service updated successfully.');
      } else {
        await add(payload);
        showToast('Service created successfully.');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await remove(id);
      showToast('Service deleted.');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const usedCategories = ['all', ...new Set((services || []).map((s) => s.category).filter(Boolean))];

  const filtered = (services || []).filter((s) => {
    if (filterCat === 'all') return true;
    return s.category === filterCat;
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
              <span>COMMERCIAL PACKAGES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              COMMERCIAL SERVICES & SOLUTIONS
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Configure engineering service tiers, pricing models, deliverable checklists, and SLAs.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW SERVICE</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
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
            {cat === 'all' ? 'ALL SERVICES' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
              <div className="h-4 w-1/3 skeleton-shimmer" />
              <div className="h-6 w-3/4 skeleton-shimmer" />
              <div className="h-12 w-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-3 bg-white">
          <Briefcase className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
          <p className="text-base font-black uppercase text-black">NO SERVICES DEFINED YET</p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Create your first service offering to display it on the commercial catalog.
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Service</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-neutral-200 hover:border-black p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="bg-neutral-100 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                    {svc.category || 'SERVICE'}
                  </span>
                  {svc.featured && (
                    <span className="bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      <span>FEATURED</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:underline">
                    {svc.title}
                  </h3>
                  <div className="mt-2 text-2xl font-black uppercase tracking-tight text-black">
                    {svc.price ? `$${svc.price}` : 'CUSTOM'}
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                      / {svc.period || 'PROJECT'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {svc.description}
                </p>

                {svc.features && svc.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    {svc.features.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEdit(svc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editService} />
    </div>
  );
};

export default ServicesAdmin;
