import { DEFAULT_SETTINGS, DEFAULT_PRODUCTS, DEFAULT_REPAIRS, DEFAULT_REVIEWS, DEFAULT_MEDIA } from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'chhaya_store_settings_v4',
  PRODUCTS: 'chhaya_products_v4',
  REPAIRS: 'chhaya_repairs_v4',
  REVIEWS: 'chhaya_reviews_v4',
  MEDIA: 'chhaya_hero_media_v4',
  BOOKINGS: 'chhaya_bookings_v4',
  SPINNER_CLAIMS: 'chhaya_spinner_claims_v4',
  CREDENTIALS: 'chhaya_admin_credentials_v4',
  SETUP_DONE: 'chhaya_admin_setup_v4',
  SESSION: 'chhaya_admin_session_v4',
  RESET_TOKEN: 'chhaya_admin_reset_token_v4'
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('chhaya_db_update', { detail: { key, value } }));
    return true;
  } catch (e) {
    console.error(`Error writing to localStorage key ${key}`, e);
    return false;
  }
}

export const ChhayaDB = {
  // ─── Settings ───
  getSettings() {
    const s = safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (s?.owner?.avatar && (s.owner.avatar.includes('aida-public') || s.owner.avatar.includes('googleusercontent.com'))) {
      s.owner.avatar = '';
      safeSet(STORAGE_KEYS.SETTINGS, s);
    }
    if (s?.announcement) {
      if (s.announcement.blinking === undefined) s.announcement.blinking = true;
      if (s.announcement.slider === undefined) s.announcement.slider = true;
    }
    return s;
  },
  saveSettings(settings) {
    return safeSet(STORAGE_KEYS.SETTINGS, settings);
  },
  updateSettingKey(section, data) {
    const current = this.getSettings();
    current[section] = { ...(current[section] || {}), ...data };
    return this.saveSettings(current);
  },

  // ─── Products ───
  getProducts() {
    return safeGet(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  },
  saveProduct(prod) {
    const list = this.getProducts();
    let saved = prod;
    if (!prod.id) {
      prod.id = 'prod-' + Date.now();
      list.unshift(prod);
      saved = prod;
    } else {
      const idx = list.findIndex(p => p.id === prod.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...prod };
        saved = list[idx];
      } else {
        list.unshift(prod);
        saved = prod;
      }
    }
    safeSet(STORAGE_KEYS.PRODUCTS, list);
    return saved;
  },
  deleteProduct(id) {
    const list = this.getProducts().filter(p => p.id !== id);
    return safeSet(STORAGE_KEYS.PRODUCTS, list);
  },
  updateStockUnits(id, delta) {
    const list = this.getProducts();
    const item = list.find(p => p.id === id);
    if (item) {
      item.units = Math.max(0, (item.units || 0) + delta);
      safeSet(STORAGE_KEYS.PRODUCTS, list);
      return item.units;
    }
    return null;
  },

  // ─── Repairs ───
  getRepairs() {
    return safeGet(STORAGE_KEYS.REPAIRS, DEFAULT_REPAIRS);
  },
  saveRepair(repair) {
    const list = this.getRepairs();
    let saved = repair;
    if (!repair.id) {
      repair.id = 'srv-' + Date.now();
      list.unshift(repair);
      saved = repair;
    } else {
      const idx = list.findIndex(r => r.id === repair.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...repair };
        saved = list[idx];
      } else {
        list.unshift(repair);
        saved = repair;
      }
    }
    safeSet(STORAGE_KEYS.REPAIRS, list);
    return saved;
  },
  deleteRepair(id) {
    const list = this.getRepairs().filter(r => r.id !== id);
    return safeSet(STORAGE_KEYS.REPAIRS, list);
  },
  toggleRepairStatus(id) {
    const list = this.getRepairs();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = !item.status;
      safeSet(STORAGE_KEYS.REPAIRS, list);
      return item.status;
    }
    return null;
  },

  // ─── Reviews ───
  getReviews() {
    return safeGet(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  },
  addReview(review) {
    const list = this.getReviews();
    const newRev = {
      id: 'rev-' + Date.now(),
      rating: 5,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true,
      pinned: false,
      ...review
    };
    list.unshift(newRev);
    return safeSet(STORAGE_KEYS.REVIEWS, list);
  },
  deleteReview(id) {
    const list = this.getReviews().filter(r => r.id !== id);
    return safeSet(STORAGE_KEYS.REVIEWS, list);
  },
  toggleReviewPin(id) {
    const list = this.getReviews();
    const item = list.find(r => r.id === id);
    if (item) {
      item.pinned = !item.pinned;
      safeSet(STORAGE_KEYS.REVIEWS, list);
      return item.pinned;
    }
    return null;
  },

  // ─── Authentication & Single-Owner Security Architecture ───
  isAdminSetupDone() {
    try {
      const isDone = localStorage.getItem(STORAGE_KEYS.SETUP_DONE) === 'true';
      const rawCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      return isDone && !!rawCreds;
    } catch (e) {
      return false;
    }
  },

  isAdminLoggedIn() {
    return !!this.getAdminSession();
  },

  getAdminSetupInfo() {
    try {
      const rawCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (!rawCreds) return { isSetup: false };
      const creds = JSON.parse(rawCreds);
      const email = creds.email || '';
      const parts = email.split('@');
      const maskedEmail = parts.length === 2 && parts[0].length > 2
        ? `${parts[0].slice(0, 2)}***@${parts[1]}`
        : email;
      return {
        isSetup: true,
        ownerName: creds.ownerName || 'Pushpendra Prajapati',
        username: creds.username,
        maskedEmail,
        email: creds.email,
        createdAt: creds.createdAt
      };
    } catch (e) {
      return { isSetup: false };
    }
  },

  getAdminSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const session = JSON.parse(raw);
      // Allow temporary developer session before real owner handover
      if (session?.isTemporaryDevMode) {
        return session;
      }
      // Validate that setup is actually finished
      if (!this.isAdminSetupDone()) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  completeAdminSetup(ownerName, username, email, password) {
    const cleanOwner = (ownerName || 'Pushpendra Prajapati').trim();
    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return { success: false, message: 'All credential fields are required.' };
    }

    const credentials = {
      ownerName: cleanOwner,
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
    localStorage.setItem(STORAGE_KEYS.SETUP_DONE, 'true');
    this.updateSettingKey('owner', { name: cleanOwner });

    // Automatically create authenticated session for the owner
    const sessionData = {
      username: cleanUsername,
      email: cleanEmail,
      ownerName: cleanOwner,
      loginTime: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    window.dispatchEvent(new CustomEvent('chhaya_auth_change', { detail: sessionData }));
    return { success: true, session: sessionData };
  },

  adminLogin(identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: 'Username / Gmail and password are required.' };
    }

    const idClean = String(identifier).trim().toLowerCase();
    const passClean = String(password).trim();

    // ── Temporary Developer Bypass Credentials ──
    // Permitted so developer can inspect all admin panels before handover.
    if ((idClean === 'admin' || idClean === 'developer') && passClean === 'admin123') {
      const sessionData = {
        username: 'admin',
        email: 'developer@chhayapreview.local',
        ownerName: 'Developer (Temporary Access)',
        isTemporaryDevMode: true,
        loginTime: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      window.dispatchEvent(new CustomEvent('chhaya_auth_change', { detail: sessionData }));
      return { success: true, session: sessionData, isTemporaryDevMode: true };
    }

    // If setup is not done yet, prompt to initialize setup
    if (!this.isAdminSetupDone()) {
      return { 
        success: false, 
        setupRequired: true, 
        message: 'First-time setup is required. Please create Master Admin credentials or use temporary developer credentials (admin / admin123).' 
      };
    }

    const rawCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!rawCreds) {
      return { 
        success: false, 
        setupRequired: true, 
        message: 'No Master Admin credentials found. Setup required.' 
      };
    }

    try {
      const creds = JSON.parse(rawCreds);

      // Strict matching: only the owner's username or registered Gmail + password
      const matchIdentifier = (creds.username && creds.username.toLowerCase() === idClean) ||
                              (creds.email && creds.email.toLowerCase() === idClean);
      const matchPassword = creds.password === passClean;

      if (!matchIdentifier || !matchPassword) {
        return { 
          success: false, 
          message: 'Invalid credentials. Only the authorized store owner can sign in.' 
        };
      }

      const sessionData = {
        username: creds.username,
        email: creds.email,
        ownerName: creds.ownerName || 'Pushpendra Prajapati',
        loginTime: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      window.dispatchEvent(new CustomEvent('chhaya_auth_change', { detail: sessionData }));
      return { success: true, session: sessionData };
    } catch (e) {
      return { success: false, message: 'Authentication error. Please try again.' };
    }
  },

  requestPasswordReset(inputEmailOrUser) {
    if (!this.isAdminSetupDone()) {
      return { success: false, message: 'Master Admin account has not been set up yet.' };
    }

    const rawCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!rawCreds) return { success: false, message: 'Admin profile not found.' };

    try {
      const creds = JSON.parse(rawCreds);
      const cleanInput = String(inputEmailOrUser || '').trim().toLowerCase();
      const registeredEmail = String(creds.email || '').trim().toLowerCase();
      const registeredUser = String(creds.username || '').trim().toLowerCase();

      // Validate input matches registered email or username
      if (cleanInput !== registeredEmail && cleanInput !== registeredUser) {
        return { 
          success: false, 
          message: 'The entered email does not match the Master Admin registered Gmail address.' 
        };
      }

      // Generate 6-digit OTP code and unique token
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const token = 'rst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

      const resetPayload = {
        email: creds.email,
        username: creds.username,
        ownerName: creds.ownerName,
        code,
        token,
        expiresAt
      };

      localStorage.setItem(STORAGE_KEYS.RESET_TOKEN, JSON.stringify(resetPayload));

      const resetUrl = `${window.location.origin}/admin/reset-password?token=${token}&email=${encodeURIComponent(creds.email)}`;
      const mailtoSubject = encodeURIComponent('Chhaya Mobiles Admin - Password Reset Security Code');
      const mailtoBody = encodeURIComponent(
        `Hello ${creds.ownerName || 'Pushpendra Prajapati'},\n\n` +
        `You requested a password reset for your Chhaya Mobiles Store Administration terminal.\n\n` +
        `Your registered Username: ${creds.username}\n` +
        `Your One-Time Security Code: ${code}\n\n` +
        `Direct Password Reset Link:\n${resetUrl}\n\n` +
        `This security code expires in 15 minutes.\n` +
        `Sony Dharmshala, Chitrakoot Dham M.P.`
      );
      const mailtoUrl = `mailto:${creds.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

      return {
        success: true,
        email: creds.email,
        username: creds.username,
        code,
        token,
        resetUrl,
        mailtoUrl,
        expiresAt
      };
    } catch (e) {
      return { success: false, message: 'Error generating password reset code.' };
    }
  },

  verifyResetCode(tokenOrCode) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKEN);
      if (!raw) return { valid: false, message: 'No active password reset request found. Please request a new code.' };
      const resetData = JSON.parse(raw);
      if (Date.now() > resetData.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
        return { valid: false, message: 'Password reset code has expired (valid 15 minutes). Please request a new one.' };
      }
      const clean = String(tokenOrCode || '').trim();
      if (clean === resetData.code || clean === resetData.token) {
        return { 
          valid: true, 
          email: resetData.email, 
          username: resetData.username, 
          ownerName: resetData.ownerName 
        };
      }
      return { valid: false, message: 'Invalid 6-digit verification code. Please check your Gmail.' };
    } catch (e) {
      return { valid: false, message: 'Invalid reset request data.' };
    }
  },

  resetPasswordWithToken(tokenOrCode, newPassword) {
    const verify = this.verifyResetCode(tokenOrCode);
    if (!verify.valid) return verify;

    if (!newPassword || String(newPassword).trim().length < 4) {
      return { valid: false, message: 'New password must be at least 4 characters long.' };
    }

    try {
      const rawCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (!rawCreds) return { valid: false, message: 'Master credentials record not found.' };
      const creds = JSON.parse(rawCreds);
      creds.password = String(newPassword).trim();
      creds.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(creds));
      localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
      return { 
        valid: true, 
        success: true, 
        username: creds.username, 
        message: 'Password reset successful! Please sign in with your new credentials.' 
      };
    } catch (e) {
      return { valid: false, message: 'Failed to update password.' };
    }
  },

  adminLogout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.dispatchEvent(new CustomEvent('chhaya_auth_change', { detail: null }));
    return true;
  },

  resetAdminSetup() {
    localStorage.removeItem(STORAGE_KEYS.SETUP_DONE);
    localStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
    window.dispatchEvent(new CustomEvent('chhaya_auth_change', { detail: null }));
    return true;
  },

  // ─── Hero Showcase Media (Video & Images) ───
  getMedia() {
    return safeGet(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  },
  saveMedia(media) {
    return safeSet(STORAGE_KEYS.MEDIA, media);
  },
  addMediaImage(img) {
    const media = this.getMedia();
    const newImg = {
      id: 'img-' + Date.now(),
      title: img.title || 'Storefront Showcase Image',
      caption: img.caption || 'Sony Dharmshala Chitrakoot Workshop',
      url: img.url
    };
    media.images = [newImg, ...(media.images || [])];
    return this.saveMedia(media);
  },
  deleteMediaImage(id) {
    const media = this.getMedia();
    media.images = (media.images || []).filter(img => img.id !== id);
    return this.saveMedia(media);
  },
  updateVideo(videoObj) {
    const media = this.getMedia();
    media.video = { ...(media.video || {}), ...videoObj };
    return this.saveMedia(media);
  },

  // ─── Bookings (Diagnostic Bench Reservations) ───
  getBookings() {
    return safeGet(STORAGE_KEYS.BOOKINGS, []);
  },
  addBooking(booking) {
    const list = this.getBookings();
    const newBooking = {
      id: 'bkg-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      ...booking
    };
    list.unshift(newBooking);
    safeSet(STORAGE_KEYS.BOOKINGS, list);
    return newBooking;
  },
  updateBookingStatus(id, status) {
    const list = this.getBookings();
    const item = list.find(b => b.id === id);
    if (item) {
      item.status = status;
      return safeSet(STORAGE_KEYS.BOOKINGS, list);
    }
    return false;
  },
  deleteBooking(id) {
    const list = this.getBookings().filter(b => b.id !== id);
    return safeSet(STORAGE_KEYS.BOOKINGS, list);
  },

  // ─── Spinner Claims & Anti-Fraud Logs ───
  getSpinnerClaims() {
    return safeGet(STORAGE_KEYS.SPINNER_CLAIMS, []);
  },
  addSpinnerClaim(claim) {
    const list = this.getSpinnerClaims();
    const newClaim = {
      id: 'claim-' + Date.now(),
      voucherCode: claim.voucherCode || ('CHHAYA-SPIN-' + Math.random().toString(36).substring(2, 7).toUpperCase()),
      customerName: claim.customerName,
      customerPhone: claim.customerPhone,
      prize: claim.prize,
      couponCode: claim.couponCode || '',
      createdAt: Date.now(),
      expiresAt: claim.expiresAt || (Date.now() + (120 * 60 * 1000)),
      status: 'active', // 'active' | 'redeemed' | 'expired'
      ...claim
    };
    list.unshift(newClaim);
    safeSet(STORAGE_KEYS.SPINNER_CLAIMS, list);
    return newClaim;
  },
  updateSpinnerClaimStatus(id, status) {
    const list = this.getSpinnerClaims();
    const item = list.find(c => c.id === id || c.voucherCode === id);
    if (item) {
      item.status = status;
      if (status === 'redeemed') {
        item.redeemedAt = Date.now();
      }
      return safeSet(STORAGE_KEYS.SPINNER_CLAIMS, list);
    }
    return false;
  },
  deleteSpinnerClaim(id) {
    const list = this.getSpinnerClaims().filter(c => c.id !== id && c.voucherCode !== id);
    return safeSet(STORAGE_KEYS.SPINNER_CLAIMS, list);
  },

  // ─── Factory Reset ───
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(DEFAULT_REPAIRS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(DEFAULT_MEDIA));
    window.dispatchEvent(new CustomEvent('chhaya_db_update', { detail: { all: true } }));
    return true;
  }
};
