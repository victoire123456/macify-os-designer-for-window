import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import AppLogo from '../components/AppLogo';
import {
  Info,
  Image,
  Sliders,
  Monitor,
  Volume2,
  Wifi,
  HardDrive,
  Cpu,
  Moon,
  Sun,
  Check,
  Zap,
  VolumeX,
  Smartphone,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Star,
  Search,
  Plus,
  Clock,
  Sparkles,
  Layers,
  ShieldAlert,
  Power,
  Laptop
} from 'lucide-react';

export default function SettingsApp({ params }: { params?: any }) {
  const {
    wallpaper,
    setWallpaper,
    isDarkMode,
    setDarkMode,
    windowsAgentConnected,
    setWindowsAgentConnected,
    allApps,
    windows,
    openApp,
    addNotification,
    // Custom preferences loaded from the upgraded global store
    dockSize,
    dockMagnification,
    displayResolution,
    displayArrangement,
    soundOutput,
    soundInput,
    activeNetwork,
    setDockSize,
    setDockMagnification,
    setDisplayResolution,
    setDisplayArrangement,
    setSoundOutput,
    setSoundInput,
    setActiveNetwork,
    volume,
    setVolume,
    // Wallpaper gallery extensions
    allWallpapers,
    favoriteWallpaperIds,
    recentWallpaperIds,
    timeBasedWallpaperActive,
    toggleFavoriteWallpaper,
    addCustomWallpaper,
    setTimeBasedWallpaperActive,
    clockFormat,
    setClockFormat,
    worldClockCities,
    setWorldClockCities,
    systemTimezone,
    systemGmtOffset,
    systemLocale,
    systemRegion,
    systemLanguage,
    isSystemRunning,
    startSystem,
    stopSystem
  } = useMacify();

  // Local filters & input controllers for wallpaper gallery
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [importError, setImportError] = useState('');

  const handleImportCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customUrl) {
      setImportError('Please provide both asset name and a valid web URL.');
      return;
    }
    if (!customUrl.startsWith('http://') && !customUrl.startsWith('https://') && !customUrl.startsWith('linear-gradient') && !customUrl.startsWith('radial-gradient')) {
      setImportError('Enter absolute HTTP URL or CSS Gradient syntax.');
      return;
    }
    
    const formattedUrl = customUrl.includes('gradient') ? customUrl : `url("${customUrl}")`;
    addCustomWallpaper(customName, formattedUrl);
    setCustomName('');
    setCustomUrl('');
    setImportError('');
  };

  const [activeTab, setActiveTab] = useState<'about' | 'wallpaper' | 'dock' | 'displays' | 'sound' | 'network' | 'windows' | 'datetime'>(
    params?.tab || 'about'
  );

  // Sync active tab state when params change
  useEffect(() => {
    if (params?.tab) {
      const normalizedTab = params.tab === 'display' ? 'displays' : params.tab;
      setActiveTab(normalizedTab);
    }
  }, [params?.tab]);

  // Backup / Rollback / Uninstall Simulation states
  const [backupState, setBackupState] = useState<'idle' | 'running' | 'done'>('idle');
  const [backupProgress, setBackupProgress] = useState(0);
  
  const [rollbackState, setRollbackState] = useState<'idle' | 'running' | 'done'>('idle');
  const [rollbackProgress, setRollbackProgress] = useState(0);

  const [uninstallState, setUninstallState] = useState<'idle' | 'running' | 'done'>('idle');
  const [uninstallProgress, setUninstallProgress] = useState(0);

  const startBackupSimulation = () => {
    if (backupState !== 'idle') return;
    setBackupState('running');
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupState('done');
          addNotification('Backup Successful', 'All Custom Macify settings and wallpaper indexes have been backed up in C:\\Program Files\\MacifyOS\\backup.json.', 'Settings');
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const startRollbackSimulation = () => {
    if (rollbackState !== 'idle') return;
    setRollbackState('running');
    setRollbackProgress(0);
    const interval = setInterval(() => {
      setRollbackProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRollbackState('done');
          addNotification('Rollback Completed', 'Windows Desktop interface successfully restored to its previous state. All backups loaded.', 'Settings');
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  const startUninstallSimulation = () => {
    if (uninstallState !== 'idle') return;
    if (confirm('Are you sure you want to completely uninstall the Macify visual layer? Your original Windows desktop and shortcuts will remain fully intact.')) {
      setUninstallState('running');
      setUninstallProgress(0);
      const interval = setInterval(() => {
        setUninstallProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUninstallState('done');
            addNotification('Uninstallation Complete', 'Macify visual layer successfully removed. Click Finish to reload Windows classic shell.', 'Settings');
            return 100;
          }
          return prev + 12;
        });
      }, 100);
    }
  };

  // Sound input interactive live waveform signal meter simulation
  const [signalMeter, setSignalMeter] = useState<number[]>([12, 18, 15, 6, 10, 24, 18, 12, 14, 8]);
  useEffect(() => {
    if (activeTab === 'sound') {
      const interval = setInterval(() => {
        setSignalMeter(Array.from({ length: 12 }, () => Math.floor(Math.random() * 26) + 4));
      }, 120);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Network connection diagnostics helper state
  const [pingSpeed, setPingSpeed] = useState<number>(14);
  const [packetLoss, setPacketLoss] = useState<number>(0);
  useEffect(() => {
    if (activeTab === 'network' && windowsAgentConnected) {
      const interval = setInterval(() => {
        setPingSpeed(prev => Math.max(9, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [activeTab, windowsAgentConnected]);

  return (
    <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-800 dark:text-neutral-200" id="system-settings-root">
      
      {/* Left Sidebar Categories Wrapper */}
      <div className="w-14 border-r border-neutral-700/10 dark:border-neutral-800 p-2 bg-neutral-100/40 dark:bg-neutral-900/40 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <div className="space-y-1 mt-1.5">
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'about' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="About This OS"
              >
                <Info size={14} />
              </button>
              
              <button
                onClick={() => setActiveTab('wallpaper')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'wallpaper' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Wallpaper"
              >
                <Image size={14} />
              </button>

              <button
                onClick={() => setActiveTab('dock')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'dock' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Dock & Menu Bar"
              >
                <Sliders size={14} />
              </button>

              <button
                onClick={() => setActiveTab('datetime')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'datetime' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Date & Time"
              >
                <Clock size={14} />
              </button>
            </div>
          </div>

          <div>
            <div className="space-y-1 mt-1.5">
              <button
                onClick={() => setActiveTab('displays')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'displays' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Displays"
              >
                <Monitor size={14} />
              </button>

              <button
                onClick={() => setActiveTab('sound')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'sound' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Sound Output"
              >
                <Volume2 size={14} />
              </button>

              <button
                onClick={() => setActiveTab('network')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'network' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Network"
              >
                <Wifi size={14} />
              </button>
            </div>
          </div>

          <div>
            <div className="space-y-1 mt-1.5">
              <button
                onClick={() => setActiveTab('windows')}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'windows' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                }`}
                title="Win32 Bridge Hub"
              >
                <HardDrive size={14} className="text-teal-555" />
              </button>
            </div>
          </div>
        </div>

        {/* Small System Diagnostic Info icon-only version */}
        <div className="p-1 rounded-xl bg-neutral-200/50 dark:bg-neutral-950/40 text-[9px] font-mono border border-neutral-700/5 flex flex-col items-center">
          <div className="flex flex-col items-center mt-1">
            <span className={`w-2 h-2 rounded-full ${windowsAgentConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} title={windowsAgentConnected ? 'Proxy pipeline Active' : 'Offline'} />
          </div>
        </div>
      </div>

      {/* Main Configurations Console */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-neutral-950/25">
        
        {/* About Tab Category */}
        {activeTab === 'about' && (
          <div className="space-y-6 text-center flex flex-col items-center py-4">
            
            {/* Visual OS Badge Layout */}
            <div className="w-18 h-18 rounded-[24px] bg-neutral-950 flex items-center justify-center shadow-2xl relative border border-white/20 overflow-hidden shrink-0">
              <AppLogo size={72} />
              <div className="absolute -bottom-1 -right-1 text-[8px] font-bold font-mono bg-teal-500 text-white px-1.5 py-0.5 rounded-full border border-white dark:border-neutral-900 shadow-md">
                14.1
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Macify OS Sequoia</h2>
              <p className="text-[11px] text-neutral-400 font-medium">Virtual Macintosh Shell inside Windows Ecosystem</p>
            </div>

            {/* Hardware emulation details card */}
            <div className="max-w-md w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-5 py-4 space-y-3 text-left shadow-sm">
              <h4 className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest leading-none border-b border-neutral-750/15 pb-2">System Profile Metrics</h4>
              
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Processor Node</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">Intel Core i9 Virtual Emulator @ 4.8GHz</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">System RAM Allocation</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">24 GB 6400MHz DDR5 Buffers</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Active Host Pipeline</span>
                <span className="font-mono text-emerald-500 font-bold flex items-center">
                  <CheckCircle2 size={12} className="mr-1" /> Windows 11 Bridge
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Graphics Accelerators</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">Metal Pro on DirectX-12 Layer</span>
              </div>

              <div className="flex justify-between text-xs pt-2 border-t border-neutral-200/50 dark:border-neutral-800/30">
                <span className="font-semibold text-neutral-500 dark:text-neutral-400">Security Architecture</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">Offline SQLite & Preload Isolated IPC</span>
              </div>
            </div>

            {/* System Engine State Card */}
            <div className="max-w-md w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-5 py-4 space-y-4 text-left shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-200/55 dark:border-neutral-800/30 pb-2">
                <h4 className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest leading-none">System Engine Controls</h4>
                <span className={`flex items-center space-x-1.5 text-[10px] font-bold font-mono uppercase ${isSystemRunning ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${isSystemRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{isSystemRunning ? 'Shell Active' : 'Shell Stopped'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Macify Shell Engine</p>
                  <p className="text-[10px] text-neutral-400">Controls virtualization services, dock rendering, and desktop subsystems.</p>
                </div>
                <div className="flex space-x-2">
                  {isSystemRunning ? (
                    <button
                      onClick={stopSystem}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs cursor-pointer transition shadow-xs"
                    >
                      Stop Engine
                    </button>
                  ) : (
                    <button
                      onClick={startSystem}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs cursor-pointer transition shadow-xs"
                    >
                      Start Engine
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="flex space-x-3 items-center">
              <button
                onClick={() => setDarkMode(!isDarkMode)}
                className="px-4 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold cursor-pointer transition shadow-xs"
              >
                {isDarkMode ? '🌞 Switch to Light Presets' : '🌙 Switch to Dark Twilight'}
              </button>
            </div>
          </div>
        )}

        {/* Wallpaper Tab Category */}
        {activeTab === 'wallpaper' && (
          <div className="space-y-5" id="macify-wallpaper-manager">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/85 pb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Desktop Wallpaper Library</h3>
                <p className="text-[10px] text-neutral-400">Change desktop textures or import custom visual assets in 4K resolution.</p>
              </div>

              {/* Automatic Theme & Time-based controls */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimeBasedWallpaperActive(!timeBasedWallpaperActive)}
                  className={`flex items-center justify-center p-2 rounded-xl border cursor-pointer transition shadow-xs ${
                    timeBasedWallpaperActive
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                  title={timeBasedWallpaperActive ? '🕒 Time-Based On' : '🕒 Time-Based Off'}
                >
                  <Clock size={11} />
                </button>

                <button
                  onClick={() => setDarkMode(!isDarkMode)}
                  className="flex items-center justify-center p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer transition shadow-xs"
                  title={isDarkMode ? '🌞 Light Appearance' : '🌙 Dark Appearance'}
                >
                  {isDarkMode ? <Sun size={11} /> : <Moon size={11} />}
                </button>
              </div>
            </div>

            {/* Import Custom Visual Asset Form */}
            <form onSubmit={handleImportCustom} className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles size={13} className="text-sky-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">Import Custom Wallpaper</span>
                </div>
                <span className="text-[9px] text-neutral-400">Supports direct image URL or CSS gradients</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Asset Name (e.g. Galactic Aurora)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-220 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-sky-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                />
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Image URL or CSS linear-gradient..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-220 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-sky-500 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-sky-550 hover:bg-sky-600 text-white rounded-lg transition flex items-center justify-center shrink-0 cursor-pointer"
                    title="Import"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {importError && (
                <p className="text-[10px] text-red-500/90 font-medium">{importError}</p>
              )}
            </form>

            {/* Categories & Search Header */}
            <div className="flex flex-col space-y-3">
              {/* Category selector row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Assets' },
                    { id: 'macos', label: 'macOS Core' },
                    { id: 'keynote', label: 'Apple Keynote' },
                    { id: 'abstract', label: 'Abstract' },
                    { id: 'landscape', label: 'Landscapes' },
                    { id: 'aurora', label: 'Aurora' },
                    { id: 'glassmorphism', label: 'Glassmorphism' },
                    { id: 'favorites', label: 'Favorites ⭐️' },
                    { id: 'recent', label: 'Recent 🕒' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                        selectedCategory === cat.id
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Local search bar */}
                <div className="relative shrink-0 w-44">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-405" />
                  <input
                    type="text"
                    placeholder="Search library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 text-[10px] font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 focus:outline-none focus:border-sky-505 text-neutral-800 dark:text-neutral-200 placeholder-neutral-450 dark:placeholder-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* Wallpapers Display Grid */}
            {(() => {
              const itemsToRender = allWallpapers.filter(wp => {
                if (selectedCategory === 'favorites') {
                  if (!favoriteWallpaperIds.includes(wp.id)) return false;
                } else if (selectedCategory === 'recent') {
                  if (!recentWallpaperIds.includes(wp.id)) return false;
                } else if (selectedCategory !== 'all') {
                  if (wp.category !== selectedCategory) return false;
                }
                
                if (searchQuery) {
                  return wp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (wp.category && wp.category.toLowerCase().includes(searchQuery.toLowerCase()));
                }
                return true;
              });

              if (itemsToRender.length === 0) {
                return (
                  <div className="p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-neutral-400">
                    No matching wallpapers found in this category. Apply custom search terms or checkout standard macOS ones.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-4">
                  {itemsToRender.map((wp) => {
                    const isSelected = wp.id === wallpaper.id;
                    const isFavorite = favoriteWallpaperIds.includes(wp.id);
                    const activeCardBg = (isDarkMode && wp.valueDark) ? wp.valueDark : wp.value;

                    return (
                      <div
                        key={wp.id}
                        onClick={() => setWallpaper(wp)}
                        className={`relative rounded-xl border p-2 cursor-pointer transition flex flex-col group ${
                          isSelected 
                            ? 'border-sky-500 bg-sky-500/10 dark:bg-sky-500/15' 
                            : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        {/* Star Favorite toggle button overlay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteWallpaper(wp.id);
                          }}
                          className="absolute top-4 right-4 z-10 p-1.5 rounded-full backdrop-blur-md bg-black/35 hover:scale-115 active:scale-95 transition cursor-pointer text-white"
                        >
                          <Star size={11} className={isFavorite ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-white'} />
                        </button>

                        {/* Preview Background Window */}
                        <div 
                          style={{ 
                            background: activeCardBg,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }} 
                          className="h-24 w-full rounded-lg shadow-xs mb-2 border border-white/5 group-hover:scale-[1.015] transition-transform duration-300 relative overflow-hidden" 
                        >
                          {/* High-def visual label indicator */}
                          {wp.valueDark && (
                            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/45 text-[7px] text-white/95 font-semibold uppercase tracking-wider backdrop-blur-xs flex items-center">
                              <Layers size={7} className="mr-0.5" /> Dynamic Light/Dark
                            </div>
                          )}
                        </div>

                        {/* Labels and Author credits */}
                        <div className="px-1 flex items-center justify-between">
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-[11px] truncate text-neutral-800 dark:text-neutral-100">
                              {wp.name}
                            </span>
                            <span className="text-[8px] text-neutral-400 uppercase font-mono mt-0.5 flex items-center space-x-1">
                              <span className="px-1 py-0.5 leading-none bg-neutral-100 dark:bg-neutral-800 rounded shrink-0">
                                {wp.category}
                              </span>
                              {wp.author && (
                                <span className="truncate max-w-[100px] text-[8px] text-neutral-450 dark:text-neutral-550 ml-1">
                                  by {wp.author.split(' /')[0]}
                                </span>
                              )}
                            </span>
                          </div>
                          
                          {isSelected && (
                            <div className="w-5 h-5 bg-sky-500 text-white flex items-center justify-center rounded-full shadow shrink-0 ml-1">
                              <Check size={11} className="stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Dock & Menu Bar Settings */}
        {activeTab === 'dock' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Dock & Menu Bar behavior</h3>
              <p className="text-[10px] text-neutral-400">Design your interface boundaries. Changes are updated immediately live in the Cupertino system tray.</p>
            </div>

            {/* Interactive sliders */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-5 shadow-sm">
              
              {/* Size slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Dock Icon Size (Base)</span>
                  <span className="font-mono font-bold text-sky-550 dark:text-sky-400">{dockSize}px</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-neutral-400">Small</span>
                  <input
                    type="range"
                    min="32"
                    max="68"
                    value={dockSize}
                    onChange={(e) => setDockSize(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-750 accent-sky-550 cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-400">Large</span>
                </div>
              </div>

              {/* Magnification slider */}
              <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800/40">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Hover Magnification Factor</span>
                  <span className="font-mono font-bold text-sky-555 dark:text-sky-400">{Math.round((dockMagnification - 1) * 100)}% extra zoom</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-neutral-400">Off (1.0x)</span>
                  <input
                    type="range"
                    min="1.0"
                    max="1.7"
                    step="0.05"
                    value={dockMagnification}
                    onChange={(e) => setDockMagnification(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-750 accent-sky-550 cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-400">Max (1.7x)</span>
                </div>
              </div>
            </div>

            {/* Simulated Desktop Customization Panel */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3 shadow-xs">
              <h4 className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest">Additional preferences</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">Minimize Windows into Application Icon</p>
                  <p className="text-[9px] text-slate-400">Saves desktop space by packing minimized screens inside active dock nodes.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-neutral-300 text-sky-500 focus:ring-sky-500" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/30">
                <div>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">Show Indicators for Open Applications</p>
                  <p className="text-[9px] text-slate-400 font-sans">Displays a glowing micro-dot underneath running app shortcuts.</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 rounded border-slate-350 text-sky-500 focus:ring-sky-500" />
              </div>
            </div>
          </div>
        )}

        {/* Displays Tab Category */}
        {activeTab === 'displays' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Displays and Arrangement</h3>
              <p className="text-[10px] text-neutral-400">Configure virtual multi-monitor canvases, pixel boundaries, and hardware placements.</p>
            </div>

            {/* Visual Arrangement Board */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-830 bg-neutral-100/50 dark:bg-neutral-900/30 p-6 flex flex-col items-center justify-center relative shadow-inner">
              
              <div className="flex items-end justify-center space-x-4 mb-4">
                
                {/* Secondary Screen */}
                <div className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center w-36 h-20 transition-all shadow-md ${
                  displayArrangement === 'Mirrored Displays' 
                    ? 'border-sky-500 bg-sky-500/10 scale-100' 
                    : 'border-neutral-400 bg-neutral-50/50 dark:bg-neutral-800'
                }`}>
                  <span className="text-[10px] font-bold">Display 2 (HDMI)</span>
                  <span className="text-[8px] font-mono text-neutral-450 mt-1">
                    {displayArrangement === 'Mirrored Displays' ? displayResolution : '1920 x 1080'}
                  </span>
                </div>

                {/* Primary Screen Screen */}
                <div className="p-3.5 rounded-xl border-sky-500 bg-sky-500/20 border-2 flex flex-col items-center justify-center w-40 h-24 shadow-lg scale-105 relative">
                  <span className="text-[10px] font-black uppercase text-sky-500">Display 1 (Main)</span>
                  <span className="text-[8px] font-mono font-bold mt-1 text-neutral-600 dark:text-neutral-300">
                    {displayResolution}
                  </span>
                  <div className="absolute -bottom-1 truncate px-1.5 py-0.5 bg-sky-500 text-white rounded font-bold text-[7px] leading-none uppercase">
                    ACTIVE MENU BAR
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-450 text-center italic">Drag or toggle modes above. Display arrangement is structured symmetrically.</p>
            </div>

            {/* Arrangement Control Dropdown Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Virtual screen layout role</label>
                <select
                  value={displayArrangement}
                  onChange={(e) => setDisplayArrangement(e.target.value)}
                  className="w-full bg-neutral-150 dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-250 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                >
                  <option value="Extended Desktop">Extended Screen Canvas Space</option>
                  <option value="Mirrored Displays">Mirror Display 1 Outcomes</option>
                  <option value="Single Output Profile">Deactivate Display 2 Monitor</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Virtual retina resolution</label>
                <select
                  value={displayResolution}
                  onChange={(e) => setDisplayResolution(e.target.value)}
                  className="w-full bg-neutral-150 dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-250 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs text-neutral-800 dark:text-neutral-250"
                >
                  <option value="1920x1080 (Retina Display)">1920 x 1080 (Retina scaled - Standard)</option>
                  <option value="2560x1440 (Ultra Retina HD)">2560 x 1440 (HiDPI Peak crispness)</option>
                  <option value="3456x2234 (Extreme MacBook 16)">3456 x 2234 (MacBook Pro Native Aspect)</option>
                  <option value="1280x800 (Low Energy Mode)">1280 x 800 (Failsafe battery-saver)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Sound Settings Tab Section */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Sound preferences</h3>
              <p className="text-[10px] text-neutral-400">Map real Windows microphones or virtual stereo line Outs seamlessly.</p>
            </div>

            {/* Volume slider & mute toggle */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-5 shadow-xs space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center">
                    <Volume2 size={13} className="mr-1.5 text-sky-500 animate-pulse" /> Combined Output Volume
                  </span>
                  <span className="font-mono font-bold text-sky-550 dark:text-sky-450">{volume}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setVolume(0)} className="text-neutral-400 hover:text-sky-500">
                    {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-750 accent-sky-550 cursor-pointer animate-none"
                  />
                </div>
              </div>
            </div>

            {/* Hardware selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Selected Sound Output device</label>
                <select
                  value={soundOutput}
                  onChange={(e) => setSoundOutput(e.target.value)}
                  className="w-full bg-neutral-150 dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-250 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                >
                  <option value="System Speakers (Realtek High Definition Audio)">Built-in Speakers (Realtek Audio)</option>
                  <option value="AirPods Pro Stereo Line-Out">AirPods Pro (Virtual Output Link)</option>
                  <option value="HDMI Display Sound Link Controller">External Monitor Audio (Master Out)</option>
                  <option value="HiFi Virtual Audio Pipeline">Stereo Hub Virtual Pipeline (Win32)</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Selected Sound Input device (Mic)</label>
                <select
                  value={soundInput}
                  onChange={(e) => setSoundInput(e.target.value)}
                  className="w-full bg-neutral-150 dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-250 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                >
                  <option value="Internal Microphone (Intel Smart Sound Technology)">Host PC Internal Arrays Microphone</option>
                  <option value="Yeti Studio Podcast Pro Line-In (USB)">Yeti USB Broadcast Microphone</option>
                  <option value="AirPods Pro virtual Bluetooth Mic">AirPods Pro (Hands-Free Mic Profile)</option>
                  <option value="System Stereo Mix (Audio Loopback)">Direct Loopback System Stereo Mix</option>
                </select>
              </div>
            </div>

            {/* Input Signal waveform visualizer */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-bold font-mono text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center"><Radio size={12} className="mr-1.5 text-rose-500 animate-pulse" /> INPUT LEVEL FREQUENCY SPECTRUM METER</span>
                <span className="text-emerald-500 animate-pulse">ACTIVE FEED</span>
              </div>
              <div className="h-11 rounded-xl bg-neutral-950/90 border border-neutral-800 p-2 flex items-center justify-center space-x-1.5 shadow-md">
                {signalMeter.map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${val}%` }}
                    className="w-2 rounded bg-gradient-to-t from-sky-500 to-rose-400 transition-all duration-100"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network & WiFi Settings */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Network pipeline and Wi-Fi</h3>
              <p className="text-[10px] text-neutral-400">Deconstruct host adapters or toggle bridge networks securely.</p>
            </div>

            {/* Active Network Card profile */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-900/40 shadow-xs flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold font-mono uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 p-1 rounded">
                  Adapter: Virtual Intel Wi-Fi 6E
                </span>
                <h4 className="font-bold text-base text-neutral-900 dark:text-white mt-1.5">{activeNetwork.split(' (')[0]}</h4>
                <div className="text-[10px] font-mono text-neutral-400 space-y-1">
                  <p>IPv4 IP Allocation: <span className="text-neutral-700 dark:text-neutral-200 font-bold">192.168.1.185</span></p>
                  <p>DHCP Gateway: <span className="text-neutral-700 dark:text-neutral-200 font-bold">192.168.1.1</span></p>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold text-[10px] inline-block border border-teal-500/15">
                  PING SPEED: {pingSpeed}ms
                </div>
                <div className="text-[10px] text-neutral-400">
                  Packet Loss: <span className="font-bold text-emerald-500">{packetLoss}%</span>
                </div>
              </div>
            </div>

            {/* Network Channel Profiles */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">Set Wi-Fi network profile</label>
              <select
                value={activeNetwork}
                onChange={(e) => setActiveNetwork(e.target.value)}
                className="w-full bg-neutral-150 dark:bg-neutral-900 py-1.5 px-3 rounded-lg border border-neutral-250 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
              >
                <option value="Home-Lan-5G (Wi-Fi 6)">Home-Lan-5G (Dual-Band Wi-Fi 6) - Recommended</option>
                <option value="Cupertino_Guest_Secure (SSID: 802.11ax)">Cupertino_Guest_Secure (Enterprise Encrypted)</option>
                <option value="Windows-Bridge-Ethernet_Internal (Ethernet 10Gbps)">Windows-Bridge-Ethernet_Internal (Wired Loop Connection)</option>
                <option value="Mobile-Hotspot-Pro_LTE">Mobile-Hotspot-Pro_LTE (Metered Connection Mode)</option>
              </select>
            </div>
          </div>
        )}

        {/* Windows Pipeline Bridge Core */}
        {activeTab === 'windows' && (
          <div className="space-y-6" id="windows-transformation-layer-dashboard">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-sky-500 flex items-center space-x-1.5 uppercase tracking-wider">
                <Laptop size={14} className="text-sky-500" />
                <span>Windows 10/11 Transformation Shell</span>
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">
                Macify OS runs as a professional premium visual layer sitting on top of the Windows kernel.
              </p>
            </div>

            {/* Informational Preservation Alert */}
            <div className="p-3.5 rounded-xl border border-sky-500/10 bg-sky-500/5 text-[11px] leading-relaxed flex items-start space-x-3 text-neutral-700 dark:text-neutral-300">
              <ShieldAlert className="text-sky-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest text-[9px] mb-0.5">Windows Integration Security & Safety</p>
                <p>
                  <strong>Zero-Risk Architecture:</strong> Macify OS preserves all user documents, shortcuts, installed software directories, system accounts, and configurations unchanged. Application files are never altered or patched.
                </p>
              </div>
            </div>

            {/* System Settings & Interface Integration Controls */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-mono uppercase text-neutral-450 dark:text-neutral-400">Transform Shell Customization</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Visual Option 1 */}
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">Preserve Standard Files & Icons</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-400">Keep active shortcuts, local directories and user documents fully visible inside the interactive Macify Desktop grid.</p>
                  <label className="flex items-center space-x-2 text-[10.5px] font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-sky-500 cursor-pointer w-3.5 h-3.5" />
                    <span>Overlay Windows Desktop Shortcuts</span>
                  </label>
                </div>

                {/* Visual Option 2 */}
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">Win32 App Wrapper Skin</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-400">Provide macOS style header bars, window drop shadows, rounded boundaries, and native hardware accelerated animations.</p>
                  <label className="flex items-center space-x-2 text-[10.5px] font-semibold cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-sky-500 cursor-pointer w-3.5 h-3.5" />
                    <span>Enforce Glassmorphic Wrap Frames</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Application Detection Engine */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold font-mono uppercase text-neutral-450 dark:text-neutral-400">Detected Win32 Applications wrapped</span>
                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-500 font-extrabold border border-indigo-500/15 px-1.5 py-0.5 rounded">GPU ACCELERATION: 60 FPS ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {allApps.map(a => (
                  <div key={a.id} className="p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-950/25 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200" style={{ borderLeftWidth: '3px', borderLeftColor: a.brandColor }}>
                        {a.name.substring(0, 1)}
                      </div>
                      <div className="font-sans leading-tight">
                        <p className="font-bold text-neutral-850 dark:text-neutral-100">{a.name}</p>
                        <p className="text-[8.5px] font-mono text-neutral-400 truncate max-w-[140px]">{a.exePath}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        openApp(a.id);
                        addNotification('Active Wrapper Spawning', `Spawning secure visual bridge wrapper representation for ${a.name}...`, 'Settings');
                      }}
                      className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[9.5px] cursor-pointer transition shadow-xs"
                    >
                      Wrap Launch
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Desktop Client Installer Registry Actions */}
            <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950/20 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-850">
              <div>
                <h4 className="font-bold text-xs">Installer Operations Control Hub</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Control the setup platform, backup system mappings, or trigger a clean uninstallation cycle.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                
                {/* Backup Settings */}
                <div className="space-y-2">
                  <p className="font-bold text-[10.5px] text-neutral-700 dark:text-neutral-200">1-Click Settings Backup</p>
                  <p className="text-[9.5px] text-neutral-400 leading-tight">Export and back up custom desktop wallpaper layouts, resolution presets, and workspace arrange caches.</p>
                  {backupState === 'idle' && (
                    <button
                      onClick={startBackupSimulation}
                      className="w-full py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-805 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 font-bold transition text-xs cursor-pointer"
                    >
                      Backup Configuration
                    </button>
                  )}
                  {backupState === 'running' && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div style={{ width: `${backupProgress}%` }} className="h-full bg-sky-500" />
                      </div>
                      <span className="text-[9px] font-mono text-sky-500 block">Exporting database... {backupProgress}%</span>
                    </div>
                  )}
                  {backupState === 'done' && (
                    <span className="text-[10px] text-emerald-500 font-extrabold flex items-center">
                      ✓ System Configuration Saved!
                    </span>
                  )}
                </div>

                {/* Rollback Settings */}
                <div className="space-y-2">
                  <p className="font-bold text-[10.5px] text-neutral-700 dark:text-neutral-200">Safe Rollback System</p>
                  <p className="text-[9.5px] text-neutral-400 leading-tight">Restore classic Windows shell parameters instantly without touching directories or installed application packages.</p>
                  {rollbackState === 'idle' && (
                    <button
                      onClick={startRollbackSimulation}
                      className="w-full py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-805 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 font-bold transition text-xs cursor-pointer"
                    >
                      Safe Shell Recovery
                    </button>
                  )}
                  {rollbackState === 'running' && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div style={{ width: `${rollbackProgress}%` }} className="h-full bg-indigo-500" />
                      </div>
                      <span className="text-[9px] font-mono text-indigo-500 block">Restoring settings... {rollbackProgress}%</span>
                    </div>
                  )}
                  {rollbackState === 'done' && (
                    <span className="text-[10px] text-indigo-500 font-extrabold flex items-center">
                      🎉 Restore Completed Safely!
                    </span>
                  )}
                </div>

                {/* Uninstall Transformer */}
                <div className="space-y-2">
                  <p className="font-bold text-[10.5px] text-neutral-700 dark:text-neutral-200">Uninstall Macify OS</p>
                  <p className="text-[9.5px] text-neutral-400 leading-tight">Rollback completely and wipe local theme wrappers. This cleans standard startup folders cleanly.</p>
                  {uninstallState === 'idle' && (
                    <button
                      onClick={startUninstallSimulation}
                      className="w-full py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold transition text-xs cursor-pointer"
                    >
                      Uninstall Shell
                    </button>
                  )}
                  {uninstallState === 'running' && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div style={{ width: `${uninstallProgress}%` }} className="h-full bg-rose-500" />
                      </div>
                      <span className="text-[9px] font-mono text-rose-500 block">Purging visual registers... {uninstallProgress}%</span>
                    </div>
                  )}
                  {uninstallState === 'done' && (
                    <span className="text-[10px] text-rose-500 font-extrabold block">
                      ⚠️ Removed. Reload shell to complete.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date & Time Settings Panel */}
        {activeTab === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-sky-500">Date & Time Settings</h3>
              <p className="text-[10px] text-neutral-400">Configure timezones, localized calendar styles, and world clocks fully synchronized with Windows host.</p>
            </div>

            {/* Sync Status Info Banner */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs flex items-center">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Host Time Synchronization Active
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Macify OS clock is automatically locked to your Windows system clock.</p>
                </div>
                <span className="text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                  ONLINE & SYNCED (LOCAL HOST)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-neutral-250/20">
                <div className="space-y-1">
                  <span className="text-neutral-400">System Timezone</span>
                  <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{systemTimezone} ({systemGmtOffset})</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400">Regional Language</span>
                  <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{systemLanguage}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 font-medium">System Locale</span>
                  <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{systemLocale}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400">Host Region Boundary</span>
                  <p className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{systemRegion}</p>
                </div>
              </div>

              <div className="text-[9px] flex items-center text-teal-600 dark:text-teal-400 font-semibold bg-teal-500/10 p-2 rounded-lg border border-teal-500/15">
                ✔️ Fully Offline Compatible: When you disconnect from the internet, Macify OS continues syncing using CPU system hardware clocks and regional settings directly.
              </div>
            </div>

            {/* Menu Bar Clock Formatting Selection */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs">Menu Bar Clock Format</h4>
              <p className="text-[10px] text-neutral-400">Select how the date and time are presented at the top-right corner of the desktop.</p>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Option 1: Short */}
                <div 
                  onClick={() => setClockFormat('short')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    clockFormat === 'short' 
                      ? 'border-sky-500 bg-sky-500/5 text-sky-600 dark:text-sky-400 font-bold' 
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 hover:bg-neutral-100/50'
                  }`}
                >
                  <div>
                    <p className="text-xs">Short Date & Time</p>
                    <span className="font-mono text-[10px] text-neutral-450 dark:text-neutral-400 mt-1 block">Sun, Jun 14 04:24 PM</span>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${clockFormat === 'short' ? 'border-sky-500 animate-[pulse_1s_infinite]' : 'border-neutral-400'}`}>
                    {clockFormat === 'short' && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                  </div>
                </div>

                {/* Option 2: Long */}
                <div 
                  onClick={() => setClockFormat('long')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    clockFormat === 'long' 
                      ? 'border-sky-500 bg-sky-500/5 text-sky-600 dark:text-sky-400 font-bold' 
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/40 hover:bg-neutral-100/50'
                  }`}
                >
                  <div>
                    <p className="text-xs">Long Date (Full)</p>
                    <span className="font-mono text-[10px] text-neutral-450 dark:text-neutral-400 mt-1 block">Sunday, June 14, 2026</span>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${clockFormat === 'long' ? 'border-sky-500 animate-[pulse_1s_infinite]' : 'border-neutral-400'}`}>
                    {clockFormat === 'long' && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                  </div>
                </div>
              </div>
            </div>

            {/* World Clocks Management Section */}
            <div className="space-y-4 bg-neutral-50/50 dark:bg-neutral-900/10 p-4 rounded-xl border border-neutral-100 dark:border-neutral-850">
              <div>
                <h4 className="font-bold text-xs pb-1">Configure Monitored World Cities</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Toggle monitoring states for international financial nodes which show up on your sidebar widgets.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {['Kigali', 'London', 'Paris', 'Dubai', 'Tokyo', 'New York', 'Los Angeles'].map(cityName => {
                  const active = worldClockCities.includes(cityName);
                  return (
                    <button
                      key={cityName}
                      onClick={() => {
                        if (active) {
                          if (worldClockCities.length > 1) {
                            setWorldClockCities(worldClockCities.filter(c => c !== cityName));
                          }
                        } else {
                          setWorldClockCities([...worldClockCities, cityName]);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-left text-[11px] font-semibold flex items-center justify-between cursor-pointer border transition ${
                        active 
                          ? 'bg-sky-500 text-white border-sky-500 shadow-sm font-bold' 
                          : 'bg-white dark:bg-neutral-950 dark:border-neutral-800 border-neutral-200 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{cityName}</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[8px] ${
                        active ? 'border-white bg-white/25 font-black' : 'border-neutral-350'
                      }`}>
                        {active ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
