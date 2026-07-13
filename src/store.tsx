import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppID, AppConfig, WindowInstance, FileSystemNode, NotificationItem, WallpaperConfig } from './types';
import { BUILTIN_WALLPAPERS } from './wallpapers';

export interface StoreType {
  // Apps & Windows
  windows: WindowInstance[];
  focusedWindowId: string | null;
  launchpadOpen: boolean;
  missionControlOpen: boolean;
  altTabOpen: boolean;
  altTabActiveIndex: number;
  activeAppId: AppID | 'Finder';
  
  // Status Bar / Settings
  wifiConnected: boolean;
  bluetoothConnected: boolean;
  airDropOn: boolean;
  brightness: number;
  focusMode: boolean;
  volume: number;
  batteryLevel: number;
  isBatteryCharging: boolean;
  timeString: string;
  dateString: string;
  isDarkMode: boolean;
  spotlightOpen: boolean;
  showControlCenter: boolean;
  showNotificationCenter: boolean;
  activeWorkspace: number;
  workspaces: number[];
  windowsAgentConnected: boolean;
  wallpaper: WallpaperConfig;
  dockApps: AppID[];
  bouncingApps: AppID[];

  // Lists
  allApps: AppConfig[];
  notifications: NotificationItem[];
  fileSystem: FileSystemNode[];
  clipboard: { node: FileSystemNode; mode: 'copy' | 'cut' } | null;

  // New Wallpaper Extension Library
  allWallpapers: WallpaperConfig[];
  favoriteWallpaperIds: string[];
  recentWallpaperIds: string[];
  firstLaunchCompleted: boolean;
  timeBasedWallpaperActive: boolean;

  // Actions
  openApp: (appId: AppID, params?: any) => void;
  closeApp: (windowId: string) => void;
  minimizeApp: (windowId: string) => void;
  toggleMaximizeApp: (windowId: string) => void;
  focusApp: (windowId: string) => void;
  setLaunchpadOpen: (open: boolean) => void;
  setMissionControlOpen: (open: boolean) => void;
  setAltTabOpen: (open: boolean) => void;
  setAltTabActiveIndex: (updater: number | ((prev: number) => number)) => void;
  setWallpaper: (wallpaper: WallpaperConfig) => void;
  setWifiConnected: (connected: boolean) => void;
  setBluetoothConnected: (connected: boolean) => void;
  setAirDropOn: (on: boolean) => void;
  setBrightness: (brightness: number) => void;
  setFocusMode: (mode: boolean) => void;
  addWorkspace: () => void;
  deleteWorkspace: (num: number) => void;
  setVolume: (vol: number) => void;
  setDarkMode: (val: boolean) => void;
  toggleSpotlight: () => void;
  toggleControlCenter: () => void;
  toggleNotificationCenter: () => void;
  addNotification: (title: string, msg: string, app: string) => void;
  clearNotification: (id: string) => void;
  triggerAppBounce: (appId: AppID) => void;
  
  // File System Actions
  createFile: (name: string, category: FileSystemNode['category'], type: 'file' | 'directory', content?: string) => void;
  deleteNode: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  renameNode: (id: string, newName: string) => void;
  copyNode: (node: FileSystemNode) => void;
  cutNode: (node: FileSystemNode) => void;
  pasteNode: (destinationCategory: FileSystemNode['category']) => void;
  moveNode: (id: string, destinationCategory: FileSystemNode['category']) => void;

  // New Wallpaper Library Actions
  toggleFavoriteWallpaper: (id: string) => void;
  addCustomWallpaper: (name: string, url: string, isGradientOrColor?: boolean) => void;
  setFirstLaunchCompleted: (completed: boolean) => void;
  setTimeBasedWallpaperActive: (active: boolean) => void;

  // New Universal Windows App Integration Actions
  toggleFavoriteApp: (appId: string) => void;
  togglePinApp: (appId: string) => void;
  addCustomApp: (newApp: AppConfig) => void;
  scanWindowsApps: (onStep?: (msg: string) => void) => Promise<void>;

  // Configuration
  setDockApps: (apps: AppID[]) => void;
  setWindowsAgentConnected: (val: boolean) => void;
  setBatteryLevel: (level: number | ((prev: number) => number)) => void;
  setIsBatteryCharging: (charging: boolean) => void;

  // Custom System Preferences customization states
  dockSize: number;
  dockMagnification: number;
  displayResolution: string;
  displayArrangement: string;
  soundOutput: string;
  soundInput: string;
  activeNetwork: string;

  setDockSize: (size: number) => void;
  setDockMagnification: (magnification: number) => void;
  setDisplayResolution: (resolution: string) => void;
  setDisplayArrangement: (arrangement: string) => void;
  setSoundOutput: (output: string) => void;
  setSoundInput: (input: string) => void;
  setActiveNetwork: (network: string) => void;

  // Time & Localization Customization
  clockFormat: 'short' | 'long';
  setClockFormat: (format: 'short' | 'long') => void;
  worldClockCities: string[];
  setWorldClockCities: (cities: string[]) => void;
  longDateString: string;
  systemTimezone: string;
  systemGmtOffset: string;
  systemLocale: string;
  systemRegion: string;
  systemLanguage: string;

  // System Running Engine
  isSystemRunning: boolean;
  startSystem: () => void;
  stopSystem: () => void;
  isBooting: boolean;
  setIsBooting: (booting: boolean) => void;
}

const StoreContext = createContext<StoreType | undefined>(undefined);

export const WALLPAPERS: WallpaperConfig[] = BUILTIN_WALLPAPERS;

