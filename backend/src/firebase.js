import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import './config/env.js';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase config values: ${missingKeys.join(', ')}. ` +
    'Check backend/.env'
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
