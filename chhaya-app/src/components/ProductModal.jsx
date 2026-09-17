import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, ShieldCheck, CheckCircle2, MessageCircle, Phone, MapPin, Tag } from 'lucide-react';

export default function ProductModal() {
  const { activeProductModal, setActiveProductModal, settings, showToast } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('Today (Within 2 hours)');
  const [reservedSuccess, setReservedSuccess] = useState(false);

  if (!activeProductModal) return null;

  const prod = activeProductModal;
  const store = settings?.store || {};

  const handleReserve = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      showToast('Please enter your name and phone number.', 'error');
      return;
    }

    setReservedSuccess(true);
    showToast(`In-store pickup reserved for ${prod.name}!`, 'success');
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Pushpendra bhai (Chhaya Mobiles), I am interested in purchasing "${prod.name}" (SKU: ${prod.sku}, Price: Rs.${prod.price.toLocaleString('en-IN')}). Is it currently available at your Chitrakoot store?`
    );
    const cleanPhone = (store.whatsapp || '+919301861874').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto max-h-[92vh] flex flex-col transform scale-100 transition-all">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">In-Store Pickup &amp; Hold</h3>
          </div>
          <button 
            onClick={() => { setActiveProductModal(null); setReservedSuccess(false); }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot & Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 mb-4 sm:mb-5">
            <img 
              src={prod.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'} 
              alt={prod.name}
              className="w-20 h-20 rounded-xl object-cover border border-white shadow-xs shrink-0"
            />
            <div className="flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{prod.category}</span>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{prod.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{prod.condition}</p>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-extrabold text-blue-700">₹{prod.price?.toLocaleString('en-IN')}</span>
                {prod.mrp && <span className="text-xs text-slate-400 line-through">₹{prod.mrp.toLocaleString('en-IN')}</span>}
              </div>
            </div>
          </div>

          {!reservedSuccess ? (
            <form onSubmit={handleReserve} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (For SMS Confirmation)</label>
                <input 
                  type="tel" 
                  required 
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9301861874"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Walk-in Time</label>
                <select 
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                >
                  <option value="Today (Within 2 hours)">Today (Within 2 hours)</option>
                  <option value="Today Evening (5 PM - 9 PM)">Today Evening (5 PM - 9 PM)</option>
                  <option value="Tomorrow Morning">Tomorrow Morning</option>
                  <option value="Weekend Walk-in">Weekend Walk-in</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Device will be reserved in Showcase Shelf. Payment handled directly at Chitrakoot counter via Cash/UPI/Card.</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm In-Store Hold</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Device Reserved Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We've set aside <strong className="text-slate-900">{prod.name}</strong> for <strong>{customerName}</strong>. Please visit our Chitrakoot store at Sony Dharmshala to inspect and collect your device.
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left text-slate-700 space-y-1">
                <p>📍 <strong>Pickup Location:</strong> {store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334'}</p>
                <p>⏰ <strong>Timing:</strong> {pickupDate}</p>
                <p>📞 <strong>Store Desk:</strong> {store.phone || '+91 93018 61874'}</p>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation to WhatsApp</span>
                </button>
                <button
                  onClick={() => { setActiveProductModal(null); setReservedSuccess(false); }}
                  className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
