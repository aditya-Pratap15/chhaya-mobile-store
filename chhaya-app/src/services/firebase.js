import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyArvmuKXT_IvWqdzplOIADtIR_sk86difA",
  authDomain: "chhaya-mobiles-chitrakoot.firebaseapp.com",
  projectId: "chhaya-mobiles-chitrakoot",
  storageBucket: "chhaya-mobiles-chitrakoot.firebasestorage.app",
  messagingSenderId: "1041246245742",
  appId: "1:1041246245742:web:4303b86d7bc4199522677f"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);

// Firestore Collection References
export const collections = {
  products: collection(firestore, 'products'),
  repairs: collection(firestore, 'repairs'),
  bookings: collection(firestore, 'bookings'),
  reviews: collection(firestore, 'reviews'),
  settings: collection(firestore, 'settings'),
  media: collection(firestore, 'media')
};

export {
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
};
