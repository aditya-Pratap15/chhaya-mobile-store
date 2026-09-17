import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_PRODUCTS, 
  DEFAULT_REPAIRS, 
  DEFAULT_REVIEWS, 
  DEFAULT_MEDIA 
} from '../src/data/initialData.js';

const firebaseConfig = {
  apiKey: "AIzaSyArvmuKXT_IvWqdzplOIADtIR_sk86difA",
  authDomain: "chhaya-mobiles-chitrakoot.firebaseapp.com",
  projectId: "chhaya-mobiles-chitrakoot",
  storageBucket: "chhaya-mobiles-chitrakoot.firebasestorage.app",
  messagingSenderId: "1041246245742",
  appId: "1:1041246245742:web:4303b86d7bc4199522677f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runSeed() {
  console.log('🌱 Seeding Firestore Cloud Database for Chhaya Mobiles Chitrakoot...');

  // 1. Seed Products
  console.log(`Writing ${DEFAULT_PRODUCTS.length} products...`);
  for (const prod of DEFAULT_PRODUCTS) {
    await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
  }

  // 2. Seed Repairs
  console.log(`Writing ${DEFAULT_REPAIRS.length} repair rate cards...`);
  for (const srv of DEFAULT_REPAIRS) {
    await setDoc(doc(db, 'repairs', srv.id), srv, { merge: true });
  }

  // 3. Seed Reviews
  console.log(`Writing ${DEFAULT_REVIEWS.length} verified reviews...`);
  for (const rev of DEFAULT_REVIEWS) {
    await setDoc(doc(db, 'reviews', rev.id), rev, { merge: true });
  }

  // 4. Seed Settings
  console.log('Writing store settings...');
  await setDoc(doc(db, 'settings', 'store_config'), DEFAULT_SETTINGS, { merge: true });

  // 5. Seed Media
  console.log('Writing media showcase...');
  await setDoc(doc(db, 'media', 'hero_media'), DEFAULT_MEDIA, { merge: true });

  console.log('🔍 Verifying documents in Firestore...');
  const snap = await getDocs(collection(db, 'products'));
  console.log(`✅ Success! Firestore has ${snap.size} products live in the cloud.`);
  process.exit(0);
}

runSeed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
