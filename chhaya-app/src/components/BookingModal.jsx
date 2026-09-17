import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wrench, Clock, CheckCircle2, MessageCircle } from 'lucide-react';

export default function BookingModal() {
  const { activeBookingModal, setActiveBookingModal, repairs, settings, showToast, addBooking } = useApp();
  
  const [deviceBrand, setDeviceBrand] = useState('Apple iPhone');
  const [deviceModel, setDeviceModel] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(repairs[0]?.id || 'srv-1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Today (Within 1 hour)');
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [savedBooking, setSavedBooking] = useState(null);

  if (!activeBookingModal) return null;

  const currentService = repairs.find(r => r.id === selectedServiceId) || repairs[0] || {};
  const store = settings?.store || {};
  const cleanPhone = (store.whatsapp || '919301861874').replace(/[^0-9]/g, '');

  const buildWhatsAppMessage = (bk) => {
    return encodeURIComponent(
      `*Chhaya Mobiles - Bench Reservation*\n\n` +
      `Name: ${bk.customerName}\n` +
      `Contact: ${bk.customerPhone}\n` +
      `Device: ${bk.deviceBrand} ${bk.deviceModel}\n` +
      `Service: ${bk.serviceName}\n` +
      `Est. Cost: Starting Rs.${Number(bk.servicePrice||0).toLocaleString('en-IN')}\n` +
      `Repair Time: ${bk.serviceDuration||'30-45 Mins'}\n` +
      `Warranty: ${bk.serviceWarranty||'90 Days'}\n` +
      `Slot: ${bk.preferredSlot}\n` +
      `Workshop: Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334\n\n` +
      `Please confirm my bench appointment. Thank you!`
    );
  };

  const buildBookingObj = (channel) => ({
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    deviceBrand,
    deviceModel: deviceModel.trim() || 'Not specified',
    serviceName: currentService.name,
    serviceId: currentService.id,
    servicePrice: currentService.price,
    serviceDuration: currentService.duration,
    serviceWarranty: currentService.warranty || '90 Days',
    preferredSlot,
    channel
  });

  const handleBook = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please enter your name and contact phone.', 'error');
      return;
    }
    const bk = buildBookingObj('Web Form');
    addBooking(bk);
    setSavedBooking(bk);
    setBookedSuccess(true);
    showToast(`Bench reserved for ${customerName} \u2014 ${currentService.name}!`, 'success');
  };

  const handleWhatsAppBooking = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please fill your name and phone first.', 'error');
      return;
    }
    const bk = savedBooking || buildBookingObj('WhatsApp');
    if (!savedBooking) {
      addBooking(bk);
      setSavedBooking(bk);
    }
    window.open(`https://wa.me/${cleanPhone}?text=${buildWhatsAppMessage(bk)}`, '_blank');
  };

  const handleClose = () => {
    setActiveBookingModal(null);
    setBookedSuccess(false);
    setSavedBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Wrench className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">Book Instant Hardware Diagnostic</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Same-day bench repair at Sony Dharmshala, Chitrakoot Dham</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!bookedSuccess ? (
            <form onSubmit={handleBook} className="space-y-4 text-left">
              
              {/* Brand Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Smartphone Brand</label>
                  <select 
                    value={deviceBrand}
                    onChange={e => setDeviceBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="Apple iPhone">Apple iPhone</option>
                    <option value="Samsung Galaxy">Samsung Galaxy</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi / Redmi / Poco">Xiaomi / Redmi / Poco</option>
                    <option value="Vivo / iQOO">Vivo / iQOO</option>
                    <option value="Oppo / Realme">Oppo / Realme</option>
                    <option value="Google Pixel">Google Pixel</option>
                    <option value="Other Brand / Tablet">Other Brand / Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model / Series</label>
                  <input 
                    type="text" 
                    required 
                    value={deviceModel}
                    onChange={e => setDeviceModel(e.target.value)}
                    placeholder="e.g. iPhone 15 / Galaxy S24"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Service Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hardware Issue / Required Service</label>
                <select 
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                >
                  {repairs.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Starting ₹{r.price?.toLocaleString('en-IN')} • {r.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Service Estimate Card */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Estimated Turnaround</span>
                    <p className="text-xs font-bold text-slate-900">{currentService.duration || '30–45 Mins'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Starting From</span>
                  <p className="text-base font-extrabold text-blue-700">₹{currentService.price?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Customer Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Joshi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9301861874"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Walk-In Slot</label>
                <select 
                  value={preferredSlot}
                  onChange={e => setPreferredSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                >
                  <option value="Today (Within 1 hour)">Today (Within 1 hour) - Priority Bench</option>
                  <option value="Today Afternoon (2 PM - 5 PM)">Today Afternoon (2 PM - 5 PM)</option>
                  <option value="Today Evening (5 PM - 9:30 PM)">Today Evening (5 PM - 9:30 PM)</option>
                  <option value="Tomorrow Morning (10 AM - 1 PM)">Tomorrow Morning (10 AM - 1 PM)</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reserve Diagnostic Bench</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Bench Appointment Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Priority diagnostic bench reserved for <strong>{savedBooking?.customerName}</strong> — your slot is locked in.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left text-slate-700 space-y-1.5">
                <p>📲 <strong>Device:</strong> {savedBooking?.deviceBrand} {savedBooking?.deviceModel}</p>
                <p>🔧 <strong>Service:</strong> {savedBooking?.serviceName}</p>
                <p>💰 <strong>Est. Cost:</strong> Starting ₹{Number(savedBooking?.servicePrice||0).toLocaleString('en-IN')}</p>
                <p>⏱️ <strong>Duration:</strong> {savedBooking?.serviceDuration} • {savedBooking?.serviceWarranty} Warranty</p>
                <p>⏰ <strong>Slot:</strong> {savedBooking?.preferredSlot}</p>
                <p>📍 <strong>Workshop:</strong> Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334</p>
                <p className="pt-1 text-emerald-700 font-bold">✅ Saved to admin — technician will confirm shortly.</p>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleWhatsAppBooking}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Booking Ticket via WhatsApp</span>
                </button>
                <button
                  onClick={handleClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
