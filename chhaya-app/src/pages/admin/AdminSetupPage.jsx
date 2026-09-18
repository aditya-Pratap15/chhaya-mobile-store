import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert,
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ChhayaDB } from '../../services/db';
import ChhayaLogo from '../../components/ChhayaLogo';

export default function AdminSetupPage() {
  const { setupAdmin, showToast } = useApp();
  const navigate = useNavigate();

  const [isLocked, setIsLocked] = useState(() => ChhayaDB.isAdminSetupDone());
  const [setupInfo, setSetupInfo] = useState(() => ChhayaDB.getAdminSetupInfo());

  const [ownerName, setOwnerName] = useState('Pushpendra Prajapati');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('pushpendra');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const done = ChhayaDB.isAdminSetupDone();
    setIsLocked(done);
    if (done) {
      setSetupInfo(ChhayaDB.getAdminSetupInfo());
    }
  }, []);

  const handleSetup = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOwner = ownerName.trim();
    const cleanUser = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanOwner || !cleanEmail || !cleanUser || !cleanPass) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid Gmail / Email address for password recovery.');
      return;
    }

    if (cleanPass.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    const res = setupAdmin(cleanOwner, cleanUser, cleanEmail, cleanPass);
    if (res && res.success) {
      setIsLocked(true);
      showToast('Master Admin Account initialized! All other registrations locked.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setErrorMsg(res?.message || 'Failed to initialize setup.');
      setSubmitting(false);
    }
  };

  // ─── IF SETUP IS ALREADY COMPLETED (PERMANENT LOCK SCREEN) ───
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-left antialiased">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-600 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider border border-amber-200">
              Registration Permanently Locked
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Master Admin Already Created
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Only one Master Admin account is permitted for <strong className="text-slate-700">Chhaya Mobiles (Sony Dharmshala, Chitrakoot Dham)</strong>. 
              The store proprietor credentials have already been created and locked. New sign-ups are disabled.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Store Proprietor:</span>
              <strong className="text-slate-900 font-bold">{setupInfo?.ownerName || 'Pushpendra Prajapati'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Terminal Username:</span>
              <strong className="text-blue-700 font-mono font-bold">{setupInfo?.username || 'Configured'}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Recovery Gmail:</span>
              <span className="text-slate-700 font-mono text-[11px]">{setupInfo?.maskedEmail || 'Registered on Setup'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Admin Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront Homepage</span>
            </Link>
          </div>

          <div className="text-center pt-2">
            <Link to="/admin/login?forgot=1" className="text-xs font-bold text-blue-600 hover:underline">
              Forgot your Master Password or Username?
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ─── FIRST-TIME INITIAL SETUP FORM ───
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-left antialiased">
      
      {/* Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1 overflow-hidden">
              <ChhayaLogo className="w-full h-full" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            First-Time Master Admin Setup
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Master Owner Account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Configure proprietor credentials for <strong className="text-slate-800">Pushpendra Prajapati</strong>. 
            Once completed, this signup page will permanently close and only you will have administrative access.
          </p>
        </div>

        {/* Info Hint */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-amber-950">Security Rule:</strong> Ensure you enter an active <strong className="underline">Gmail address</strong>. If you ever forget your username or password, recovery links and security codes will be dispatched to that Gmail.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSetup} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Store Proprietor Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="e.g. Pushpendra Prajapati"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Proprietor Registered Gmail <span className="text-rose-500 font-normal">(Crucial for Password Recovery)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. pushpendra.chhaya@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Master Admin Username / Login ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. pushpendra or admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Create Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white text-xs font-extrabold shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Locking Credentials...' : 'Create Master Admin & Permanently Lock Signup'}</span>
          </button>

        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link to="/" className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-blue-700">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <Link to="/admin/login" className="font-bold text-blue-700 hover:underline">
            Go to Admin Login
          </Link>
        </div>

      </div>

    </div>
  );
}
