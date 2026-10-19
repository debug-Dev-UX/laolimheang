import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Clock, Calendar, ArrowRight, Plus, Search } from 'lucide-react';

const Blog = () => {
  const { isAdmin, user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getCollection(COLLECTIONS.BLOGS);
      const published = (data || []).filter((b) => b.published !== false);
      setBlogs(published.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA;
      }));
    } catch (e) {
      console.warn('Error loading blogs from database:', e);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    ...new Set(blogs.map((b) => (b.category || 'TECH').toUpperCase()).filter(Boolean)),
  ];

  const filtered = blogs.filter((b) => {
    const matchesFilter = filter === 'ALL' || (b.category || '').toUpperCase() === filter;
    const matchesSearch =
      !searchQuery ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Editorial Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">JOURNAL & EDITORIAL</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                ENGINEERING JOURNAL & ARTICLES
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Technical writeups on distributed systems, modern React development, database optimization, and cloud architecture.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_BLOGS}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write / Manage Articles</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="border-b border-neutral-200 bg-white py-4 sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  filter === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="SEARCH ARTICLES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-500 text-xs font-medium pl-9 pr-4 py-2 focus:outline-none focus:border-black uppercase tracking-wider"
            />
          </div>
        </div>
      </div>

      {/* ── Articles Catalog ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          /* Skeleton Shimmer Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-neutral-200 p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 skeleton-shimmer" />
                  <div className="h-3 w-16 skeleton-shimmer" />
                </div>
                <div className="h-6 w-5/6 skeleton-shimmer" />
                <div className="h-3 w-24 skeleton-shimmer" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full skeleton-shimmer" />
                  <div className="h-3 w-full skeleton-shimmer" />
                  <div className="h-3 w-2/3 skeleton-shimmer" />
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <div className="h-4 w-28 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-4 animate-fade-in">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase text-black">NO ARTICLES PUBLISHED YET</h2>
              <p className="text-xs text-neutral-500 uppercase tracking-wider max-w-md mx-auto">
                Articles published in the admin dashboard will automatically appear here.
              </p>
            </div>
            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_BLOGS}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publish First Article in Admin</span>
              </Link>
            )}
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <article
                key={post.id || post.slug}
                className="border border-neutral-200 hover:border-black p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <span className="bg-black text-white px-2 py-0.5">{post.category || 'ARTICLE'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime || '5 MIN READ'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black group-hover:underline">
                      <Link to={`/blog/${post.slug || post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt?.toDate?.() || post.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                    {post.summary || post.excerpt || post.content?.slice(0, 160)}...
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200">
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black group-hover:translate-x-1 transition-transform"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
