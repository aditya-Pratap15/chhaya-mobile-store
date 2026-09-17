import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export default function AdminRepairsPage() {
  const { repairs, saveRepair, deleteRepair, toggleRepairStatus, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [editingRepair, setEditingRepair] = useState(null);

  const categories = [
    'Screen & Display', 
    'Battery & Charging', 
    'Motherboard & Micro-soldering', 
    'Diagnostics & Recovery',
    'Ports & Audio',
    'Camera & Optics'
  ];

  const filteredRepairs = (repairs || []).filter(r => {
    if (!r) return false;
    const nameStr = (r.name || '').toLowerCase();
    const catStr = (r.category || '').toLowerCase();
    const searchLower = (search || '').toLowerCase();
    return nameStr.includes(searchLower) || catStr.includes(searchLower);
  });

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingRepair.name || !editingRepair.price) {
      showToast('Service name and base price are required.', 'error');
      return;
    }

    saveRepair({
      ...editingRepair,
      price: Number(editingRepair.price),
      includes: Array.isArray(editingRepair.includes) 
        ? editingRepair.includes 
        : (editingRepair.includesStr || '').split('\n').filter(Boolean)
    });

    setEditingRepair(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete rate card for "${name}"?`)) {
      deleteRepair(id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Repair Service Rate Cards
          </h1>
          <p className="text-xs text-slate-500">
            Configure workshop diagnostic rates, turnaround times, and customer warranty seals.
          </p>
        </div>

        <button
          onClick={() => setEditingRepair({
            name: '',
            category: 'Screen & Display',
            price: 1499,
            duration: '30–45 Mins',
            warranty: '90 Days Warranty',
            description: 'Precision diagnostic and component repair with OEM quality parts.',
            includesStr: 'OEM Grade Calibration\nFree 9D Glass Protector\nDust Cleaning',
            status: true
          })}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Rate Card</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search repair rate cards by service name or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRepairs.map((srv) => (
          <div 
            key={srv.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {srv.category}
                </span>
                
                <button
                  onClick={() => toggleRepairStatus(srv.id)}
                  className={`flex items-center gap-1 text-[11px] font-bold ${
                    srv.status !== false ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                  title="Toggle Active Status"
                >
                  {srv.status !== false ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {srv.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {srv.description}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-600 font-bold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{srv.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{srv.warranty}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Base Rate</span>
                <span className="text-base font-extrabold text-slate-900">₹{srv.price?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingRepair({
                    ...srv,
                    includesStr: Array.isArray(srv.includes) ? srv.includes.join('\n') : ''
                  })}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  title="Edit Rate Card"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.name)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  title="Delete Rate Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Repair Modal */}
      {editingRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden transform scale-100 transition-all text-left">
            
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingRepair.id ? 'Edit Repair Rate Card' : 'Add New Hardware Service'}
              </h3>
              <button 
                onClick={() => setEditingRepair(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title</label>
                <input 
                  type="text" 
                  required
                  value={editingRepair.name || ''}
                  onChange={e => setEditingRepair({ ...editingRepair, name: e.target.value })}
                  placeholder="e.g. Original OLED Screen Replacement"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Category</label>
                  <select
                    value={editingRepair.category || 'Screen & Display'}
                    onChange={e => setEditingRepair({ ...editingRepair, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={editingRepair.price || ''}
                    onChange={e => setEditingRepair({ ...editingRepair, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround Duration</label>
                  <input 
                    type="text" 
                    value={editingRepair.duration || ''}
                    onChange={e => setEditingRepair({ ...editingRepair, duration: e.target.value })}
                    placeholder="e.g. 30–45 Mins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warranty Guarantee</label>
                  <input 
                    type="text" 
                    value={editingRepair.warranty || ''}
                    onChange={e => setEditingRepair({ ...editingRepair, warranty: e.target.value })}
                    placeholder="e.g. 90 Days Warranty"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Description</label>
                <textarea 
                  rows="2"
                  value={editingRepair.description || ''}
                  onChange={e => setEditingRepair({ ...editingRepair, description: e.target.value })}
                  placeholder="Details of the diagnostic procedure..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inclusions (One per line)</label>
                <textarea 
                  rows="3"
                  value={editingRepair.includesStr || ''}
                  onChange={e => setEditingRepair({ ...editingRepair, includesStr: e.target.value })}
                  placeholder="OEM Calibration&#10;Dust Cleaning&#10;Frame Seal Reapplied"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3 shrink-0">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all"
                >
                  Save Rate Card
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRepair(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
