import React, { useState, useEffect } from 'react';
import { getCookie, setCookie, COOKIE_KEYS } from '../../utils/sessionCookie';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_KEYS.COOKIE_CONSENT);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIE_KEYS.COOKIE_CONSENT, 'accepted', 30);
    setVisible(false);
  };

  const handleDecline = () => {
    setCookie(COOKIE_KEYS.COOKIE_CONSENT, 'declined', 7);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 bg-white border-2 border-black p-5 shadow-2xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
            COOKIE & ANALYTICS NOTICE
          </span>
          <span className="text-[10px] font-bold text-black uppercase">
            PRIVACY FIRST
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
          This portfolio uses minimal session storage and cookies to measure performance and remember your preferences. No third-party ad trackers are used.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            ACCEPT & CONTINUE
          </button>
          <button
            onClick={handleDecline}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
          >
            DECLINE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