const INITIAL_APPS: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: 'Folder', isWindowsNative: false, category: 'system' },
  { id: 'safari', name: 'Safari', icon: 'Globe', isWindowsNative: false, category: 'system' },
  { id: 'vscode', name: 'VS Code', icon: 'Code', isWindowsNative: true, category: 'windows' },
  { id: 'spotify', name: 'Spotify Music', icon: 'Music', isWindowsNative: true, category: 'windows' },
  { id: 'settings', name: 'Settings', icon: 'Settings', isWindowsNative: false, category: 'system' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', isWindowsNative: false, category: 'utilities' },
  { id: 'notepad', name: 'Notepad', icon: 'FileText', isWindowsNative: true, category: 'windows' },
  { id: 'terminal', name: 'Terminal', icon: 'Terminal', isWindowsNative: false, category: 'utilities' },
  { id: 'discord', name: 'Discord', icon: 'MessageSquare', isWindowsNative: true, category: 'windows' },
  { id: 'telegram', name: 'Telegram', icon: 'Send', isWindowsNative: true, category: 'windows' },
  { id: 'edge', name: 'Microsoft Edge', icon: 'Compass', isWindowsNative: true, category: 'windows' },
  { id: 'chrome', name: 'Google Chrome', icon: 'Chrome', isWindowsNative: true, category: 'windows' },
  { id: 'installer', name: 'Win32 Setup Wizard', icon: 'HardDrive', isWindowsNative: false, category: 'utilities' },
  { id: 'creatorhub', name: 'Macify Creator Hub', icon: 'Sparkles', isWindowsNative: false, category: 'utilities' },
  { id: 'taskmanager', name: 'Task Manager', icon: 'Activity', isWindowsNative: false, category: 'utilities' },
];

const INITIAL_DOCK: AppID[] = ['finder', 'safari', 'vscode', 'spotify', 'calculator', 'notepad', 'terminal', 'installer', 'creatorhub', 'settings'];

const INITIAL_FILES: FileSystemNode[] = [
  // Primary Interactive Desktop Directories
  {
    id: 'desk-mhd',
    name: 'Macintosh HD',
    type: 'directory',
    path: '/Desktop/Macintosh HD',
    size: '--',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: 'Root Macintosh HD storage volume.'
  },
  {
    id: 'desk-doc',
    name: 'Documents',
    type: 'directory',
    path: '/Desktop/Documents',
    size: '--',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: 'All user text drafts, reports and creative manuscripts.'
  },
  {
    id: 'desk-dld',
    name: 'Downloads',
    type: 'directory',
    path: '/Desktop/Downloads',
    size: '--',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: 'Inbound browser packages and setup bundles.'
  },
  {
    id: 'desk-pic',
    name: 'Pictures',
    type: 'directory',
    path: '/Desktop/Pictures',
    size: '--',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: 'High resolution digital wallpapers and photography archives.'
  },
  {
    id: 'desk-trsh',
    name: 'Trash',
    type: 'directory',
    path: '/Desktop/Trash',
    size: '--',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: 'Discarded nodes stage before final deletion.'
  },
  {
    id: 'w1',
    name: 'Welcome to Macify OS.txt',
    type: 'file',
    path: '/Desktop/Welcome to Macify OS.txt',
    size: '1.2 KB',
    category: 'Desktop',
    lastModified: 'June 2026',
    content: `=========================================
WELCOME TO MACIFY OS FOR WINDOWS 11/10
=========================================

Macify OS provides a luxurious macOS Sequoia style shell running virtually on top of Windows.

🌟 CORE CAPABILITIES:
1. Multi-Window Management: Drag, resize, maximize, workspace zoom (Mission Control).
2. Dock Magnification: Responsive zoom with custom active-state indicators.
3. Windows Application Bridge: Virtual integration of Windows apps (VS Code, Spotify, Telegram, Edge, and more).
4. Full File System (Finder): Rich sidebar directories, copying, cutting, renaming, list/grid layouts.
5. Alt+Tab Switching: Easy quick key shortcut navigation.
6. Responsive launchpad & Spotlight (search).

Enjoy your ultimate macOS shell experience!
`
  },
  {
    id: 'f2',
    name: 'Project Ideas.txt',
    type: 'file',
    path: '/Documents/Project Ideas.txt',
    size: '250 Bytes',
    category: 'Documents',
    lastModified: 'Just now',
    content: `1. Port all native C++ Windows APIs into web-synthesized sandboxes.
2. Design elegant macOS Ventura/Sequoia canvas templates.
3. Build a local node runtime terminal command simulation.
4. Expand Alt+Tab switcher to save previous activity thumbnails.
`
  },
  {
    id: 'f3',
    name: 'mac_wallpaper_sonoma.png',
    type: 'file',
    path: '/Pictures/mac_wallpaper_sonoma.png',
    size: '4.8 MB',
    category: 'Pictures',
    lastModified: 'April 2026',
    content: '[Binary Image File - Sonoma Peak Scenic Grid]'
  },
  {
    id: 'd1',
    name: 'discord-x64-setup.exe',
    type: 'file',
    path: '/Downloads/discord-x64-setup.exe',
    size: '84.2 MB',
    category: 'Downloads',
    lastModified: 'Yesterday',
    content: '[Windows Application Installer Binary Node]'
  },
  {
    id: 'm1',
    name: 'Lofi Ambient Chill.mp3',
    type: 'file',
    path: '/Music/Lofi Ambient Chill.mp3',
    size: '6.4 MB',
    category: 'Music',
    lastModified: 'May 2026',
    content: '[Synthesized Stereo Audio Track - BPM 76]'
  }
];

