/**
 * shared.js — Chhaya Mobiles Client-Side Database & Store Platform Engine
 * 
 * Provides:
 * 1. ChhayaDB: Complete LocalStorage database for Store Settings, Inventory, Repair Catalog,
 *    Owner Profile, and Customer Reviews with robust default seeding.
 * 2. Auth & Route Guard helpers.
 * 3. Unified responsive Public Header & Mobile Drawer injection.
 * 4. Unified responsive Admin Sidebar & Topbar injection.
 * 5. Global Toast Notification system.
 */

// ─── 1. CLIENT-SIDE DATABASE ENGINE (ChhayaDB) ──────────────────────────────

// ─── INDEXEDDB MEDIA STORAGE (For local videos & high-res photos) ───────────
var ChhayaMediaStorage = (function() {
  var DB_NAME = 'chhaya_media_db_v1';
  var DB_VERSION = 1;
  var STORE_NAME = 'media_blobs';
  var dbInstance = null;

  function openDB(cb) {
    if (dbInstance) return cb(null, dbInstance);
    if (!window.indexedDB) return cb(new Error('IndexedDB not supported'));
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = function(e) {
      dbInstance = e.target.result;
      cb(null, dbInstance);
    };
    req.onerror = function(e) {
      cb(e);
    };
  }

  return {
    saveVideo: function(file, cb) {
      openDB(function(err, db) {
        if (err) return cb && cb(err);
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var record = {
          id: 'hero_video',
          blob: file,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          updatedAt: Date.now()
        };
        var req = store.put(record);
        req.onsuccess = function() {
          var blobUrl = URL.createObjectURL(file);
          if (cb) cb(null, blobUrl, record);
        };
        req.onerror = function(e) { if (cb) cb(e); };
      });
    },
    getVideoUrl: function(cb) {
      openDB(function(err, db) {
        if (err) return cb(null);
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get('hero_video');
        req.onsuccess = function() {
          if (req.result && req.result.blob) {
            cb(URL.createObjectURL(req.result.blob), req.result);
          } else {
            cb(null);
          }
        };
        req.onerror = function() { cb(null); };
      });
    },
    deleteVideo: function(cb) {
      openDB(function(err, db) {
        if (err) return cb && cb(err);
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.delete('hero_video');
        req.onsuccess = function() { if (cb) cb(null); };
        req.onerror = function(e) { if (cb) cb(e); };
      });
    }
  };
})();

