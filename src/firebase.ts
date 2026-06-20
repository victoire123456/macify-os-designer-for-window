import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAj-R4m93bgy27N106gGbqVCJKQ4CdtPrU",
  authDomain: "gen-lang-client-0806383005.firebaseapp.com",
  projectId: "gen-lang-client-0806383005",
  storageBucket: "gen-lang-client-0806383005.firebasestorage.app",
  messagingSenderId: "653402752064",
  appId: "1:653402752064:web:a784fd2683e34873cfcba5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// Plan definition interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'premium';
  createdAt: string;
  momoReference?: string;
  subscriptionStatus?: 'active' | 'lifetime' | 'free_tier' | 'pending' | string;
}

// Fetch or create user profile in Firestore with local cache-first strategy for instant sign-in
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  // Try to load from localStorage cache first
  let cached: UserProfile | null = null;
  try {
    const cachedData = localStorage.getItem(`macify_profile_${uid}`);
    if (cachedData) {
      cached = JSON.parse(cachedData) as UserProfile;
    }
  } catch (e) {
    console.warn('Error reading user profile cache:', e);
  }

  // Cache-first strategy: Return cached profile instantly to make desktop load with 0ms latency.
  // Update the cache from firestore in the background.
  if (cached) {
    (async () => {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const liveProfile = docSnap.data() as UserProfile;
          localStorage.setItem(`macify_profile_${uid}`, JSON.stringify(liveProfile));
        }
      } catch (err) {
        console.warn('Background sync skipped:', err);
      }
    })();
    return cached;
  }

  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const liveProfile = docSnap.data() as UserProfile;
      // Update local storage cache
      try {
        localStorage.setItem(`macify_profile_${uid}`, JSON.stringify(liveProfile));
      } catch (e) {}
      return liveProfile;
    }
    return cached;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore, falling back to local cache or defaults:', error);
    if (cached) {
      return cached;
    }
    // Return a default profile if absolutely no profile has been saved/cached yet
    // to prevent blocking the user onboarding/workspace loading when offline.
    const defaultProfile: UserProfile = {
      uid: uid,
      email: auth.currentUser?.email || null,
      displayName: auth.currentUser?.displayName || 'Macify User',
      photoURL: auth.currentUser?.photoURL || null,
      plan: 'free',
      subscriptionStatus: 'free_tier',
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`macify_profile_${uid}`, JSON.stringify(defaultProfile));
    } catch (e) {}
    return defaultProfile;
  }
}

// Save or update user profile with local cache write-through
export async function saveUserProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
  const uid = profile.uid;
  
  // Get existing profile to merge updates
  const existing = await getUserProfile(uid);
  
  const mergedProfile: UserProfile = {
    uid: uid,
    email: profile.email !== undefined ? profile.email : (existing?.email || auth.currentUser?.email || null),
    displayName: profile.displayName !== undefined ? profile.displayName : (existing?.displayName || auth.currentUser?.displayName || 'Macify User'),
    photoURL: profile.photoURL !== undefined ? profile.photoURL : (existing?.photoURL || auth.currentUser?.photoURL || null),
    plan: profile.plan !== undefined ? profile.plan : (existing?.plan || 'free'),
    subscriptionStatus: profile.subscriptionStatus !== undefined ? profile.subscriptionStatus : (existing?.subscriptionStatus || (profile.plan === 'premium' ? 'lifetime' : 'free_tier')),
    createdAt: existing?.createdAt || new Date().toISOString(),
    momoReference: profile.momoReference !== undefined ? profile.momoReference : existing?.momoReference,
  };

  // 1. Instantly save to local storage for zero-latency UI response and reliable offline usage
  try {
    localStorage.setItem(`macify_profile_${uid}`, JSON.stringify(mergedProfile));
  } catch (e) {
    console.warn('Failed to cache user profile in localStorage:', e);
  }

  // 2. Attempt to sync with Firestore
  try {
    const docRef = doc(db, 'users', uid);
    if (existing) {
      const updateData: Record<string, any> = {
        updatedAt: new Date().toISOString()
      };
      if (profile.email !== undefined) updateData.email = profile.email;
      if (profile.displayName !== undefined) updateData.displayName = profile.displayName;
      if (profile.photoURL !== undefined) updateData.photoURL = profile.photoURL;
      if (profile.plan !== undefined) {
        updateData.plan = profile.plan;
        updateData.subscriptionStatus = profile.plan === 'premium' ? 'lifetime' : 'free_tier';
      }
      if (profile.subscriptionStatus !== undefined) updateData.subscriptionStatus = profile.subscriptionStatus;
      if (profile.momoReference !== undefined) updateData.momoReference = profile.momoReference;

      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, mergedProfile);
    }
  } catch (error) {
    console.warn('Error saving user profile to Firestore (currently offline or error). Saved in cache only:', error);
  }
}
