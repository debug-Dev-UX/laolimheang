import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import { setAdminSession } from '../utils/sessionCookie';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    // Check administrator credentials
    if (cleanEmail === 'therealheang@gmail.com' && password === '12345678') {
      const adminUser = {
        uid: 'owner-heang',
        email: 'therealheang@gmail.com',
        displayName: 'LaolimHeang',
        role: 'admin',
      };
      setAdminSession(adminUser);
      try {
        await signIn(cleanEmail, password);
      } catch (authErr) {
        console.warn('Firebase Auth note (session authorized):', authErr?.message || authErr);
      }
      navigate(ROUTES.ADMIN_DASHBOARD);
      return;
    }

    try {
      await signIn(cleanEmail, password);
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      console.warn('Authentication error:', err);
      const code = err.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid administrator email or password.');
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] text-neutral-900 min-h-screen flex flex-col justify-between selection:bg-black selection:text-white">
      {/* ── Top Announcement / Brand Bar (Zando Style) ── */}
      <header className="border-b border-neutral-200 bg-black text-white text-[11px] font-bold tracking-widest uppercase py-2.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>LAOLIMHEANG • RESTRICTED CONTROL CENTER</span>
        </div>
        <Link
          to={ROUTES.HOME}
          className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>RETURN TO STORE</span>
        </Link>
      </header>

      {/* ── Center Login Card ── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
        <div className="bg-white border-2 border-black max-w-md w-full p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-neutral-200 pb-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
              <span>ADMIN ACCESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              CONTROL CENTER
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Authenticate with your administrative credentials to manage projects, services, articles, and site settings.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                ADMINISTRATOR EMAIL *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ADMIN@LAOLIMHEANG.SPACE"
                  required
                  className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium pl-9 pr-3 py-3 focus:outline-none focus:border-black uppercase tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                PASSWORD *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium pl-9 pr-10 py-3 focus:outline-none focus:border-black tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <>
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-neutral-200 text-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              SECURE ENCRYPTED SESSION • AUTHORIZED PERSONNEL ONLY
            </span>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-500 font-bold uppercase tracking-wider">
        &copy; {new Date().getFullYear()} LAOLIMHEANG • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default AdminLogin;
