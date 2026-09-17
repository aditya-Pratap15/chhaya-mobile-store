import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

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

async function testCrud() {
  console.log('🧪 Testing Firestore CRUD operations...');
  const testId = 'test-phone-' + Date.now();
  const testDoc = {
    id: testId,
    name: 'Realme 12 Pro Plus 5G Test',
    price: 26999,
    units: 3,
    createdAt: Date.now()
  };

  // Create
  await setDoc(doc(db, 'products', testId), testDoc);
  console.log('✅ Created document:', testId);

  // Read
  const snap = await getDoc(doc(db, 'products', testId));
  if (!snap.exists() || snap.data().price !== 26999) {
    throw new Error('Read failed or data mismatch');
  }
  console.log('✅ Read document back successfully:', snap.data().name);

  // Delete
  await deleteDoc(doc(db, 'products', testId));
  console.log('✅ Deleted test document cleanly.');

  console.log('🎉 All Firestore read/write/delete backend operations are working 100% perfectly!');
  process.exit(0);
}

testCrud().catch(e => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
