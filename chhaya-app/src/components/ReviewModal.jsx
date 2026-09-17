import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ReviewModal() {
  const { activeReviewModal, setActiveReviewModal, addReview, showToast } = useApp();
  const [name, setName] = useState('');
  const [device, setDevice] = useState('');
  const [service, setService] = useState('Screen Replacement');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!activeReviewModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) {
      showToast('Please enter your name and review message.', 'error');
      return;
    }

    addReview({
      name,
      device: device || 'Walk-in Customer',
      service,
      rating,
      comment
    });

    setActiveReviewModal(false);
    setName('');
    setDevice('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col transform scale-100 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Share Your Workshop Experience</h3>
          </div>
          <button 
            onClick={() => setActiveReviewModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-left overflow-y-auto flex-1">
          
          {/* Star Rating Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
              <span className="text-xs font-extrabold text-amber-600 ml-2">
                {rating === 5 ? '5.0 — Outstanding!' : `${rating}.0 Stars`}
              </span>
            </div>
          </div>

          {/* Name and Device */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Pooja Deshmukh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Device Model</label>
              <input 
                type="text" 
                value={device}
                onChange={e => setDevice(e.target.value)}
                placeholder="e.g. iPhone 13 Pro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Service / Purchase Done</label>
            <select 
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
            >
              <option value="Screen Replacement">Screen Replacement</option>
              <option value="Battery Replacement">Battery Replacement</option>
              <option value="Motherboard IC Micro-soldering">Motherboard IC Micro-soldering</option>
              <option value="Water Damage Rescue">Water Damage Rescue</option>
              <option value="Pre-Owned Phone Purchase">Pre-Owned Phone Purchase</option>
              <option value="Accessories & Fast Charger">Accessories &amp; Fast Charger</option>
              <option value="General Diagnosis">General Diagnosis</option>
            </select>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Honest Feedback</label>
            <textarea 
              rows="3" 
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was the diagnostic clarity, repair speed, part quality, and staff behavior at Sony Dharmshala store?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Verified Review</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveReviewModal(false)}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
