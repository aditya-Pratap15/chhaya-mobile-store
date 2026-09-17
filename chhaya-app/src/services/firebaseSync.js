import { 
  firestore, 
  collections, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from './firebase';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_PRODUCTS, 
  DEFAULT_REPAIRS, 
  DEFAULT_REVIEWS, 
  DEFAULT_MEDIA 
} from '../data/initialData';

let isSeeding = false;

// ─── Initial Database Seeder ────────────────────────────────────────────────
// Populates Firestore once if the database is newly created and empty.
export async function seedFirestoreIfEmpty() {
  if (isSeeding) return;
  try {
    const productsSnap = await getDocs(collections.products);
    if (productsSnap.empty) {
      isSeeding = true;
      console.log('⚡ Initializing Firestore with Chhaya Mobiles Chitrakoot initial store data...');

      // 1. Seed Products
      for (const prod of DEFAULT_PRODUCTS) {
        await setDoc(doc(firestore, 'products', prod.id), prod, { merge: true });
      }

      // 2. Seed Repairs
      for (const srv of DEFAULT_REPAIRS) {
        await setDoc(doc(firestore, 'repairs', srv.id), srv, { merge: true });
      }

      // 3. Seed Reviews
      for (const rev of DEFAULT_REVIEWS) {
        await setDoc(doc(firestore, 'reviews', rev.id), rev, { merge: true });
      }

      // 4. Seed Settings
      await setDoc(doc(firestore, 'settings', 'store_config'), DEFAULT_SETTINGS, { merge: true });

      // 5. Seed Media
      await setDoc(doc(firestore, 'media', 'hero_media'), DEFAULT_MEDIA, { merge: true });

      console.log('✅ Firestore seeding completed successfully!');
      isSeeding = false;
    }
  } catch (err) {
    console.warn('Notice: Firestore seeding check:', err?.message || err);
    isSeeding = false;
  }
}

// ─── Real-time Firestore Listeners ──────────────────────────────────────────
export function subscribeToFirestore(callbacks = {}) {
  const unsubscribers = [];

  // 1. Products Listener
  try {
    const unsubProd = onSnapshot(collections.products, (snapshot) => {
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
        if (callbacks.onProducts) callbacks.onProducts(items);
      }
    }, (err) => console.warn('Products live sync notice:', err?.message));
    unsubscribers.push(unsubProd);
  } catch (e) {
    console.warn('Could not attach products listener:', e);
  }

  // 2. Repairs Rate Cards Listener
  try {
    const unsubRep = onSnapshot(collections.repairs, (snapshot) => {
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
        if (callbacks.onRepairs) callbacks.onRepairs(items);
      }
    }, (err) => console.warn('Repairs live sync notice:', err?.message));
    unsubscribers.push(unsubRep);
  } catch (e) {
    console.warn('Could not attach repairs listener:', e);
  }

  // 3. Reviews Listener
  try {
    const unsubRev = onSnapshot(collections.reviews, (snapshot) => {
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
        if (callbacks.onReviews) callbacks.onReviews(items);
      }
    }, (err) => console.warn('Reviews live sync notice:', err?.message));
    unsubscribers.push(unsubRev);
  } catch (e) {
    console.warn('Could not attach reviews listener:', e);
  }

  // 4. Store Settings Listener
  try {
    const unsubSet = onSnapshot(doc(firestore, 'settings', 'store_config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (callbacks.onSettings) callbacks.onSettings(data);
      }
    }, (err) => console.warn('Settings live sync notice:', err?.message));
    unsubscribers.push(unsubSet);
  } catch (e) {
    console.warn('Could not attach settings listener:', e);
  }

  // 5. Media Listener
  try {
    const unsubMed = onSnapshot(doc(firestore, 'media', 'hero_media'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (callbacks.onMedia) callbacks.onMedia(data);
      }
    }, (err) => console.warn('Media live sync notice:', err?.message));
    unsubscribers.push(unsubMed);
  } catch (e) {
    console.warn('Could not attach media listener:', e);
  }

  // 6. Bookings Listener
  try {
    const unsubBook = onSnapshot(collections.bookings, (snapshot) => {
      if (!snapshot.empty) {
        const items = [];
        snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
        if (callbacks.onBookings) callbacks.onBookings(items);
      }
    }, (err) => console.warn('Bookings live sync notice:', err?.message));
    unsubscribers.push(unsubBook);
  } catch (e) {
    console.warn('Could not attach bookings listener:', e);
  }

  // Check and seed once after subscribing
  seedFirestoreIfEmpty();

  return () => {
    unsubscribers.forEach((unsub) => {
      try { unsub(); } catch (e) {}
    });
  };
}

