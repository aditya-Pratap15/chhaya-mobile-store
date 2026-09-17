import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Store, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Save, 
  RefreshCw, 
  Lock, 
  ShieldCheck,
  Award,
  AlertTriangle,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { ChhayaDB } from '../../services/db';

export default function AdminProfilePage() {
  const { settings, updateSettings, resetStoreDefaults, uploadOwnerAvatar, deleteOwnerAvatar, showToast } = useApp();

  const avatarFileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [ownerData, setOwnerData] = useState({
    name: settings?.owner?.name || 'Pushpendra Prajapati',
    title: settings?.owner?.title || 'Master Technician & Store Proprietor',
    experience: settings?.owner?.experience || '8+ Years Micro-soldering',
    estYear: settings?.owner?.estYear || '2023',
    bio: settings?.owner?.bio || '',
    avatar: settings?.owner?.avatar || ''
  });

  useEffect(() => {
    if (settings?.owner) {
      setOwnerData(prev => ({
        ...prev,
        ...settings.owner
      }));
    }
  }, [settings?.owner]);

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    setAvatarUploading(true);
    try {
      const dataUrl = await uploadOwnerAvatar(file);
      setOwnerData(prev => ({ ...prev, avatar: dataUrl }));
      showToast('Owner photo updated and applied live to website!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarUploading(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    setOwnerData(prev => ({ ...prev, avatar: '' }));
    if (typeof deleteOwnerAvatar === 'function') {
      await deleteOwnerAvatar();
    } else {
      updateSettings({
        ...settings,
        owner: { ...(settings.owner || {}), avatar: '' }
      });
      showToast('Owner photo removed completely.', 'success');
    }
  };

  const [storeData, setStoreData] = useState({
    name: settings?.store?.name || 'Chhaya Mobiles & Repairs',
    tagline: settings?.store?.tagline || '',
    badge: settings?.store?.badge || 'EST. 2023 • SONY DHARMSHALA, CHITRAKOOT',
    address: settings?.store?.address || '',
    landmark: settings?.store?.landmark || '',
    phone: settings?.store?.phone || '+91 93018 61874',
    whatsapp: settings?.store?.whatsapp || '+91 93018 61874',
    email: settings?.store?.email || 'contact@chhayamobiles.com',
    hoursWeek: settings?.store?.hoursWeek || 'Mon – Sat: 10:00 AM – 9:30 PM',
    hoursSun: settings?.store?.hoursSun || 'Sunday: 11:00 AM – 6:00 PM',
    mapEmbed: settings?.store?.mapEmbed || '',
    payments: settings?.store?.payments || ''
  });

  const [newPassword, setNewPassword] = useState('');

  const handleSaveAll = (e) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      owner: ownerData,
      store: storeData
    });

    if (newPassword && newPassword.length >= 4) {
      const rawCreds = localStorage.getItem('chhaya_admin_credentials_v3');
      if (rawCreds) {
        try {
          const creds = JSON.parse(rawCreds);
          creds.password = newPassword;
          localStorage.setItem('chhaya_admin_credentials_v3', JSON.stringify(creds));
          showToast('Master password updated successfully!', 'success');
        } catch(e) {}
      }
      setNewPassword('');
    }

    showToast('Store & Proprietor profile synced to storefront!', 'success');
  };

  const handleFactoryReset = () => {
    if (window.confirm('⚠️ WARNING: This will reset all inventory, repairs, settings, and reviews to original factory seed data. Are you sure?')) {
      resetStoreDefaults();
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Store &amp; Proprietor Profile Settings
        </h1>
        <p className="text-xs text-slate-500">
          Update public contact info, Chitrakoot Dham store address, workshop hours, and master credentials.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* Proprietor Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-blue-700">
            <User className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900">Master Proprietor Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
              <input 
                type="text" 
                required
                value={ownerData.name}
                onChange={e => setOwnerData({ ...ownerData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                value={ownerData.title}
                onChange={e => setOwnerData({ ...ownerData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Owner Photo / Avatar Uploader Component */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={avatarFileInputRef} 
                accept="image/*" 
                onChange={handleAvatarFileSelect} 
                className="hidden" 
              />
              <div 
                onClick={() => avatarFileInputRef.current?.click()}
                className="relative group cursor-pointer"
                title="Click to upload new owner photo"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-slate-100 flex items-center justify-center">
                  {ownerData.avatar ? (
                    <img 
                      src={ownerData.avatar} 
                      alt={ownerData.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 block">Owner Profile Portrait</span>
                <p className="text-[11px] text-slate-500">Shown in Homepage Meet the Owner section, Owner bio page &amp; Admin top bar</p>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Live synchronization enabled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={avatarUploading}
                onClick={() => avatarFileInputRef.current?.click()}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{avatarUploading ? 'Processing...' : 'Upload Owner Photo'}</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Delete photo completely from database"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Tag</label>
              <input 
                type="text" 
                value={ownerData.experience}
                onChange={e => setOwnerData({ ...ownerData, experience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL / Data URL</label>
              <input 
                type="text" 
                value={ownerData.avatar}
                onChange={e => setOwnerData({ ...ownerData, avatar: e.target.value })}
                placeholder="https://... or upload above"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800 truncate"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Proprietor Bio / Philosophy</label>
            <textarea 
              rows="3"
              value={ownerData.bio}
              onChange={e => setOwnerData({ ...ownerData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            ></textarea>
          </div>
        </div>

        {/* Storefront Contact & Timings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-emerald-700">
            <Store className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900">Chitrakoot Shop Configuration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Calling Phone</label>
              <input 
                type="text" 
                value={storeData.phone}
                onChange={e => setStoreData({ ...storeData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Inquiry Number</label>
              <input 
                type="text" 
                value={storeData.whatsapp}
                onChange={e => setStoreData({ ...storeData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weekday Timings (Mon–Sat)</label>
              <input 
                type="text" 
                value={storeData.hoursWeek}
                onChange={e => setStoreData({ ...storeData, hoursWeek: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sunday Timings</label>
              <input 
                type="text" 
                value={storeData.hoursSun}
                onChange={e => setStoreData({ ...storeData, hoursSun: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
            <input 
              type="text" 
              value={storeData.address}
              onChange={e => setStoreData({ ...storeData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prominent Landmark</label>
            <input 
              type="text" 
              value={storeData.landmark}
              onChange={e => setStoreData({ ...storeData, landmark: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Change Master Password */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-800">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">Security &amp; Password Update</h3>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-bold text-slate-700 mb-1">New Master Password (Leave blank to keep unchanged)</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 4 characters)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Push All Changes Live</span>
          </button>

          <button
            type="button"
            onClick={handleFactoryReset}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database to Factory Defaults</span>
          </button>
        </div>

      </form>

    </div>
  );
}
