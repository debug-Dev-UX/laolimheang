import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';

const CATEGORIES = ['Technology', 'Design', 'Architecture', 'Tutorial', 'Personal', 'Other'];
const emptyForm = { title: '', slug: '', content: '', category: 'Technology', tags: '', author: 'Lao Limheang', thumbnail: '', published: true };
const toSlug = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (initial) {
        const rawTags = initial.tags || [];
        const formattedTags = Array.isArray(rawTags) ? rawTags.join(', ') : String(rawTags);
        setForm({
          ...emptyForm,
          ...initial,
          tags: formattedTags,
        });
      } else {
        setForm({ ...emptyForm, author: 'Lao Limheang' });
      }
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && (!initial || !p.slug)) {
        next.slug = toSlug(value);
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.title.trim()) {
      setError('Please provide a post title.');
      return;
    }

    try {
      setSaving(true);
      let parsedTags = [];
      if (Array.isArray(form.tags)) {
        parsedTags = form.tags;
      } else if (typeof form.tags === 'string' && form.tags.trim()) {
        parsedTags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }

      const generatedSlug = (form.slug || toSlug(form.title) || `post-${Date.now()}`).toLowerCase().trim();

      const payload = {
        title: form.title.trim(),
        slug: generatedSlug,
        content: form.content || '',
        category: form.category || 'Technology',
        tags: parsedTags,
        author: (form.author || 'Lao Limheang').trim(),
        thumbnail: form.thumbnail || '',
        published: Boolean(form.published),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err?.message || 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white border-2 border-black max-w-3xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              JOURNAL ARCHIVE
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {initial ? 'EDIT EDITORIAL ARTICLE' : 'WRITE NEW ARTICLE'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-black hover:text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                ARTICLE TITLE *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handle}
                required
                placeholder="OPTIMIZING REACT 18 VIRTUAL DOM"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                URL SLUG
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handle}
                placeholder="optimizing-react-18-virtual-dom"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
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

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                AUTHOR NAME
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handle}
                placeholder="Lao Limheang"
                className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              ARTICLE COVER / THUMBNAIL
            </label>
            <Base64UploadZone
              currentUrl={form.thumbnail}
              onUploaded={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
            />
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handle}
              placeholder="Or paste direct image URL..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              ARTICLE BODY CONTENT (MARKDOWN / TEXT)
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handle}
              rows={8}
              placeholder="Write your in-depth technical analysis or markdown content..."
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              TAGS (COMMA-SEPARATED)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handle}
              placeholder="React, Microservices, Cloud, Docker"
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="blog-published"
              name="published"
              checked={form.published}
              onChange={handle}
              className="w-4 h-4 accent-black rounded-none cursor-pointer"
            />
            <label htmlFor="blog-published" className="text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
              PUBLISH ARTICLE IMMEDIATELY TO JOURNAL
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
              {saving ? 'SAVING...' : 'SAVE ARTICLE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const BlogsAdmin = () => {
  const { data: blogs, loading, add, update, remove } = useFirestore(COLLECTIONS.BLOGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async (payload) => {
    try {
      if (editItem) {
        await update(editItem.id, payload);
        showToast('Article updated.');
      } else {
        await add(payload);
        showToast('Article published.');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await remove(id);
      showToast('Article deleted.');
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const filtered = (blogs || []).filter((b) => {
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && b.published) ||
      (filterStatus === 'draft' && !b.published);
    const matchSearch =
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.summary?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
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
              <span>TECHNICAL WRITING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              EDITORIAL ARTICLES & JOURNAL
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Author and publish in-depth technical writeups, architecture case studies, and engineering journal articles.
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
            <span>WRITE NEW ARTICLE</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filterStatus === s
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {s === 'all' ? 'ALL POSTS' : s === 'published' ? 'PUBLISHED' : 'DRAFTS'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            placeholder="SEARCH ARTICLES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium pl-9 pr-3 py-2 focus:outline-none focus:border-black uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-neutral-400">
            LOADING JOURNAL POSTS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-2 border-dashed border-neutral-300 m-6 p-16 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
            <p className="text-base font-black uppercase text-black">NO ARTICLES FOUND</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              {search ? 'Try a different search query.' : 'Write your first article to publish it to the journal.'}
            </p>
            {!search && (
              <button
                onClick={() => {
                  setEditItem(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write First Post</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {b.thumbnail ? (
                    <img
                      src={b.thumbnail}
                      alt=""
                      className="w-14 h-14 object-cover border border-neutral-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 flex items-center justify-center font-black text-base text-black shrink-0">
                      {b.title?.[0]?.toUpperCase() || 'A'}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        {b.category || 'ARTICLE'}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${
                          b.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {b.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>

                    <h3 className="text-base font-black uppercase tracking-tight text-black">
                      {b.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono">
                      /blog/{b.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setEditItem(b);
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editItem} />
    </div>
  );
};

export default BlogsAdmin;