var ChhayaDB = (function() {
  var STORAGE_KEYS = {
    SETTINGS: 'chhaya_cms_settings_v4',
    PRODUCTS: 'chhaya_cms_products_v4',
    REPAIRS:  'chhaya_cms_repairs_v4',
    REVIEWS:  'chhaya_cms_reviews_v4',
  };

  // Default seed data
  var DEFAULT_SETTINGS = {
    announcement: {
      text: '🔥 Festival Offer: Free Tempered Glass with Screen Replacement! • 🏪 Store Visit Only: Cash, UPI & Cards',
      visible: true,
      tone: 'blue' // 'blue', 'amber', 'red'
    },
    hero: {
      title: 'Fast, Honest & Expert Mobile Repairs & Latest Tech Gadgets.',
      subtitle: "Chitrakoot Dham's trusted walk-in hardware clinic at Sony Dharmshala, Kamta Nath Mandir Road. Watch your smartphone repaired right in front of your eyes in 30 minutes, or pick up certified pre-owned flagships tested across 45 hardware checkpoints.",
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-extreme-close-up-repair-41221-large.mp4',
      loopDuration: 14,
      autoFallback: true,
      badges: [
        { tag: 'TURNAROUND', value: '30 Mins', sub: 'Screen & battery' },
        { tag: 'DIAGNOSTICS', value: '₹0 Free', sub: 'Before any repair' },
        { tag: 'WARRANTY', value: '180 Days', sub: 'Official receipt seal' }
      ]
    },
    metrics: {
      benchStatus: 'Live Bench',
      pulseActive: true,
      m1: { label: 'Avg Turnaround', value: '28m', sub: 'Express Screen Replacement' },
      m2: { label: 'Devices Inspected', value: '1,480+', sub: 'Zero Return Defect Rate' },
      notice: 'Store Counters open until 9:30 PM (Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot)'
    },
    slides: [
      {
        id: 's1',
        title: 'Store Front',
        caption: 'Chhaya Mobiles Exterior & Signboard — Sony Dharmshala, Chitrakoot Dham',
        img: 'exterior.png',
        active: true
      },
      {
        id: 's2',
        title: 'Interior Display',
        caption: 'Showcase Counter & Accessories Racks — Chitrakoot Store',
        img: 'interior.png',
        active: true
      },
      {
        id: 's3',
        title: 'Repair Lab',
        caption: 'High-precision Micro Soldering Station',
        img: 'interior.png',
        active: true
      }
    ],
    store: {
      name: 'Chhaya Mobiles',
      tagline: 'Certified Hardware Hub & Live Lab',
      address: 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334',
      landmark: 'Near Kamta Nath Mandir, Sony Dharmshala (5VF8+XPG M.P)',
      phone: '+91 93018 61874',
      whatsapp: '919301861874',
      email: 'contact@chhayamobiles.com',
      hoursWeek: 'Mon – Sat: 10:00 AM – 9:30 PM',
      hoursSun: 'Sunday: 11:00 AM – 6:00 PM',
      mapEmbed: 'https://maps.google.com/maps?q=25.1749388,80.8668289&t=&z=16&ie=UTF8&iwloc=&output=embed',
      payments: 'Store-only payment: Cash, PhonePe, GPay, Paytm, UPI, Debit/Credit Cards accepted on counter.'
    },
    owner: {
      name: 'Pushpendra Prajapati',
      title: 'Master Technician & Store Proprietor',
      experience: 'Started 2023 Till Now Running • Sony Dharmshala, Chitrakoot',
      estYear: '2023',
      bio: 'Chhaya Mobiles was established in 2023 at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham M.P. by Pushpendra Prajapati. Started from 2023 and continuously running till now, providing transparent on-the-spot smartphone repairs and certified gadget trading.',
      avatar: 'exterior.png'
    }
  };

  var DEFAULT_PRODUCTS = [
    {
      id: 'prod-1',
      name: 'iPhone 13 128GB Midnight (Certified)',
      category: 'Pre-Owned Phones',
      sku: 'CH-IP13-MDN',
      price: 34999,
      mrp: 52000,
      location: 'Showcase #1, Shelf A',
      condition: 'Mint 92% Battery • OEM Box',
      units: 4,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod-2',
      name: 'Samsung Galaxy S22 5G 128GB Phantom Black',
      category: 'Pre-Owned Phones',
      sku: 'CH-SS22-BLK',
      price: 28499,
      mrp: 48999,
      location: 'Showcase #1, Shelf B',
      condition: 'Grade A+ • Snapdragon 8 Gen 1',
      units: 3,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod-3',
      name: 'OnePlus 11R 5G 256GB Sonic Black',
      category: 'Pre-Owned Phones',
      sku: 'CH-OP11R-256',
      price: 24999,
      mrp: 39999,
      location: 'Showcase #2, Shelf A',
      condition: 'Like New • 100W SuperVOOC Included',
      units: 2,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod-4',
      name: 'Apple 20W USB-C Fast Power Adapter OEM',
      category: 'Batteries & Power',
      sku: 'CH-ACC-20W',
      price: 1450,
      mrp: 1900,
      location: 'Peg Board #3',
      condition: 'Genuine Sealed Pack',
      units: 18,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod-5',
      name: 'Anker 20,000mAh 22.5W Power Bank Dual Port',
      category: 'Batteries & Power',
      sku: 'CH-ANK-20K',
      price: 2199,
      mrp: 2999,
      location: 'Shelf 4, Unit C',
      condition: 'Brand New In Box',
      units: 7,
      image: 'https://images.unsplash.com/photo-1609592424364-e4c16ca60882?w=600&auto=format&fit=crop&q=80',
      featured: false
    },
    {
      id: 'prod-6',
      name: 'Realme Buds Air 5 Pro ANC Earbuds',
      category: 'Audio & Earphones',
      sku: 'CH-AUD-RBA5',
      price: 3899,
      mrp: 4999,
      location: 'Audio Vitrine #1',
      condition: 'Sealed • 50dB Active Noise Cancel',
      units: 5,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod-7',
      name: 'Spigen Ultra Hybrid Clear Case for iPhone 14/15',
      category: 'Phone Cases & Covers',
      sku: 'CH-SPG-UH15',
      price: 899,
      mrp: 1499,
      location: 'Hanger Rack #2',
      condition: 'Anti-Yellowing Military Grade',
      units: 12,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
      featured: false
    },
    {
      id: 'prod-8',
      name: 'Portronics 6-in-1 USB-C Multi-Port Hub',
      category: 'Tech Gadgets',
      sku: 'CH-PRT-HUB6',
      price: 1299,
      mrp: 2199,
      location: 'Accessory Shelf #1',
      condition: '4K HDMI + 100W PD Pass-through',
      units: 8,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      featured: false
    }
  ];

  var DEFAULT_REPAIRS = [
    {
      id: 'srv-1',
      name: 'AMOLED / OLED Screen Replacement',
      category: 'display',
      turnaround: '25 – 35 Mins',
      basePrice: 1850,
      warranty: '180 Days Touch Guarantee',
      status: true,
      icon: 'screenshot',
      models: ['iPhone 11–15 Pro', 'Samsung S & Note Series', 'OnePlus AMOLED', 'Pixel 6–8']
    },
    {
      id: 'srv-2',
      name: 'Motherboard IC Micro-Soldering & Reballing',
      category: 'motherboard',
      turnaround: '2 – 4 Hours',
      basePrice: 2400,
      warranty: '60 Days Bench Warranty',
      status: true,
      icon: 'memory',
      models: ['Audio IC', 'Power IC (PMIC)', 'Network Baseband', 'Charging IC']
    },
    {
      id: 'srv-3',
      name: 'High-Capacity OEM Battery Replacement',
      category: 'battery',
      turnaround: '20 – 30 Mins',
      basePrice: 1100,
      warranty: '180 Days Full Cycle Seal',
      status: true,
      icon: 'battery_charging_full',
      models: ['iPhone 100% Health OEM', 'Samsung High-Density', 'OnePlus Dual-Cell']
    },
    {
      id: 'srv-4',
      name: 'Camera Sensor & Sapphire Glass Lens Fix',
      category: 'camera',
      turnaround: '30 – 45 Mins',
      basePrice: 1350,
      warranty: '90 Days Clarity Guarantee',
      status: true,
      icon: 'photo_camera',
      models: ['OIS Module Alignment', 'Sapphire Ring Replacement', 'Focus Actuator Fix']
    },
    {
      id: 'srv-5',
      name: 'Ultrasonic Liquid & Water Damage Revival',
      category: 'water',
      turnaround: '3 – 5 Hours',
      basePrice: 1600,
      warranty: 'Post-Recovery Bench Report',
      status: true,
      icon: 'water_drop',
      models: ['Isopropyl 99% De-oxidation', 'Short-Circuit Thermal Scan', 'Component Level Rescue']
    },
    {
      id: 'srv-6',
      name: 'Type-C / Lightning Port Microsolder Fix',
      category: 'battery',
      turnaround: '20 – 30 Mins',
      basePrice: 650,
      warranty: '90 Days Fast-Charge Seal',
      status: true,
      icon: 'cable',
      models: ['Fast Charge Pin Re-anchor', 'Microphone Integration', 'ESD Protection Fix']
    }
  ];

  var DEFAULT_REVIEWS = [
    {
      id: 'rev-1',
      name: 'Amitabh Deshmukh',
      rating: 5,
      date: '14 Sep 2026',
      text: 'Got my iPhone 13 Pro display replaced right in front of my eyes in 28 minutes. Pushpendra bhai explained the touch digitizer difference honestly and sealed it with a 180-day warranty card. Outstanding service at Sony Dharmshala Chitrakoot!',
      verified: true,
      device: 'iPhone 13 Pro (Screen Replacement)',
      pinned: true
    },
    {
      id: 'rev-2',
      name: 'Pooja Kulkarni',
      rating: 5,
      date: '11 Sep 2026',
      text: 'Bought a certified pre-owned Samsung Galaxy S22. The 45-point inspection paper was shown in detail. Battery health is 94% and price was 40% cheaper than market. Very trustworthy shop.',
      verified: true,
      device: 'Samsung Galaxy S22 5G (Certified Purchase)',
      pinned: true
    },
    {
      id: 'rev-3',
      name: 'Rahul Shirke',
      rating: 5,
      date: '08 Sep 2026',
      text: 'My OnePlus motherboard had an Audio IC fault that 3 other shops told me was unfixable. Pushpendra diagnosed it in 5 minutes and micro-soldered it within 3 hours. 10/10 recommend!',
      verified: true,
      device: 'OnePlus 9 Pro (IC Soldering)',
      pinned: true
    },
    {
      id: 'rev-4',
      name: 'Dr. Sameer Joshi',
      rating: 5,
      date: '02 Sep 2026',
      text: 'Replaced my iPad battery. Genuine component used, zero heating issues. Transparent pricing, no hidden fees, and accepted UPI on counter.',
      verified: true,
      device: 'iPad Air 4 (OEM Battery)',
      pinned: false
    }
  ];

  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[ChhayaDB] Parse error for ' + key + ', resetting fallback.', e);
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
  }

  function saveJSON(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      notifyUpdate(key, data);
      return true;
    } catch (e) {
      console.error('[ChhayaDB] Save error for ' + key, e);
      return false;
    }
  }

  function notifyUpdate(key, data) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      var evt = new CustomEvent('chhaya-db-updated', { detail: { key: key, data: data } });
      window.dispatchEvent(evt);
    }
  }

  return {
    // ─── Settings CRUD ───
    getSettings: function() {
      return loadJSON(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    saveSettings: function(settings) {
      return saveJSON(STORAGE_KEYS.SETTINGS, settings);
    },
    updateSettingKey: function(section, data) {
      var current = this.getSettings();
      current[section] = Object.assign({}, current[section], data);
      return this.saveSettings(current);
    },

    // ─── Products / Inventory CRUD ───
    getProducts: function() {
      return loadJSON(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    },
    saveProduct: function(prod) {
      var list = this.getProducts();
      if (!prod.id) {
        prod.id = 'prod-' + Date.now();
        list.unshift(prod);
      } else {
        var idx = list.findIndex(function(p) { return p.id === prod.id; });
        if (idx !== -1) {
          list[idx] = Object.assign({}, list[idx], prod);
        } else {
          list.unshift(prod);
        }
      }
      return saveJSON(STORAGE_KEYS.PRODUCTS, list);
    },
    deleteProduct: function(id) {
      var list = this.getProducts().filter(function(p) { return p.id !== id; });
      return saveJSON(STORAGE_KEYS.PRODUCTS, list);
    },
    updateStockUnits: function(id, delta) {
      var list = this.getProducts();
      var item = list.find(function(p) { return p.id === id; });
      if (item) {
        item.units = Math.max(0, (item.units || 0) + delta);
        saveJSON(STORAGE_KEYS.PRODUCTS, list);
        return item.units;
      }
      return null;
    },

    // ─── Repairs CRUD ───
    getRepairs: function() {
      return loadJSON(STORAGE_KEYS.REPAIRS, DEFAULT_REPAIRS);
    },
    saveRepair: function(repair) {
      var list = this.getRepairs();
      if (!repair.id) {
        repair.id = 'srv-' + Date.now();
        list.unshift(repair);
      } else {
        var idx = list.findIndex(function(r) { return r.id === repair.id; });
        if (idx !== -1) {
          list[idx] = Object.assign({}, list[idx], repair);
        } else {
          list.unshift(repair);
        }
      }
      return saveJSON(STORAGE_KEYS.REPAIRS, list);
    },
    deleteRepair: function(id) {
      var list = this.getRepairs().filter(function(r) { return r.id !== id; });
      return saveJSON(STORAGE_KEYS.REPAIRS, list);
    },
    toggleRepairStatus: function(id) {
      var list = this.getRepairs();
      var item = list.find(function(r) { return r.id === id; });
      if (item) {
        item.status = !item.status;
        saveJSON(STORAGE_KEYS.REPAIRS, list);
        return item.status;
      }
      return null;
    },

    // ─── Reviews CRUD ───
    getReviews: function() {
      return loadJSON(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    },
    addReview: function(review) {
      var list = this.getReviews();
      review.id = 'rev-' + Date.now();
      if (!review.date) {
        var now = new Date();
        review.date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      list.unshift(review);
      return saveJSON(STORAGE_KEYS.REVIEWS, list);
    },
    deleteReview: function(id) {
      var list = this.getReviews().filter(function(r) { return r.id !== id; });
      return saveJSON(STORAGE_KEYS.REVIEWS, list);
    },
    toggleReviewPin: function(id) {
      var list = this.getReviews();
      var item = list.find(function(r) { return r.id === id; });
      if (item) {
        item.pinned = !item.pinned;
        saveJSON(STORAGE_KEYS.REVIEWS, list);
        return item.pinned;
      }
      return null;
    },

    // ─── Reset ───
    resetToDefaults: function() {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(DEFAULT_REPAIRS));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
      notifyUpdate('all', null);
      return true;
    }
  };
})();


// ─── 2. AUTH & SESSION HELPERS ──────────────────────────────────────────────

function isAdminSetupDone() {
  var isSetup = localStorage.getItem('chhaya_admin_setup') === 'true';
  var hasCreds = !!localStorage.getItem('chhaya_admin_credentials');
  return isSetup && hasCreds;
}

function isAdminLoggedIn() {
  return !!getAdminSession();
}

function getAdminSetupInfo() {
  try {
    var raw = localStorage.getItem('chhaya_admin_credentials');
    if (!raw) return { isSetup: false };
    var creds = JSON.parse(raw);
    var email = creds.email || '';
    var parts = email.split('@');
    var maskedEmail = parts.length === 2 && parts[0].length > 2
      ? parts[0].slice(0, 2) + '***@' + parts[1]
      : email;
    return {
      isSetup: true,
      ownerName: creds.ownerName || 'Pushpendra Prajapati',
      username: creds.username,
      maskedEmail: maskedEmail,
      email: creds.email
    };
  } catch(e) {
    return { isSetup: false };
  }
}

function completeAdminSetup(ownerName, username, email, password) {
  var cleanOwner = (ownerName || 'Pushpendra Prajapati').trim();
  var cleanUser = String(username || '').trim().toLowerCase();
  var cleanEmail = String(email || '').trim().toLowerCase();
  var cleanPassword = String(password || '').trim();

  if (!cleanUser || !cleanEmail || !cleanPassword) return false;

  var creds = {
    username: cleanUser,
    password: cleanPassword,
    email: cleanEmail,
    ownerName: cleanOwner,
    createdAt: Date.now()
  };

  localStorage.setItem('chhaya_admin_setup', 'true');
  localStorage.setItem('chhaya_admin_credentials', JSON.stringify(creds));
  ChhayaDB.updateSettingKey('owner', { name: cleanOwner });

  var sessionData = JSON.stringify({
    username: cleanUser,
    email: cleanEmail,
    ownerName: cleanOwner,
    loginTime: Date.now()
  });
  localStorage.setItem('chhaya_admin_session', sessionData);
  localStorage.setItem('chhayaAdminSession', sessionData);
  return true;
}

function adminLogin(username, password) {
  if (!username || !password) return false;
  var uClean = String(username).trim().toLowerCase();
  var pClean = String(password).trim();

  // Temporary developer bypass credentials for testing before handover
  if ((uClean === 'admin' || uClean === 'developer') && pClean === 'admin123') {
    var devSession = JSON.stringify({
      username: 'admin',
      email: 'developer@chhayapreview.local',
      ownerName: 'Developer (Temporary Access)',
      isTemporaryDevMode: true,
      loginTime: Date.now()
    });
    localStorage.setItem('chhaya_admin_session', devSession);
    localStorage.setItem('chhayaAdminSession', devSession);
    return true;
  }

  // If setup is not done yet
  if (!isAdminSetupDone()) return false;

  var raw = localStorage.getItem('chhaya_admin_credentials');
  if (!raw) return false;

  try {
    var creds = JSON.parse(raw);
    // Strict match only: owner's registered username or Gmail + password
    var uMatch = (creds.username && String(creds.username).trim().toLowerCase() === uClean) ||
                 (creds.email && String(creds.email).trim().toLowerCase() === uClean);
    var pMatch = String(creds.password).trim() === pClean;

    if (!uMatch || !pMatch) return false;

    var sessionData = JSON.stringify({
      username: creds.username,
      email: creds.email,
      ownerName: creds.ownerName || 'Pushpendra Prajapati',
      loginTime: Date.now()
    });
    localStorage.setItem('chhaya_admin_session', sessionData);
    localStorage.setItem('chhayaAdminSession', sessionData);
    return true;
  } catch(e) {
    return false;
  }
}

function requestPasswordReset(emailOrUser) {
  if (!isAdminSetupDone()) return { success: false, message: 'Setup not yet performed.' };
  var raw = localStorage.getItem('chhaya_admin_credentials');
  if (!raw) return { success: false, message: 'No admin credentials found.' };

  try {
    var creds = JSON.parse(raw);
    var cleanInput = String(emailOrUser || '').trim().toLowerCase();
    var registeredEmail = String(creds.email || '').trim().toLowerCase();
    var registeredUser = String(creds.username || '').trim().toLowerCase();

    if (cleanInput !== registeredEmail && cleanInput !== registeredUser) {
      return { success: false, message: 'Entered email does not match registered Master Admin Gmail.' };
    }

    var code = Math.floor(100000 + Math.random() * 900000).toString();
    var token = 'rst_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
    var expiresAt = Date.now() + 15 * 60 * 1000;

    var resetPayload = {
      email: creds.email,
      username: creds.username,
      ownerName: creds.ownerName,
      code: code,
      token: token,
      expiresAt: expiresAt
    };

    localStorage.setItem('chhaya_admin_reset_token', JSON.stringify(resetPayload));

    var mailtoSubject = encodeURIComponent('Chhaya Mobiles Admin - Password Reset Security Code');
    var mailtoBody = encodeURIComponent(
      'Hello ' + (creds.ownerName || 'Admin') + ',\n\n' +
      'Your Chhaya Mobiles Admin Password Reset Security Code is: ' + code + '\n' +
      'Username: ' + creds.username + '\n\n' +
      'Valid for 15 minutes.'
    );
    var mailtoUrl = 'mailto:' + creds.email + '?subject=' + mailtoSubject + '&body=' + mailtoBody;

    return {
      success: true,
      email: creds.email,
      username: creds.username,
      code: code,
      token: token,
      mailtoUrl: mailtoUrl,
      expiresAt: expiresAt
    };
  } catch(e) {
    return { success: false, message: 'Reset error.' };
  }
}

function verifyResetCode(codeOrToken) {
  try {
    var raw = localStorage.getItem('chhaya_admin_reset_token');
    if (!raw) return { valid: false, message: 'No active reset request.' };
    var resetData = JSON.parse(raw);
    if (Date.now() > resetData.expiresAt) {
      localStorage.removeItem('chhaya_admin_reset_token');
      return { valid: false, message: 'Reset code has expired.' };
    }
    var clean = String(codeOrToken || '').trim();
    if (clean === resetData.code || clean === resetData.token) {
      return { valid: true, email: resetData.email, username: resetData.username, ownerName: resetData.ownerName };
    }
    return { valid: false, message: 'Invalid verification code.' };
  } catch(e) {
    return { valid: false, message: 'Invalid data.' };
  }
}

function resetPasswordWithToken(codeOrToken, newPassword) {
  var verify = verifyResetCode(codeOrToken);
  if (!verify.valid) return verify;
  if (!newPassword || String(newPassword).trim().length < 4) {
    return { valid: false, message: 'Password must be at least 4 characters long.' };
  }
  try {
    var rawCreds = localStorage.getItem('chhaya_admin_credentials');
    if (!rawCreds) return { valid: false, message: 'Credentials not found.' };
    var creds = JSON.parse(rawCreds);
    creds.password = String(newPassword).trim();
    creds.updatedAt = Date.now();
    localStorage.setItem('chhaya_admin_credentials', JSON.stringify(creds));
    localStorage.removeItem('chhaya_admin_reset_token');
    return { valid: true, success: true, username: creds.username };
  } catch(e) {
    return { valid: false, message: 'Failed to update password.' };
  }
}

function adminLogout() {
  localStorage.removeItem('chhaya_admin_session');
  localStorage.removeItem('chhayaAdminSession');
  window.location.href = 'admin-login.html';
}

function resetAdminSetup() {
  localStorage.removeItem('chhaya_admin_setup');
  localStorage.removeItem('chhaya_admin_credentials');
  localStorage.removeItem('chhaya_admin_session');
  localStorage.removeItem('chhayaAdminSession');
  localStorage.removeItem('chhaya_admin_reset_token');
  window.location.href = 'admin-setup.html';
}

function getAdminSession() {
  var raw = localStorage.getItem('chhaya_admin_session') || localStorage.getItem('chhayaAdminSession');
  if (!raw) return null;
  try {
    var session = JSON.parse(raw);
    if (session && session.isTemporaryDevMode) {
      return session;
    }
    if (!isAdminSetupDone()) {
      localStorage.removeItem('chhaya_admin_session');
      localStorage.removeItem('chhayaAdminSession');
      return null;
    }
    return session;
  } catch(e) {
    return null;
  }
}


// ─── 3. GLOBAL TOAST NOTIFICATION ───────────────────────────────────────────

function showToast(message, type) {
  type = type || 'success';
  var existing = document.getElementById('chhaya-global-toast');
  if (existing) existing.remove();

  var bg = type === 'error' ? 'bg-error text-on-error' : (type === 'warning' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-inverse-surface text-inverse-on-surface');
  var icon = type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'check_circle');

  var toast = document.createElement('div');
  toast.id = 'chhaya-global-toast';
  toast.className = 'fixed bottom-6 right-6 z-[9999] transform translate-y-4 opacity-0 transition-all duration-300 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl font-sans text-sm font-semibold ' + bg;
  toast.innerHTML = '<span class="material-symbols-outlined text-lg">' + icon + '</span><span>' + message + '</span>';
  
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 20);

  setTimeout(function() {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}


// ─── 4. PUBLIC STOREFRONT NAVIGATION INJECTION ──────────────────────────────

var PUBLIC_NAV_LINKS = [
  { key: 'home',                   href: 'index.html',    label: 'Home' },
  { key: 'products-and-gadgets',   href: 'products.html', label: 'Products & Gadgets' },
  { key: 'repair-services',        href: 'repairs.html',  label: 'Repair Services' },
  { key: 'meet-the-owner',         href: 'owner.html',    label: 'Meet the Owner' },
  { key: 'store-location-and-map', href: 'location.html', label: 'Store & Map' },
  { key: 'reviews',                href: 'reviews.html',  label: 'Reviews' },
];

function injectPublicNav(activePage) {
  if (!activePage) {
    var fn = window.location.pathname.split('/').pop() || 'index.html';
    var map = {
      'index.html': 'home',
      'products.html': 'products-and-gadgets',
      'repairs.html': 'repair-services',
      'owner.html': 'meet-the-owner',
      'location.html': 'store-location-and-map',
      'reviews.html': 'reviews'
    };
    activePage = map[fn] || 'home';
  }

  var settings = ChhayaDB.getSettings();
  var announce = settings.announcement || { text: '🔥 Festival Offer: Free Tempered Glass with Screen Replacement!', visible: true, tone: 'blue' };
  var store = settings.store || { whatsapp: '919301861874' };

  var toneGradient = 'linear-gradient(to right, #1d4ed8, #4338ca, #1d4ed8)';
  if (announce.tone === 'amber') toneGradient = 'linear-gradient(to right, #b45309, #d97706, #b45309)';
  if (announce.tone === 'red') toneGradient = 'linear-gradient(to right, #b91c1c, #dc2626, #b91c1c)';

  var desktopLinks = PUBLIC_NAV_LINKS.map(function(l) {
    var isActive = l.key === activePage;
    return '<a href="' + l.href + '" data-path="' + l.key + '" class="nav-link text-sm font-semibold px-4 py-2 rounded-full transition-all ' + (isActive ? 'text-blue-700 bg-blue-50 font-bold shadow-xs' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100') + '">' + l.label + '</a>';
  }).join('');

  var mobileLinks = PUBLIC_NAV_LINKS.map(function(l) {
    var isActive = l.key === activePage;
    return '<a href="' + l.href + '" onclick="closeMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ' + (isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100') + '">' + l.label + '</a>';
  }).join('');

  var announcementHTML = announce.visible ? (
    '<div id="top-announcement-bar" style="background:' + toneGradient + ';color:#fff;font-size:11px;font-weight:600;text-align:center;padding:7px 16px;letter-spacing:0.04em;display:flex;align-items:center;justify-content:center;gap:8px;">' +
    '<span>' + announce.text + '</span>' +
    '</div>'
  ) : '';

  var navHTML = '<header id="site-header" style="position:sticky;top:0;z-index:100;width:100%;">' +
    announcementHTML +
    '<div style="background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;box-shadow:0 1px 6px rgba(0,0,0,0.06);">' +
    '<div style="max-width:1280px;margin:0 auto;padding:0 16px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;">' +
    // Logo
    '<a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;">' +
    '<img src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" alt="Chhaya Mobiles" style="height:40px;width:40px;border-radius:10px;object-fit:contain;border:1px solid #e2e8f0;background:#f8fafc;padding:4px;">' +
    '<div style="display:flex;flex-direction:column;line-height:1.2;">' +
    '<span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;">Chhaya Mobiles</span>' +
    '<span style="font-size:10px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:0.08em;">Repairs &amp; Certified Store</span>' +
    '</div></a>' +
    // Desktop Nav
    '<nav id="desktop-nav" style="display:none;align-items:center;gap:2px;">' + desktopLinks + '</nav>' +
    // Right Actions
    '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
    '<span id="pay-at-store-badge" style="display:none;align-items:center;gap:6px;background:#fefce8;border:1px solid #fde68a;color:#92400e;padding:6px 12px;border-radius:9999px;font-size:11px;font-weight:700;white-space:nowrap;">' +
    '<span style="font-size:14px;">🏪</span>Pay at Store</span>' +
    '<a href="https://wa.me/' + store.whatsapp + '" target="_blank" id="whatsapp-btn" style="display:none;align-items:center;gap:6px;background:#16a34a;color:#fff;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;transition:background 0.2s;">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.513 5.829L0 24l6.335-1.491C8.048 23.49 9.988 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.641-.52-5.143-1.42L3 21.5l.943-3.784C3.05 16.305 2.5 14.715 2.5 13c0-5.238 4.262-9.5 9.5-9.5S21.5 7.762 21.5 13 17.238 22 12 22z"/></svg>' +
    'WhatsApp</a>' +
    '<a href="admin-login.html" title="Admin Portal" style="padding:8px;color:#94a3b8;border-radius:8px;transition:all 0.2s;display:flex;align-items:center;" onmouseover="this.style.color=\'#1e293b\';this.style.background=\'#f1f5f9\'" onmouseout="this.style.color=\'#94a3b8\';this.style.background=\'transparent\'">' +
    '<span class="material-symbols-outlined" style="font-size:20px;">lock</span></a>' +
    // Mobile hamburger
    '<button id="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open menu" style="display:flex;align-items:center;justify-content:center;padding:8px;border:none;background:transparent;cursor:pointer;color:#475569;border-radius:8px;" onmouseover="this.style.background=\'#f1f5f9\'" onmouseout="this.style.background=\'transparent\'">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
    '</button>' +
    '</div>' +
    '</div></div>' +
    // Mobile Drawer
    '<div id="mobile-menu-overlay" onclick="closeMobileMenu()" style="display:none;position:fixed;inset:0;background:rgba(15,23,42,0.5);z-index:200;transition:opacity 0.2s;"></div>' +
    '<div id="mobile-menu-drawer" style="display:none;position:fixed;top:0;right:0;bottom:0;width:280px;background:#fff;z-index:201;box-shadow:-4px 0 24px rgba(0,0,0,0.12);overflow-y:auto;transform:translateX(100%);transition:transform 0.25s ease;">' +
    '<div style="padding:16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;">' +
    '<span style="font-weight:800;font-size:16px;color:#0f172a;">Chhaya Mobiles</span>' +
    '<button onclick="closeMobileMenu()" style="padding:6px;border:none;background:transparent;cursor:pointer;color:#64748b;border-radius:6px;">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button></div>' +
    '<div style="padding:12px;">' + mobileLinks + '</div>' +
    '<div style="padding:12px;border-top:1px solid #e2e8f0;margin-top:8px;">' +
    '<a href="https://wa.me/' + store.whatsapp + '" target="_blank" style="display:flex;align-items:center;gap:10px;background:#dcfce7;color:#15803d;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;margin-bottom:8px;">WhatsApp Desk</a>' +
    '<a href="admin-login.html" style="display:flex;align-items:center;gap:10px;background:#f1f5f9;color:#475569;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600;text-decoration:none;">🔒 Admin Portal</a>' +
    '</div></div>' +
    '</header>';

  var existingHeader = document.querySelector('body > header, body > div > header');
  if (existingHeader) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = navHTML;
    existingHeader.parentNode.replaceChild(tempDiv.firstChild, existingHeader);
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }
}

function toggleMobileMenu() {
  var overlay = document.getElementById('mobile-menu-overlay');
  var drawer = document.getElementById('mobile-menu-drawer');
  if (!drawer || !overlay) return;
  var isOpen = drawer.style.transform === 'translateX(0%)';
  if (isOpen) {
    closeMobileMenu();
  } else {
    overlay.style.display = 'block';
    drawer.style.display = 'block';
    setTimeout(function() { drawer.style.transform = 'translateX(0%)'; }, 10);
  }
}

function closeMobileMenu() {
  var overlay = document.getElementById('mobile-menu-overlay');
  var drawer = document.getElementById('mobile-menu-drawer');
  if (drawer && overlay) {
    drawer.style.transform = 'translateX(100%)';
    setTimeout(function() {
      overlay.style.display = 'none';
      drawer.style.display = 'none';
    }, 260);
  }
}


// ─── 5. ADMIN SIDEBAR & TOPBAR INJECTION ────────────────────────────────────

var ADMIN_NAV_LINKS = [
  { key: 'admin-dashboard', href: 'admin-dashboard.html', icon: 'dashboard', label: 'Admin Home' },
  { key: 'admin-stock',     href: 'admin-stock.html',     icon: 'devices',   label: 'Stock & Gadgets' },
  { key: 'admin-repairs',   href: 'admin-repairs.html',   icon: 'home_repair_service', label: 'Repair Services CMS' },
  { key: 'admin-profile',   href: 'admin-profile.html',   icon: 'manage_accounts', label: 'Profile & Settings' },
];

function injectAdminSidebar(activePage) {
  if (!activePage) {
    var fn = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
    var map = {
      'admin-dashboard.html': 'admin-dashboard',
      'admin-stock.html': 'admin-stock',
      'admin-repairs.html': 'admin-repairs',
      'admin-profile.html': 'admin-profile'
    };
    activePage = map[fn] || 'admin-dashboard';
  }

  var session = getAdminSession();
  var ownerName = session ? session.ownerName : 'Admin';

  var sidebarLinks = ADMIN_NAV_LINKS.map(function(l) {
    var isActive = l.key === activePage;
    return '<a href="' + l.href + '" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:' + (isActive ? '700' : '600') + ';transition:all 0.15s;' + (isActive ? 'background:#1a56db;color:#fff;' : 'color:#434654;') + '" ' +
      (isActive ? '' : 'onmouseover="this.style.background=\'#e2e7ff\';this.style.color=\'#003fb1\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'#434654\'"') +
      '><span class="material-symbols-outlined" style="font-size:20px;">' + l.icon + '</span><span>' + l.label + '</span></a>';
  }).join('');

  // Remove static asides and topbars
  var oldAside = document.querySelector('body > aside:not(#admin-sidebar)');
  if (oldAside) oldAside.remove();
  var oldDrawer = document.getElementById('navDrawer');
  if (oldDrawer) oldDrawer.remove();
  var oldBackdrop = document.getElementById('drawerBackdrop');
  if (oldBackdrop) oldBackdrop.remove();
  var oldTopbar = document.querySelector('body > header:not(#admin-topbar), .admin-content-area > header:not(#admin-topbar)');
  if (oldTopbar) oldTopbar.remove();

  var existingSidebar = document.getElementById('admin-sidebar');
  if (existingSidebar) return; // already injected

  var adminOverlay = document.createElement('div');
  adminOverlay.id = 'admin-sidebar-overlay';
  adminOverlay.onclick = toggleAdminSidebar;

  var aside = document.createElement('aside');
  aside.id = 'admin-sidebar';
  aside.innerHTML =
    '<div style="height:64px;padding:0 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #dae2fd;flex-shrink:0;">' +
    '<img src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:contain;border:1px solid #dae2fd;">' +
    '<div style="line-height:1.2;"><div style="font-size:15px;font-weight:800;color:#131b2e;letter-spacing:-0.01em;">Chhaya Mobiles</div>' +
    '<div style="font-size:10px;font-weight:700;color:#737686;text-transform:uppercase;letter-spacing:0.07em;">Admin Panel</div></div>' +
    '</div>' +
    '<div style="flex:1;overflow-y:auto;padding:12px 8px;">' +
    '<div style="font-size:10px;font-weight:700;color:#737686;text-transform:uppercase;letter-spacing:0.1em;padding:8px 12px 6px;">Navigation</div>' +
    sidebarLinks +
    '</div>' +
    '<div style="padding:12px 8px;border-top:1px solid #dae2fd;">' +
    '<a href="index.html" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;color:#434654;" onmouseover="this.style.background=\'#e2e7ff\'" onmouseout="this.style.background=\'transparent\'"><span class="material-symbols-outlined" style="font-size:18px;">arrow_back</span>Back to Storefront</a>' +
    '<button onclick="adminLogout()" style="width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:600;color:#ba1a1a;text-align:left;" onmouseover="this.style.background=\'#ffdad6\'" onmouseout="this.style.background=\'transparent\'"><span class="material-symbols-outlined" style="font-size:18px;">logout</span>Sign Out</button>' +
    '</div>';

  var header = document.createElement('header');
  header.id = 'admin-topbar';
  header.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<button id="admin-hamburger" onclick="toggleAdminSidebar()" style="display:flex;align-items:center;justify-content:center;padding:8px;border:none;background:transparent;cursor:pointer;color:#434654;border-radius:8px;" onmouseover="this.style.background=\'#e2e7ff\'" onmouseout="this.style.background=\'transparent\'">' +
    '<span class="material-symbols-outlined" style="font-size:24px;">menu</span></button>' +
    '<div style="font-size:15px;font-weight:800;color:#131b2e;">Chhaya Mobiles</div>' +
    '<span style="font-size:11px;font-weight:700;background:#e2e7ff;color:#003fb1;padding:3px 10px;border-radius:9999px;text-transform:uppercase;letter-spacing:0.07em;">Admin</span>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<a href="index.html" target="_blank" style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#434654;text-decoration:none;padding:6px 12px;border-radius:8px;border:1px solid #dae2fd;background:#f2f3ff;" onmouseover="this.style.background=\'#e2e7ff\'" onmouseout="this.style.background=\'#f2f3ff\'"><span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>View Storefront</a>' +
    '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#003fb1,#1a56db);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;cursor:pointer;" title="' + ownerName + '">' +
    ownerName.charAt(0).toUpperCase() +
    '</div></div>';

  document.body.prepend(header);
  document.body.prepend(aside);
  document.body.prepend(adminOverlay);
}

function toggleAdminSidebar() {
  var sidebar = document.getElementById('admin-sidebar');
  var overlay = document.getElementById('admin-sidebar-overlay');
  if (!sidebar || !overlay) return;
  var isOpen = sidebar.classList.contains('sidebar-open');
  if (isOpen) {
    sidebar.classList.remove('sidebar-open');
    sidebar.style.transform = 'translateX(-100%)';
    overlay.style.display = 'none';
  } else {
    sidebar.classList.add('sidebar-open');
    sidebar.style.transform = 'translateX(0%)';
    overlay.style.display = 'block';
  }
}


// ─── 6. STOREFRONT HYDRATION & REACTIVITY ENGINE ───────────────────────────

function hydrateStorefront() {
  var settings = ChhayaDB.getSettings();
  var products = ChhayaDB.getProducts();
  var repairs  = ChhayaDB.getRepairs();
  var reviews  = ChhayaDB.getReviews();

  // 1. Re-render Public Nav if present
  var activeNavHeader = document.querySelector('header#site-header');
  if (activeNavHeader) {
    injectPublicNav();
  }

  // 2. Hydrate Hero Content & Autoplay Video
  if (settings.hero) {
    var heroTitleEl = document.querySelector('h1.font-display-lg');
    if (heroTitleEl && (window.location.pathname.indexOf('index.html') !== -1 || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
      heroTitleEl.innerText = settings.hero.title;
    }
    var heroSubEl = document.querySelector('section p.font-body-lg');
    if (heroSubEl && (window.location.pathname.indexOf('index.html') !== -1 || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
      heroSubEl.innerText = settings.hero.subtitle;
    }
  }

  // Hydrate Hero Video (check IndexedDB local upload first, then settings.hero.videoUrl)
  var heroVid = document.getElementById('heroVideo');
  if (heroVid) {
    ChhayaMediaStorage.getVideoUrl(function(customUrl) {
      var targetUrl = customUrl || (settings.hero && settings.hero.videoUrl);
      if (targetUrl && !targetUrl.startsWith('/uploaded_video_local')) {
        var srcTag = heroVid.querySelector('source');
        if (srcTag && srcTag.src !== targetUrl) {
          srcTag.src = targetUrl;
          heroVid.load();
        } else if (heroVid.src !== targetUrl) {
          heroVid.src = targetUrl;
          heroVid.load();
        }
      }
    });
  }

  // 3. Hydrate Lab Metrics (on products.html / index.html)
  if (settings.metrics) {
    var m1Val = document.querySelector('.metric-m1-val, [data-metric="m1-val"]');
    var m2Val = document.querySelector('.metric-m2-val, [data-metric="m2-val"]');
    if (m1Val) m1Val.innerHTML = settings.metrics.m1.value;
    if (m2Val) m2Val.innerHTML = settings.metrics.m2.value;
  }

  // 4. Hydrate Owner Profile Elements (on owner.html / index.html)
  if (settings.owner) {
    document.querySelectorAll('[data-owner-name]').forEach(function(el) { el.innerText = settings.owner.name; });
    document.querySelectorAll('[data-owner-exp]').forEach(function(el) { el.innerText = settings.owner.experience; });
    document.querySelectorAll('[data-owner-bio]').forEach(function(el) { el.innerText = settings.owner.bio; });
    document.querySelectorAll('[data-owner-avatar]').forEach(function(el) {
      if (el.tagName === 'IMG') el.src = settings.owner.avatar;
    });
  }

  // 5. Hydrate Store Info & Hours Elements
  if (settings.store) {
    document.querySelectorAll('[data-store-phone]').forEach(function(el) { el.innerText = settings.store.phone; });
    document.querySelectorAll('[data-store-address]').forEach(function(el) { el.innerText = settings.store.address; });
    document.querySelectorAll('[data-store-hours-week]').forEach(function(el) { el.innerText = settings.store.hoursWeek; });
    document.querySelectorAll('[data-store-hours-sun]').forEach(function(el) { el.innerText = settings.store.hoursSun; });
  }

  // 6. Hydrate Products Grid (if on products.html or index.html)
  var productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    renderStoreProductsGrid(products, settings.store);
  }

  var homeProductsGrid = document.getElementById('homeProductsGrid');
  if (homeProductsGrid) {
    renderHomeProductsGrid(products, settings.store);
  }

  // 7. Hydrate Repairs Grid (if on repairs.html)
  var repairsGrid = document.getElementById('repairsCatalogGrid') || document.getElementById('repairsGrid');
  if (repairsGrid) {
    renderStoreRepairsGrid(repairs, settings.store);
  }

  // 8. Hydrate Reviews Grid (if on reviews.html or index.html)
  var reviewsGrid = document.getElementById('reviewsGrid');
  if (reviewsGrid) {
    renderStoreReviewsGrid(reviews, settings.owner);
  }
}

function renderHomeProductsGrid(products, store) {
  var grid = document.getElementById('homeProductsGrid');
  if (!grid) return;
  var waPhone = (store && store.whatsapp) ? store.whatsapp : '919301861874';
  var displayProds = products.slice(0, 6);

  grid.innerHTML = displayProds.map(function(p) {
    var waMsg = encodeURIComponent('Hi Chhaya Mobiles, please reserve ' + p.name + ' (Rs. ' + Number(p.price).toLocaleString('en-IN') + ') for my in-store inspection');
    var mrpHtml = p.mrp > p.price ? '<span class="font-label-sm text-label-sm text-on-surface-variant line-through">₹' + Number(p.mrp).toLocaleString('en-IN') + '</span>' : '';
    return '<div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">' +
      '<div>' +
      '<div class="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-space-sm">' +
      '<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="' + p.image + '" alt="' + p.name + '">' +
      '<span class="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full shadow">' + (p.condition || 'Certified A+') + '</span>' +
      '<span class="absolute top-2 right-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded shadow">100% In-Store</span>' +
      '</div>' +
      '<div class="flex items-center justify-between gap-space-xs">' +
      '<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">' + p.category + '</span>' +
      '<span class="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-0.5"><span class="material-symbols-outlined text-sm">inventory_2</span> ' + p.units + ' in stock</span>' +
      '</div>' +
      '<h3 class="font-headline-sm text-headline-sm text-on-surface mt-1">' + p.name + '</h3>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">' + (p.sku ? 'SKU: ' + p.sku + ' • ' : '') + 'Verified 45-Point Hardware Checklist passed.</p>' +
      '</div>' +
      '<div class="mt-space-md pt-space-sm bg-surface-container-low -mx-space-md -mb-space-md p-space-md rounded-b-2xl flex flex-col gap-space-sm">' +
      '<div class="flex items-baseline justify-between">' +
      '<div>' + mrpHtml + '<span class="font-headline-sm text-headline-sm text-primary font-extrabold ml-1">₹' + Number(p.price).toLocaleString('en-IN') + '</span></div>' +
      '<span class="bg-surface-container text-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded">Pay & Collect at Store</span>' +
      '</div>' +
      '<a class="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-on-primary font-label-md text-label-md py-2.5 rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm" href="https://wa.me/' + waPhone + '?text=' + waMsg + '" target="_blank">' +
      '<span class="material-symbols-outlined text-base">chat</span><span>Reserve via WhatsApp (Pay at Store)</span></a>' +
      '</div></div>';
  }).join('');
}

function renderStoreProductsGrid(products, store) {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  var waPhone = (store && store.whatsapp) ? store.whatsapp : '919301861874';
  var storePhone = (store && store.phone) ? store.phone : '+91 93018 61874';

  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-12 bg-surface-container-lowest rounded-2xl p-8"><span class="material-symbols-outlined text-5xl text-slate-300">inventory_2</span><h3 class="text-lg font-bold text-slate-800 mt-2">No items found in stock</h3><p class="text-sm text-slate-500 mt-1">Please check back soon or visit our Chitrakoot store for incoming inventory.</p></div>';
    var countEl = document.getElementById('itemCount');
    if (countEl) countEl.innerText = '0';
    return;
  }

  grid.innerHTML = products.map(function(p) {
    var mrpHtml = p.mrp > p.price ? '<span class="font-body-sm text-body-sm text-outline line-through">₹' + Number(p.mrp).toLocaleString('en-IN') + '</span>' : '';
    var waMsg = encodeURIComponent('Hi Chhaya Mobiles, I would like to reserve ' + p.name + ' (Rs. ' + Number(p.price).toLocaleString('en-IN') + ') for in-store physical inspection.');
    var brand = (p.name.toLowerCase().indexOf('apple') !== -1 || p.name.toLowerCase().indexOf('iphone') !== -1) ? 'apple' :
                (p.name.toLowerCase().indexOf('samsung') !== -1) ? 'samsung' :
                (p.name.toLowerCase().indexOf('oneplus') !== -1) ? 'oneplus' :
                (p.name.toLowerCase().indexOf('xiaomi') !== -1 || p.name.toLowerCase().indexOf('redmi') !== -1) ? 'xiaomi' :
                (p.name.toLowerCase().indexOf('realme') !== -1) ? 'realme' :
                (p.name.toLowerCase().indexOf('jbl') !== -1) ? 'jbl' :
                (p.name.toLowerCase().indexOf('dji') !== -1) ? 'dji' : 'other';

    var catSlug = (p.category.toLowerCase().indexOf('pre-owned') !== -1 || p.category.toLowerCase().indexOf('2nd hand') !== -1) ? 'preowned' :
                  (p.category.toLowerCase().indexOf('audio') !== -1) ? 'audio' :
                  (p.category.toLowerCase().indexOf('battery') !== -1 || p.category.toLowerCase().indexOf('power') !== -1) ? 'chargers' :
                  (p.category.toLowerCase().indexOf('case') !== -1 || p.category.toLowerCase().indexOf('cover') !== -1) ? 'cases' :
                  (p.category.toLowerCase().indexOf('drone') !== -1) ? 'drones' : 'all';

    var condSlug = (p.condition && p.condition.toLowerCase().indexOf('sealed') !== -1) ? 'brand-new' :
                   (p.condition && (p.condition.toLowerCase().indexOf('like new') !== -1 || p.condition.toLowerCase().indexOf('mint') !== -1)) ? 'like-new' : 'certified';

    return '<article class="product-item bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all" data-brand="' + brand + '" data-category="' + catSlug + '" data-condition="' + condSlug + '" data-price="' + p.price + '">' +
      '<div class="flex flex-col">' +
      '<div class="relative bg-surface-container-high h-56 flex items-center justify-center p-space-md overflow-hidden">' +
      '<img class="h-full w-full object-contain" src="' + p.image + '" alt="' + p.name + '">' +
      '<span class="absolute top-2 left-2 bg-surface-container-lowest font-label-sm text-label-sm font-bold text-on-surface px-2.5 py-1 rounded-full shadow-sm">' + (p.units > 0 ? p.units + ' in stock' : 'Pre-Order') + '</span>' +
      '<span class="absolute top-2 right-2 bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold px-2 py-0.5 rounded uppercase">' + (p.condition || 'Verified') + '</span>' +
      '</div>' +
      '<div class="p-space-md flex flex-col gap-1.5">' +
      '<div class="flex items-center justify-between">' +
      '<span class="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">' + p.category + '</span>' +
      '<span class="font-label-sm text-label-sm text-on-surface-variant">' + (p.sku || 'CH-STORE') + '</span>' +
      '</div>' +
      '<h3 class="font-title-md text-title-md text-on-surface">' + p.name + '</h3>' +
      '<div class="flex items-center gap-space-xs py-0.5">' +
      '<span class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">' +
      '<span class="material-symbols-outlined text-xs text-primary">verified</span> Store Location: ' + (p.location || 'Showcase Bench') + '</span>' +
      '</div>' +
      '<div class="flex items-baseline gap-2 pt-1">' +
      '<span class="font-headline-sm text-headline-sm text-primary font-bold">₹' + Number(p.price).toLocaleString('en-IN') + '</span>' + mrpHtml +
      '</div>' +
      '<div class="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded text-center font-label-sm text-label-sm font-bold mt-1">Pay at Counter upon Inspection</div>' +
      '</div>' +
      '</div>' +
      '<div class="p-space-md pt-0 flex flex-col gap-2">' +
      '<a href="https://wa.me/' + waPhone + '?text=' + waMsg + '" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 rounded-lg font-label-md text-label-md font-bold shadow-sm transition-all flex items-center justify-center gap-2">' +
      '<span class="material-symbols-outlined text-base">chat</span><span>Reserve via WhatsApp</span></a>' +
      '<div class="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">' +
      '<span>📞 Call: <a href="tel:' + storePhone.replace(/\s+/g, '') + '" class="font-bold text-blue-700 hover:underline">' + storePhone + '</a></span>' +
      '<span class="text-amber-700 font-semibold">Store Visit Only</span>' +
      '</div>' +
      '</div>' +
      '</article>';
  }).join('');

  var countEl = document.getElementById('itemCount');
  if (countEl) countEl.innerText = products.length;
}

function renderStoreRepairsGrid(repairs, store) {
  var grid = document.getElementById('repairsCatalogGrid') || document.getElementById('repairsGrid');
  if (!grid) return;
  var waPhone = (store && store.whatsapp) ? store.whatsapp : '919301861874';
  var activeRepairs = repairs.filter(function(r) { return r.status === true; });

  if (activeRepairs.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-12 bg-surface-container-lowest rounded-2xl p-8"><span class="material-symbols-outlined text-5xl text-slate-300">handyman</span><h3 class="text-lg font-bold text-slate-800 mt-2">All bench services active</h3></div>';
    return;
  }

  grid.innerHTML = activeRepairs.map(function(r) {
    var waMsg = encodeURIComponent('Hi Pushpendra bhai, I need a bench quote for ' + r.name + ' (From Rs. ' + Number(r.basePrice).toLocaleString('en-IN') + '). When can I visit?');
    var modelsList = (r.models && Array.isArray(r.models)) ? r.models.map(function(m) {
      return '<div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span><span>' + m + '</span></div>';
    }).join('') : '';

    return '<div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">' +
      '<div class="space-y-space-sm">' +
      '<div class="flex items-center justify-between">' +
      '<span class="p-2.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[24px]">' + (r.icon || 'build') + '</span>' +
      '<span class="bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded font-label-sm text-label-sm font-bold uppercase">' + (r.warranty || '180 Days Shield') + '</span>' +
      '</div>' +
      '<h3 class="font-headline-sm text-headline-sm text-on-surface">' + r.name + '</h3>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">' + (r.category ? 'Category: ' + r.category.toUpperCase() + ' • ' : '') + 'Live on-bench hardware restoration with open customer viewing glass.</p>' +
      '<div class="space-y-1.5 pt-space-xs">' + modelsList + '</div>' +
      '</div>' +
      '<div class="pt-space-md mt-space-md border-t border-surface-container flex flex-col gap-3">' +
      '<div class="flex items-center justify-between">' +
      '<div><span class="font-label-sm text-label-sm text-on-surface-variant block">From Price</span><span class="font-title-md text-title-md text-on-surface font-bold">₹' + Number(r.basePrice).toLocaleString('en-IN') + '</span></div>' +
      '<div class="text-right"><span class="font-label-sm text-label-sm text-on-surface-variant block">Bench Speed</span><span class="font-label-md text-label-md text-primary font-bold">' + r.turnaround + '</span></div>' +
      '</div>' +
      '<a href="https://wa.me/' + waPhone + '?text=' + waMsg + '" target="_blank" class="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2 rounded-lg font-label-md text-label-md font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all">' +
      '<span class="material-symbols-outlined text-base">chat</span><span>Book Bench Slot on WhatsApp</span></a>' +
      '</div></div>';
  }).join('');
}

function renderStoreReviewsGrid(reviews, owner) {
  var grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  var ownerName = (owner && owner.name) ? owner.name : 'Pushpendra Prajapati';

  if (!reviews || reviews.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-12 bg-surface-container-lowest rounded-2xl p-8"><span class="material-symbols-outlined text-5xl text-slate-300">rate_review</span><h3 class="text-lg font-bold text-slate-800 mt-2">Be the first to review Chhaya Mobiles!</h3></div>';
    return;
  }

  grid.innerHTML = reviews.map(function(rev) {
    var stars = Array(Math.min(5, Math.max(1, rev.rating || 5))).fill('<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: \'FILL\' 1;">star</span>').join('');
    var initial = (rev.name && rev.name.length > 0) ? rev.name.charAt(0).toUpperCase() : 'C';

    return '<article class="review-card bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between" data-category="all" data-keywords="' + ((rev.name || '') + ' ' + (rev.device || '') + ' ' + (rev.text || '')).toLowerCase() + '">' +
      '<div>' +
      '<div class="flex items-center justify-between gap-space-xs mb-space-sm">' +
      '<div class="flex items-center gap-space-sm">' +
      '<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center font-title-md text-title-md">' + initial + '</div>' +
      '<div>' +
      '<h2 class="font-title-md text-title-md text-on-surface leading-tight">' + rev.name + '</h2>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant">' + (rev.date || 'Chitrakoot Walk-In') + '</p>' +
      '</div>' +
      '</div>' +
      '<div class="flex flex-col items-end">' +
      '<div class="flex text-[#F59E0B]">' + stars + '</div>' +
      '<span class="font-label-sm text-label-sm text-primary font-semibold mt-0.5">' + (rev.pinned ? '📌 Featured Review' : 'Verified Walk-In') + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="flex flex-wrap gap-1.5 mb-space-md">' +
      '<span class="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded font-label-sm text-label-sm font-semibold">' +
      '<span class="material-symbols-outlined text-[14px] text-secondary">verified</span> Walk-In Customer</span>' +
      (rev.device ? '<span class="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-space-sm py-0.5 rounded font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">smartphone</span> ' + rev.device + '</span>' : '') +
      '</div>' +
      '<p class="font-body-md text-body-md text-on-surface leading-relaxed mb-space-md">“' + rev.text + '”</p>' +
      '</div>' +
      '<div class="bg-surface-container-low p-space-md rounded-lg mt-space-sm">' +
      '<div class="flex items-center justify-between mb-1">' +
      '<div class="flex items-center gap-space-xs text-primary font-label-md text-label-md font-bold">' +
      '<span class="material-symbols-outlined text-[16px]">reply</span><span>' + ownerName + ' (Proprietor)</span>' +
      '</div>' +
      '<span class="font-label-sm text-label-sm text-on-surface-variant">Verified</span>' +
      '</div>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant leading-normal">“Thank you for visiting our Chitrakoot store counter (Sony Dharmshala)! Your warranty seal and receipt are always backed by our physical desk.”</p>' +
      '</div>' +
      '</article>';
  }).join('');
}


// ─── 7. AUTOMATIC PAGE INITIALIZATION & ROUTE GUARDS ────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  var fn = window.location.pathname.split('/').pop() || 'index.html';
  var adminPages = ['admin-dashboard.html', 'admin-stock.html', 'admin-repairs.html', 'admin-profile.html'];
  var publicPages = ['index.html', 'products.html', 'repairs.html', 'owner.html', 'location.html', 'reviews.html'];

  // Route protection for Admin Management Pages
  if (adminPages.indexOf(fn) !== -1) {
    if (!isAdminSetupDone()) {
      window.location.replace('admin-setup.html');
      return;
    }
    if (!isAdminLoggedIn()) {
      window.location.replace('admin-login.html');
      return;
    }
    injectAdminSidebar();
  } 
  // Route protection for Setup and Login pages
  else if (fn === 'admin-setup.html') {
    if (isAdminSetupDone()) {
      window.location.replace('admin-login.html');
      return;
    }
  } 
  else if (fn === 'admin-login.html') {
    if (!isAdminSetupDone()) {
      window.location.replace('admin-setup.html');
      return;
    }
    if (isAdminLoggedIn()) {
      window.location.replace('admin-dashboard.html');
      return;
    }
  } 
  // Storefront Pages Hydration
  else if (publicPages.indexOf(fn) !== -1) {
    injectPublicNav();
    hydrateStorefront();
  }
});

// Reactively re-hydrate storefront when database updates
window.addEventListener('chhaya-db-updated', function() {
  var fn = window.location.pathname.split('/').pop() || 'index.html';
  var publicPages = ['index.html', 'products.html', 'repairs.html', 'owner.html', 'location.html', 'reviews.html'];
  if (publicPages.indexOf(fn) !== -1) {
    hydrateStorefront();
  }
});

