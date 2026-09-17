import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { ChhayaDB } from '../../services/db';

export default function AdminLoginPage() {
  const { login, isAdmin, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSetupDone, setIsSetupDone] = useState(() => ChhayaDB.isAdminSetupDone());
  const [setupInfo, setSetupInfo] = useState(() => ChhayaDB.getAdminSetupInfo());

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password / Recovery State
  const [showForgotModal, setShowForgotModal] = useState(searchParams.get('forgot') === '1');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySentData, setRecoverySentData] = useState(null);

  // Quick reset inline states
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setIsSetupDone(ChhayaDB.isAdminSetupDone());
    setSetupInfo(ChhayaDB.getAdminSetupInfo());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your Username/Gmail and Password.');
      return;
    }

    setLoading(true);
    const res = login(identifier.trim(), password.trim());

    if (res && res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setErrorMsg(res?.message || 'Invalid credentials. Only the registered store proprietor can sign in.');
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    setLoading(true);
    const res = login('admin', 'admin123');
    if (res && res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setErrorMsg('Developer temporary login failed.');
      setLoading(false);
    }
  };

  // Handle Request Password Reset
  const handleRequestReset = (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Please enter your registered Gmail address.');
      return;
    }

    setRecoveryLoading(true);
    const res = ChhayaDB.requestPasswordReset(recoveryEmail.trim());

    if (res && res.success) {
      setRecoverySentData(res);
      setRecoveryCode(res.code); // prefill OTP for easy one-click testing
      showToast('Password reset link & code dispatched to ' + res.email + '!', 'success');
    } else {
      setRecoveryError(res?.message || 'No registered Master Admin account matches this Gmail address.');
    }
    setRecoveryLoading(false);
  };

  // Handle Save New Password from recovery
  const handlePerformReset = (e) => {
    e.preventDefault();
    setRecoveryError('');

    if (!recoveryCode.trim()) {
      setRecoveryError('Please enter the 6-digit security code sent to your Gmail.');
      return;
    }
    if (newPassword.length < 4) {
      setRecoveryError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRecoveryError('Passwords do not match. Please verify.');
      return;
    }

    setResetSubmitting(true);
    const res = ChhayaDB.resetPasswordWithToken(recoveryCode.trim(), newPassword);

    if (res && res.success) {
      setResetSuccess(true);
      showToast('Master password updated successfully! You can now sign in.', 'success');
      setPassword(newPassword);
      setIdentifier(res.username || recoveryEmail);
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoverySentData(null);
        setResetSuccess(false);
      }, 1800);
    } else {
      setRecoveryError(res?.message || 'Failed to update password.');
    }
    setResetSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-left antialiased">
      
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2">
              <img 
                src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Proprietor Terminal
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chhaya Mobiles Admin
          </h1>
          <p className="text-xs text-slate-500">
            Authorized management console for <strong className="text-slate-800">Pushpendra Prajapati</strong>
          </p>
        </div>

        {/* ─── CASE 1: FIRST-TIME SETUP REQUIRED ─── */}
        {!isSetupDone ? (
          <div className="space-y-4">
            
            {/* Developer Testing Login Box */}
            <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Temporary Developer Testing Access
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 text-[10px] font-extrabold uppercase">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Use temporary credentials to test and inspect all admin pages (stock, rate cards, hero videos, bookings) right now:
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-xs space-y-1.5 text-slate-800 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Username:</span>
                  <strong className="text-blue-700 font-bold">admin</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Password:</span>
                  <strong className="text-blue-700 font-bold">admin123</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDevLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white text-xs font-extrabold shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>1-Click Sign In as Developer (admin)</span>
              </button>
            </div>

            {/* Owner Master Setup Portal Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>For Real Owner: Master Setup</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                When ready to hand over the store, Pushpendra Prajapati will register his master username, Gmail and password here.
              </p>
              <Link
                to="/admin/setup"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Owner Master Setup Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-2 text-center">
              <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ─── CASE 2: NORMAL SECURE SIGN-IN FORM ─── */
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Username or Registered Gmail
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    required 
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter username or registered Gmail"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Master Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForgotModal(true);
                      setRecoveryError('');
                      setRecoverySentData(null);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white text-xs font-extrabold shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating Owner...' : 'Secure Admin Sign In'}</span>
              </button>

            </form>

            {/* Developer Testing Shortcut in Case 2 */}
            <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <p className="font-bold text-[11px] text-amber-950">Developer Testing Access:</p>
                <p className="text-[10px] text-amber-800 font-mono">admin / admin123</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin');
                  setPassword('admin123');
                }}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>

            {/* Subtle Security Badge */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Master Admin Active &amp; Locked
              </span>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/" className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-blue-700">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </Link>
              <button 
                onClick={() => setShowForgotModal(true)}
                className="font-bold text-blue-700 hover:underline"
              >
                Forgot Username?
              </button>
            </div>
          </>
        )}

      </div>

      {/* ─── FORGOT PASSWORD & RECOVERY MODAL / OVERLAY ─── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200">
                  <Mail className="w-3 h-3" />
                  Gmail Password Recovery
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Reset Master Admin Password
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setRecoverySentData(null);
                  setRecoveryError('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {!recoverySentData ? (
              /* STEP 1: Enter Registered Gmail */
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter the Gmail address you registered during master setup. A direct password reset link &amp; 6-digit security code will be sent to your Gmail inbox.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Gmail Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      required
                      value={recoveryEmail}
                      onChange={e => setRecoveryEmail(e.target.value)}
                      placeholder="e.g. pushpendra.chhaya@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                {recoveryError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{recoveryLoading ? 'Dispatching Link...' : 'Send Reset Link to Gmail'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: Recovery Link Sent + Quick Password Reset Form */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recovery Code Generated for Gmail</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    A password reset link &amp; security code were dispatched for: <strong className="font-mono">{recoverySentData.email}</strong>.
                  </p>
                  <div className="pt-1 flex items-center justify-between font-mono text-[11px] text-emerald-900 border-t border-emerald-200/60 mt-1">
                    <span>Registered Username:</span>
                    <strong className="text-emerald-950 font-bold">{recoverySentData.username}</strong>
                  </div>
                </div>

                {/* Direct Actions: Open Gmail or Use Code */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open Gmail (mail.google.com)</span>
                  </a>

                  {recoverySentData.mailtoUrl && (
                    <a
                      href={recoverySentData.mailtoUrl}
                      className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1"
                      title="Open in default Email app"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email App</span>
                    </a>
                  )}
                </div>

                {/* Instant Password Reset Form */}
                <form onSubmit={handlePerformReset} className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                    Set New Password Now
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      6-Digit Security Code from Gmail
                    </label>
                    <input 
                      type="text" 
                      required
                      value={recoveryCode}
                      onChange={e => setRecoveryCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold tracking-wider text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">New Password</label>
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min 4 chars"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white"
                      />
                    </div>
                  </div>

                  {recoveryError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{recoveryError}</span>
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Password successfully updated! Logging you in...</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{resetSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                  </button>
                </form>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
