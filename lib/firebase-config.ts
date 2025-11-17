// Firebase configuration
import { initializeApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Validate and sanitize environment variables
const sanitizeEnvVar = (value: string | undefined, name: string): string => {
  if (!value) {
    console.warn(`⚠️ Missing environment variable: ${name}`);
    return '';
  }
  // Remove any whitespace or newlines
  const sanitized = value.trim();
  
  // Validate API key format if it's the API key
  if (name === 'NEXT_PUBLIC_FIREBASE_API_KEY' && sanitized) {
    // Basic validation: API key should start with 'AIza'
    if (!sanitized.startsWith('AIza')) {
      console.warn(`⚠️ Invalid Firebase API key format: ${sanitized.substring(0, 10)}...`);
    }
  }
  
  return sanitized;
};

const firebaseConfig: FirebaseOptions = {
  apiKey: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

// Log config values in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase config values:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasStorageBucket: !!firebaseConfig.storageBucket,
    hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
    hasAppId: !!firebaseConfig.appId,
    apiKeyPreview: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING'
  });
}

// Check if required config values are present
const isConfigValid = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket && 
  firebaseConfig.messagingSenderId && 
  firebaseConfig.appId;

let app: any;
let db: any;
let auth: any;
let storage: any;

if (isConfigValid) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    
    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error: any) {
    console.error('❌ Error initializing Firebase:', error);
    
    // Log detailed error info in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Firebase config values:', {
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
        hasProjectId: !!firebaseConfig.projectId,
        hasStorageBucket: !!firebaseConfig.storageBucket,
        hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
        hasAppId: !!firebaseConfig.appId
      });
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        customData: error?.customData
      });
      
      // Check for specific auth errors
      if (error?.code === 'auth/invalid-api-key') {
        console.error('🔧 Troubleshooting steps:');
        console.error('1. Verify your FIREBASE_API_KEY in .env.local is correct');
        console.error('2. Ensure the API key has not been revoked in Firebase Console');
        console.error('3. Check that you are using the correct Firebase project');
      }
    }
    
    // Initialize with mock objects to prevent crashes
    app = { name: 'mock-app' };
    db = { type: 'mock-db' };
    auth = { type: 'mock-auth' };
    storage = { type: 'mock-storage' };
  }
} else {
  console.warn('⚠️ Firebase config is invalid or incomplete. Initializing with mock services.');
  
  // Log which values are missing in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Missing config values:', {
      apiKey: !!firebaseConfig.apiKey,
      authDomain: !!firebaseConfig.authDomain,
      projectId: !!firebaseConfig.projectId,
      storageBucket: !!firebaseConfig.storageBucket,
      messagingSenderId: !!firebaseConfig.messagingSenderId,
      appId: !!firebaseConfig.appId
    });
    
    console.warn('🔧 Troubleshooting steps:');
    console.warn('1. Check that .env.local file exists in the root directory');
    console.warn('2. Verify all required Firebase environment variables are set');
    console.warn('3. Ensure there are no syntax errors in the .env.local file');
  }
  
  // Initialize with mock objects to prevent crashes
  app = { name: 'mock-app' };
  db = { type: 'mock-db' };
  auth = { type: 'mock-auth' };
  storage = { type: 'mock-storage' };
}

export { db, auth, storage };
export default app;