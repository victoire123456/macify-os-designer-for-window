import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Sliders,
  Check,
  Monitor,
  Layout,
  Compass,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Clock,
  Laptop,
  Search,
  Bell,
  Wifi,
  Layers,
  Settings,
  Folder,
  Image,
  Terminal,
  Eye,
  Activity,
  Zap,
  Info
} from 'lucide-react';

interface WallpaperPreset {
  id: string;
  name: string;
  category: 'macos' | 'windows' | 'dynamic' | 'custom';
  thumbnail: string;
  bgValue: string; // for direct visual card display
}

export default function SetupWizard() {
  const {
    firstLaunchCompleted,
    setFirstLaunchCompleted,
    setWallpaper,
    allWallpapers,
    isDarkMode,
    setDarkMode,
    dockSize,
    setDockSize,
    dockMagnification,
    setDockMagnification,
    addNotification,
    setTimeBasedWallpaperActive
  } = useMacify();

  // Load active wizard step from localStorage to support "Resume setup later"
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('macify_onboarding_step');
      if (saved) {
        const stepNum = parseInt(saved, 10);
        if (stepNum >= 0 && stepNum <= 7) return stepNum;
      }
    } catch (e) {}
    return 0; // Default to Welcome Screen
  });

  // Track state choices
  const [appearanceMode, setAppearanceMode] = useState<'light' | 'dark' | 'auto'>(() => {
    try {
      const saved = localStorage.getItem('macify_appearance_mode');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    } catch (e) {}
    return 'dark';
  });

  const [wallpaperCategory, setWallpaperCategory] = useState<'macos' | 'windows' | 'dynamic' | 'custom'>('macos');
  const [selectedWallpaperId, setSelectedWallpaperId] = useState<string>('sequoia-dynamic');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string>('');
  const [customWallpaperError, setCustomWallpaperError] = useState<string>('');

  const [dockStyle, setDockStyle] = useState<'classic' | 'compact' | 'floating'>('classic');
  const [selectedIconPack, setSelectedIconPack] = useState<'modern' | 'inspired' | 'fluent' | 'minimal'>('modern');

  // App Hub Option Toggles
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSearchIndexing, setEnableSearchIndexing] = useState(true);
  const [enableAutoUpdates, setEnableAutoUpdates] = useState(true);
  const [enableAppIntegration, setEnableAppIntegration] = useState(true);

  // Quick Tour active tab index
  const [tourIndex, setTourIndex] = useState(0);

  // Persist current step to support resume layout
  useEffect(() => {
    localStorage.setItem('macify_onboarding_step', JSON.stringify(currentStep));
  }, [currentStep]);

  // If already completed inside system, do not render this wizard overlay
  if (firstLaunchCompleted) return null;

  // Real-time background application handler when changing values
  const applyAppearance = (mode: 'light' | 'dark' | 'auto') => {
    setAppearanceMode(mode);
    localStorage.setItem('macify_appearance_mode', mode);
    
    if (mode === 'light') {
      setDarkMode(false);
    } else if (mode === 'dark') {
      setDarkMode(true);
    } else if (mode === 'auto') {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      setDarkMode(isNight);
      addNotification(
        'Auto Appearance Triggered',
        `Determined state dynamically from host time. Loaded ${isNight ? 'Dark' : 'Light'} Mode.`,
        'System Setup'
      );
    }
  };

  const applyWallpaper = (id: string) => {
    setSelectedWallpaperId(id);
    const found = allWallpapers.find(w => w.id === id);
    if (found) {
      setWallpaper(found);
      setTimeBasedWallpaperActive(found.themeSupport === 'dynamic');
    }
  };

  const handleCustomWallpaperApply = () => {
    if (!customWallpaperUrl.trim()) {
      setCustomWallpaperError('Please enter a valid image URL');
      return;
    }
    if (!customWallpaperUrl.startsWith('http://') && !customWallpaperUrl.startsWith('https://') && !customWallpaperUrl.startsWith('url(')) {
      setCustomWallpaperError('URL must begin with http:// or https://');
      return;
    }

    setCustomWallpaperError('');
    // Inject custom wallpaper
    const customId = `custom-onboarding-${Date.now()}`;
    const formattedUrl = customWallpaperUrl.startsWith('url(') ? customWallpaperUrl : `url("${customWallpaperUrl}")`;
    
    const customConfig = {
      id: customId,
      name: 'Onboarding Personal Image',
      type: 'image' as const,
      value: formattedUrl,
      category: 'custom' as const,
      themeSupport: 'light' as const,
      author: 'User Provided'
    };

    setWallpaper(customConfig);
    setSelectedWallpaperId(customId);
    addNotification('Custom Wallpaper Set', 'Applied user image URL backdrop successfully.', 'Wizard');
  };

  const applyDockStyle = (style: 'classic' | 'compact' | 'floating') => {
    setDockStyle(style);
    if (style === 'classic') {
      setDockSize(48);
      setDockMagnification(1.35);
    } else if (style === 'compact') {
      setDockSize(38);
      setDockMagnification(1.2);
    } else if (style === 'floating') {
      setDockSize(56);
      setDockMagnification(1.5);
    }
  };

  const applyIconPack = (pack: 'modern' | 'inspired' | 'fluent' | 'minimal') => {
    setSelectedIconPack(pack);
    localStorage.setItem('macify_icon_pack', pack);
  };

  // Complete Onboarding sequence
  const handleFinishOnboarding = () => {
    // Generate notification summary of setup choices
    addNotification(
      'Macify Configured Successfully',
      `Welcome home! Using ${appearanceMode.toUpperCase()} appearance and ${dockStyle.toUpperCase()} Dock.`,
      'System Setup'
    );

    // Save app hub settings
    const hubSettings = {
      notifications: enableNotifications,
      searchIndexing: enableSearchIndexing,
      autoUpdates: enableAutoUpdates,
      appIntegration: enableAppIntegration
    };
    localStorage.setItem('macify_app_hub_options', JSON.stringify(hubSettings));

    // Clear step tracker
    localStorage.removeItem('macify_onboarding_step');

    // Launch Shell!
    setFirstLaunchCompleted(true);
  };

  const handleSkipSetup = () => {
    // Load standard Cupertino defaults
    setDarkMode(true);
    setDockSize(48);
    setDockMagnification(1.35);
    localStorage.setItem('macify_icon_pack', 'modern');
    localStorage.removeItem('macify_onboarding_step');
    setFirstLaunchCompleted(true);
    addNotification('Setup Completed via Express Skip', 'Standard Cupertino layout active. Feel free to tweak in Settings next.', 'Settings');
  };

  // Static items mapping for step renders
  const tourTabs = [
    {
      title: 'Magnifying Dock',
      icon: Layout,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      headline: 'A dynamic, fluid launchpad at your command',
      description: 'The elegant Macify Dock sits natively at the bottom of your screen. Hover past items to trigger smooth glassmorphic expansion, locate running Windows instances, or access direct shortcut menus with a simple right click.'
    },
    {
      title: 'Finder Explorer',
      icon: Folder,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      headline: 'Reimagined navigation, pristine file layout',
      description: 'Ditch the cluttered Explorer. Finder delivers sleek multi-pane directories (Desktop, Documents, Downloads, Trash), accurate file type indicators, size counts, and visual tags designed purely for focus.'
    },
    {
      title: 'Spotlight Search',
      icon: Search,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      headline: 'Lightning quick command queries',
      description: 'Press Cmd + Space, Ctrl + Space, or Alt + Space anywhere on screen. Instantly summon a beautiful minimalist search box. Type letters to fuzzy-match applications, file names, or specific system settings panels immediately.'
    },
    {
      title: 'Control Center',
      icon: Sliders,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      headline: 'Hardware telemetry, volume & light controls',
      description: 'Tap the luxury sliders icon in your status MenuBar. Control virtual monitor brightness parameters, switch active Wi-Fi adapters, assign outputs, or trace active telemetry vectors effortlessly from one spot.'
    },
    {
      title: 'Notification Center',
      icon: Bell,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      headline: 'Rich system event pipelines',
      description: 'Never miss an event. The slides drawer in the right margin queues high-fidelity notices about local storage swaps, custom setups, software discovered on parent Windows, or peripheral connections in real-time.'
    },
    {
      title: 'App Hub Discoveries',
      icon: ActivitiesIcon, // mapped below
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      headline: 'Safe integration of Chrome, Discord & VS Code',
      description: 'Macify operates strictly on top of Windows. Your core software works 100% exactly the same. Only their desk representation, launch animations, and context panels morph into gorgeous Cupertino assets.'
    }
  ];

  function ActivitiesIcon(props: any) {
    return <Activity {...props} />;
  }

  // Next / Back handlers
  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-neutral-900/60 dark:bg-black/85 backdrop-blur-3xl flex items-center justify-center p-4">
      {/* Background Ambience Underlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-[100px] animate-pulse delay-75" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl w-full bg-white/90 dark:bg-neutral-900/85 border border-white/20 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] backdrop-blur-2xl"
        id="macify-onboarding-container"
      >
        {/* LEFT SIDEBAR: Step progress summary */}
        <div className="md:w-[280px] bg-neutral-100/50 dark:bg-neutral-950/40 border-r border-neutral-200/50 dark:border-neutral-800/60 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none text-neutral-800 dark:text-neutral-100">MACIFY OS</h1>
                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Onboarding System</span>
              </div>
            </div>

            {/* Stepper Steps Indicators representation */}
            <div className="space-y-1.5">
              {[
                { step: 0, label: 'Welcome' },
                { step: 1, label: 'Appearance' },
                { step: 2, label: 'Desktop Wallpaper' },
                { step: 3, label: 'Dock Geometry' },
                { step: 4, label: 'Premium Icon Pack' },
                { step: 5, label: 'System App Hub' },
                { step: 6, label: 'Interactive Tour' },
                { step: 7, label: 'Ready to Launch' }
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;

                return (
                  <div
                    key={s.step}
                    className={`flex items-center space-x-3 text-xs p-2 rounded-xl transition-all duration-150 ${
                      isActive 
                        ? 'bg-sky-500/10 text-sky-500 font-bold border border-sky-500/15' 
                        : isPassed 
                          ? 'text-neutral-400 dark:text-neutral-500 font-medium' 
                          : 'text-neutral-405 dark:text-neutral-500'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition ${
                      isActive 
                        ? 'bg-sky-500 border-sky-500 text-white' 
                        : isPassed 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'border-neutral-300 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 text-neutral-500'
                    }`}>
                      {isPassed ? '✓' : s.step + 1}
                    </div>
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe preservation hint info card */}
          {currentStep > 0 && currentStep < 7 && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1 text-sky-500">
                <Info size={11} />
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Zero Risk Skin</span>
              </div>
              <p className="text-[9px] text-neutral-450 dark:text-neutral-400 leading-normal">
                Windows is running underlying. No files are moved, renamed, patched or modified. Deleting is 100% safe.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT AREA: Active onboarding content panels */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white/40 dark:bg-neutral-950/20 text-neutral-950 dark:text-neutral-50">
          
          <div className="flex-1 overflow-y-auto p-8" id="macify-onboarding-content-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col justify-between"
              >
                
                {/* STEP 0: WELCOME SCREEN */}
                {currentStep === 0 && (
                  <div className="space-y-6 my-auto text-center md:text-left max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-xl mask-squircle mx-auto md:mx-0">
                      <Sparkles size={36} className="text-white animate-pulse" />
                    </div>
                    
                    <div className="space-y-2.5">
                      <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                        Welcome to Macify OS
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed font-semibold">
                        Transform Windows into a premium desktop experience. Enjoy beautiful fluid transitions, frosted glass widgets, custom search tools, and dynamic desktop options.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-sky-400/10 bg-sky-500/5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-1.5">
                      <div className="flex items-center space-x-1.5 font-bold text-sky-500">
                        <Laptop size={14} />
                        <span className="uppercase tracking-widest text-[9.5px]">Windows Core Preservation</span>
                      </div>
                      <p>
                        Your existing Windows system drives, documents, registry keys, active accounts, and installed applications remain <strong>100% untouched</strong>. Macify acts strictly as a luxury overlays visual layer.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={handleNext}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 font-bold text-white shadow-lg transition active:scale-95 space-x-1.5 flex items-center justify-center cursor-pointer text-xs"
                      >
                        <span>Get Started</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={handleSkipSetup}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-350 dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/60 font-semibold text-neutral-450 dark:text-neutral-300 transition text-xs cursor-pointer"
                      >
                        Skip Setup & Launch
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: APPEARANCE PREFERENCE */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 1 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Choose Your Base Appearance</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Select light or dark twilight backgrounds. Preview elements apply immediately.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {/* Light mode select */}
                      <button
                        onClick={() => applyAppearance('light')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 ${
                          appearanceMode === 'light'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/15">
                          <Sun size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center">
                            <span>Light Mode</span>
                            {appearanceMode === 'light' && <Check size={11} className="ml-1.5 text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">Crisp, readable, daylight optimization.</p>
                        </div>
                      </button>

                      {/* Dark mode select */}
                      <button
                        onClick={() => applyAppearance('dark')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 ${
                          appearanceMode === 'dark'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/15">
                          <Moon size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center">
                            <span>Dark Mode</span>
                            {appearanceMode === 'dark' && <Check size={11} className="ml-1.5 text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">Eye-safe obsidian midnight slate canvas.</p>
                        </div>
                      </button>

                      {/* Auto mode select */}
                      <button
                        onClick={() => applyAppearance('auto')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 ${
                          appearanceMode === 'auto'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/15">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center">
                            <span>Auto Night Mode</span>
                            {appearanceMode === 'auto' && <Check size={11} className="ml-1.5 text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">Transitions coordinates aligned with sunrise.</p>
                        </div>
                      </button>
                    </div>

                    {/* Interactive Preview Notice */}
                    <div className="p-3 bg-neutral-100/50 dark:bg-neutral-900/40 rounded-xl text-[10px] text-neutral-450 dark:text-neutral-400 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span>The onboarding screen background and main computer menu behind morph in real-time.</span>
                    </div>
                  </div>
                )}

                {/* STEP 2: DESKTOP WALLPAPER */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 2 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Choose Desktop Background</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Select high-definition style structures. They lay out instantly in the wallpaper grid below.</p>
                    </div>

                    {/* Wallpaper Category Selector pills */}
                    <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-bold space-x-4 mb-2 shrink-0">
                      {[
                        { id: 'macos', label: 'macOS Style' },
                        { id: 'windows', label: 'Landscapes & Windows' },
                        { id: 'dynamic', label: 'Dynamic (Transitions)' },
                        { id: 'custom', label: 'Custom URL Input' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setWallpaperCategory(cat.id as any)}
                          className={`pb-2 transition cursor-pointer relative ${
                            wallpaperCategory === cat.id 
                              ? 'text-sky-500' 
                              : 'text-neutral-405 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          {cat.label}
                          {wallpaperCategory === cat.id && (
                            <motion.div layoutId="cat-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[220px] pr-1">
                      {/* macOS and Windows categorization rendering grids */}
                      {wallpaperCategory !== 'custom' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {allWallpapers
                            .filter(w => {
                              if (wallpaperCategory === 'macos') return w.category === 'macos';
                              if (wallpaperCategory === 'windows') return w.category === 'landscape' || w.category === 'minimal' || w.category === 'aurora';
                              if (wallpaperCategory === 'dynamic') return w.themeSupport === 'dynamic';
                              return true;
                            })
                            .slice(0, 6)
                            .map((wp) => {
                              const isSelected = selectedWallpaperId === wp.id;
                              return (
                                <button
                                  key={wp.id}
                                  onClick={() => applyWallpaper(wp.id)}
                                  className={`p-2 rounded-xl border text-left cursor-pointer transition flex flex-col space-y-1.5 ${
                                    isSelected
                                      ? 'border-sky-500 bg-sky-500/10'
                                      : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/30'
                                  }`}
                                >
                                  {/* Thumbnail representation */}
                                  <div 
                                    style={{ 
                                      backgroundImage: wp.type === 'image' ? wp.value : '',
                                      background: wp.type === 'gradient' ? wp.value : ''
                                    }}
                                    className="w-full h-16 rounded-lg bg-cover bg-center border border-white/10 shrink-0" 
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-[10px] text-neutral-900 dark:text-white truncate">{wp.name}</p>
                                    <p className="text-[8px] text-neutral-400 truncate mt-0.5">By {wp.author || 'Macify'}</p>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      ) : (
                        /* Custom file/url configuration panel representation */
                        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 space-y-3">
                          <label className="block text-xs font-bold text-neutral-750 dark:text-neutral-200">Load Outer Unsplash or Direct URL Address</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/photo-..."
                              className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-sky-500"
                              value={customWallpaperUrl}
                              onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                            />
                            <button
                              onClick={handleCustomWallpaperApply}
                              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer text-center"
                            >
                              Apply URL
                            </button>
                          </div>
                          {customWallpaperError && (
                            <p className="text-[10px] text-rose-500 font-bold">{customWallpaperError}</p>
                          )}
                          
                          <div className="p-2.5 text-[9px] text-neutral-400 leading-normal border border-neutral-200 dark:border-neutral-850 bg-neutral-100/40 dark:bg-neutral-900/40 rounded-lg leading-tight">
                            <strong>Paste any dynamic landscape photography.</strong> Examples: <code>https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format</code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: DOCK STYLE GEOMETRY */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 3 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Choose Dock Visual Style</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Tweak the height and zoom magnification parameters of your bottom magnifying tray.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {/* Classic Dock */}
                      <button
                        onClick={() => applyDockStyle('classic')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-36 ${
                          dockStyle === 'classic'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/15 font-black text-xs">
                          48px
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center justify-between">
                            <span>Classic macOS</span>
                            {dockStyle === 'classic' && <Check size={11} className="text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">48px size, hefty 1.35x magnification ripples.</p>
                        </div>
                      </button>

                      {/* Compact Dock */}
                      <button
                        onClick={() => applyDockStyle('compact')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-36 ${
                          dockStyle === 'compact'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/15 font-black text-xs">
                          38px
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center justify-between">
                            <span>Compact Slim</span>
                            {dockStyle === 'compact' && <Check size={11} className="text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">38px space saver, minimal 1.20x magnification.</p>
                        </div>
                      </button>

                      {/* Floating Dock */}
                      <button
                        onClick={() => applyDockStyle('floating')}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-36 ${
                          dockStyle === 'floating'
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-550/15 shadow-md'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/15 font-black text-xs">
                          56px
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white flex items-center justify-between">
                            <span>Floating Luxury</span>
                            {dockStyle === 'floating' && <Check size={11} className="text-sky-500" />}
                          </p>
                          <p className="text-[9.5px] text-neutral-400 mt-1">56px oversized icons, heavy 1.50x expansion waves.</p>
                        </div>
                      </button>
                    </div>

                    {/* Live indicator control widget */}
                    <div className="p-3.5 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="font-semibold">Interactive Dock Scaling Telemetry:</span>
                      <div className="flex items-center space-x-3 text-[10px] font-mono text-sky-400">
                        <span>HEIGHT: {dockSize}px</span>
                        <span>MAGNIFICATION: {dockMagnification}x</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PREMIUM ICON PACK */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 4 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Choose System Icon Pack</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">All desktop files, shortcut wrappers, and launchpad items conform instantly.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'modern', name: 'Macify Modern Squircles', desc: 'Slightly rounded vector shapes with ambient drop-shadow overlays and neon borders.' },
                        { id: 'inspired', name: 'Cupertino 1-to-1 Classic', desc: 'Direct mapping of macOS Catalina through Sequoia physical high-detailed icons.' },
                        { id: 'fluent', name: 'Redmond Fluent Premium', desc: 'Fluent grid elements styled precisely inside round glassmorphic templates.' },
                        { id: 'minimal', name: 'Minimalist Monoline', desc: 'Stunning fine visual sketches and translucent outlined shapes.' }
                      ].map((pk) => {
                        const isSel = selectedIconPack === pk.id;
                        return (
                          <button
                            key={pk.id}
                            onClick={() => applyIconPack(pk.id as any)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start space-x-3 ${
                              isSel
                                ? 'border-sky-500 bg-sky-500/10'
                                : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="iconpack-grp"
                              checked={isSel}
                              readOnly
                              className="mt-1 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-neutral-900 dark:text-white">{pk.name}</p>
                              <p className="text-[9.5px] text-neutral-400 mt-1 leading-normal">{pk.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mini Icon Pack Preview Block */}
                    <div className="p-3 bg-neutral-100/50 dark:bg-neutral-900/40 rounded-xl space-y-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">Desktop Representation under {selectedIconPack.toUpperCase()} pack:</span>
                      <div className="flex space-x-4 items-center justify-center p-2 bg-white/40 dark:bg-black/20 rounded-lg">
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-lg ${selectedIconPack === 'minimal' ? 'border border-neutral-300 dark:border-neutral-700 bg-white/5' : 'bg-gradient-to-b from-sky-400 to-sky-700'} flex items-center justify-center text-white text-[11px] font-bold`}>
                            F
                          </div>
                          <span className="text-[8px] font-mono">Finder</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-lg ${selectedIconPack === 'minimal' ? 'border border-neutral-300 dark:border-neutral-700 bg-white/5' : 'bg-gradient-to-b from-teal-400 to-teal-700'} flex items-center justify-center text-white text-[11px] font-bold`}>
                            S
                          </div>
                          <span className="text-[8px] font-mono">Safari</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-lg ${selectedIconPack === 'minimal' ? 'border border-neutral-300 dark:border-neutral-700 bg-white/5' : 'bg-gradient-to-b from-amber-400 to-amber-700'} flex items-center justify-center text-white text-[11px] font-bold`}>
                            N
                          </div>
                          <span className="text-[8px] font-mono">Notepad</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-lg ${selectedIconPack === 'minimal' ? 'border border-neutral-300 dark:border-neutral-700 bg-white/5' : 'bg-gradient-to-b from-neutral-600 to-neutral-900'} flex items-center justify-center text-white text-[11px] font-bold`}>
                            T
                          </div>
                          <span className="text-[8px] font-mono">Terminal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: APP HUB INTEGRATION TOGGLES */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 5 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Configure System Integration Services</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Activate backgrounds, filters, notifications, and telemetry processes safely.</p>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {/* Notifications Switch */}
                      <div
                        onClick={() => setEnableNotifications(!enableNotifications)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          enableNotifications 
                            ? 'border-sky-500 bg-sky-500/5' 
                            : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/25'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className="w-8 h-8 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <Bell size={15} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white leading-normal">System Notification Broker</h4>
                            <p className="text-[9.5px] text-neutral-450 dark:text-neutral-400 mt-0.5 truncate max-w-[340px]">Queue slide notices for volume levels, active nets, and setup states.</p>
                          </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition ${enableNotifications ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${enableNotifications ? 'translate-x-4' : ''}`} />
                        </div>
                      </div>

                      {/* Spotlight Indexing */}
                      <div
                        onClick={() => setEnableSearchIndexing(!enableSearchIndexing)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          enableSearchIndexing 
                            ? 'border-sky-500 bg-sky-500/5' 
                            : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/25'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className="w-8 h-8 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <Search size={15} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white leading-normal">Fuzzy Spotlight Indexer</h4>
                            <p className="text-[9.5px] text-neutral-450 dark:text-neutral-400 mt-0.5 truncate max-w-[340px]">Index desktop shortcut targets and .lnk folders for swift query discovery.</p>
                          </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition ${enableSearchIndexing ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${enableSearchIndexing ? 'translate-x-4' : ''}`} />
                        </div>
                      </div>

                      {/* Updates Toggle */}
                      <div
                        onClick={() => setEnableAutoUpdates(!enableAutoUpdates)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          enableAutoUpdates 
                            ? 'border-sky-500 bg-sky-500/5' 
                            : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/25'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className="w-8 h-8 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <Zap size={15} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white leading-normal">Silently Pull Asset Updates</h4>
                            <p className="text-[9.5px] text-neutral-450 dark:text-neutral-400 mt-0.5 truncate max-w-[340px]">Fetch glassmorphic layouts and premium icons automatically in background regimes.</p>
                          </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition ${enableAutoUpdates ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${enableAutoUpdates ? 'translate-x-4' : ''}`} />
                        </div>
                      </div>

                      {/* App Integration wrapper */}
                      <div
                        onClick={() => setEnableAppIntegration(!enableAppIntegration)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          enableAppIntegration 
                            ? 'border-sky-500 bg-sky-500/5' 
                            : 'border-neutral-200 dark:border-neutral-805 bg-white/40 dark:bg-neutral-900/25'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <Laptop size={15} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white leading-normal">Win32 Wrapper Shell Pipeline</h4>
                            <p className="text-[9.5px] text-neutral-450 dark:text-neutral-400 mt-0.5 truncate max-w-[340px]">Detect and wrap launched programs matching VS Code, Chrome, or Discord.</p>
                          </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full p-0.5 transition ${enableAppIntegration ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${enableAppIntegration ? 'translate-x-4' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: QUICK GUIDED TOUR */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-500">Step 6 of 6</span>
                      <h2 className="text-xl font-bold mt-1 text-neutral-950 dark:text-white">Quick Guided Shell Tour</h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Discover fundamental core features before you load into your live desktop workspace.</p>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 h-[220px]">
                      {/* Sidebar list */}
                      <div className="w-full md:w-[170px] space-y-1 block shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 gap-1 md:gap-0">
                        {tourTabs.map((tb, idx) => {
                          const isSel = tourIndex === idx;
                          const IconC = tb.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => setTourIndex(idx)}
                              className={`w-full text-left p-2 rounded-xl text-[10px] font-bold cursor-pointer transition flex items-center space-x-2 shrink-0 whitespace-nowrap md:whitespace-normal ${
                                isSel
                                  ? 'bg-neutral-200/60 dark:bg-neutral-800 text-sky-500'
                                  : 'hover:bg-neutral-100/50 dark:hover:bg-neutral-900/60 text-neutral-405 dark:text-neutral-400'
                              }`}
                            >
                              <IconC size={12} strokeWidth={2.5} />
                              <span className="truncate">{tb.title}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Tab focus details pane */}
                      <div className="flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-805 bg-white/45 dark:bg-neutral-900/15 p-4 flex flex-col justify-between overflow-y-auto min-h-0">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase border ${tourTabs[tourIndex].color}`}>
                              INTEGRATION OK
                            </span>
                          </div>
                          <h4 className="font-extrabold text-[12.5px] text-neutral-900 dark:text-white leading-tight">
                            {tourTabs[tourIndex].headline}
                          </h4>
                          <p className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400 font-semibold">
                            {tourTabs[tourIndex].description}
                          </p>
                        </div>
                        
                        <span className="text-[8.5px] text-neutral-404 font-mono font-medium block border-t border-neutral-100 dark:border-neutral-800 pt-2.5 mt-2">
                          💡 NAVIGATION: Press the Tab key on external hardware anytime to swipe view panels.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: READY / CELEBRATION */}
                {currentStep === 7 && (
                  <div className="space-y-6 my-auto text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg border border-emerald-450/20 mx-auto animate-bounce">
                      <Check size={32} strokeWidth={3} />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                        Your Macify OS is Ready!
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed font-semibold">
                        All chosen theme profiles, HD backgrounds, dock scales, and icon registers have been successfully packaged and written into the client registry.
                      </p>
                    </div>

                    {/* Preferences choices debug table representation */}
                    <div className="p-3 bg-neutral-100/60 dark:bg-neutral-900/40 rounded-2xl border border-neutral-250 dark:border-neutral-805 text-[10px] space-y-1.5 text-left max-w-xs mx-auto">
                      <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-neutral-400 block border-b border-neutral-200 dark:border-neutral-800 pb-1 mb-1">
                        PERSONALIZATIONS SAVE LOG
                      </span>
                      <div className="flex justify-between">
                        <span className="text-neutral-450">Base Theme:</span>
                        <span className="font-bold font-mono text-sky-500 dark:text-sky-400 capitalize">{appearanceMode} Mode</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-450">Theme Support:</span>
                        <span className="font-bold font-mono text-sky-500 dark:text-sky-400 capitalize">Dynamic 60FPS Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-450">Dock Geometry:</span>
                        <span className="font-bold font-mono text-sky-500 dark:text-sky-400 capitalize">{dockStyle} ({dockSize}px)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-450">Active Icon Pack:</span>
                        <span className="font-bold font-mono text-sky-500 dark:text-sky-400 capitalize">{selectedIconPack}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleFinishOnboarding}
                        className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:opacity-95 text-white font-bold shadow-xl active:scale-95 transition-all text-xs cursor-pointer block mx-auto text-center"
                      >
                        Launch Macify OS
                      </button>
                    </div>
                  </div>
                )}

                {/* STEPS CONTROL FOOTER FOR EVERY OTHER STEP */}
                {currentStep > 0 && (
                  <div className="flex items-center justify-between pt-5 border-t border-neutral-200/50 dark:border-neutral-800/60 mt-4 shrink-0">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl text-neutral-450 dark:text-neutral-300 font-bold transition flex items-center space-x-1.5 text-xs cursor-pointer"
                    >
                      <ArrowLeft size={13} strokeWidth={2.5} />
                      <span>Back</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {currentStep < 7 ? (
                        <button
                          onClick={handleNext}
                          className="px-5 py-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl space-x-1.5 flex items-center shadow-md transition text-xs cursor-pointer"
                        >
                          <span>Continue</span>
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
                
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
