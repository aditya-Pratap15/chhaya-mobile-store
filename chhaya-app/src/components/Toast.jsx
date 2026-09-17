import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const bgClasses = isError
    ? 'bg-rose-600 text-white shadow-rose-900/20'
    : isInfo
    ? 'bg-slate-900 text-white shadow-slate-900/20'
    : 'bg-emerald-600 text-white shadow-emerald-900/20';

  const IconComponent = isError ? AlertCircle : isInfo ? Info : CheckCircle2;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 max-w-md animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${bgClasses}`}>
        <IconComponent className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
}
