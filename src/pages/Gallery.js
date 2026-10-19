import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToCollection, subscribeToDocument } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import ImageZoomModal from '../components/common/ImageZoomModal';
import { Image, Eye, Plus, Sparkles, ZoomIn, ArrowUpDown, Pin, Layers } from 'lucide-react';

const Gallery = () => {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'size-desc' | 'size-asc'
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [customCats, setCustomCats] = useState([]);

  // Real-time synchronization across devices for exhibits and custom categories
  useEffect(() => {
    setLoading(true);
    const unsubscribeGallery = subscribeToCollection(COLLECTIONS.GALLERY, (data) => {
      if (data && data.length > 0) {
        setItems(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
      } else {
        setItems([]);
      }
      setLoading(false);
    });

    const unsubscribeCategories = subscribeToDocument(COLLECTIONS.SETTINGS, 'gallery_categories', (doc) => {
      if (doc && Array.isArray(doc.list)) {
        const names = doc.list.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
        setCustomCats(names.map((n) => n.toUpperCase()));
      } else {
        setCustomCats([]);
      }
    });

    return () => {
      if (typeof unsubscribeGallery === 'function') unsubscribeGallery();
      if (typeof unsubscribeCategories === 'function') unsubscribeCategories();
    };
  }, []);

  const categories = [
    'ALL',
    ...new Set(
      customCats.length > 0
        ? customCats
        : items.map((item) => (item.category || '').toUpperCase()).filter(Boolean)
    ),
  ];

  const filtered = items.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return (item.category || '').toUpperCase() === activeFilter;
  });

  // SORTING ALGORITHM: PINNED / FEATURED ITEMS ALWAYS STAY ON TOP!
  const sorted = [...filtered].sort((a, b) => {
    // 1. PINNED / FEATURED ALWAYS AT THE TOP!
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

  const selectedItem = selectedIndex !== null ? sorted[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < sorted.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    const num = Number(bytes);
    if (num > 1024 * 1024) return (num / (1024 * 1024)).toFixed(1) + ' MB';
    if (num > 1024) return Math.round(num / 1024) + ' KB';
    return num + ' B';
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Lookbook Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">GALLERY &amp; LOOKBOOK</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>REAL-TIME CURATED EXHIBIT</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                DESIGN GALLERY &amp; VISUAL LOOKBOOK
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Curated archive of user interface prototypes, architectural system designs, and production dashboards. Click any asset to inspect and zoom up to 400%.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_GALLERY}
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 shrink-0 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>MANAGE GALLERY</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Filter Tabs & Sort Controls ── */}
      <div className="border-b border-neutral-200 bg-white py-4 sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
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
      </div>

      {/* ── Gallery Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          /* Skeleton Shimmer Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-neutral-200 p-4 bg-white space-y-3">
                <div className="aspect-[4/3] skeleton-shimmer rounded-xs" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded-xs" />
                <div className="h-3 w-full skeleton-shimmer rounded-xs" />
                <div className="h-3 w-1/2 skeleton-shimmer rounded-xs" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          /* Empty State */
          <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-4 animate-fade-in">
            <Image className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase text-black">NO GALLERY ITEMS PUBLISHED YET</h2>
              <p className="text-xs text-neutral-500 uppercase tracking-wider max-w-md mx-auto">
                Upload lookbook designs, UI screens, and architecture visuals in the admin dashboard to showcase them here.
              </p>
            </div>
            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_GALLERY}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Item in Admin</span>
              </Link>
            )}
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className={`border bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between p-4 ${
                  item.featured ? 'border-2 border-black' : 'border-neutral-200 hover:border-black'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border border-neutral-200">
                    <img
                      src={item.image || item.imageUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10">
                      <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-xs">
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
                      <span className="bg-black text-white text-xs font-bold uppercase tracking-widest px-3.5 py-2 flex items-center gap-1.5 shadow-md">
                        <ZoomIn className="w-4 h-4" />
                        <span>INSPECT &amp; ZOOM</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:underline">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-wrap gap-1">
                    {item.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[9px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── High-Resolution Interactive Zoom Lightbox Modal ── */}
      {selectedItem && (
        <ImageZoomModal
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          imageUrl={selectedItem.image || selectedItem.imageUrl || selectedItem.url}
          images={selectedItem.images || []}
          title={selectedItem.title}
          category={selectedItem.category}
          description={selectedItem.description}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < sorted.length - 1}
        />
      )}
    </div>
  );
};

export default Gallery;
