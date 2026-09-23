import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCookie, setCookie, getUserSession, COOKIE_KEYS } from '../../utils/sessionCookie';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const consent = getCookie(COOKIE_KEYS.COOKIE_CONSENT);
    const activeSession = getUserSession();
    setSession(activeSession);

    // Only show if user has not yet consented
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
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
    <AnimatePresence>
      <motion.aside
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          right: '24px',
          maxWidth: '680px',
          margin: '0 auto',
          background: 'rgba(10, 12, 24, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.15)',
          borderRadius: '20px',
          padding: '20px 24px',
          zIndex: 9999,
          color: '#f8fafc',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              🍪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  User Session & Cookie Preferences
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  Active
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '12.5px', lineHeight: 1.5, margin: 0 }}>
                We use secure cookies and local sessions to remember your 3D spatial settings, navigation telemetry, and interactive preferences.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowTelemetry(!showTelemetry)}
              style={{
                padding: '8px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {showTelemetry ? 'Hide Details' : 'Session Info'}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              style={{
                padding: '8px 14px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAccept}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              }}
            >
              Accept & Continue
            </button>
          </div>
        </div>

        {/* Expandable Session Telemetry Info */}
        {showTelemetry && session && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              fontSize: '11.5px',
            }}
          >
            <div>
              <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>SESSION TOKEN</span>
              <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{session.sessionId ? `${session.sessionId.slice(0, 16)}...` : 'Generating...'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>DEVICE TYPE</span>
              <span style={{ color: '#34d399', textTransform: 'capitalize' }}>{session.device || 'Desktop'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>VISIT COUNT</span>
              <span style={{ color: '#fbbf24' }}>#{session.visitCount || 1} Session</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontWeight: 600 }}>COOKIE EXPIRY</span>
              <span style={{ color: '#cbd5e1' }}>7 Days (Rolling)</span>
            </div>
          </motion.div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
