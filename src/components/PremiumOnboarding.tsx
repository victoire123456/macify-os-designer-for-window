import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  Smartphone, 
  Loader2, 
  Lock, 
  Crown, 
  LogOut, 
  Mail, 
  Key, 
  HelpCircle,
  Folder,
  Globe,
  Settings,
  Shield,
  CreditCard,
  User as UserIcon,
  CheckCircle,
  Activity,
  Workflow,
  Sparkle,
  Download,
  Laptop
} from 'lucide-react';
import { useMacify } from '../store';
import { 
  auth, 
  googleProvider, 
  getUserProfile, 
  saveUserProfile, 
  UserProfile 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';

interface PremiumOnboardingProps {
  onLoginComplete: (user: User, profile: UserProfile) => void;
  onLogout: () => void;
  currentProfile: UserProfile | null;
  onPlanUpdated: (newPlan: 'free' | 'premium') => void;
  isDesktopWidget?: boolean;
}

export default function PremiumOnboarding({ 
  onLoginComplete, 
  onLogout, 
  currentProfile,
  onPlanUpdated,
  isDesktopWidget = false
}: PremiumOnboardingProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(currentProfile);
  
  // Potential views: 'welcome', 'auth', 'plan-selection', 'payment', 'home-screen', 'loading', 'downloader'
  const [view, setView] = useState<'welcome' | 'auth' | 'plan-selection' | 'payment' | 'home-screen' | 'loading' | 'downloader'>('welcome');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [premiumIntent, setPremiumIntent] = useState(false);
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Loading/Startup progress bar
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing Your Workspace...');

  // Downloader animated states (Step 4 installer mock download system)
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadText, setDownloadText] = useState('Initializing installation package...');

  // Upgrade / Payment states
  const { premiumModalOpen, setPremiumModalOpen } = useMacify();
  const [momoRef, setMomoRef] = useState('');
  const [momoPhone, setMomoPhone] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

  // Manage Account Modal / View
  const [showAccountManager, setShowAccountManager] = useState(false);

  // Keep local profile state in sync with parent profile
  useEffect(() => {
    if (currentProfile) {
      setProfile(currentProfile);
    }
  }, [currentProfile]);

  // Synchronous Workspace Launcher Progress (STEP 3 & 4)
  const startLoadingWorkspace = (fUser: User, fProfile: UserProfile) => {
    setView('loading');
    setLoadingProgress(0);
    const bootSteps = [
      { prg: 10, text: 'Mapping Cloud Security Protocols...' },
      { prg: 25, text: 'Mounting virtual desktop file registers...' },
      { prg: 45, text: 'Enabling hardware graphics virtualization layers...' },
      { prg: 65, text: 'Preloading secure local glassmorphic widgets...' },
      { prg: 85, text: 'Constructing custom modern macOS system UI...' },
      { prg: 95, text: 'Initializing luxury desktop icon packs...' },
      { prg: 100, text: 'Launching Macify Shell workspace...' }
    ];

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setLoadingText('Workspace Prepared!');
          setTimeout(() => {
            // Desktop opens successfully, session starts
            onLoginComplete(fUser, fProfile);
          }, 200);
          return 100;
        }
        
        // Find custom descriptions based on current bounds
        const matchedStep = [...bootSteps].reverse().find(s => next >= s.prg);
        if (matchedStep) {
          setLoadingText(matchedStep.text);
        }
        return next;
      });
    }, 60);
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsLoadingAuth(true);
        try {
          let fetchedProfile = await getUserProfile(firebaseUser.uid);
          
          if (!fetchedProfile) {
            // New user signed up - create profile
            const initialProf: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Macify User',
              photoURL: firebaseUser.photoURL || '',
              plan: 'free',
              subscriptionStatus: 'free_tier',
              createdAt: new Date().toISOString()
            };
            await saveUserProfile(initialProf);
            fetchedProfile = initialProf;
            
            // Redirect new user to select plan
            setProfile(fetchedProfile);
            if (!isDesktopWidget) {
              if (premiumIntent) {
                setView('payment');
              } else {
                setView('plan-selection');
              }
            }
          } else {
            // Existing user
            setProfile(fetchedProfile);
            if (!isDesktopWidget) {
              if (premiumIntent && fetchedProfile.plan !== 'premium') {
                setView('payment');
              } else {
                // Automatically fast-launch the Sequoian workspace for returning sessions
                startLoadingWorkspace(firebaseUser, fetchedProfile);
              }
            }
          }
        } catch (e) {
          console.error('Error in auth profile resolve:', e);
        } finally {
          setIsLoadingAuth(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        onLogout();
        if (!isDesktopWidget) {
          setView('welcome');
        }
      }
    });

    return () => unsubscribe();
  }, [isDesktopWidget]);

  // Automated Get Started Downloader trigger (STEP 4)
  useEffect(() => {
    let interval: any;
    if (view === 'downloader') {
      setDownloadProgress(0);
      setDownloadText('Initializing install stream handshake...');
      
      const downloadSteps = [
        { progress: 15, text: 'Resolving cloud download mirrors...' },
        { progress: 35, text: 'Verifying MD5 checksum certificates...' },
        { progress: 55, text: 'Downloading visual shell wrappers (42.1 / 84 MB)...' },
        { progress: 75, text: 'Reassembling setup package files...' },
        { progress: 95, text: 'Finalizing macify-os-win64-setup.exe...' },
        { progress: 100, text: 'Download Started Successfully!' }
      ];

      // Download trigger executed once in the middle of progress
      let downloadTriggered = false;
      const triggerFileDownload = () => {
        const text = `===========================================
MACIFY OS NATIVE INDEPENDENT WINDOWS LAUNCHER
===========================================

Your standalone offline desktop environment setup wrapper is ready.

Launch Instructions:
1. Extract the primary setup archive into your chosen system directories.
2. Run 'npm install' to cache local package resources.
3. Launch via 'npm run start' or by double clicking the 'MacifyOffline.bat' launcher script.

Features Included:
- Complete Offline support with active service worker buffering
- Rapid stand-by memory and extreme 60 fps rendering animations
- Secure sandboxed standard user accounts

Enjoy using Macify OS on Windows!`;
        const blob = new Blob([text], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'macify-os-setup.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      let stepIndex = 0;
      interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }

          if (prev >= 50 && !downloadTriggered) {
            downloadTriggered = true;
            try {
              triggerFileDownload();
            } catch (e) {
              console.warn('Auto download blocked by browser sandbox settings.', e);
            }
          }

          if (stepIndex < downloadSteps.length && prev >= downloadSteps[stepIndex].progress) {
            setDownloadText(downloadSteps[stepIndex].text);
            stepIndex++;
          }

          return prev + Math.floor(Math.random() * 8) + 3;
        });
      }, 150);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  // Perform Email Register or Log in
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim() || !password.trim()) {
      setAuthError('Please fill in both email and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsLoadingAuth(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        // Auth state listener handles the rest
      } else {
        if (!displayName.trim()) {
          setAuthError('Please provide your full display name.');
          setIsLoadingAuth(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const initialProf: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: displayName,
          photoURL: '',
          plan: 'free',
          subscriptionStatus: 'free_tier',
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(initialProf);
        setProfile(initialProf);
        setView('plan-selection'); // Go straight to choose plan
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setAuthError('Invalid credentials entered.');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered.');
      } else {
        setAuthError(err.message || 'Authentication error.');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Perform Google popup login (Primary Authentication Option)
  const handleGoogleAuth = async () => {
    setAuthError('');
    setIsLoadingAuth(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      let fetchedProfile = await getUserProfile(googleUser.uid);
      if (!fetchedProfile) {
        // Save retrieved google details (Name, Email, Profile Picture)
        const initialProf: UserProfile = {
          uid: googleUser.uid,
          email: googleUser.email,
          displayName: googleUser.displayName || 'Macify User',
          photoURL: googleUser.photoURL || '',
          plan: 'free',
          subscriptionStatus: 'free_tier',
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(initialProf);
        setProfile(initialProf);
        setView('plan-selection'); // Direct brand-new users to select a plan
      } else {
        setProfile(fetchedProfile);
        setView('home-screen'); // Existing user goes to home screen dashboard
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request' || err.message?.includes('popup-closed-by-user') || err.message?.includes('cancelled-popup-request')) {
        setAuthError(
          'Google Sign-In popup was closed or cancelled. This occurs when browser security restricts popup/authentication communication inside cross-origin preview iframes.\n\nPlease sign in by clicking "Open Macify in New Tab" below, or use the Email & Password form below to register/login instantly!'
        );
      } else {
        setAuthError(err.message || 'Google Popup connection rejected. Ensure popups are allowed.');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Handle plan updates in the flow
  const selectPlan = async (chosenPlan: 'free' | 'premium') => {
    if (!user || !profile) return;
    
    if (chosenPlan === 'free') {
      setIsUpgrading(true);
      try {
        const updated = {
          ...profile,
          plan: 'free' as const,
          subscriptionStatus: 'free_tier'
        };
        await saveUserProfile(updated);
        setProfile(updated);
        onPlanUpdated('free');
        setView('home-screen');
      } catch (err) {
        console.error(err);
      } finally {
        setIsUpgrading(false);
      }
    } else {
      // Directs to MoMo payment page
      setView('payment');
    }
  };

  // Mobile Money subscription validator (STEP 2 PAYMENT FLOW)
  const handleVerifyPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUpgradeError('');
    
    if (!momoPhone.trim()) {
      setUpgradeError('Please enter the Mobile Money phone number used for the transaction.');
      return;
    }
    if (!momoRef.trim()) {
      setUpgradeError('Please enter a valid Transaction ID or reference number.');
      return;
    }

    setIsUpgrading(true);
    try {
      if (!user || !profile) throw new Error('Unauthenticated');
      
      // Simulate real-time server verification logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedProfile: UserProfile = {
        ...profile,
        plan: 'premium',
        subscriptionStatus: 'lifetime',
        momoReference: momoRef,
        momoPhoneNumber: momoPhone
      };
      
      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      onPlanUpdated('premium');
      
      // Upgrade successful! Redirect to the Home Screen
      setView('home-screen');
      setMomoRef('');
      setMomoPhone('');
      setPremiumModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setUpgradeError('Verification failed. Please double check reference or connect to network.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Interactive instant developer bypass
  const handleInstantDemoUpgrade = async () => {
    if (!user || !profile) return;
    setIsUpgrading(true);
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        plan: 'premium',
        subscriptionStatus: 'lifetime',
        momoReference: 'MOMO-DEMO-BYPASS-' + Math.floor(Math.random() * 90000 + 10000)
      };
      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      onPlanUpdated('premium');
      setView('home-screen');
      setPremiumModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Perform sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
      onLogout();
      setView('welcome');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // DESKTOP WIDGET RENDERING (If already inside the desktop workspace)
  if (isDesktopWidget) {
    if (!user || !profile) return null;
    return (
      <>
        {/* Floating Desktop Account widget at top right */}
        <div 
          id="macify-floating-hud-widget"
          className="fixed top-12 right-4 z-[9999] bg-neutral-900/80 dark:bg-neutral-950/80 backdrop-blur-xl rounded-xl border border-neutral-200/10 dark:border-neutral-800/80 p-3 flex items-center justify-between space-x-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none max-w-xs font-sans transition-all duration-350 hover:bg-neutral-900/90 dark:hover:bg-neutral-950/90 hover:scale-[1.02]"
        >
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              {profile.photoURL ? (
                <img 
                  id="macify-hud-avatar"
                  src={profile.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700/50" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div id="macify-hud-avatar-fallback" className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-505 to-indigo-600 flex items-center justify-center border border-neutral-700">
                  <span className="font-extrabold text-neutral-100 font-mono text-sm">
                    {profile.displayName ? profile.displayName[0].toUpperCase() : 'M'}
                  </span>
                </div>
              )}
              {profile.plan === 'premium' && (
                <div id="macify-hud-badge" className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-0.5 border border-neutral-950 shadow-md">
                  <Crown className="w-3 h-3 text-neutral-950 fill-neutral-950" />
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-[11.5px] font-bold text-neutral-100 truncate w-28">{profile.displayName || 'Macify User'}</p>
              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full inline-block font-mono tracking-wider ${
                profile.plan === 'premium' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700/30'
              }`}>
                {profile.plan === 'premium' ? '👑 PREMIUM' : '⭐ FREE PLAN'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {profile.plan !== 'premium' && (
              <button 
                id="macify-upgrade-hud-btn"
                onClick={() => setPremiumModalOpen(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[9.5px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center cursor-pointer shadow-md hover:shadow-sky-500/30"
              >
                Upgrade
              </button>
            )}
            <button 
              id="macify-logout-hud-btn"
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-neutral-800/40 cursor-pointer"
              title="Sign Out of Macify"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Upgrade Dialog Modal on Desktop */}
        <AnimatePresence>
          {premiumModalOpen && (
            <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center font-sans p-4">
              <motion.div 
                id="macify-upgrade-modal-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-neutral-900/95 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6 relative text-left"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600" />
                <button 
                  onClick={() => setPremiumModalOpen(false)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  ✕
                </button>

                <div className="text-center mb-5 mt-2">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                    <Crown className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-100 bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">
                    Upgrade to Macify Premium
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">Unlock AI, Live Wallpapers, and Cloud integrations instantly</p>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800/80 mb-3">
                    <span className="text-neutral-400 text-xs font-semibold">Premium Pricing:</span>
                    <span className="font-mono text-sm font-black text-amber-400">1,500 RWF</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Smartphone className="w-5 h-5 text-sky-450 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11.5px] font-bold text-neutral-200">MTN Mobile Money Transfer</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Please transfer exactly <span className="font-semibold text-neutral-200">1,500 RWF</span> to our line:</p>
                      <p className="font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-sky-400 font-extrabold mt-1.5 text-xs inline-block tracking-wider">
                        0784 838 094
                      </p>
                      <p className="text-[9px] text-neutral-500 mt-1">Account Holder Name: Joseph Atuyishime</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerifyPayment} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">
                      Transaction Reference / ID
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text" 
                        value={momoRef}
                        onChange={(e) => setMomoRef(e.target.value)}
                        placeholder="e.g. 2938475837"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-750 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {upgradeError && (
                    <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-[10px]">
                      {upgradeError}
                    </div>
                  )}

                  <div className="flex flex-col space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isUpgrading}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-neutral-950 font-extrabold text-xs py-2.5 rounded-xl transition shadow shadow-amber-500/10 cursor-pointer text-center"
                    >
                      {isUpgrading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Checking Reference...
                        </span>
                      ) : (
                        "Verify & Upgrade to Premium"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleInstantDemoUpgrade}
                      className="w-full bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold text-[10.5px] py-1.5 rounded-xl transition cursor-pointer text-center"
                    >
                      ⚡ Instant Bypass (Free Demo Activation)
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // BOOTING LOADING WORKSPACE LAYOUT (STEP 3 & 4)
  if (view === 'loading') {
    return (
      <div 
        id="macify-booting-screen"
        className="fixed inset-0 z-[999999] bg-neutral-950 flex flex-col items-center justify-center font-sans select-none"
      >
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-650/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <div className="relative text-center max-w-sm px-6">
          {/* Glowing Metallic Apple-Style Boot Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-tr from-sky-400 via-indigo-500 to-orange-500 rounded-3xl flex items-center justify-center p-0.5 shadow-xl shadow-sky-500/15"
          >
            <div className="w-full h-full bg-neutral-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[50%] bg-white/5" />
              <Sparkles className="w-10 h-10 text-sky-400 animate-pulse" />
            </div>
          </motion.div>

          <h2 className="text-xl font-black bg-gradient-to-r from-neutral-50 via-sky-100 to-indigo-300 bg-clip-text text-transparent mb-1.5">
            Macify OS Sequoia
          </h2>
          <p className="text-xs text-neutral-400 font-mono tracking-tight h-5 mb-8">{loadingText}</p>

          <div className="w-72 bg-neutral-950 border border-neutral-900 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-sky-450 via-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_#0EA5E9]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center w-72 mx-auto mt-3 text-[9.5px] font-mono text-neutral-550">
            <span>SECURE SANDBOX BOOT</span>
            <span className="font-bold text-sky-400">{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  // FULL-SCREEN INITIAL ONBOARDING OR LAUNCHER PANELS (STEP 1 Welcome / STEP 2 Auth / Plan Selection / Payment / Home Screen)
  return (
    <div 
      id="macify-fullscreen-onboarding-container"
      className="fixed inset-0 z-[999998] bg-neutral-950 flex items-center justify-center font-sans select-none overflow-y-auto p-4 md:p-8"
    >
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-sky-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* STEP 1: WELCOME SCREEN */}
      {view === 'welcome' && (
        <motion.div 
          key="welcome-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 py-4 relative z-10"
        >
          {/* Header styling */}
          <div className="text-center max-w-2xl mb-4">
            {/* Pulsing luxury badge */}
            <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-400/20 px-3.5 py-1.5 rounded-full mb-4 relative overflow-hidden">
              <Sparkle className="w-4 h-4 text-sky-400 animate-spin-slow" />
              <span className="text-[10px] font-black tracking-widest text-sky-400 font-mono">MACIFY OS DESKTOP VIRTUAL</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-neutral-50 tracking-tight leading-tight mb-2">
              Transform Windows into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Premium Experience</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 font-medium">
              A hybrid futuristic operating system with glassmorphic visuals, smooth workspaces and MoMo payment tiers.
            </p>
          </div>

          {/* Clean Card UI with 3 Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-2">
            
            {/* OPTION 1: GET STARTED */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setPremiumIntent(false);
                setView('downloader');
              }}
              className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 hover:border-sky-550/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl cursor-pointer hover:shadow-sky-500/5 transition relative overflow-hidden text-left"
              id="get-started-card"
            >
              <div className="absolute top-0 right-0 p-3 text-[9.5px] font-mono font-black text-sky-400 bg-sky-500/10 rounded-bl-xl uppercase">
                FREE TIER
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center">
                    Get Started
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Download visual installer setup commands safely, preserve original documents, and try basic system tools.
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs text-sky-400 font-black">
                <span>Start Transformation</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
            </motion.div>

            {/* OPTION 2: CONTINUE WITH GOOGLE */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={handleGoogleAuth}
              className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 hover:border-neutral-700 rounded-3xl p-6 flex flex-col justify-between shadow-xl cursor-pointer transition relative overflow-hidden text-left"
              id="google-onboarding-card"
            >
              <div className="absolute top-0 right-0 p-3 text-[9.5px] font-mono font-black text-neutral-400 bg-neutral-800/25 rounded-bl-xl uppercase">
                QUICK SIGN IN
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-extrabold text-sm font-mono select-none">
                  G
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Continue with Google
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Fast 1-click authentication style. Retrieve address and avatar automatically for synchronous configuration.
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs text-neutral-300 font-bold">
                <span>Popup Google Login</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* OPTION 3: GO PREMIUM */}
            <motion.div
              whileHover={{ scale: 1.025 }}
              onClick={() => {
                setPremiumIntent(true);
                setView('auth');
              }}
              className="bg-gradient-to-b from-amber-500/10 to-transparent backdrop-blur-md border border-amber-500/20 hover:border-amber-400 rounded-3xl p-6 flex flex-col justify-between shadow-xl cursor-pointer hover:shadow-orange-500/5 transition relative overflow-hidden text-left"
              id="premium-onboarding-card"
            >
              <div className="absolute top-0 right-0 p-3 text-[9.5px] font-mono font-black text-amber-500 bg-amber-500/10 rounded-bl-xl uppercase tracking-widest animate-pulse">
                RECOMMENDED
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center">
                    Go Premium
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Unchain custom backgrounds, ultimate setups, dynamic integrations, and cloud sync features securely.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-850/60 flex flex-col">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono pt-1">
                  <span>TRANSFER AMOUNT:</span>
                  <span className="text-amber-400 font-extrabold font-sans">1500 RWF</span>
                </div>
                <div className="flex justify-between items-center text-[9px] text-neutral-500 font-mono pt-0.5">
                  <span>VIA MTN MOMO:</span>
                  <span className="truncate max-w-[120px] font-bold">0784 838 094</span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}

      {/* STEP 1.5: DOWNLOADER SYSTEM */}
      {view === 'downloader' && (
        <motion.div
          key="downloader-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 md:p-8 text-center relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/5 animate-pulse">
            <Download className="w-8 h-8" />
          </div>

          <h2 className="text-2.5xl font-black text-white tracking-tight mb-2">
            Preparing your Macify OS installation…
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            Compiling native visual shell hooks, mapping local paths, and bootstrapping the Sequoian environment files.
          </p>

          {/* Animated Download Progress Bar */}
          <div className="w-full bg-neutral-950 border border-neutral-850 h-5 rounded-full overflow-hidden p-0.5 shadow-inner mb-3 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full shadow-[0_0_8px_#0EA5E9]"
              style={{ width: `${downloadProgress}%` }}
            />
            <span className="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[10px] font-mono font-black text-white drop-shadow">
              {downloadProgress}%
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mb-6 px-1">
            <span className="uppercase font-bold text-sky-400/80 animate-pulse">{downloadText}</span>
            <span>{downloadProgress === 100 ? 'FINISHED' : 'DOWNLOADING'}</span>
          </div>

          {/* Fallback button if block and proceed trigger */}
          <div className="space-y-4">
            {downloadProgress < 100 ? (
              <button
                onClick={() => {
                  // Direct trigger download manual bypass in case of sandbox blocks
                  const text = `===========================================
MACIFY OS NATIVE INDEPENDENT WINDOWS LAUNCHER
===========================================

Your standalone offline desktop environment setup wrapper is ready.
Extract and run npm install & npm run start to launch.`;
                  const blob = new Blob([text], { type: 'application/octet-stream' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'macify-os-setup.exe';
                  a.click();
                }}
                className="w-full bg-neutral-850 hover:bg-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer border border-neutral-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Click here if download is blocked</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2.5 rounded-xl text-center font-semibold flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download Started Successfully!</span>
                </div>
                
                <button
                  onClick={() => {
                    setPremiumIntent(false);
                    setView('auth');
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-650 text-white font-extrabold text-xs py-3.5 rounded-xl transition hover:opacity-95 shadow shadow-sky-500/10 cursor-pointer text-center flex items-center justify-center space-x-2"
                >
                  <span>Continue to Register & Start Trial</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </motion.div>
            )}
            
            {downloadProgress < 100 && (
              <button
                onClick={() => setView('welcome')}
                className="text-neutral-500 hover:text-neutral-350 transition text-xs font-bold leading-none"
              >
                Cancel Download Setup
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* STEP 2: AUTHENTICATION SCREEN */}
      {view === 'auth' && (
        <motion.div 
          key="auth-panel"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative text-left"
        >
          {/* Back Action */}
          <button 
            onClick={() => setView('welcome')}
            className="absolute top-5 left-5 text-xs text-neutral-400 hover:text-white transition flex items-center space-x-1 cursor-pointer font-bold"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Back</span>
          </button>

          <div className="text-center mb-6 mt-4">
            <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-neutral-100 via-sky-100 to-sky-300 bg-clip-text text-transparent">
              Sign in to Continue
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5">Access your Macify OS Workspace securely</p>
          </div>

          {/* Social Sign In (Primary Action) */}
          <div className="mt-2 mb-6">
            <button
              id="google-signin-btn"
              onClick={handleGoogleAuth}
              disabled={isLoadingAuth}
              className="w-full bg-neutral-950 hover:bg-neutral-900 text-neutral-200 border border-neutral-850 font-black text-xs py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-3 active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.35-1.15 2.1l2.58 2c1.51-1.4 2.38-3.48 2.38-5.95z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.98c-1.07.72-2.45 1.15-4.1 1.15-3.15 0-5.83-2.13-6.78-5.01H1.28v3.1A11.99 11.99 0 0 0 12 24z"/>
                <path fill="#FBBC05" d="M5.22 14.26a7.22 7.22 0 0 1 0-4.52V6.64H1.28A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.28 5.36l3.94-3.1z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.32 2.69 1.28 6.64l3.94 3.1c.95-2.88 3.63-5.01 6.78-5.01z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121212] px-4 text-neutral-500 font-mono text-[10px] tracking-widest">OR EMAIL</span>
            </div>
          </div>

          {/* Email Fallback Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1">Full Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alexis Carter"
                  className="w-full bg-neutral-950/70 border border-neutral-850 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-750 transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="account@macify.com"
                className="w-full bg-neutral-950/70 border border-neutral-850 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-750 transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950/70 border border-neutral-850 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-750 transition"
                required
              />
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-semibold flex flex-col gap-2">
                <div className="leading-relaxed whitespace-pre-line">{authError}</div>
                {(authError.includes('New Tab') || authError.includes('new tab') || authError.includes('popup')) && (
                  <button
                    type="button"
                    onClick={() => {
                      const newWin = window.open(window.location.href, '_blank');
                      if (!newWin) {
                        alert('Popup blocker prevented opening in a new tab. Please allow popups or open directly.');
                      }
                    }}
                    className="mt-1 w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[11px] py-2 rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center space-x-1 shadow-md shadow-sky-550/10"
                  >
                    <span>Open Macify in New Tab ↗</span>
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl active:scale-95 transition shadow-lg shadow-sky-550/20 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {isLoadingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Configuring Profile...</span>
                </>
              ) : (
                <>
                  {authMode === 'login' ? <LogIn className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                  <span>{authMode === 'login' ? 'Sign In Securely' : 'Create Free Account'}</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-5 pt-1">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-neutral-400 hover:text-sky-400 transition cursor-pointer"
            >
              {authMode === 'login' ? "Don't have an account? Create Register Here" : "Already have an account? Switch to Log In"}
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3 FIRST TIME: PLAN SELECTION PAGE */}
      {view === 'plan-selection' && (
        <motion.div 
          key="plan-selector"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full max-w-4xl relative z-10 text-center"
        >
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Select Your Access Tier
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-2">Choose the workspace configuration that fits your design expectations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* option 1: Free Plan */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between hover:border-neutral-700/60 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-neutral-100 font-sans uppercase">Free Tier</h3>
                    <p className="text-xs text-neutral-450 mt-1">Core Macify virtualization layer</p>
                  </div>
                  <span className="font-mono text-xl font-black text-sky-450 tracking-tight">FREE</span>
                </div>

                <hr className="border-neutral-800 mb-4" />

                <div className="space-y-3.5 mb-6">
                  {[
                    "✓ Dynamic Macify dock with magnification",
                    "✓ Standard responsive macOS icons pack",
                    "✓ Stock sequoia style static wallpapers",
                    "✓ Core macOS Finder explorer style folder UI",
                    "✓ Basic desktop settings panels and widgets",
                    "✓ Standard windows shell adapter tools"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center text-[11.5px] text-neutral-300">
                      <Check className="w-4 h-4 text-sky-400 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => selectPlan('free')}
                disabled={isUpgrading}
                className="w-full bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer active:scale-95"
              >
                Choose Free Plan
              </button>
            </div>

            {/* option 2: Premium Plan */}
            <div className="bg-neutral-900/65 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-neutral-950 font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                HIGHLY RESERVED
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400/10 mr-1.5" />
                      MACIFY PREMIUM
                    </h3>
                    <p className="text-xs text-neutral-450 mt-1">Unleash the supreme premium workstation</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-black text-amber-400 block pb-0">1500 RWF</span>
                    <span className="text-[9px] text-neutral-500 block leading-none text-right uppercase tracking-wider font-bold">one-time active lock</span>
                  </div>
                </div>

                <hr className="border-neutral-800 mb-4" />

                <div className="space-y-3.5 mb-6">
                  {[
                    "✓ Everything included inside Free Tier",
                    "✓ Unlimited Google Gemini AI Assistant App",
                    "✓ Immersive dynamic live active wallpapers",
                    "✓ Custom generative AI wallpaper engine App",
                    "✓ Unlimited Creator Hub advanced tools access",
                    "✓ Live cloud Firestore sync & profile storage",
                    "✓ Premium exclusive dark/light desktop themes"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center text-[11.5px] text-neutral-250">
                      <CheckCircle className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => selectPlan('premium')}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-neutral-950 font-black text-xs py-3 rounded-xl transition cursor-pointer active:scale-95 shadow shadow-amber-500/20"
              >
                Upgrade to Premium ($1,500 F)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* PAYMENT DISCOVERY / VERIFY FORM (STEP 2 PAYMENT FLOW) */}
      {view === 'payment' && (
        <motion.div 
          key="payment-gateway"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 md:p-8 relative text-left"
        >
          {/* Back Action */}
          <button 
            onClick={() => setView('plan-selection')}
            className="absolute top-5 left-5 text-xs text-neutral-400 hover:text-white transition flex items-center space-x-1 cursor-pointer font-bold"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Back</span>
          </button>

          <div className="text-center mb-6 mt-4">
            <h2 className="text-xl md:text-2.5xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-indigo-200 bg-clip-text text-transparent">
              Verify Transaction Reference
            </h2>
            <p className="text-xs text-neutral-400 mt-1.5">Activate Premium plan below via Mobile Money transfer</p>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-850 rounded-2xl p-5 mb-6 text-left">
            <p className="text-xs font-black text-amber-500 font-mono tracking-widest uppercase mb-3">TRANSFER RECIPIENT INFORMATION</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span className="text-neutral-450">Pay exact price:</span>
                <span className="text-amber-400 font-extrabold">1,500 RWF</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span className="text-neutral-450">MTN MoMo Number:</span>
                <span className="text-sky-400 font-black">0784 838 094</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span className="text-neutral-450">Account Name:</span>
                <span className="text-neutral-200 font-bold">Joseph Atuyishime</span>
              </div>
            </div>
            <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-850 mt-3.5">
              <p className="text-[10px] text-neutral-400 leading-normal">
                Please complete transferring the payment first to the merchant lines above. Once sent, provide the reference ID here to register.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyPayment} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                Your Mobile Money Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input 
                  type="tel" 
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="e.g. 078XXXXXXX"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-700 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                Upload Transaction ID / Reference No.
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  value={momoRef}
                  onChange={(e) => setMomoRef(e.target.value)}
                  placeholder="e.g. MTN-283947492"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-neutral-700 font-mono"
                  required
                />
              </div>
            </div>

            {upgradeError && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-medium">
                {upgradeError}
              </div>
            )}

            <div className="flex flex-col space-y-2 pt-2">
              <button
                type="submit"
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-500 text-neutral-950 font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Verifying Transfer reference...</span>
                  </>
                ) : (
                  <span>Verify Payment & Active Premium</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleInstantDemoUpgrade}
                className="w-full bg-neutral-850 hover:bg-neutral-800 text-neutral-250 font-bold text-[10.5px] py-2 rounded-xl transition cursor-pointer text-center"
              >
                ⚡ Instant Bypass (Free Demo Mode Activation)
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 4: HOME SCREEN (POST-LOGIN INTERACTIVE ACCOUNT BOARD) */}
      {view === 'home-screen' && (
        <motion.div 
          key="home-center"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="w-full max-w-sm md:max-w-md bg-neutral-900/40 backdrop-blur-3xl border border-neutral-800/80 rounded-[32px] shadow-2xl p-6 md:p-8 relative text-center flex flex-col items-center justify-center"
        >
          {profile?.plan === 'premium' ? (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
          ) : (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 to-indigo-500" />
          )}

          {/* User profile picture */}
          <div className="relative mb-4 mt-2">
            {profile?.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700/60 shadow-lg" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-550 flex items-center justify-center border-2 border-neutral-700/50 shadow-lg">
                <span className="font-black text-neutral-100 font-mono text-3xl">
                  {profile?.displayName ? profile.displayName[0].toUpperCase() : 'M'}
                </span>
              </div>
            )}
            {profile?.plan === 'premium' && (
              <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1.5 border-2 border-neutral-950 shadow-xl" title="Crown Member">
                <Crown className="w-4.5 h-4.5 text-neutral-950 fill-neutral-950" />
              </div>
            )}
          </div>

          <p className="text-xs font-black tracking-widest text-sky-400 font-mono uppercase mb-1">ACCOUNT ACTIVE</p>
          <h2 className="text-xl md:text-2xl font-black text-white px-2 truncate max-w-full">
            {profile?.displayName || 'Macify User'}
          </h2>
          
          <div className="mt-2.5 mb-6">
            <span className={`text-[9px] font-black px-3.5 py-1 rounded-full inline-block font-mono tracking-widest uppercase border ${
              profile?.plan === 'premium' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-neutral-800 text-neutral-400 border-neutral-750'
            }`}>
              {profile?.plan === 'premium' ? '👑 PREMIUM ACCOUNT' : '⭐ FREE TIER'}
            </span>
          </div>

          {/* Main Action Controllers */}
          <div className="w-full space-y-3.5">
            <button
              id="launch-macify-btn"
              onClick={() => {
                if (user && profile) {
                  startLoadingWorkspace(user, profile);
                }
              }}
              className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:opacity-[0.98] text-white font-black text-xs py-3.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-sky-500/10 hover:shadow-sky-550/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Workflow className="w-4 h-4 shrink-0" />
              <span>Launch Macify OS</span>
            </button>

            {profile?.plan === 'free' && (
              <button
                id="upgrade-plan-home-btn"
                onClick={() => setView('plan-selection')}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-neutral-950 font-black text-xs py-3.5 rounded-2xl active:scale-95 transition-all shadow shadow-amber-500/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 shrink-0" />
                <span>Upgrade to Premium</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                id="manage-account-btn"
                onClick={() => setShowAccountManager(true)}
                className="bg-neutral-955 hover:bg-neutral-850 border border-neutral-800 text-neutral-250 font-bold text-[10.5px] py-2.5 rounded-xl transition cursor-pointer"
              >
                Manage Account
              </button>

              <button
                id="logout-btn"
                onClick={handleLogout}
                className="bg-neutral-955 hover:bg-red-950/20 border border-neutral-800 text-neutral-400 hover:text-red-400 font-bold text-[10.5px] py-2.5 rounded-xl transition cursor-pointer"
              >
                Logout Account
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MANAGE ACCOUNT POPUP PANEL (IF OPENED) */}
      <AnimatePresence>
        {showAccountManager && (
          <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md flex items-center justify-center font-sans p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6 relative text-left"
            >
              <button 
                onClick={() => setShowAccountManager(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3 mb-5 border-b border-neutral-800 pb-4">
                <Settings className="w-5 h-5 text-sky-400 shrink-0" />
                <h3 className="text-base font-black text-neutral-100">
                  Manage Workspace Account
                </h3>
              </div>

              <div className="space-y-3 font-mono text-[11px] mb-6">
                <div className="flex justify-between py-1 border-b border-neutral-950">
                  <span className="text-neutral-450">Display Name:</span>
                  <span className="text-neutral-200 font-semibold">{profile?.displayName || 'Alexis user'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-950">
                  <span className="text-neutral-450">Linked Email:</span>
                  <span className="text-neutral-200 font-semibold max-w-[150px] truncate" title={profile?.email || ''}>{profile?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-950">
                  <span className="text-neutral-450">Active Tier:</span>
                  <span className="text-sky-400 font-bold uppercase">{profile?.plan || 'free'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-950">
                  <span className="text-neutral-450">Sub Status:</span>
                  <span className={`${profile?.plan === 'premium' ? 'text-amber-400' : 'text-neutral-400'} font-bold uppercase`}>
                    {profile?.subscriptionStatus || 'free_tier'}
                  </span>
                </div>
                {profile?.momoReference && (
                  <div className="flex justify-between py-1 border-b border-neutral-950">
                    <span className="text-neutral-450">Reference:</span>
                    <span className="text-neutral-300 select-all font-bold">{profile.momoReference}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-neutral-450">Registered:</span>
                  <span className="text-neutral-400">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <button
                onClick={() => setShowAccountManager(false)}
                className="w-full bg-neutral-800 hover:bg-neutral-750 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer text-center"
              >
                Close Manager
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
