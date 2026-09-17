import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Mail,
  User
} from 'lucide-react';
import { ChhayaDB } from '../../services/db';

export default function AdminResetPasswordPage() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [codeOrToken, setCodeOrToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      const verify = ChhayaDB.verifyResetCode(tokenParam);
      if (verify.valid) {
        setVerifiedUser(verify);
      }
    }
  }, [tokenParam]);

  const handleVerifyCodeOnly = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const verify = ChhayaDB.verifyResetCode(codeOrToken);
    if (verify.valid) {
      setVerifiedUser(verify);
      showToast('Security code verified for ' + verify.username + '!', 'success');
    } else {
      setErrorMsg(verify.message || 'Invalid or expired code.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const res = ChhayaDB.resetPasswordWithToken(codeOrToken, newPassword);
    if (res.valid && res.success) {
      setSuccessMsg('Master Password updated successfully! Redirecting to sign in...');
      showToast('Password reset successful! Please sign in with your new password.', 'success');
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 2000);
    } else {
      setErrorMsg(res.message || 'Failed to update password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-left antialiased">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 mx-auto flex items-center justify-center text-blue-600 shadow-sm">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Owner Password Recovery
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reset Master Admin Password
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Enter the 6-digit security code dispatched to your registered Gmail address to configure a new master password.
          </p>
        </div>

        {/* Verified User Info Banner */}
        {verifiedUser && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Identity Verified</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Master Account: <strong className="font-mono">{verifiedUser.username}</strong> ({verifiedUser.email})
            </p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              6-Digit Security Code or Token
            </label>
            <input 
              type="text" 
              required
              value={codeOrToken}
              onChange={e => setCodeOrToken(e.target.value)}
              placeholder="e.g. 6-digit OTP code"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              New Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 chars)"
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
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
            className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white text-xs font-extrabold shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Saving Password...' : 'Save New Password & Return to Login'}</span>
          </button>

        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link to="/admin/login" className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-blue-700">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <Link to="/" className="font-bold text-blue-700 hover:underline">
            Storefront Homepage
          </Link>
        </div>

      </div>

    </div>
  );
}
