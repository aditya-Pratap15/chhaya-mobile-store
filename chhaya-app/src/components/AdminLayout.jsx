import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChhayaDB } from '../services/db';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wrench, 
  UserCog, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  Bell, 
  ChevronRight,
  Store,
  Film,
  Calendar,
  Star
} from 'lucide-react';

export default function AdminLayout() {
  const { isAdmin, adminSession, logout, bookings, settings } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingBookings = (bookings || []).filter(b => b.status === 'pending').length;

  // Protected Route Check
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/admin/bookings', label: 'Bench Bookings', icon: Calendar, badge: pendingBookings },
    { to: '/admin/media', label: 'Hero Video & Gallery', icon: Film },
    { to: '/admin/stock', label: 'Stock & Gadgets', icon: Smartphone },
    { to: '/admin/repairs', label: 'Repair Rate Cards', icon: Wrench },
    { to: '/admin/reviews', label: 'Customer Reviews', icon: Star },
    { to: '/admin/profile', label: 'Store & Profile Settings', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      
      {/* Developer Testing Mode Banner with Handover Action */}
      {adminSession?.isTemporaryDevMode && (
        <div className="bg-amber-400 border-b border-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-extrabold uppercase text-[10px] tracking-wider">
              Developer Testing Mode
            </span>
            <span>
              Signed in with temporary credentials (<strong>admin</strong> / <strong>admin123</strong>). Check everything in the admin panel!
            </span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Delete temporary developer credentials and hand over the store admin exclusively to the real owner (Pushpendra Prajapati)?')) {
                ChhayaDB.resetAdminSetup();
                logout();
                navigate('/admin/setup', { replace: true });
              }
            }}
            className="px-3 py-1 bg-slate-950 hover:bg-black text-white rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Hand Over to Real Owner (Delete Temp Credentials)</span>
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        
        {/* Left Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle admin sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                <img 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" 
                  alt="Chhaya Mobiles Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">Chhaya Mobiles</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200">
                Staff Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shadow-xs"
            title="Open Live Customer Storefront in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Storefront Preview</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
            title="Sign out of Workshop Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center ring-2 ring-blue-500/20 overflow-hidden">
              {settings?.owner?.avatar ? (
                <img src={settings.owner.avatar} alt="Owner" className="w-full h-full object-cover" />
              ) : (
                adminSession?.ownerName ? adminSession.ownerName.charAt(0) : 'P'
              )}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <p className="font-bold text-slate-900">{adminSession?.ownerName || 'Pushpendra Prajapati'}</p>
              <p className="text-[10px] text-slate-500">Chitrakoot Dham Admin</p>
            </div>
          </div>
        </div>

      </header>

      {/* Main App Container with Sidebar & Content */}
      <div className="flex flex-1 relative">
        
        {/* Mobile Backdrop Overlay for Sidebar */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-16 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
          <div className="p-4 space-y-6">
            
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Store Management</span>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Store className="w-4 h-4 text-blue-600" />
                <span>Chitrakoot Dham Active Sync</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Changes saved in this panel update the live customer storefront instantly with zero build step.
              </p>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Terminal</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
