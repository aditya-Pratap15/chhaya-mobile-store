import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gift, 
  Clock, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Plus, 
  Save, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Layers, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  ExternalLink,
  Check,
  X
} from 'lucide-react';

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#4f46e5'  // Indigo
];

export default function AdminSpinnerPage() {
  const { settings, updateSettings, spinnerClaims, updateSpinnerClaimStatus, deleteSpinnerClaim, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'config'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'redeemed' | 'expired'

  // Wheel configuration state
  const [config, setConfig] = useState(() => {
    return settings?.spinner || {
      enabled: true,
      title: 'Chitrakoot Lucky Spin & Win',
      subtitle: 'Spin the wheel to win instant counter discounts & gifts!',
      expiryMinutes: 120,
      slices: [
        { id: 's1', label: '₹150 OFF Repair', prize: '₹150 Flat Discount on Screen or Motherboard Repair', code: 'CHHAYA-REP150', color: '#2563eb', textColor: '#ffffff' },
        { id: 's2', label: 'Free 9D Glass', prize: 'Free 9D Tempered Glass Installation on Any Phone', code: 'CHHAYA-9DGLASS', color: '#059669', textColor: '#ffffff' },
        { id: 's3', label: '10% Gadget OFF', prize: '10% Instant OFF on Any Audio or Power Gadget', code: 'CHHAYA-GADGET10', color: '#d97706', textColor: '#ffffff' },
        { id: 's4', label: '₹50 OFF Cover', prize: '₹50 Flat OFF on Any Mobile Cover or Case', code: 'CHHAYA-COVER50', color: '#7c3aed', textColor: '#ffffff' },
        { id: 's5', label: 'Free Cable Guard', prize: 'Free Spiral Cable Protector Set (Pack of 4)', code: 'CHHAYA-FREEPROT', color: '#db2777', textColor: '#ffffff' },
        { id: 's6', label: '₹200 OFF Combo', prize: '₹200 Instant OFF on Combo (Screen + Battery)', code: 'CHHAYA-COMBO200', color: '#0891b2', textColor: '#ffffff' }
      ]
    };
  });

  // Modal / Slice editing state
  const [editingSlice, setEditingSlice] = useState(null);

  // Filtered claims for anti-fraud log
  const claimsList = useMemo(() => spinnerClaims || [], [spinnerClaims]);

  const filteredClaims = useMemo(() => {
    return claimsList
      .filter(claim => {
        const isExpired = claim.expiresAt && Date.now() > claim.expiresAt && claim.status !== 'redeemed';
        const effectiveStatus = claim.status === 'redeemed' 
          ? 'redeemed' 
          : (isExpired ? 'expired' : 'active');

        const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
        
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          (claim.voucherCode || '').toLowerCase().includes(q) ||
          (claim.customerName || '').toLowerCase().includes(q) ||
          (claim.customerPhone || '').toLowerCase().includes(q) ||
          (claim.prize || '').toLowerCase().includes(q);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [claimsList, statusFilter, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = claimsList.length;
    let redeemed = 0;
    let active = 0;
    let expired = 0;

    claimsList.forEach(c => {
      if (c.status === 'redeemed') redeemed++;
      else if (c.expiresAt && Date.now() > c.expiresAt) expired++;
      else active++;
    });

    return { total, redeemed, active, expired };
  }, [claimsList]);

  // Save Wheel Configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!config.slices || config.slices.length < 2) {
      showToast('Spinner wheel must have at least 2 prize slices.', 'error');
      return;
    }

    updateSettings({
      ...settings,
      spinner: config
    });
    showToast('Spinner configuration & expiry rules saved live!', 'success');
  };

  // Add or Update Slice
  const handleSaveSlice = (e) => {
    e.preventDefault();
    if (!editingSlice.label || !editingSlice.prize) {
      showToast('Slice label and prize description are required.', 'error');
      return;
    }

    let updatedSlices = [...(config.slices || [])];
    if (editingSlice.id) {
      updatedSlices = updatedSlices.map(s => s.id === editingSlice.id ? editingSlice : s);
    } else {
      updatedSlices.push({
        ...editingSlice,
        id: 's-' + Date.now(),
        textColor: '#ffffff'
      });
    }

    setConfig({ ...config, slices: updatedSlices });
    setEditingSlice(null);
    showToast('Slice updated! Click "Save Wheel Configuration" to apply live.', 'info');
  };

  const handleDeleteSlice = (id) => {
    if (config.slices.length <= 2) {
      showToast('The spinner requires at least 2 slices.', 'error');
      return;
    }
    const updatedSlices = config.slices.filter(s => s.id !== id);
    setConfig({ ...config, slices: updatedSlices });
  };

  const handleMarkRedeemed = (claim) => {
    if (window.confirm(`Mark voucher "${claim.voucherCode}" as REDEEMED for customer ${claim.customerName}?`)) {
      updateSpinnerClaimStatus(claim.id, 'redeemed');
    }
  };

  const handleDeleteClaim = (claim) => {
    if (window.confirm(`Delete voucher record "${claim.voucherCode}"?`)) {
      deleteSpinnerClaim(claim.id);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" />
            <span>Store Gamification &amp; Counter Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lucky Wheel &amp; Voucher Control
          </h1>
          <p className="text-xs text-slate-500">
            Verify walk-in customer voucher codes, inspect audit logs, and configure prize slices &amp; expiration windows.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claims &amp; Verification ({claimsList.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wheel Setup &amp; Timer
          </button>
        </div>
      </div>

      {/* ─── TAB 1: CLAIMS & ANTI-FRAUD VERIFICATION ─── */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Total Claims Won</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.total}</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs bg-emerald-50/20">
              <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider">Active Vouchers</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{metrics.active}</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs bg-blue-50/20">
              <span className="text-[11px] font-bold text-blue-700 block uppercase tracking-wider">Redeemed at Counter</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">{metrics.redeemed}</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Expired Vouchers</span>
              <span className="text-2xl font-black text-slate-500 mt-1 block">{metrics.expired}</span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Voucher Code (e.g. SPIN-), Mobile Number, Customer Name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['all', 'active', 'redeemed', 'expired'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Anti-Fraud Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-extrabold text-slate-800">Verified Customer Prize Claims Log</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredClaims.length} records found
              </span>
            </div>

            {filteredClaims.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Voucher Code</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Prize Won</th>
                      <th className="py-3.5 px-4">Won Time</th>
                      <th className="py-3.5 px-4">Remaining / Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClaims.map((claim) => {
                      const isExpired = claim.expiresAt && Date.now() > claim.expiresAt && claim.status !== 'redeemed';
                      const isRedeemed = claim.status === 'redeemed';

                      return (
                        <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Voucher Code */}
                          <td className="py-4 px-4 font-mono font-black text-blue-700">
                            <span className="px-2 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs">
                              {claim.voucherCode}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-slate-900 block">{claim.customerName || 'Anonymous'}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-500 font-mono">{claim.customerPhone}</span>
                              {claim.customerPhone && (
                                <a
                                  href={`https://wa.me/91${claim.customerPhone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Prize */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900 block max-w-xs">{claim.prize}</span>
                            {claim.couponCode && (
                              <span className="text-[10px] font-mono text-slate-400">Code: {claim.couponCode}</span>
                            )}
                          </td>

                          {/* Won Date */}
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            {new Date(claim.createdAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            {isRedeemed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Redeemed
                              </span>
                            ) : isExpired ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                                <Clock className="w-3 h-3" />
                                Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active (Ready to Claim)
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isRedeemed && (
                                <button
                                  onClick={() => handleMarkRedeemed(claim)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                  title="Mark voucher redeemed at store counter"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Redeem</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteClaim(claim)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center space-y-2">
                <Gift className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No voucher claims matching filter</h4>
                <p className="text-xs text-slate-400">
                  When customers spin the lucky wheel and submit their details, records appear here immediately.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ─── TAB 2: WHEEL CONFIGURATION & EXPIRY RULES ─── */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          
          {/* Main Controls Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold">Wheel General Settings</h3>
              </div>

              {/* Enable / Disable Switch */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  config.enabled 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                }`}
              >
                {config.enabled ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                <span>{config.enabled ? 'Spinner Enabled on Website' : 'Spinner Disabled'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wheel Title</label>
                <input 
                  type="text"
                  value={config.title || ''}
                  onChange={e => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g. Chitrakoot Lucky Spin & Win"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Subtitle</label>
                <input 
                  type="text"
                  value={config.subtitle || ''}
                  onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="e.g. Spin the wheel to win instant counter discounts!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Voucher Expiration Window (Minutes)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number"
                    min="5"
                    max="10080"
                    required
                    value={config.expiryMinutes || 120}
                    onChange={e => setConfig({ ...config, expiryMinutes: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Default: 120 mins (2 Hours). Set to 60 for 1 hr, 1440 for 24 hrs.
                </span>
              </div>
            </div>
          </div>

          {/* Slices & Prizes Customization Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Wheel Prize Slices ({config.slices?.length || 0})</h3>
                <p className="text-[11px] text-slate-500">Every slice represents a prize a customer can land on and win.</p>
              </div>

              <button
                type="button"
                onClick={() => setEditingSlice({
                  label: '',
                  prize: '',
                  code: 'CHHAYA-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
                  color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
                  textColor: '#ffffff'
                })}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Slice</span>
              </button>
            </div>

            {/* Slices List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(config.slices || []).map((slice, index) => (
                <div 
                  key={slice.id || index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-white shadow-xs" 
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-xs font-black text-slate-900">{slice.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingSlice({ ...slice })}
                        className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlice(slice.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Delete slice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-snug line-clamp-2">
                    {slice.prize}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Coupon: <strong className="font-mono text-slate-700">{slice.code || 'N/A'}</strong></span>
                    <span className="font-bold">Slice #{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit / Save Bar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-700/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Wheel Settings Live</span>
            </button>
          </div>

        </form>
      )}

      {/* Slice Add / Edit Modal */}
      {editingSlice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md my-auto overflow-hidden text-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingSlice.id ? 'Edit Spinner Slice' : 'Create New Prize Slice'}
              </h3>
              <button 
                onClick={() => setEditingSlice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlice} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slice Wheel Label (Short)</label>
                <input 
                  type="text"
                  required
                  value={editingSlice.label || ''}
                  onChange={e => setEditingSlice({ ...editingSlice, label: e.target.value })}
                  placeholder="e.g. ₹150 OFF Repair"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Prize Description</label>
                <textarea 
                  rows="2"
                  required
                  value={editingSlice.prize || ''}
                  onChange={e => setEditingSlice({ ...editingSlice, prize: e.target.value })}
                  placeholder="e.g. ₹150 Flat Discount on Screen or Motherboard Repair at Sony Dharmshala"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Associated Coupon Code</label>
                <input 
                  type="text"
                  value={editingSlice.code || ''}
                  onChange={e => setEditingSlice({ ...editingSlice, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CHHAYA-REP150"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Slice Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setEditingSlice({ ...editingSlice, color: col })}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        editingSlice.color === col ? 'border-slate-900 scale-110 shadow-sm' : 'border-white'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                  <input 
                    type="color"
                    value={editingSlice.color || '#2563eb'}
                    onChange={e => setEditingSlice({ ...editingSlice, color: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer"
                    title="Custom Color"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  Save Slice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
