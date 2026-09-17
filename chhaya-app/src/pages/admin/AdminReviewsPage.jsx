import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  Trash2, 
  Pin, 
  Search, 
  MessageSquare, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  ThumbsUp,
  MapPin
} from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews, deleteReview, toggleReviewPin, settings, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const store = settings?.store || {};
  const googleReviewUrl = store.googleReviewUrl || 'https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m8!3m7!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!9m1!1b1!16s%2Fg%2F11h9zslwhs?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D';

  const safeReviews = reviews || [];

  const filteredReviews = safeReviews.filter(r => {
    if (!r) return false;
    const nameStr = (r.name || '').toLowerCase();
    const commentStr = (r.comment || '').toLowerCase();
    const deviceStr = (r.device || '').toLowerCase();
    const searchLower = (search || '').toLowerCase();

    const matchesSearch = nameStr.includes(searchLower) ||
                          commentStr.includes(searchLower) ||
                          deviceStr.includes(searchLower);
    const matchesRating = filterRating === 'all' || Number(r.rating) === Number(filterRating);
    return matchesSearch && matchesRating;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the review from "${name || 'Customer'}"?`)) {
      deleteReview(id);
    }
  };

  const avgRating = safeReviews.length > 0 
    ? (safeReviews.reduce((acc, r) => acc + (Number(r?.rating) || 5), 0) / safeReviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 text-left max-w-6xl pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Reviews Management
          </h1>
          <p className="text-xs text-slate-500">
            Moderate testimonials, pin showcase feedback, and inspect your official Google Maps reputation.
          </p>
        </div>

        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 rounded-full bg-white p-0.5" />
          <span>Open Google Reviews</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-extrabold text-xl flex items-center justify-center">
            ★ {avgRating}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Average Rating</span>
            <span className="text-sm font-extrabold text-slate-900">{safeReviews.length} Verified Reviews in DB</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-xl flex items-center justify-center">
            <Pin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pinned on Homepage</span>
            <span className="text-sm font-extrabold text-slate-900">{safeReviews.filter(r => r?.pinned).length} Featured</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Workshop Location</span>
            <span className="text-sm font-extrabold text-slate-900">Sony Dharmshala, Chitrakoot</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, device, or review text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
          />
        </div>

        <select
          value={filterRating}
          onChange={e => setFilterRating(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
        >
          <option value="all">All Star Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
          <option value="3">⭐⭐⭐ (3 Stars)</option>
          <option value="2">⭐⭐ (2 Stars)</option>
          <option value="1">⭐ (1 Star)</option>
        </select>
      </div>

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No matching reviews found</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different search term or star filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <div 
              key={r.id} 
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between gap-4 ${
                r.pinned ? 'border-amber-300 shadow-md ring-2 ring-amber-400/20' : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                
                {/* Review Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{r.name}</h4>
                      {r.pinned && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.device} • <span className="text-blue-600 font-semibold">{r.service}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{r.comment}"
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>📅 {r.date || 'Verified Customer'}</span>
                  {r.verified && <span className="text-emerald-600 font-bold">✓ Verified Bench Repair</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleReviewPin(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    r.pinned 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={r.pinned ? 'Unpin from Homepage' : 'Pin to Homepage'}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>{r.pinned ? 'Pinned' : 'Pin to Top'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(r.id, r.name)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Delete review from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Review</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
