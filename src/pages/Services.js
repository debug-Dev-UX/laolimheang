import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { Check, ArrowRight, Share2, Plus, Zap, Shield, Clock, FileText } from 'lucide-react';

const Services = () => {
  const { isAdmin, user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getCollection(COLLECTIONS.SERVICES);
      if (data && data.length > 0) {
        setServices(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
      } else {
        setServices([]);
      }
    } catch (e) {
      console.warn('Error loading services from Firestore:', e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (title) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setToastMessage(`LINK FOR "${title.toUpperCase()}" COPIED!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 text-xs font-bold tracking-widest uppercase border border-neutral-700 shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Category Header (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">COMMERCIAL SERVICES</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                ENGINEERING PACKAGES & PRICING
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Transparent development deliverables designed for startups, digital agencies, and enterprise teams.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_SERVICES}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage Services</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
        {loading ? (
          /* Skeleton Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-2 border-neutral-200 p-8 space-y-5 bg-white">
                <div className="h-4 skeleton-shimmer w-1/3" />
                <div className="h-6 skeleton-shimmer w-3/4" />
                <div className="h-10 skeleton-shimmer w-1/2" />
                <div className="h-20 skeleton-shimmer w-full" />
                <div className="h-24 skeleton-shimmer w-full" />
                <div className="h-10 skeleton-shimmer w-full" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-neutral-300 space-y-4">
            <p className="text-lg font-black uppercase text-black">NO SERVICES CONFIGURED YET</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Services added by the administrator in the admin dashboard will automatically appear here.
            </p>
            {isAdmin ? (
              <Link
                to={ROUTES.ADMIN_SERVICES}
                className="inline-block px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800"
              >
                + ADD FIRST SERVICE IN ADMIN
              </Link>
            ) : (
              <Link
                to={ROUTES.CONTACT}
                className="inline-block px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800"
              >
                REQUEST CUSTOM PROPOSAL
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className={`border-2 flex flex-col justify-between p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  svc.featured ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-black'
                }`}
              >
                <div className="space-y-5">
                  {/* Header & Badges */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      {svc.category || 'SERVICE PACKAGE'}
                    </span>
                    <div className="flex items-center gap-2">
                      {svc.featured && (
                        <span className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                          POPULAR CHOICE
                        </span>
                      )}
                      <button
                        onClick={() => handleShare(svc.title)}
                        className="text-neutral-400 hover:text-black transition-colors"
                        title="Share Service Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">
                      {svc.title}
                    </h3>
                    {svc.tagline && (
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mt-1">
                        {svc.tagline}
                      </p>
                    )}
                  </div>

                  {/* Price Display */}
                  <div className="py-2 border-y border-neutral-200">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black tracking-tight text-black">
                        ${svc.price ? Number(svc.price).toLocaleString() : 'CUSTOM'}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        / {svc.period || 'PROJECT'}
                      </span>
                    </div>
                    {svc.delivery && (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-600 mt-1">
                        ESTIMATED DURATION: {svc.delivery}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {svc.description}
                  </p>

                  {/* Deliverables Checklist (Lucide Check icon, no emoji) */}
                  {svc.features && svc.features.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                        INCLUDED IN PACKAGE:
                      </span>
                      <ul className="space-y-1.5 text-xs text-neutral-800">
                        {svc.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5 stroke-[3]" />
                            <span className="font-medium">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  <Link
                    to={`${ROUTES.CONTACT}?service=${encodeURIComponent(svc.title)}`}
                    className={`w-full block text-center py-3.5 text-xs font-black tracking-[0.2em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                      svc.featured
                        ? 'bg-black text-white hover:bg-neutral-800'
                        : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    SELECT PACKAGE &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Service Guarantees Strip (Lucide Icons, No Emojis) ── */}
        <div className="mt-16 sm:mt-24 border-2 border-black p-8 sm:p-12 bg-neutral-50">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-neutral-500">
              SERVICE COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              WHY PARTNER WITH LAOLIMHEANG
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-neutral-300 p-5 bg-white space-y-2">
              <Zap className="w-6 h-6 text-black" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black">DIRECT ACCESS</h4>
              <p className="text-xs text-neutral-600">Communicate directly with the engineer without agency account managers or middlemen.</p>
            </div>

            <div className="border border-neutral-300 p-5 bg-white space-y-2">
              <Shield className="w-6 h-6 text-black" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black">STRICT NDA</h4>
              <p className="text-xs text-neutral-600">Full intellectual property ownership and standard non-disclosure agreements upfront.</p>
            </div>

            <div className="border border-neutral-300 p-5 bg-white space-y-2">
              <Clock className="w-6 h-6 text-black" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black">RAPID ITERATIONS</h4>
              <p className="text-xs text-neutral-600">Weekly deployment sprints and continuous demo environments so you see real progress.</p>
            </div>

            <div className="border border-neutral-300 p-5 bg-white space-y-2">
              <FileText className="w-6 h-6 text-black" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black">CLEAN DOCUMENTATION</h4>
              <p className="text-xs text-neutral-600">Documented README, schema diagrams, and clean code comments for seamless handoffs.</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Contact CTA ── */}
      <section className="bg-black text-white py-14 px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          HAVE A BESPOKE REQUIREMENT?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-medium">
          If your project scope falls outside standard packages, request a customized technical proposal.
        </p>
        <div className="pt-2">
          <Link
            to={ROUTES.CONTACT}
            className="inline-block px-8 py-3.5 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            REQUEST CUSTOM PROPOSAL &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
