import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ChhayaDB } from '../services/db';
import { MediaDB } from '../services/mediaDb';
import { 
  subscribeToFirestore, 
  cloudSaveProduct, 
  cloudDeleteProduct, 
  cloudSaveRepair, 
  cloudDeleteRepair, 
  cloudSaveReview, 
  cloudDeleteReview, 
  cloudSaveSettings, 
  cloudSaveMedia, 
  cloudSaveBooking, 
  cloudUpdateBookingStatus,
  cloudDeleteBooking 
} from '../services/firebaseSync';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => ChhayaDB.getSettings());
  const [products, setProducts] = useState(() => ChhayaDB.getProducts());
  const [repairs, setRepairs] = useState(() => ChhayaDB.getRepairs());
  const [reviews, setReviews] = useState(() => ChhayaDB.getReviews());
  const [media, setMedia] = useState(() => ChhayaDB.getMedia());
  const [bookings, setBookings] = useState(() => ChhayaDB.getBookings());
  const [spinnerClaims, setSpinnerClaims] = useState(() => ChhayaDB.getSpinnerClaims());
  const [adminSession, setAdminSession] = useState(() => ChhayaDB.getAdminSession());

  // Modal States
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeBookingModal, setActiveBookingModal] = useState(null);
  const [activeReviewModal, setActiveReviewModal] = useState(false);
  const [activeSpinnerModal, setActiveSpinnerModal] = useState(false);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(curr => (curr?.message === message ? null : curr));
    }, 3800);
  }, []);

  const refreshAllData = useCallback(async () => {
    setSettings(ChhayaDB.getSettings());
    setProducts(ChhayaDB.getProducts());
    setRepairs(ChhayaDB.getRepairs());
    setReviews(ChhayaDB.getReviews());
    
    // Check if custom uploaded video is in IndexedDB
    const baseMedia = ChhayaDB.getMedia();
    try {
      const blobUrl = await MediaDB.getObjectURL('hero_video');
      if (blobUrl) {
        baseMedia.video = {
          ...(baseMedia.video || {}),
          url: blobUrl,
          isLocalUploaded: true
        };
      }
    } catch (e) {
      console.warn('Error checking IndexedDB video:', e);
    }
    setMedia(baseMedia);
    setBookings(ChhayaDB.getBookings());
    setSpinnerClaims(ChhayaDB.getSpinnerClaims());
    setAdminSession(ChhayaDB.getAdminSession());
  }, []);

  useEffect(() => {
    // Initial load check for local uploaded video
    refreshAllData();

    // ─── Real-Time Cloud Firestore Sync ───
    const unsubscribeFirestore = subscribeToFirestore({
      onProducts: (liveProducts) => {
        setProducts(liveProducts);
        try { localStorage.setItem('chhaya_products_v4', JSON.stringify(liveProducts)); } catch(e){}
      },
      onRepairs: (liveRepairs) => {
        setRepairs(liveRepairs);
        try { localStorage.setItem('chhaya_repairs_v4', JSON.stringify(liveRepairs)); } catch(e){}
      },
      onReviews: (liveReviews) => {
        setReviews(liveReviews);
        try { localStorage.setItem('chhaya_reviews_v4', JSON.stringify(liveReviews)); } catch(e){}
      },
      onSettings: (liveSettings) => {
        if (liveSettings?.owner?.avatar && (liveSettings.owner.avatar.includes('aida-public') || liveSettings.owner.avatar.includes('googleusercontent.com'))) {
          liveSettings.owner.avatar = '';
          cloudSaveSettings(liveSettings);
        }
        setSettings(liveSettings);
        try { localStorage.setItem('chhaya_store_settings_v4', JSON.stringify(liveSettings)); } catch(e){}
      },
      onMedia: (liveMedia) => {
        setMedia(prev => ({
          ...liveMedia,
          video: prev?.video?.isLocalUploaded ? prev.video : liveMedia.video
        }));
        try { localStorage.setItem('chhaya_hero_media_v4', JSON.stringify(liveMedia)); } catch(e){}
      },
      onBookings: (liveBookings) => {
        setBookings(liveBookings);
        try { localStorage.setItem('chhaya_bookings_v4', JSON.stringify(liveBookings)); } catch(e){}
      }
    });

    const handleDBUpdate = () => {
      refreshAllData();
    };
    const handleAuthUpdate = (e) => {
      setAdminSession(e.detail);
    };

    window.addEventListener('chhaya_db_update', handleDBUpdate);
    window.addEventListener('chhaya_auth_change', handleAuthUpdate);
    window.addEventListener('storage', handleDBUpdate);

    return () => {
      if (typeof unsubscribeFirestore === 'function') unsubscribeFirestore();
      window.removeEventListener('chhaya_db_update', handleDBUpdate);
      window.removeEventListener('chhaya_auth_change', handleAuthUpdate);
      window.removeEventListener('storage', handleDBUpdate);
    };
  }, [refreshAllData]);

  // Product Actions
  const saveProduct = (prod) => {
    const isNew = !prod.id;
    const saved = ChhayaDB.saveProduct(prod);
    cloudSaveProduct(saved || prod);
    refreshAllData();
    showToast(isNew ? 'New gadget added to live store inventory!' : 'Product details updated & synced live!', 'success');
  };

  const deleteProduct = (id) => {
    ChhayaDB.deleteProduct(id);
    cloudDeleteProduct(id);
    refreshAllData();
    showToast('Product removed from catalog.', 'info');
  };

  const updateStock = (id, delta) => {
    const newQty = ChhayaDB.updateStockUnits(id, delta);
    const updated = ChhayaDB.getProducts().find(p => p.id === id);
    if (updated) cloudSaveProduct(updated);
    refreshAllData();
    showToast(`Stock updated (${newQty} units remaining).`, 'success');
  };

  // Repair Actions
  const saveRepair = (srv) => {
    const isNew = !srv.id;
    const saved = ChhayaDB.saveRepair(srv);
    cloudSaveRepair(saved || srv);
    refreshAllData();
    showToast(isNew ? 'New repair service added!' : 'Service rate card updated & synced live!', 'success');
  };

  const deleteRepair = (id) => {
    ChhayaDB.deleteRepair(id);
    cloudDeleteRepair(id);
    refreshAllData();
    showToast('Repair service removed.', 'info');
  };

  const toggleRepairStatus = (id) => {
    ChhayaDB.toggleRepairStatus(id);
    const srv = ChhayaDB.getRepairs().find(r => r.id === id);
    if (srv) cloudSaveRepair(srv);
    refreshAllData();
    showToast('Service availability updated.', 'success');
  };

  // Review Actions
  const addReview = (rev) => {
    ChhayaDB.addReview(rev);
    cloudSaveReview(rev);
    refreshAllData();
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const deleteReview = (id) => {
    ChhayaDB.deleteReview(id);
    cloudDeleteReview(id);
    refreshAllData();
    showToast('Review removed.', 'info');
  };

  const toggleReviewPin = (id) => {
    ChhayaDB.toggleReviewPin(id);
    const rev = ChhayaDB.getReviews().find(r => r.id === id);
    if (rev) cloudSaveReview(rev);
    refreshAllData();
    showToast('Review pinned status updated.', 'success');
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    ChhayaDB.saveSettings(newSettings);
    cloudSaveSettings(newSettings);
    refreshAllData();
    showToast('Store settings & broadcast updated live!', 'success');
  };

  const resetStoreDefaults = () => {
    ChhayaDB.resetToDefaults();
    refreshAllData();
    showToast('Database reset to original Chitrakoot store catalog.', 'info');
  };

  // Auth Actions
  const login = (u, p) => {
    const res = ChhayaDB.adminLogin(u, p);
    if (res.success) {
      setAdminSession(ChhayaDB.getAdminSession());
      showToast('Admin authenticated. Welcome back, ' + (res.session?.ownerName || 'Proprietor') + '!', 'success');
    } else {
      showToast(res.message || 'Login failed', 'error');
    }
    return res;
  };

  const logout = () => {
    ChhayaDB.adminLogout();
    setAdminSession(null);
    showToast('Signed out of admin terminal.', 'info');
  };

  const setupAdmin = (ownerName, username, email, password) => {
    const res = ChhayaDB.completeAdminSetup(ownerName, username, email, password);
    if (res.success) {
      setAdminSession(ChhayaDB.getAdminSession());
      showToast('Master Admin credentials created and locked successfully!', 'success');
    } else {
      showToast(res.message || 'Setup failed', 'error');
    }
    return res;
  };

  const requestPasswordReset = (emailOrUser) => {
    return ChhayaDB.requestPasswordReset(emailOrUser);
  };

  const verifyResetCode = (tokenOrCode) => {
    return ChhayaDB.verifyResetCode(tokenOrCode);
  };

  const resetPasswordWithToken = (tokenOrCode, newPassword) => {
    const res = ChhayaDB.resetPasswordWithToken(tokenOrCode, newPassword);
    if (res.success) {
      showToast('Password reset successfully! Please log in.', 'success');
    } else {
      showToast(res.message || 'Password reset failed.', 'error');
    }
    return res;
  };

  // Media Actions
  const addMediaImage = (img) => {
    ChhayaDB.addMediaImage(img);
    cloudSaveMedia(ChhayaDB.getMedia());
    refreshAllData();
    showToast('New showcase image added to homepage gallery!', 'success');
  };

  const deleteMediaImage = (id) => {
    ChhayaDB.deleteMediaImage(id);
    cloudSaveMedia(ChhayaDB.getMedia());
    refreshAllData();
    showToast('Showcase image removed.', 'info');
  };

  const updateVideo = (videoObj) => {
    ChhayaDB.updateVideo(videoObj);
    cloudSaveMedia(ChhayaDB.getMedia());
    refreshAllData();
    showToast('Hero showcase video updated!', 'success');
  };

  const uploadHeroVideo = async (file) => {
    try {
      showToast(`Saving video "${file.name}" to browser storage...`, 'info');
      await MediaDB.saveFile('hero_video', file, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      const blobUrl = URL.createObjectURL(file);
      const videoData = {
        url: blobUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        isLocalUploaded: true,
        fileName: file.name,
        fileSize: file.size
      };
      ChhayaDB.updateVideo({
        url: '/uploaded_video_local',
        title: videoData.title,
        isLocalUploaded: true,
        fileName: file.name,
        fileSize: file.size
      });
      setMedia(prev => ({
        ...prev,
        video: videoData
      }));
      showToast(`Hero video "${file.name}" uploaded successfully!`, 'success');
      return blobUrl;
    } catch (err) {
      console.error(err);
      showToast('Failed to save video: ' + (err.message || 'Storage error'), 'error');
      throw err;
    }
  };

  const resetHeroVideo = async () => {
    try {
      await MediaDB.deleteFile('hero_video');
      const defaultVideo = {
        url: '/final_video.mp4',
        title: 'Chhaya Mobiles Workshop & Store Showcase',
        isLocalUploaded: false
      };
      ChhayaDB.updateVideo(defaultVideo);
      cloudSaveMedia(ChhayaDB.getMedia());
      refreshAllData();
      showToast('Reset to original showcase video.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const uploadOwnerAvatar = async (file) => {
    try {
      const dataUrl = await MediaDB.fileToDataURL(file, 800, 0.88);
      await MediaDB.saveFile('owner_avatar', file, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      const currentSettings = ChhayaDB.getSettings();
      updateSettings({
        ...currentSettings,
        owner: { ...(currentSettings.owner || {}), avatar: dataUrl }
      });
      return dataUrl;
    } catch (err) {
      console.error(err);
      showToast('Failed to process image: ' + (err.message || 'Image error'), 'error');
      throw err;
    }
  };

  const deleteOwnerAvatar = async () => {
    try {
      await MediaDB.deleteFile('owner_avatar');
    } catch (err) {
      console.warn('Could not delete from MediaDB', err);
    }
    const currentSettings = ChhayaDB.getSettings();
    const newSettings = {
      ...currentSettings,
      owner: { ...(currentSettings.owner || {}), avatar: '' }
    };
    ChhayaDB.saveSettings(newSettings);
    cloudSaveSettings(newSettings);
    refreshAllData();
    showToast('Owner photo removed completely and deleted from database.', 'success');
  };

  const saveMedia = (mediaObj) => {
    ChhayaDB.saveMedia(mediaObj);
    cloudSaveMedia(mediaObj);
    refreshAllData();
    showToast('Showcase media settings saved & synced live!', 'success');
  };

  // Booking Actions
  const addBooking = (booking) => {
    const saved = ChhayaDB.addBooking(booking);
    if (saved) cloudSaveBooking(saved);
    refreshAllData();
  };

  const updateBookingStatus = (id, status) => {
    ChhayaDB.updateBookingStatus(id, status);
    cloudUpdateBookingStatus(id, status);
    refreshAllData();
    showToast(`Booking marked as ${status}.`, 'success');
  };

  const deleteBooking = (id) => {
    ChhayaDB.deleteBooking(id);
    cloudDeleteBooking(id);
    refreshAllData();
    showToast('Booking removed.', 'info');
  };

  // Spinner Actions
  const claimSpinnerPrize = (claimData) => {
    const newClaim = ChhayaDB.addSpinnerClaim(claimData);
    refreshAllData();
    showToast('🎁 Lucky Prize Voucher Activated!', 'success');
    return newClaim;
  };

  const updateSpinnerClaimStatus = (id, status) => {
    ChhayaDB.updateSpinnerClaimStatus(id, status);
    refreshAllData();
    showToast(`Voucher status updated to ${status}.`, 'success');
  };

  const deleteSpinnerClaim = (id) => {
    ChhayaDB.deleteSpinnerClaim(id);
    refreshAllData();
    showToast('Voucher entry deleted.', 'info');
  };

  const value = {
    settings,
    products,
    repairs,
    reviews,
    media,
    bookings,
    spinnerClaims,
    adminSession,
    isAdmin: !!adminSession,
    toast,
    showToast,
    saveProduct,
    deleteProduct,
    updateStock,
    saveRepair,
    deleteRepair,
    toggleRepairStatus,
    addReview,
    deleteReview,
    toggleReviewPin,
    updateSettings,
    resetStoreDefaults,
    addMediaImage,
    deleteMediaImage,
    updateVideo,
    uploadHeroVideo,
    resetHeroVideo,
    uploadOwnerAvatar,
    deleteOwnerAvatar,
    saveMedia,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    claimSpinnerPrize,
    updateSpinnerClaimStatus,
    deleteSpinnerClaim,
    login,
    logout,
    setupAdmin,
    isAdminSetupDone: ChhayaDB.isAdminSetupDone(),
    getAdminSetupInfo: ChhayaDB.getAdminSetupInfo,
    requestPasswordReset,
    verifyResetCode,
    resetPasswordWithToken,
    // Modals
    activeProductModal,
    setActiveProductModal,
    activeBookingModal,
    setActiveBookingModal,
    activeReviewModal,
    setActiveReviewModal,
    activeSpinnerModal,
    setActiveSpinnerModal
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
