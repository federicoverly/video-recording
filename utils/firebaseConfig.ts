// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD668p-VssCXsbr9sWT2x03lQY-giLYpYU',
  authDomain: 'padelapp-5c3a1.firebaseapp.com',
  projectId: 'padelapp-5c3a1',
  storageBucket: 'padelapp-5c3a1.appspot.com',
  messagingSenderId: '121694593378',
  appId: '1:121694593378:web:0926980a6009868255cc3b',
  measurementId: 'G-Q45YHRDFDP'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore();
const analytics = getAnalytics(app);

export { auth, db, analytics };

export default app;