// ─── Direct Cloud Sync Writers ──────────────────────────────────────────────

export async function cloudSaveProduct(product) {
  try {
    const cleanId = product.id || 'prod-' + Date.now();
    const dataToSave = { ...product, id: cleanId, updatedAt: Date.now() };
    await setDoc(doc(firestore, 'products', cleanId), dataToSave, { merge: true });
    return { success: true, id: cleanId };
  } catch (e) {
    console.warn('Cloud save product warning (offline fallback active):', e);
    return { success: false, error: e };
  }
}

export async function cloudDeleteProduct(productId) {
  try {
    await deleteDoc(doc(firestore, 'products', productId));
    return { success: true };
  } catch (e) {
    console.warn('Cloud delete product warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudSaveRepair(repair) {
  try {
    const cleanId = repair.id || 'srv-' + Date.now();
    const dataToSave = { ...repair, id: cleanId, updatedAt: Date.now() };
    await setDoc(doc(firestore, 'repairs', cleanId), dataToSave, { merge: true });
    return { success: true, id: cleanId };
  } catch (e) {
    console.warn('Cloud save repair warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudDeleteRepair(repairId) {
  try {
    await deleteDoc(doc(firestore, 'repairs', repairId));
    return { success: true };
  } catch (e) {
    console.warn('Cloud delete repair warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudSaveReview(review) {
  try {
    const cleanId = review.id || 'rev-' + Date.now();
    const dataToSave = { ...review, id: cleanId, createdAt: review.createdAt || Date.now() };
    await setDoc(doc(firestore, 'reviews', cleanId), dataToSave, { merge: true });
    return { success: true, id: cleanId };
  } catch (e) {
    console.warn('Cloud save review warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudDeleteReview(reviewId) {
  try {
    await deleteDoc(doc(firestore, 'reviews', reviewId));
    return { success: true };
  } catch (e) {
    console.warn('Cloud delete review warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudSaveSettings(settings) {
  try {
    await setDoc(doc(firestore, 'settings', 'store_config'), settings, { merge: true });
    return { success: true };
  } catch (e) {
    console.warn('Cloud save settings warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudSaveMedia(media) {
  try {
    // Note: avoid large binary bloat in Firestore documents (only store URLs & string meta)
    const sanitizedMedia = {
      ...media,
      video: {
        ...(media.video || {}),
        url: media.video?.isLocalUploaded ? '' : (media.video?.url || '')
      }
    };
    await setDoc(doc(firestore, 'media', 'hero_media'), sanitizedMedia, { merge: true });
    return { success: true };
  } catch (e) {
    console.warn('Cloud save media warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudSaveBooking(booking) {
  try {
    const cleanId = booking.id || 'bk-' + Date.now();
    const dataToSave = { ...booking, id: cleanId, createdAt: booking.createdAt || Date.now() };
    await setDoc(doc(firestore, 'bookings', cleanId), dataToSave, { merge: true });
    return { success: true, id: cleanId };
  } catch (e) {
    console.warn('Cloud save booking warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudUpdateBookingStatus(bookingId, status) {
  try {
    await setDoc(doc(firestore, 'bookings', bookingId), { status, updatedAt: Date.now() }, { merge: true });
    return { success: true };
  } catch (e) {
    console.warn('Cloud update booking warning:', e);
    return { success: false, error: e };
  }
}

export async function cloudDeleteBooking(bookingId) {
  try {
    await deleteDoc(doc(firestore, 'bookings', bookingId));
    return { success: true };
  } catch (e) {
    console.warn('Cloud delete booking warning:', e);
    return { success: false, error: e };
  }
}
