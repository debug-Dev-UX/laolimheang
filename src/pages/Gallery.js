import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { Image, Eye, X, Plus } from 'lucide-react';

const Gallery = () => {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await getCollection(COLLECTIONS.GALLERY);
      if (data && data.length > 0) {
        setItems(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.warn('Error loading gallery items from database:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    ...new Set(items.map((item) => (item.category || 'WORK').toUpperCase()).filter(Boolean)),
  ];

  const filtered = items.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return (item.category || '').toUpperCase() === activeFilter;
  });

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Lookbook Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">GALLERY & LOOKBOOK</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                DESIGN GALLERY & VISUAL LOOKBOOK
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Curated archive of user interface prototypes, architectural system designs, and production dashboards.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_GALLERY}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage Gallery</span>
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
              onClick={() => setActiveFilter(cat)}
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
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
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
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>QUICK VIEW</span>
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
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
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

      {/* ── Quick-View Lightbox Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative bg-white border-2 border-black max-w-4xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-4 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {selectedItem.category}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-black hover:text-neutral-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border border-neutral-200 overflow-hidden bg-neutral-900">
              <img
                src={selectedItem.image || selectedItem.imageUrl || selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            </div>

            {selectedItem.description && (
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-2">
                {selectedItem.description}
              </p>
            )}

            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase transition-all active:scale-95"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
