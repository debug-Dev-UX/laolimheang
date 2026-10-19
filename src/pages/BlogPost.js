import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocumentsByField, getDocument } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { ArrowLeft, Calendar, Clock, User, Share2, Check } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      // First try by slug
      let data = await getDocumentsByField(COLLECTIONS.BLOGS, 'slug', slug);
      if (data && data.length > 0) {
        setBlog(data[0]);
        return;
      }
      // Otherwise try by document ID
      const doc = await getDocument(COLLECTIONS.BLOGS, slug);
      if (doc) {
        setBlog(doc);
        return;
      }
    } catch (e) {
      console.warn('Error fetching blog post:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Breadcrumb Bar (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-6 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <Link to={ROUTES.BLOG} className="hover:text-black">JOURNAL</Link>
            <span>/</span>
            <span className="text-black truncate max-w-[200px]">{blog?.title || slug}</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          /* Skeleton Loading Screen */
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4 border-b-2 border-neutral-200 pb-8">
              <div className="h-4 w-48 skeleton-shimmer" />
              <div className="h-10 w-full skeleton-shimmer" />
              <div className="h-10 w-3/4 skeleton-shimmer" />
              <div className="h-4 w-5/6 skeleton-shimmer" />
            </div>
            <div className="h-64 sm:h-96 w-full skeleton-shimmer" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full skeleton-shimmer" />
              <div className="h-4 w-full skeleton-shimmer" />
              <div className="h-4 w-4/5 skeleton-shimmer" />
              <div className="h-4 w-full skeleton-shimmer" />
              <div className="h-4 w-2/3 skeleton-shimmer" />
            </div>
          </div>
        ) : !blog ? (
          <div className="py-20 text-center border-2 border-dashed border-neutral-300 space-y-4 animate-fade-in">
            <h2 className="text-xl font-black uppercase text-black">ARTICLE NOT FOUND</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              The requested article could not be located in the journal archive.
            </p>
            <Link
              to={ROUTES.BLOG}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO JOURNAL</span>
            </Link>
          </div>
        ) : (
          <article className="space-y-8 animate-slide-up">
            {/* Article Header */}
            <div className="space-y-4 border-b-2 border-black pb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px]">
                    {blog.category || 'TECHNICAL EDITORIAL'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.createdAt?.toDate?.() || blog.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime || '5 MIN READ'}
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-300 hover:border-black transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>SHARE</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black leading-tight">
                {blog.title}
              </h1>

              {blog.summary && (
                <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
                  {blog.summary}
                </p>
              )}
            </div>

            {/* Thumbnail Image if provided */}
            {blog.thumbnail && (
              <div className="border border-neutral-200 overflow-hidden bg-neutral-100">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-auto max-h-[480px] object-cover"
                />
              </div>
            )}

            {/* Main Content Body */}
            <div className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-neutral-800 space-y-5 pt-4">
              {typeof blog.content === 'string' ? (
                blog.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{blog.content}</p>
              )}
            </div>

            {/* Author Signature & Back Link */}
            <div className="pt-12 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center">
                  LH
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-black block">LAOLIMHEANG</span>
                  <span className="text-[11px] text-neutral-500 font-medium uppercase flex items-center gap-1">
                    <User className="w-3 h-3" /> Full-Stack Software Engineer
                  </span>
                </div>
              </div>

              <Link
                to={ROUTES.BLOG}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-widest border border-neutral-300 transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO ALL ARTICLES</span>
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default BlogPost;
