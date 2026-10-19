import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToCollection, subscribeToDocument } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import ImageZoomModal from '../components/common/ImageZoomModal';
import { Image, Eye, Plus, Sparkles, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
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

  const selectedItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filtered.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
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

      {/* ── Category Filter Tabs ── */}
      <div className="border-b border-neutral-200 bg-white py-4 sticky top-16 sm:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setSelectedIndex(null);
              }}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all duration-200 active:scale-95 ${
                activeFilter === cat
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
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
        ) : filtered.length === 0 ? (
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
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className="border border-neutral-200 hover:border-black p-4 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border border-neutral-200">
                    <img
                      src={item.image || item.imageUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-xs">
                      {item.category || 'EXHIBIT'}
                    </div>
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
          isOpen={!!selectedItem}
          onClose={() => setSelectedIndex(null)}
          imageUrl={selectedItem.image || selectedItem.imageUrl || selectedItem.url}
          title={selectedItem.title}
          category={selectedItem.category}
          description={selectedItem.description}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filtered.length - 1}
        />
      )}
    </div>
  );
};

export default Gallery;
