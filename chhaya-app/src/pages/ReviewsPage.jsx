import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  CheckCircle2, 
  MessageSquarePlus, 
  ShieldCheck, 
  Sparkles, 
  Filter,
  ThumbsUp,
  ExternalLink
} from 'lucide-react';

export default function ReviewsPage() {
  const { reviews, setActiveReviewModal, settings } = useApp();
  const [selectedTag, setSelectedTag] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const tags = ['All', 'Screen Replacement', 'Water Damage Rescue', 'Pre-Owned Phone Purchase', 'Battery Replacement', 'Charging Port Repair'];

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchTag = selectedTag === 'All' || rev.service === selectedTag;
      const matchRating = rev.rating >= minRating;
      return matchTag && matchRating;
    });
  }, [reviews, selectedTag, minRating]);

  return (
    <div className="space-y-10 pb-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Verified Chitrakoot Testimonials
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Customer Reviews &amp; Repair Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real feedback from customers across Chitrakoot Dham and surrounding regions who got their devices repaired or purchased certified smartphones at our Sony Dharmshala workshop.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href={settings?.store?.googleReviewUrl || 'https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m8!3m7!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!9m1!1b1!16s%2Fg%2F11h9zslwhs?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 rounded-full" />
            <span>Review on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </a>

          <button
            onClick={() => setActiveReviewModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write Verified Review</span>
          </button>
        </div>
      </div>

      {/* Review Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl">
            4.9
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">Average Google Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl">
            500+
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Verified Reviews</h4>
            <p className="text-xs text-slate-500">Across Chitrakoot &amp; Surrounding Regions</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl">
            99%
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Satisfaction Rate</h4>
            <p className="text-xs text-slate-500">90-Day Service Guarantee</p>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-4 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">{rev.date}</span>
              </div>

              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                {rev.service}
              </span>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{rev.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{rev.device}</p>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