export const MacifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Loading
  const loadSavedState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`macify_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [missionControlOpen, setMissionControlOpen] = useState(false);
  const [altTabOpen, setAltTabOpen] = useState(false);
  const [altTabActiveIndex, setAltTabActiveIndex] = useState(0);
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [workspaces, setWorkspaces] = useState<number[]>([1, 2]);
  const [dockApps, setDockAppsState] = useState<AppID[]>(() => loadSavedState('dock_apps', INITIAL_DOCK));
  const [bouncingApps, setBouncingApps] = useState<AppID[]>([]);
  
  // Custom Controls
  const [wifiConnected, setWifiConnected] = useState(true);
  const [bluetoothConnected, setBluetoothConnected] = useState(true);
  const [airDropOn, setAirDropOn] = useState(true);
  const [brightness, setBrightnessState] = useState(() => loadSavedState('brightness', 90));
  const [focusMode, setFocusMode] = useState(false);
  const [volume, setVolume] = useState(75);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isBatteryCharging, setIsBatteryCharging] = useState(false);
  const [isDarkMode, setDarkMode] = useState(() => loadSavedState('dark_mode', true));
  const [wallpaper, setWallpaperState] = useState<WallpaperConfig>(() => loadSavedState('wallpaper', WALLPAPERS[0]));
  
  // Custom & Interactive Wallpaper States
  const [favoriteWallpaperIds, setFavoriteWallpaperIdsState] = useState<string[]>(() => loadSavedState('fav_wallpapers', []));
  const [recentWallpaperIds, setRecentWallpaperIdsState] = useState<string[]>(() => loadSavedState('recent_wallpapers', [WALLPAPERS[0].id]));
  const [customWallpapers, setCustomWallpapersState] = useState<WallpaperConfig[]>(() => loadSavedState('custom_wallpapers', []));
  const [firstLaunchCompleted, setFirstLaunchCompletedState] = useState<boolean>(() => loadSavedState('first_launch_completed', false));
  const [timeBasedWallpaperActive, setTimeBasedWallpaperActiveState] = useState<boolean>(() => loadSavedState('time_based_wallpaper', false));

  // System Running Engine States
  const [isSystemRunning, setIsSystemRunningState] = useState<boolean>(() => loadSavedState('system_running', true));
  const [isBooting, setIsBooting] = useState<boolean>(() => {
    const running = loadSavedState('system_running', true);
    return running;
  });

  const allWallpapers = [...WALLPAPERS, ...customWallpapers];
  const [windowsAgentConnected, setWindowsAgentConnected] = useState(true);

  // Live dynamic Windows applications and system apps list
  const [allApps, setAllAppsState] = useState<AppConfig[]>(() => loadSavedState('all_apps', INITIAL_APPS));

  const setAllApps = (nextApps: AppConfig[]) => {
    setAllAppsState(nextApps);
    try { localStorage.setItem('macify_all_apps', JSON.stringify(nextApps)); } catch (e) {}
    if (window.macifyAPI) {
      window.macifyAPI.saveLocalDataItem('all_apps', 'all_apps', 'all_apps', nextApps).catch(err => {
        console.error('Failed to sync installed apps to SQLite:', err);
      });
    }
  };

  // System Preferences States
  const [dockSize, setDockSizeState] = useState(() => loadSavedState('dock_size', 48));
  const [dockMagnification, setDockMagnificationState] = useState(() => loadSavedState('dock_magnification', 1.35));
  const [displayResolution, setDisplayResolutionState] = useState(() => loadSavedState('display_resolution', '1920x1080 (Retina Display)'));
  const [displayArrangement, setDisplayArrangementState] = useState(() => loadSavedState('display_arrangement', 'Extended Desktop'));
  const [soundOutput, setSoundOutputState] = useState(() => loadSavedState('sound_output', 'System Speakers (Realtek High Definition Audio)'));
  const [soundInput, setSoundInputState] = useState(() => loadSavedState('sound_input', 'Internal Microphone (Intel Smart Sound Technology)'));
  const [activeNetwork, setActiveNetworkState] = useState(() => loadSavedState('active_network', 'Home-Lan-5G (Wi-Fi 6)'));

  const setDockSize = (val: number) => {
    setDockSizeState(val);
    try { localStorage.setItem('macify_dock_size', JSON.stringify(val)); } catch (e) {}
  };
  const setDockMagnification = (val: number) => {
    setDockMagnificationState(val);
    try { localStorage.setItem('macify_dock_magnification', JSON.stringify(val)); } catch (e) {}
  };
  const setDisplayResolution = (val: string) => {
    setDisplayResolutionState(val);
    try { localStorage.setItem('macify_display_resolution', JSON.stringify(val)); } catch (e) {}
  };
  const setDisplayArrangement = (val: string) => {
    setDisplayArrangementState(val);
    try { localStorage.setItem('macify_display_arrangement', JSON.stringify(val)); } catch (e) {}
  };
  const setSoundOutput = (val: string) => {
    setSoundOutputState(val);
    try { localStorage.setItem('macify_sound_output', JSON.stringify(val)); } catch (e) {}
  };
  const setSoundInput = (val: string) => {
    setSoundInputState(val);
    try { localStorage.setItem('macify_sound_input', JSON.stringify(val)); } catch (e) {}
  };
  const setActiveNetwork = (val: string) => {
    setActiveNetworkState(val);
    try { localStorage.setItem('macify_active_network', JSON.stringify(val)); } catch (e) {}
  };

  const setBrightness = (val: number) => {
    setBrightnessState(val);
    try { localStorage.setItem('macify_brightness', JSON.stringify(val)); } catch (e) {}
  };

  const addWorkspace = () => {
    setWorkspaces(prev => {
      const nextNum = prev.length > 0 ? Math.max(...prev) + 1 : 1;
      const updated = [...prev, nextNum];
      addNotification('Workspace Created', `Added Desktop ${nextNum}`, 'Mission Control');
      return updated;
    });
  };

  const deleteWorkspace = (num: number) => {
    if (workspaces.length <= 1) {
      alert('Keep at least one desktop workspace active.');
      return;
    }
    setWorkspaces(prev => prev.filter(w => w !== num));
    if (activeWorkspace === num) {
      setActiveWorkspace(prev => {
        const remaining = workspaces.filter(w => w !== num);
        return remaining[0] || 1;
      });
    }
    addNotification('Workspace Deleted', `Removed Desktop ${num}`, 'Mission Control');
  };

  const triggerAppBounce = (appId: AppID) => {
    setBouncingApps(prev => [...prev, appId]);
    setTimeout(() => {
      setBouncingApps(prev => prev.filter(id => id !== appId));
    }, 1800);
  };

  // Focus tracking / Spotlight search
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Time & Localization Customization States
  const [clockFormat, setClockFormatState] = useState<'short' | 'long'>(() => loadSavedState('clock_format', 'short'));
  const [worldClockCities, setWorldClockCitiesState] = useState<string[]>(() => loadSavedState('world_clock_cities', ['Kigali', 'London', 'Tokyo', 'New York']));
  
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [longDateString, setLongDateString] = useState('');

  // Auto-detected Host Windows variables
  const [systemTimezone, setSystemTimezone] = useState('');
  const [systemGmtOffset, setSystemGmtOffset] = useState('');
  const [systemLocale, setSystemLocale] = useState('');
  const [systemRegion, setSystemRegion] = useState('');
  const [systemLanguage, setSystemLanguage] = useState('');

  const setClockFormat = (format: 'short' | 'long') => {
    setClockFormatState(format);
    try { localStorage.setItem('macify_clock_format', JSON.stringify(format)); } catch (e) {}
  };

  const setWorldClockCities = (cities: string[]) => {
    setWorldClockCitiesState(cities);
    try { localStorage.setItem('macify_world_clock_cities', JSON.stringify(cities)); } catch (e) {}
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'nt1',
      title: 'Windows Agent Activated',
      message: 'Windows Application Proxy connects securely. Virtual ports optimized for real Windows launch feedback.',
      time: 'Just now',
      app: 'Settings'
    },
    {
      id: 'nt2',
      title: 'Welcome to your Mac Dock',
      message: 'Hover to experience beautiful hardware accelerated macOS Magnification.',
      time: '1m ago',
      app: 'Finder'
    }
  ]);

  // Simulated Persistent LocalStorage Files
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(() => loadSavedState('filesystem', INITIAL_FILES));
  const [clipboard, setClipboard] = useState<{ node: FileSystemNode; mode: 'copy' | 'cut' } | null>(null);

  // Compute Active Application text based on focused window
  const getActiveAppName = (): AppID | 'Finder' => {
    if (focusedWindowId) {
      const activeWin = windows.find(w => w.id === focusedWindowId);
      if (activeWin) return activeWin.appId;
    }
    return 'Finder';
  };
  const activeAppId = getActiveAppName();

  useEffect(() => {
    const updateTimeAndMetrics = () => {
      const now = new Date();
      
      // Dynamic Clock Formatting matching user preference and detected locale parameters
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDateString(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      setLongDateString(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));

      // Autodetect host parameters dynamically
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      setSystemTimezone(tz);

      // Compute GMT Offset string
      try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'longOffset' }).formatToParts(now);
        const oVal = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+0';
        const cleanedOffset = oVal.replace(/GMT([-+])0?(\d+):00/, "GMT$1$2").replace("GMT-00", "GMT+0").replace("GMT+00", "GMT+0");
        setSystemGmtOffset(cleanedOffset);
      } catch (e) {
        setSystemGmtOffset('GMT+0');
      }

      // Locale
      const loc = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || 'en-US';
      setSystemLocale(loc);

      // Parse Language & Region
      const [langCode, regionCode] = loc.split('-');
      
      let lang = 'English';
      try {
        const dNames = new Intl.DisplayNames(['en'], { type: 'language' });
        lang = dNames.of(langCode) || 'English';
      } catch (e) {
        const fallbackLangs: Record<string, string> = { en: 'English', fr: 'French', es: 'Spanish', de: 'German', ja: 'Japanese', zh: 'Chinese', rw: 'Kinyarwanda' };
        lang = fallbackLangs[langCode] || langCode;
      }
      setSystemLanguage(lang);

      let reg = 'United States';
      try {
        let rCode = regionCode;
        if (!rCode) {
          if (tz.includes('Kigali')) rCode = 'RW';
          else if (tz.includes('London')) rCode = 'GB';
          else if (tz.includes('Tokyo')) rCode = 'JP';
          else if (tz.includes('Paris')) rCode = 'FR';
          else rCode = 'US';
        }
        const rNames = new Intl.DisplayNames(['en'], { type: 'region' });
        reg = rNames.of(rCode) || 'United States';
      } catch (e) {
        const fallbackRegions: Record<string, string> = { US: 'United States', GB: 'United Kingdom', RW: 'Rwanda', JP: 'Japan', FR: 'France', DE: 'Germany' };
        reg = fallbackRegions[regionCode] || regionCode || 'United States';
      }
      setSystemRegion(reg);
    };

    updateTimeAndMetrics();
    const timer = setInterval(updateTimeAndMetrics, 1000);
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------
  // OFFLINE SQLite SYNC & PERSISTENCE
  // ----------------------------------------------------
  // A. Load Settings, FileSystem, and Installed Apps on Mount
  useEffect(() => {
    if (window.macifyAPI) {
      // 1. Load Settings
      window.macifyAPI.getLocalSettings().then((settings) => {
        if (settings) {
          if (settings.isDarkMode !== undefined) setDarkMode(settings.isDarkMode);
          if (settings.dockSize !== undefined) setDockSizeState(settings.dockSize);
          if (settings.dockMagnification !== undefined) setDockMagnificationState(settings.dockMagnification);
          if (settings.brightness !== undefined) setBrightnessState(settings.brightness);
          if (settings.volume !== undefined) setVolume(settings.volume);
        }
      }).catch(err => {
        console.error('Failed to load local settings from SQLite:', err);
      });

      // 2. Load FileSystem
      window.macifyAPI.getLocalDataItems('filesystem').then((items) => {
        const fsItem = items.find(item => item.id === 'virtual_disk');
        if (fsItem && Array.isArray(fsItem.value)) {
          setFileSystem(fsItem.value);
        }
      }).catch(err => {
        console.error('Failed to load virtual disk from SQLite:', err);
      });

      // 3. Load Apps
      window.macifyAPI.getLocalDataItems('all_apps').then((items) => {
        const appItem = items.find(item => item.id === 'all_apps');
        if (appItem && Array.isArray(appItem.value)) {
          setAllAppsState(appItem.value);
        }
      }).catch(err => {
        console.error('Failed to load apps from SQLite:', err);
      });
    }
  }, []);

  // B. Save Settings Reactively When They Change
  useEffect(() => {
    if (window.macifyAPI) {
      window.macifyAPI.saveLocalSettings({
        isDarkMode,
        dockSize,
        dockMagnification,
        brightness,
        volume,
        clockFormat: 'short'
      }).catch(err => {
        console.error('Failed to sync settings to SQLite:', err);
      });
    }
  }, [isDarkMode, dockSize, dockMagnification, brightness, volume]);

  // Simulating small battery discharges
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 1) return 100; // recharge loop inside sandbox
        return prev - 1;
      });
    }, 120000);
    return () => clearInterval(batteryTimer);
  }, []);

  // Sync state to localstorage
  const setWallpaper = (wp: WallpaperConfig) => {
    setWallpaperState(wp);
    localStorage.setItem('macify_wallpaper', JSON.stringify(wp));

    // Add to recent queue
    setRecentWallpaperIdsState(prev => {
      const filtered = prev.filter(id => id !== wp.id);
      const updated = [wp.id, ...filtered].slice(0, 8);
      localStorage.setItem('macify_recent_wallpapers', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteWallpaper = (id: string) => {
    setFavoriteWallpaperIdsState(prev => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('macify_fav_wallpapers', JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomWallpaper = (name: string, url: string, isGradientOrColor?: boolean) => {
    const newWp: WallpaperConfig = {
      id: `custom-${Date.now()}`,
      name,
      type: isGradientOrColor ? 'gradient' : 'image',
      value: url,
      category: 'custom',
      themeSupport: 'light'
    };
    setCustomWallpapersState(prev => {
      const updated = [...prev, newWp];
      localStorage.setItem('macify_custom_wallpapers', JSON.stringify(updated));
      return updated;
    });
    setWallpaper(newWp);
    addNotification('Wallpaper Added', `Successfully imported custom wallpaper style "${name}"`, 'System Settings');
  };

  const setFirstLaunchCompleted = (completed: boolean) => {
    setFirstLaunchCompletedState(completed);
    localStorage.setItem('macify_first_launch_completed', JSON.stringify(completed));
  };

  const setTimeBasedWallpaperActive = (active: boolean) => {
    setTimeBasedWallpaperActiveState(active);
    localStorage.setItem('macify_time_based_wallpaper', JSON.stringify(active));
    if (active) {
      addNotification('Time-Based Shifts', 'Active theme and wallpaper will adjust automatically to your local sunset/sunrise.', 'Settings');
    }
  };

  // Automatic Theme Switching & Dynamic Wallpaper switching
  useEffect(() => {
    if (timeBasedWallpaperActive) {
      const checkAndSwitchThemeByTime = () => {
        const hour = new Date().getHours();
        const shouldBeDark = hour >= 18 || hour < 6;
        if (isDarkMode !== shouldBeDark) {
          setDarkMode(shouldBeDark);
          try { localStorage.setItem('macify_dark_mode', JSON.stringify(shouldBeDark)); } catch (e) {}
          addNotification('Theme Switched', shouldBeDark ? 'Dark Theme activated based on sundown.' : 'Light Theme activated based on sunrise.', 'System Preferences');
        }
      };
      
      checkAndSwitchThemeByTime();
      const interval = setInterval(checkAndSwitchThemeByTime, 15000); // Check every 15 seconds
      return () => clearInterval(interval);
    }
  }, [timeBasedWallpaperActive, isDarkMode]);

  const setDockApps = (newApps: AppID[]) => {
    setDockAppsState(newApps);
    localStorage.setItem('macify_dock_apps', JSON.stringify(newApps));
  };

  const updateLocalStorageFileSystem = (fs: FileSystemNode[]) => {
    localStorage.setItem('macify_filesystem', JSON.stringify(fs));
    if (window.macifyAPI) {
      window.macifyAPI.saveLocalDataItem('filesystem', 'virtual_disk', 'virtual_disk', fs).catch(err => {
        console.error('Failed to sync filesystem to SQLite:', err);
      });
    }
  };

  // Window actions
  const openApp = (appId: AppID, params?: any) => {
    triggerAppBounce(appId);
    
    // Natively launch file/program if running in Electron environment
    const targetApp = allApps.find(a => a.id === appId);
    if (targetApp && targetApp.exePath && window.macifyAPI) {
      window.macifyAPI.openApp(targetApp.exePath).catch(err => {
        console.error('Native launch execution failed:', err);
      });
    }
    
    // Ensure the app is in the dock list
    setDockAppsState(prevDock => {
      if (!prevDock.includes(appId)) {
        const nextDock = [...prevDock, appId];
        try { localStorage.setItem('macify_dock_apps', JSON.stringify(nextDock)); } catch (e) {}
        return nextDock;
      }
      return prevDock;
    });

    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        // If it already exists, unminimize and bring it to front
        const maxZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) + 1 : 10;
        setTimeout(() => {
          setFocusedWindowId(existing.id);
        }, 0);
        return prev.map(w => (w.id === existing.id ? { ...w, isMinimized: false, zIndex: maxZ } : w));
      }

      // If opening new window, determine style values
      const nextZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) + 1 : 10;
      const defaultWidth = appId === 'calculator' ? 320 : appId === 'terminal' ? 650 : 800;
      const defaultHeight = appId === 'calculator' ? 460 : appId === 'terminal' ? 420 : 540;
      const offset = (prev.length % 5) * 30;

      // Unique ID using timestamp + random suffix to guarantee uniqueness
      const uniqueId = `${appId}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      const newWindow: WindowInstance = {
        id: uniqueId,
        appId,
        title: INITIAL_APPS.find(a => a.id === appId)?.name || 'Window',
        isMinimized: false,
        isMaximized: false,
        x: 120 + offset,
        y: 90 + offset,
        width: defaultWidth,
        height: defaultHeight,
        zIndex: nextZ,
        params
      };

      setTimeout(() => {
        setFocusedWindowId(uniqueId);
      }, 0);

      return [...prev, newWindow];
    });
  };

  const closeApp = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (focusedWindowId === windowId) {
      const remaining = windows.filter(w => w.id !== windowId);
      if (remaining.length > 0) {
        // find highest zIndex
        const highest = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current));
        setFocusedWindowId(highest.id);
      } else {
        setFocusedWindowId(null);
      }
    }
  };

  const minimizeApp = (windowId: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
    // Focus next available window
    const remaining = windows.filter(w => w.id !== windowId && !w.isMinimized);
    if (remaining.length > 0) {
      const highest = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current));
      setFocusedWindowId(highest.id);
    } else {
      setFocusedWindowId(null);
    }
  };

  const toggleMaximizeApp = (windowId: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusApp = (windowId: string) => {
    setWindows(prev => {
      const nextZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) + 1 : 10;
      return prev.map(w => (w.id === windowId ? { ...w, zIndex: nextZ, isMinimized: false } : w));
    });
    setFocusedWindowId(windowId);
  };

  const toggleSpotlight = () => setSpotlightOpen(prev => !prev);
  const toggleControlCenter = () => {
    setShowControlCenter(prev => !prev);
    setShowNotificationCenter(false);
  };
  const toggleNotificationCenter = () => {
    setShowNotificationCenter(prev => !prev);
    setShowControlCenter(false);
  };

  const addNotification = (title: string, message: string, app: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Now',
      app
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const stopSystem = () => {
    setWindows([]);
    setFocusedWindowId(null);
    setIsSystemRunningState(false);
    setIsBooting(false);
    try { localStorage.setItem('macify_system_running', JSON.stringify(false)); } catch (e) {}
    addNotification('🛑 Engine Stopped', 'Macify OS has been stopped successfully. Virtual system resources released.', 'System Kernel');
  };

  const startSystem = () => {
    setIsSystemRunningState(true);
    setIsBooting(true);
  };

  // PWA Service Worker & Network Connection Listeners
  useEffect(() => {
    // 1. Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registered successfully with scope: ', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    }

    // 2. Online/offline event listeners
    const handleOnline = () => {
      addNotification('📶 Online Mode', 'Your device is back online. Internet services synchronized.', 'System Kernel');
    };
    const handleOffline = () => {
      addNotification('📡 Offline Mode', 'Your device is offline. Macify OS will continue to run with local features.', 'System Kernel');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // File System Implementation
  const createFile = (name: string, category: FileSystemNode['category'], type: 'file' | 'directory', content?: string) => {
    const path = `/${category}/${name}`;
    const size = type === 'directory' ? '--' : `${(content?.length || 0) * 2} Bytes`;
    const newFile: FileSystemNode = {
      id: `file-${Date.now()}`,
      name,
      type,
      path,
      size,
      category,
      content: content || '',
      lastModified: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const nextFs = [...fileSystem, newFile];
    setFileSystem(nextFs);
    updateLocalStorageFileSystem(nextFs);
    addNotification(`${type === 'directory' ? 'Folder' : 'File'} Created`, `Created "${name}" in ${category}`, 'Finder');
  };

  const deleteNode = (id: string) => {
    const targetNode = fileSystem.find(f => f.id === id);
    if (!targetNode) return;

    const nextFs = fileSystem.filter(f => f.id !== id);
    setFileSystem(nextFs);
    updateLocalStorageFileSystem(nextFs);
    addNotification('Moved to Trash', `Deleted "${targetNode.name}"`, 'Finder');
  };

  const updateFileContent = (id: string, content: string) => {
    const nextFs = fileSystem.map(f => {
      if (f.id === id) {
        return {
          ...f,
          content,
          size: `${content.length * 2} Bytes`,
          lastModified: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return f;
    });
    setFileSystem(nextFs);
    updateLocalStorageFileSystem(nextFs);
  };

  const renameNode = (id: string, newName: string) => {
    const targetNode = fileSystem.find(f => f.id === id);
    if (!targetNode) return;

    const nextFs = fileSystem.map(f => {
      if (f.id === id) {
        // Adjust path
        const parentPath = f.path.substring(0, f.path.lastIndexOf('/'));
        const newPath = `${parentPath}/${newName}`;
        return {
          ...f,
          name: newName,
          path: newPath,
          lastModified: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return f;
    });
    setFileSystem(nextFs);
    updateLocalStorageFileSystem(nextFs);
  };

  const copyNode = (node: FileSystemNode) => {
    setClipboard({ node, mode: 'copy' });
  };

  const cutNode = (node: FileSystemNode) => {
    setClipboard({ node, mode: 'cut' });
  };

  const pasteNode = (destinationCategory: FileSystemNode['category']) => {
    if (!clipboard) return;
    const { node, mode } = clipboard;

    if (mode === 'copy') {
      // Create duplicate
      const copyName = node.name.includes('.') 
        ? `${node.name.split('.')[0]} Copy.${node.name.split('.').slice(1).join('.')}`
        : `${node.name} Copy`;
      createFile(copyName, destinationCategory, node.type, node.content);
    } else {
      // Cut/Move
      const nextFs = fileSystem.map(f => {
        if (f.id === node.id) {
          return {
            ...f,
            category: destinationCategory,
            path: `/${destinationCategory}/${f.name}`
          };
        }
        return f;
      });
      setFileSystem(nextFs);
      updateLocalStorageFileSystem(nextFs);
      addNotification('Folder Moved', `Moved "${node.name}" to ${destinationCategory}`, 'Finder');
    }
    setClipboard(null);
  };

  const moveNode = (id: string, destinationCategory: FileSystemNode['category']) => {
    const targetNode = fileSystem.find(f => f.id === id);
    if (!targetNode) return;

    const nextFs = fileSystem.map(f => {
      if (f.id === id) {
        return {
          ...f,
          category: destinationCategory,
          path: `/${destinationCategory}/${f.name}`
        };
      }
      return f;
    });
    setFileSystem(nextFs);
    updateLocalStorageFileSystem(nextFs);
    addNotification('File Moved', `Moved "${targetNode.name}" to ${destinationCategory}`, 'Finder');
  };

  const toggleFavoriteApp = (appId: string) => {
    const updated = allApps.map(app => {
      if (app.id === appId) {
        const nextFav = !app.isFavorite;
        addNotification(
          nextFav ? 'Added to Favorites' : 'Removed from Favorites',
          `"${app.name}" is ${nextFav ? 'now' : 'no longer'} in your favorite workspace shortcuts.`,
          'Launchpad'
        );
        return { ...app, isFavorite: nextFav };
      }
      return app;
    });
    setAllApps(updated);
  };

  const togglePinApp = (appId: string) => {
    const isPinned = dockApps.includes(appId);
    if (isPinned) {
      setDockApps(dockApps.filter(id => id !== appId));
      addNotification('Unpinned App', `"${allApps.find(a => a.id === appId)?.name}" unpinned from dock.`, 'Launchpad');
    } else {
      setDockApps([...dockApps, appId]);
      addNotification('Pinned App', `"${allApps.find(a => a.id === appId)?.name}" pinned to the dock!`, 'Launchpad');
    }
  };

  const addCustomApp = (newApp: AppConfig) => {
    if (allApps.some(app => app.id === newApp.id)) {
      addNotification('Installation Skipped', `App ${newApp.name} is already registered.`, 'Win32 Setup Wizard');
      return;
    }
    const updated = [...allApps, { ...newApp, isFavorite: false }];
    setAllApps(updated);
    
    // Auto-pin to dock
    setDockApps([...dockApps, newApp.id]);

    addNotification(
      'Application Installed',
      `"${newApp.name}" registered successfully. Macify icon generated in 4K resolution!`,
      'Win32 Setup Wizard'
    );
  };

  const scanWindowsApps = async (onStep?: (msg: string) => void) => {
    if (window.macifyAPI) {
      const steps = [
        'Interrogating host files and directories...',
        'Scanning Windows registry hives (HKLM, HKCU)...',
        'Auto-generating premium Cupertino representational assets...'
      ];
      for (const step of steps) {
        if (onStep) onStep(step);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      try {
        let addedCount = 0;
        const currentApps = [...allApps];
        const nativeApps = await window.macifyAPI.scanApps();
        nativeApps.forEach(app => {
          const existingIdx = currentApps.findIndex(a => a.id === app.id);
          if (existingIdx >= 0) {
            currentApps[existingIdx] = {
              ...currentApps[existingIdx],
              exePath: app.exePath,
              isInstalled: true
            };
          } else {
            currentApps.push({ ...app, isFavorite: false });
            addedCount++;
          }
        });
        if (addedCount > 0) {
          setAllApps(currentApps);
          addNotification(
            'Discovery Engine Complete',
            `Discovered & optimized ${addedCount} new Windows apps successfully!`,
            'Win32 Setup Wizard'
          );
        } else {
          addNotification(
            'Discovery Engine Run',
            'Scan completed. All local Windows programs are already integrated.',
            'Win32 Setup Wizard'
          );
        }
      } catch (err) {
        console.error('Electron host scan failure:', err);
      }
      return;
    }

    const steps = [
      'Scanning Windows registry hives (HKLM, HKCU)...',
      'Crawling C:\\Program Files (x86) directory...',
      'Analyzing C:\\Program Files structures...',
      'Locating Start Menu registry folders...',
      'Parsing Desktop shortcuts & .lnk files...',
      'Auto-generating premium Cupertino glassmorphic representations...',
      'Synchronizing Windows agent registry database...'
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onStep) onStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const appsToDiscover: AppConfig[] = [
      {
        id: 'vlc',
        name: 'VLC Media Player',
        icon: 'Play',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
        registryKey: 'HKLM\\Software\\VideoLAN\\VLC',
        windowsCategory: 'Media',
        brandColor: '#FF5A00',
        isFavorite: false
      },
      {
        id: 'obs',
        name: 'OBS Studio',
        icon: 'Video',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe',
        registryKey: 'HKLM\\Software\\OBS Studio',
        windowsCategory: 'Media',
        brandColor: '#1D1F21',
        isFavorite: false
      },
      {
        id: 'steam',
        name: 'Steam Client',
        icon: 'Gamepad',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files (x85)\\Steam\\steam.exe',
        registryKey: 'HKCU\\Software\\Valve\\Steam',
        windowsCategory: 'Gaming',
        brandColor: '#171A21',
        isFavorite: false
      },
      {
        id: 'photoshop',
        name: 'Adobe Photoshop',
        icon: 'Palette',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\Adobe\\Adobe Photoshop\\Photoshop.exe',
        registryKey: 'HKLM\\Software\\Adobe\\Photoshop',
        windowsCategory: 'Media',
        brandColor: '#002244',
        isFavorite: false
      },
      {
        id: 'notepadplusplus',
        name: 'Notepad++',
        icon: 'FileText',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\Notepad++\\notepad++.exe',
        registryKey: 'HKLM\\Software\\Notepad++',
        windowsCategory: 'Developer',
        brandColor: '#3A9D23',
        isFavorite: false
      },
      {
        id: 'word',
        name: 'Microsoft Word',
        icon: 'FileText',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE',
        registryKey: 'HKLM\\Software\\Microsoft\\Office\\16.0\\Word',
        windowsCategory: 'Office',
        brandColor: '#2B579A',
        isFavorite: false
      },
      {
        id: 'excel',
        name: 'Microsoft Excel',
        icon: 'Grid',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE',
        registryKey: 'HKLM\\Software\\Microsoft\\Office\\16.0\\Excel',
        windowsCategory: 'Office',
        brandColor: '#217346',
        isFavorite: false
      },
      {
        id: 'powerpoint',
        name: 'Microsoft PowerPoint',
        icon: 'Presentation',
        isWindowsNative: true,
        category: 'windows',
        exePath: 'C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE',
        registryKey: 'HKLM\\Software\\Microsoft\\Office\\16.0\\PowerPoint',
        windowsCategory: 'Office',
        brandColor: '#B7472A',
        isFavorite: false
      }
    ];

    // Filter only those not already discovered in allApps
    let addedCount = 0;
    const currentApps = [...allApps];
    appsToDiscover.forEach(app => {
      if (!currentApps.some(a => a.id === app.id)) {
        currentApps.push(app);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setAllApps(currentApps);
      addNotification(
        'Discovery Engine Complete',
        `Discovered & optimized ${addedCount} new Windows apps successfully!`,
        'Win32 Setup Wizard'
      );
    } else {
      addNotification(
        'Discovery Engine Run',
        'Scan completed. All local Windows programs are already integrated.',
        'Win32 Setup Wizard'
      );
    }
  };

  return (
    <StoreContext.Provider
      value={{
        windows,
        focusedWindowId,
        launchpadOpen,
        missionControlOpen,
        altTabOpen,
        altTabActiveIndex,
        activeAppId,
        wifiConnected,
        bluetoothConnected,
        airDropOn,
        brightness,
        focusMode,
        volume,
        batteryLevel,
        isBatteryCharging,
        timeString,
        dateString,
        isDarkMode,
        spotlightOpen,
        showControlCenter,
        showNotificationCenter,
        activeWorkspace,
        workspaces,
        windowsAgentConnected,
        wallpaper,
        dockApps,
        bouncingApps,
        allApps,
        notifications,
        fileSystem,
        clipboard,
        openApp,
        closeApp,
        minimizeApp,
        toggleMaximizeApp,
        focusApp,
        setLaunchpadOpen,
        setMissionControlOpen,
        setAltTabOpen,
        setAltTabActiveIndex,
        setWallpaper,
        setWifiConnected,
        setBluetoothConnected,
        setAirDropOn,
        setBrightness,
        setFocusMode,
        addWorkspace,
        deleteWorkspace,
        triggerAppBounce,
        setVolume,
        setDarkMode,
        toggleSpotlight,
        toggleControlCenter,
        toggleNotificationCenter,
        addNotification,
        clearNotification,
        createFile,
        deleteNode,
        updateFileContent,
        renameNode,
        copyNode,
        cutNode,
        pasteNode,
        moveNode,
        setDockApps,
        setWindowsAgentConnected,
        setBatteryLevel,
        setIsBatteryCharging,
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
        allWallpapers,
        favoriteWallpaperIds,
        recentWallpaperIds,
        firstLaunchCompleted,
        timeBasedWallpaperActive,
        toggleFavoriteWallpaper,
        addCustomWallpaper,
        setFirstLaunchCompleted,
        setTimeBasedWallpaperActive,
        toggleFavoriteApp,
        togglePinApp,
        addCustomApp,
        scanWindowsApps,
        clockFormat,
        setClockFormat,
        worldClockCities,
        setWorldClockCities,
        longDateString,
        systemTimezone,
        systemGmtOffset,
        systemLocale,
        systemRegion,
        systemLanguage,
        isSystemRunning,
        startSystem,
        stopSystem,
        isBooting,
        setIsBooting,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useMacify = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useMacify must be used within a MacifyProvider');
  }
  return context;
};
