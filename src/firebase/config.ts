import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: 'templo-25526.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: 'templo-25526.appspot.com',
  messagingSenderId: '641718728453',
  appId: '1:641718728453:web:c2a04a2999e7ea0914e96c',
  measurementId: 'G-01ZD4643SE',
}

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const database = getFirestore(app)
export const auth = getAuth()
