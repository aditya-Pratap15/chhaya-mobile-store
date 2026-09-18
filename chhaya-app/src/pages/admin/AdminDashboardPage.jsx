import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wrench, 
  Star, 
  TrendingUp, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Clock,
  Save,
  Film,
  Calendar,
  Zap,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, repairs, reviews, settings, updateSettings, showToast, bookings } = useApp();

  const safeProducts = products || [];
  const safeRepairs = repairs || [];
  const safeReviews = reviews || [];
  const safeBookings = bookings || [];

  const pendingBookings = safeBookings.filter(b => b?.status === 'pending').length;

  const [announcementText, setAnnouncementText] = useState(
    settings?.announcement?.text || '🔥 Festival Special: Free 9D Tempered Glass with any Screen Replacement! Walk-ins welcome.'
  );
  const [announcementVisible, setAnnouncementVisible] = useState(
    settings?.announcement?.visible ?? true
  );
  const [announcementBlinking, setAnnouncementBlinking] = useState(
    settings?.announcement?.blinking ?? false
  );
  const [announcementSlider, setAnnouncementSlider] = useState(
    settings?.announcement?.slider ?? false
  );

  React.useEffect(() => {
    if (settings?.announcement) {
      if (settings.announcement.text !== undefined) setAnnouncementText(settings.announcement.text);
      if (settings.announcement.visible !== undefined) setAnnouncementVisible(settings.announcement.visible);
      if (settings.announcement.blinking !== undefined) setAnnouncementBlinking(settings.announcement.blinking);
      if (settings.announcement.slider !== undefined) setAnnouncementSlider(settings.announcement.slider);
    }
  }, [settings?.announcement]);

  const totalStockUnits = safeProducts.reduce((sum, p) => sum + (Number(p?.units) || 0), 0);
  const lowStockItems = safeProducts.filter(p => Number(p?.units) <= 3);
  const activeRepairsCount = safeRepairs.filter(r => r?.status !== false).length;

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      announcement: {
        ...settings?.announcement,
        text: announcementText,
        visible: announcementVisible,
        blinking: announcementBlinking,
        slider: announcementSlider
      }
    });
    showToast('Store broadcast banner updated and pushed to storefront!', 'success');
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
              Store Terminal v3.0
            </span>
            <span className="text-xs text-slate-500 font-semibold">Sony Dharmshala, Chitrakoot Dham</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            CMS Command Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time management for catalog stock, repair rate cards, customer reviews, and live store broadcast.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            to="/admin/media"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Film className="w-4 h-4" />
            <span>Hero Media</span>
          </Link>
          <Link
            to="/admin/stock"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gadget</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>Preview Store</span>
          </Link>
        </div>
      </div>

      {/* Telemetry Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Inventory</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">{totalStockUnits} Units</span>
            <span className="text-[11px] text-blue-600 font-bold">{safeProducts.length} distinct SKUs</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Hardware Services</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">{activeRepairsCount} Active</span>
            <span className="text-[11px] text-emerald-600 font-bold">Diagnostics online</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <Link to="/admin/reviews" className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Customer Reviews</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">4.9 ★</span>
            <span className="text-[11px] text-amber-600 font-bold group-hover:text-amber-700">{safeReviews.length} Verified • Manage →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
        </Link>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Low Stock Alerts</span>
            <span className="text-2xl font-black text-rose-600 block mt-0.5">{lowStockItems.length} SKUs</span>
            <span className="text-[11px] text-slate-400 font-medium">Restock suggested</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <Link to="/admin/bookings" className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Bench Bookings</span>
            <span className={`text-2xl font-black block mt-0.5 ${pendingBookings > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{pendingBookings} Pending</span>
            <span className="text-[11px] text-blue-600 font-bold">View all bookings →</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </Link>

      </div>

      {/* Broadcast Announcement Banner CMS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Storefront Broadcast Banner</h3>
              <p className="text-xs text-slate-500">Live top notification bar displayed across all customer pages</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Message Text</label>
            <input 
              type="text" 
              required
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              placeholder="e.g. 🔥 Festival Offer: Free Tempered Glass with Screen Replacement!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            />
          </div>

          {/* Configuration Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Option 1: Display on Storefront */}
            <label className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              announcementVisible 
                ? 'bg-blue-50/70 border-blue-300 shadow-xs' 
                : 'bg-slate-50/70 border-slate-200 opacity-70 hover:opacity-100'
            }`}>
              <input 
                type="checkbox"
                checked={announcementVisible}
                onChange={e => setAnnouncementVisible(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-slate-900">Show On Storefront</span>
                <p className="text-[11px] text-slate-500 leading-tight">Display top notification banner to visitors</p>
              </div>
            </label>

            {/* Option 2: Blinking Attention Alert */}
            <label className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              announcementBlinking 
                ? 'bg-amber-50/70 border-amber-300 shadow-xs' 
                : 'bg-slate-50/70 border-slate-200 opacity-70 hover:opacity-100'
            }`}>
              <input 
                type="checkbox"
                checked={announcementBlinking}
                onChange={e => setAnnouncementBlinking(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Blinking Alert Effect</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-tight">Flash &amp; pulse text to draw instant customer attention</p>
              </div>
            </label>

            {/* Option 3: Moving Text Slider (Marquee) */}
            <label className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              announcementSlider 
                ? 'bg-indigo-50/70 border-indigo-300 shadow-xs' 
                : 'bg-slate-50/70 border-slate-200 opacity-70 hover:opacity-100'
            }`}>
              <input 
                type="checkbox"
                checked={announcementSlider}
                onChange={e => setAnnouncementSlider(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Moving Text Slider</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-tight">Smooth scrolling ticker sliding across the bar</p>
              </div>
            </label>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Storefront Preview</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Status: {announcementVisible ? (
                  <span className="text-emerald-400 font-semibold">Active Live</span>
                ) : (
                  <span className="text-slate-400 font-semibold">Hidden</span>
                )}
              </span>
            </div>

            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-full py-1.5 px-4 border border-slate-800 flex items-center justify-between text-[11px] gap-2 overflow-hidden shadow-inner">
              <div className={`flex items-center gap-2 overflow-hidden ${announcementSlider ? 'w-full flex-1' : 'truncate'}`}>
                <span className={`inline-flex items-center justify-center p-0.5 rounded-full bg-amber-400/20 text-amber-300 shrink-0 ${announcementBlinking ? 'animate-blink' : ''}`}>
                  <Sparkles className="w-3 h-3" />
                </span>

                {announcementSlider ? (
                  <div className="overflow-hidden w-full relative flex items-center">
                    <div className={`animate-marquee whitespace-nowrap font-semibold text-slate-100 ${announcementBlinking ? 'animate-blink' : ''}`}>
                      <span className="mr-8">{announcementText || 'Your announcement message...'}</span>
                      <span className="mr-8 text-amber-400 font-bold">✦</span>
                      <span className="mr-8">{announcementText || 'Your announcement message...'}</span>
                      <span className="mr-8 text-amber-400 font-bold">✦</span>
                      <span className="mr-8">{announcementText || 'Your announcement message...'}</span>
                    </div>
                  </div>
                ) : (
                  <span className={`font-semibold text-slate-100 truncate ${announcementBlinking ? 'animate-blink' : ''}`}>
                    {announcementText || 'Your announcement message...'}
                  </span>
                )}
              </div>

              <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-400 shrink-0 pl-2">
                Preview Bar
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Broadcast Live</span>
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Low Stock Watchlist & Active Repairs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Watchlist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Inventory Stock Level Watch</h3>
            <Link to="/admin/stock" className="text-xs font-bold text-blue-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {safeProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-slate-400">₹{p.price?.toLocaleString('en-IN')} • {p.category}</span>
                  </div>
                </div>

                <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold ${
                  p.units <= 2 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {p.units} left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Repair Services Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Live Hardware Diagnostics Services</h3>
            <Link to="/admin/repairs" className="text-xs font-bold text-blue-600 hover:underline">
              Manage Rates
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {safeRepairs.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div className="text-left space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{r.duration}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{r.warranty}</span>
                  </div>
                </div>

                <span className="text-xs font-black text-slate-900">
                  ₹{r.price?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
