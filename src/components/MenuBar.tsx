import React, { useState, useRef, useEffect } from 'react';
import { useMacify } from '../store';
import { Apple, Wifi, Battery, Volume2, Search, Sliders, Bell, User, Moon, Sun, Monitor, HelpCircle, HardDrive, Cpu, RefreshCw, Key, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AppLogo from './AppLogo';
import WorldClockWidget from './WorldClockWidget';

export default function MenuBar() {
  const {
    timeString,
    dateString,
    clockFormat,
    longDateString,
    wifiConnected,
    bluetoothConnected,
    airDropOn,
    brightness,
    focusMode,
    volume,
    batteryLevel,
    isBatteryCharging,
    setBatteryLevel,
    setIsBatteryCharging,
    isDarkMode,
    activeAppId,
    allApps,
    notifications,
    setWifiConnected,
    setBluetoothConnected,
    setAirDropOn,
    setBrightness,
    setFocusMode,
    setVolume,
    setDarkMode,
    openApp,
    closeApp,
    minimizeApp,
    toggleMaximizeApp,
    focusedWindowId,
    toggleSpotlight,
    showControlCenter,
    toggleControlCenter,
    showNotificationCenter,
    toggleNotificationCenter,
    clearNotification,
    windowsAgentConnected,
    setWindowsAgentConnected,
    createFile,
    pasteNode,
    stopSystem
  } = useMacify();

  const [helpOpen, setHelpOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeShortcutTab, setActiveShortcutTab] = useState<'all' | 'nav' | 'window' | 'files'>('all');
  const [shortcutSearch, setShortcutSearch] = useState('');

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click and handle global shortcuts
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Toggle Keyboard Shortcuts cheat sheet modal with Alt + Cmd/Ctrl + K or Alt + Cmd/Ctrl + H
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (e.altKey && isCmdOrCtrl && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        setHelpOpen(prev => !prev);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const currentAppMeta = allApps.find(a => a.id === activeAppId);
  const currentAppName = currentAppMeta ? currentAppMeta.name : 'Finder';

  // Toggle WiFi / Dark / Agent
  const toggleWiFi = () => setWifiConnected(!wifiConnected);
  const toggleAgent = () => setWindowsAgentConnected(!windowsAgentConnected);

  return (
    <div
      ref={menuBarRef}
      className={`fixed top-0 left-0 right-0 h-6 select-none z-50 flex items-center justify-between px-4 text-xs font-medium transition-colors duration-300 border-b ${
        isDarkMode
          ? 'bg-neutral-900/75 border-neutral-850 text-white'
          : 'bg-white/75 border-neutral-200 text-neutral-900'
      } backdrop-blur-md`}
      id="macify-menu-bar"
    >
      {/* Left items */}
      <div className="flex items-center space-x-4">
        {/* Apple Logo Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('apple')}
            className={`cursor-pointer px-2 py-0.5 rounded transition-all duration-150 ease-out ${
              activeMenu === 'apple' 
                ? 'bg-neutral-250/35 dark:bg-white/25 scale-[0.97] shadow-inner' 
                : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]'
            } flex items-center justify-center`}
          >
            <AppLogo size={14} className="fill-current text-white dark:text-neutral-200" />
          </button>
          <AnimatePresence>
            {activeMenu === 'apple' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 } as any}
                className={`absolute left-0 mt-1 w-56 rounded-lg shadow-lg border p-1 border-neutral-200 dark:border-neutral-800 ${
                  isDarkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-white text-neutral-850'
                }`}
              >
                <button
                  onClick={() => { openApp('settings', { tab: 'about' }); setActiveMenu(null); }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left transition duration-150"
                >
                  <HelpCircle size={14} className="mr-2.5 text-neutral-400" />
                  About Macify OS
                </button>
                <button
                  onClick={() => { openApp('settings'); setActiveMenu(null); }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left transition duration-150"
                >
                  <Sliders size={14} className="mr-2.5 text-neutral-400" />
                  System Preferences...
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => { toggleAgent(); setActiveMenu(null); }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left transition duration-150"
                >
                  <Monitor size={14} className="mr-2.5 text-neutral-450" />
                  {windowsAgentConnected ? 'Disconnect Windows Agent' : 'Connect Windows Agent'}
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => window.location.reload()}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left transition duration-150"
                >
                  <RefreshCw size={14} className="mr-2.5 text-neutral-450" />
                  Restart Shell
                </button>
                <button
                  onClick={() => { alert('Macify OS shell locked. Click anywhere to return.'); setActiveMenu(null); }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left text-rose-500 font-medium transition duration-150"
                >
                  <LogOut size={14} className="mr-2.5 text-rose-450" />
                  Lock Desktop Environment
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => { stopSystem(); setActiveMenu(null); }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-rose-600 hover:text-white rounded-md text-left text-red-500 font-bold transition duration-150"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2.5">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
                  </svg>
                  Shutdown Macify Shell
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Focused App Dropdown */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('app')}
            className={`cursor-pointer px-2 py-0.5 rounded font-bold tracking-wide transition-all duration-150 ease-out ${
              activeMenu === 'app' 
                ? 'bg-neutral-250/35 dark:bg-white/25 scale-[0.97] shadow-inner' 
                : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]'
            }`}
          >
            {currentAppName}
          </button>
          <AnimatePresence>
            {activeMenu === 'app' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 } as any}
                className={`absolute left-0 mt-1 w-48 rounded-lg shadow-lg border p-1 border-neutral-200 dark:border-neutral-800 ${
                  isDarkMode ? 'bg-neutral-950 text-neutral-200' : 'bg-white text-neutral-850'
                }`}
              >
                <div className="px-3 py-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  {currentAppName} App
                </div>
                <button
                  onClick={() => {
                    openApp('settings');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left transition duration-150"
                >
                  Preferences...
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    alert(`${currentAppName} has been reset.`);
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-md text-left text-amber-500 transition duration-150"
                >
                  Force Reload App
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Interactive Menus */}
        <div className="hidden sm:flex items-center space-x-1">
          {[
            {
              id: 'file',
              label: 'File',
              items: [
                { label: 'New Folder', shortcut: '⇧⌘N', action: () => createFile('New Folder', 'Desktop', 'directory') },
                { label: 'New Rich File', shortcut: '⌘N', action: () => createFile('notes-' + Math.floor(Math.random() * 100) + '.txt', 'Desktop', 'file', 'Macify OS dynamic rich editor buffered content.') },
                { type: 'separator' },
                { label: 'Close Window', shortcut: '⌘W', action: () => { if (focusedWindowId) closeApp(focusedWindowId); } },
                { label: 'System Lock', shortcut: '⌃⌘Q', action: () => alert('Macify OS shell locked. Click anywhere to return.') }
              ]
            },
            {
              id: 'edit',
              label: 'Edit',
              items: [
                { label: 'Undo Action', shortcut: '⌘Z', action: () => alert('Undo last GUI action successful.') },
                { label: 'Redo Action', shortcut: '⇧⌘Z', action: () => alert('Redo state buffer updated.') },
                { type: 'separator' },
                { label: 'Cut Target', shortcut: '⌘X', action: () => alert('Item cut to clip registry. Navigate folders to paste.') },
                { label: 'Copy Target', shortcut: '⌘C', action: () => alert('File node address copied to context.') },
                { label: 'Paste Clipboard', shortcut: '⌘V', action: () => { pasteNode('Desktop'); } },
                { type: 'separator' },
                { label: 'Select All Nodes', shortcut: '⌘A', action: () => alert('All desktop items selected.') }
              ]
            },
            {
              id: 'view',
              label: 'View',
              items: [
                { label: 'As Icons Grid', shortcut: '⌘1', action: () => alert('Switched Finder visualization to adaptive Grid layout.') },
                { label: 'As List Index', shortcut: '⌘2', action: () => alert('Switched Finder visualization to Detailed list view.') },
                { type: 'separator' },
                { label: 'Toggle Dark Theme', shortcut: '⌃⌥⌘D', action: () => setDarkMode(!isDarkMode) },
                { label: 'Enter Fullscreen', shortcut: '⌃⌘F', action: () => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
              ]
            },
            {
              id: 'go',
              label: 'Go',
              items: [
                { label: 'Applications Hub', shortcut: '⇧⌘A', action: () => openApp('settings') },
                { label: 'Utilities Folder', shortcut: '⇧⌘U', action: () => openApp('terminal') },
                { type: 'separator' },
                { label: 'Desktop Directory', shortcut: '⇧⌘D', action: () => openApp('finder', { focusCategory: 'Desktop' }) },
                { label: 'Documents Vault', shortcut: '⇧⌘O', action: () => openApp('finder', { focusCategory: 'Documents' }) },
                { label: 'Downloads Node', shortcut: '⌥⌘L', action: () => openApp('finder', { focusCategory: 'Downloads' }) }
              ]
            },
            {
              id: 'window',
              label: 'Window',
              items: [
                { label: 'Minimize App window', shortcut: '⌘M', action: () => { if (focusedWindowId) minimizeApp(focusedWindowId); } },
                { label: 'Zoom/Maximize size', shortcut: '⌥⌘M', action: () => { if (focusedWindowId) toggleMaximizeApp(focusedWindowId); } },
                { type: 'separator' },
                { label: 'Mission Workspace Control', shortcut: '⌃↑', action: () => openApp('settings', { tab: 'displays' }) },
                { label: 'Bring All Windows Front', shortcut: '⌥⌘F', action: () => alert('Visual indices synchronized to top z-buffer.') }
              ]
            },
            {
              id: 'help',
              label: 'Help',
              items: [
                { label: 'Keyboard Shortcuts', shortcut: '⌥⌘K', action: () => setHelpOpen(true) },
                { label: 'Macify Virtual Helpdesk', shortcut: '⌃⌥⌘H', action: () => setFeedbackOpen(true) },
                { type: 'separator' },
                { label: 'About Macify OS core...', action: () => openApp('settings', { tab: 'about' }) }
              ]
            }
          ].map(menu => (
            <div key={menu.id} className="relative">
              <button
                onClick={() => handleMenuClick(menu.id)}
                className={`cursor-pointer px-2.5 py-1 rounded text-xs font-semibold transition-all duration-150 ease-out ${
                  activeMenu === menu.id 
                    ? 'bg-neutral-250/35 dark:bg-white/25 scale-[0.97] shadow-inner' 
                    : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]'
                }`}
              >
                {menu.label}
              </button>
              <AnimatePresence>
                {activeMenu === menu.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 } as any}
                    className={`absolute left-0 mt-1 w-56 rounded-xl shadow-2xl border p-1 z-50 ${
                      isDarkMode ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200' : 'bg-white text-neutral-800 border-neutral-200'
                    } backdrop-blur-xl`}
                  >
                    {menu.items.map((item, idx) => {
                      if (item.type === 'separator') {
                        return <div key={idx} className="my-1 border-t border-neutral-150 dark:border-neutral-800" />;
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (item.action) item.action();
                            setActiveMenu(null);
                          }}
                          className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-sky-600 hover:text-white rounded-lg text-left text-[11px] font-semibold transition duration-150"
                        >
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[9px] opacity-50 font-mono tracking-wider">{item.shortcut}</span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-3.5">
        {/* Connection status indicator */}
        <div 
          className="flex items-center cursor-pointer py-0.5 px-1.5 rounded transition-all duration-150 ease-out hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]" 
          onClick={() => openApp('settings', { tab: 'windows' })}
        >
          <span className={`w-2 h-2 rounded-full mr-1.5 ${windowsAgentConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider">
            {windowsAgentConnected ? 'WinAgent' : 'Offline'}
          </span>
        </div>

        {/* WiFi */}
        <button 
          onClick={toggleWiFi} 
          className="cursor-pointer p-1 rounded transition-all duration-150 ease-out hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.05] active:scale-[0.95]"
        >
          <Wifi size={14} className={wifiConnected ? 'text-sky-500' : 'text-neutral-500 line-through'} />
        </button>

        {/* Battery with visual indicator */}
        <div className="relative" id="macify-battery-trigger">
          <button
            onClick={() => handleMenuClick('battery')}
            className={`cursor-pointer flex items-center space-x-1.5 px-1.5 py-0.5 rounded transition-all duration-150 ease-out ${
              activeMenu === 'battery' 
                ? 'bg-neutral-250/35 dark:bg-white/25 scale-[0.97] shadow-inner' 
                : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]'
            }`}
          >
            <div className="flex items-center">
              {/* Battery Shell */}
              <div className="w-[19px] h-[10.5px] rounded-[2.5px] border border-neutral-600/80 dark:border-neutral-300/80 p-[1px] flex items-center relative">
                {/* Visual Fill */}
                <div
                  style={{ width: `${Math.max(5, batteryLevel)}%` }}
                  className={`h-full rounded-[1px] transition-all duration-300 ${
                    isBatteryCharging
                      ? 'bg-emerald-500'
                      : batteryLevel <= 20
                      ? 'bg-rose-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                      : batteryLevel <= 50
                      ? 'bg-amber-500'
                      : 'bg-neutral-800 dark:bg-neutral-100'
                  }`}
                />
                
                {/* Charging bolt overlay */}
                {isBatteryCharging && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-[7.5px] h-[7.5px] fill-amber-400 stroke-black dark:stroke-neutral-900 stroke-[1.5]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Battery Cap */}
              <div className="w-[1.2px] h-[3.5px] bg-neutral-500 dark:bg-neutral-400 rounded-r-[0.5px]" />
            </div>
            
            {/* Visual numeric indicator */}
            <span className="text-[10px] font-mono leading-none">{batteryLevel}%</span>
          </button>
          
          {/* Battery Dropdown Menu */}
          <AnimatePresence>
            {activeMenu === 'battery' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 } as any}
                className={`absolute right-0 mt-1 w-64 rounded-xl shadow-2xl border p-3.5 z-50 ${
                  isDarkMode ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200' : 'bg-white text-neutral-800 border-neutral-200'
                } backdrop-blur-xl`}
              >
                {/* Dropdown Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-150 dark:border-neutral-800 mb-3">
                  <span className="font-extrabold text-[10px] uppercase tracking-wider text-neutral-400">
                    Battery Status
                  </span>
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${isBatteryCharging ? 'bg-emerald-500/15 text-emerald-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}>
                    {isBatteryCharging ? 'Charging' : 'On Battery'}
                  </span>
                </div>

                {/* Big charge display */}
                <div className="flex items-center space-x-3 mb-3.5">
                  <div className="text-2xl font-bold font-mono tracking-tight leading-none text-neutral-850 dark:text-neutral-50">
                    {batteryLevel}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold truncate">
                      {isBatteryCharging ? 'Power Source: Power Adapter' : 'Power Source: Internal Battery'}
                    </div>
                    <div className="text-[9.5px] text-neutral-450 dark:text-neutral-400 mt-0.5 leading-tight">
                      {isBatteryCharging 
                        ? 'Simulated power delivery active.' 
                        : batteryLevel <= 20 
                        ? 'Low battery warning. Connect charger below!'
                        : 'Simulated passive power discharge active.'}
                    </div>
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-850 rounded-xl p-2.5 mb-3 space-y-3">
                  {/* Charger Connection Checkbox */}
                  <label className="flex items-center justify-between text-[11px] font-semibold cursor-pointer py-0.5 select-none text-neutral-700 dark:text-neutral-300">
                    <span>Power Adapter Cable</span>
                    <input
                      type="checkbox"
                      checked={isBatteryCharging}
                      onChange={(e) => setIsBatteryCharging(e.target.checked)}
                      className="w-3.5 h-3.5 accent-sky-500 cursor-pointer"
                    />
                  </label>

                  {/* Manual Slider adjustment */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9.5px] font-bold text-neutral-400">
                      <span>Simulated Level</span>
                      <span className="font-mono">{batteryLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={batteryLevel}
                      onChange={(e) => setBatteryLevel(Number(e.target.value))}
                      className="w-full accent-sky-500 h-1 bg-neutral-200 dark:bg-neutral-850 rounded-lg cursor-pointer transition-all"
                    />
                  </div>
                </div>

                {/* Energy Consumption lists */}
                <div className="space-y-1.5 text-[10px] text-neutral-450 dark:text-neutral-450 mb-3 border-b border-neutral-150 dark:border-neutral-800 pb-3">
                  <div className="font-bold text-[8.5px] uppercase tracking-wider text-neutral-450 mb-1">
                    Significant Energy Consumers
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                    <span>Active Terminal Sessions</span>
                    <span className="font-mono text-[9px] opacity-75">8.4W (High)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                    <span>Visual Core Window Layers</span>
                    <span className="font-mono text-[9px] opacity-75">2.1W (Medium)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                    <span>Macify Engine Daemon</span>
                    <span className="font-mono text-[9px] opacity-75">0.5W (Low)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    openApp('settings', { tab: 'displays' });
                    setActiveMenu(null);
                  }}
                  className="w-full text-center py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-sky-600 hover:text-white rounded-lg transition-colors text-[10.5px] font-bold text-neutral-700 dark:text-neutral-200 cursor-pointer"
                >
                  Battery Settings...
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spotlight */}
        <button 
          onClick={toggleSpotlight} 
          className="cursor-pointer p-1 rounded transition-all duration-150 ease-out hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.05] active:scale-[0.95]"
        >
          <Search size={14} />
        </button>

        {/* Sliders (Control Center) */}
        <button
          onClick={toggleControlCenter}
          className={`cursor-pointer p-1 rounded transition-all duration-150 ease-out ${
            showControlCenter 
              ? 'bg-sky-500 text-white scale-[0.98] shadow-inner' 
              : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.05] active:scale-[0.95]'
          }`}
        >
          <Sliders size={14} />
        </button>

        {/* Notifications Alert Bell */}
        <button
          onClick={toggleNotificationCenter}
          className={`cursor-pointer p-1 rounded relative transition-all duration-150 ease-out ${
            showNotificationCenter 
              ? 'bg-sky-500 text-white scale-[0.98] shadow-inner' 
              : 'hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.05] active:scale-[0.95]'
          }`}
        >
          <Bell size={14} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>

        {/* Clock & Date */}
        <button
          onClick={toggleNotificationCenter}
          className="cursor-pointer font-medium px-1.5 py-0.5 rounded text-[12px] shrink-0 transition-all duration-150 ease-out hover:bg-neutral-250/15 dark:hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97]"
        >
          {clockFormat === 'short' ? `${dateString} ${timeString}` : longDateString}
        </button>
      </div>

      {/* Control Center Floating Panel */}
      <AnimatePresence>
        {showControlCenter && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 } as any}
            className={`fixed right-4 top-8 w-80 rounded-2xl shadow-2xl border p-4.5 z-50 overflow-hidden ${
              isDarkMode ? 'bg-neutral-900/95 border-neutral-800 text-white' : 'bg-white/95 border-neutral-200 text-neutral-900'
            } backdrop-blur-2xl`}
          >
            {/* Action Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {/* Box 1: Wi-Fi */}
              <div
                onClick={toggleWiFi}
                className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-200 active:scale-95 ${
                  wifiConnected ? 'bg-sky-500 text-white shadow-sm' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className={`p-1.5 rounded-full ${wifiConnected ? 'bg-white/20' : 'bg-neutral-250 dark:bg-neutral-800'}`}>
                  <Wifi size={15} />
                </div>
                <div>
                  <div className={`font-bold text-[11px] leading-tight ${wifiConnected ? 'text-white' : 'text-neutral-800 dark:text-neutral-300'}`}>Wi-Fi</div>
                  <div className="text-[9px] opacity-75 mt-0.5 mt-1 leading-none">{wifiConnected ? 'Home-Lan-5G' : 'Off'}</div>
                </div>
              </div>

              {/* Box 2: Bluetooth */}
              <div
                onClick={() => {
                  setBluetoothConnected(!bluetoothConnected);
                  alert(`Bluetooth ${!bluetoothConnected ? 'enabled' : 'disabled'}.`);
                }}
                className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-200 active:scale-95 ${
                  bluetoothConnected ? 'bg-sky-500 text-white shadow-sm' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className={`p-1.5 rounded-full ${bluetoothConnected ? 'bg-white/20' : 'bg-neutral-250 dark:bg-neutral-850'}`}>
                  {/* Bluetooth Icon represented as static symbol */}
                  <span className="text-[12px] font-bold font-mono">B</span>
                </div>
                <div>
                  <div className={`font-bold text-[11px] leading-tight ${bluetoothConnected ? 'text-white' : 'text-neutral-800 dark:text-neutral-300'}`}>Bluetooth</div>
                  <div className="text-[9px] opacity-75 mt-0.5 mt-1 leading-none">{bluetoothConnected ? 'AirPods Pro' : 'Disabled'}</div>
                </div>
              </div>

              {/* Box 3: AirDrop */}
              <div
                onClick={() => {
                  setAirDropOn(!airDropOn);
                  alert(`AirDrop ${!airDropOn ? 'enabled for Contacts Only' : 'disabled'}.`);
                }}
                className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-200 active:scale-95 ${
                  airDropOn ? 'bg-sky-500 text-white shadow-sm' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className={`p-1.5 rounded-full ${airDropOn ? 'bg-white/20' : 'bg-neutral-250 dark:bg-neutral-850'}`}>
                  {/* AirDrop icon shape */}
                  <span className="text-[11px] font-bold font-mono">◎</span>
                </div>
                <div>
                  <div className={`font-bold text-[11px] leading-tight ${airDropOn ? 'text-white' : 'text-neutral-800 dark:text-neutral-300'}`}>AirDrop</div>
                  <div className="text-[9px] opacity-75 mt-0.5 mt-1 leading-none">{airDropOn ? 'Contacts Only' : 'Off'}</div>
                </div>
              </div>

              {/* Box 4: Focus mode */}
              <div
                onClick={() => setFocusMode(!focusMode)}
                className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-200 active:scale-95 ${
                  focusMode ? 'bg-purple-650 text-white bg-purple-600 shadow-sm' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className={`p-1.5 rounded-full ${focusMode ? 'bg-white/20' : 'bg-neutral-250 dark:bg-neutral-850'}`}>
                  <Moon size={15} />
                </div>
                <div>
                  <div className={`font-bold text-[11px] leading-tight ${focusMode ? 'text-white' : 'text-neutral-800 dark:text-neutral-300'}`}>Do Not Disturb</div>
                  <div className="text-[9px] opacity-75 mt-0.5 mt-1 leading-none">{focusMode ? 'Focus On' : 'Off'}</div>
                </div>
              </div>

              {/* Full Row: Dark Mode and Bridge Status */}
              <div
                onClick={() => setDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-250 col-span-2 hover:opacity-95 ${
                  isDarkMode ? 'bg-indigo-950/40 text-white shadow' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-300'
                }`}
              >
                <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[11px] leading-tight">Screen Theme</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{isDarkMode ? 'Dark Dusk active' : 'Bright Light active'}</div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-neutral-250/25 dark:bg-neutral-800 px-1.5 py-0.5 rounded uppercase">TOGGLE</span>
              </div>
            </div>

            {/* Sliders Deck */}
            <div className="space-y-4 bg-neutral-100/70 dark:bg-neutral-850/40 p-3 rounded-xl">
              {/* Display Brightness Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 leading-none">
                  <span className="flex items-center"><Sun size={12} className="mr-1.5 text-neutral-450" /> Display Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-neutral-250 dark:bg-neutral-800 accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Volume Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 leading-none">
                  <span className="flex items-center"><Volume2 size={12} className="mr-1.5 text-neutral-450" /> Auditory Volume</span>
                  <span>{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-neutral-250 dark:bg-neutral-800 accent-sky-500 cursor-pointer"
                />
              </div>

              {/* CPU Live diagnostic indicator */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 leading-none">
                  <span className="flex items-center"><Cpu size={12} className="mr-1.5 text-neutral-450" /> Host Engine CPU Load</span>
                  <span>14%</span>
                </div>
                <div className="w-full bg-neutral-250 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[14%]" />
                </div>
              </div>
            </div>

            {/* Battery Status Indicator */}
            <div className="mt-3.5 bg-neutral-100/30 dark:bg-neutral-850/20 p-2.5 rounded-xl flex items-center justify-between border border-neutral-200/10">
              <span className="text-[10px] font-bold text-neutral-550 dark:text-neutral-400">Power Source</span>
              <span className="text-[11px] font-extrabold text-emerald-500 flex items-center font-mono">
                {batteryLevel}% • {isBatteryCharging ? 'Charging (85W Outlet)' : 'Internal Battery'}
              </span>
            </div>

            {/* Host PC Spec Details */}
            <div className="mt-4 pt-3.5 border-t border-neutral-150 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/5">
                  <User size={15} />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] leading-tight">Admin User</div>
                  <div className="text-[9px] text-neutral-450 dark:text-neutral-400 font-mono tracking-wider uppercase leading-tight mt-0.5">Macify Virtual Host</div>
                </div>
              </div>
              <div className="text-[10px] text-neutral-450 dark:text-neutral-450 text-right leading-tight">
                <p className="font-bold text-neutral-850 dark:text-neutral-300">Windows 11 Pro</p>
                <p className="font-mono text-[9px]">v24H2 active bridge</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Center Panel */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 } as any}
            className={`fixed right-4 top-8 w-80 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border p-4 z-50 ${
              isDarkMode ? 'bg-neutral-900/90 border-neutral-800 text-white' : 'bg-white/90 border-neutral-200 text-neutral-900'
            } backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="font-extrabold text-sm tracking-tight flex items-center">
                <Bell size={14} className="mr-1 text-sky-500" /> Notifications
              </span>
              {notifications.length > 0 && (
                <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                  {notifications.length} Active
                </span>
              )}
            </div>

            {/* World Clock Widget */}
            <div className="mb-4">
              <WorldClockWidget />
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 select-none">
                <h4 className="font-semibold text-xs text-neutral-500 dark:text-neutral-400">All Quiet in Cupertino</h4>
                <p className="text-[10px] mt-1 opacity-70">No immediate notifications generated by host active bridges.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-neutral-200/50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-sky-500 font-bold font-mono">
                        {item.app}
                      </span>
                      <span className="text-[9px] text-neutral-400">{item.time}</span>
                    </div>
                    <h5 className="font-bold text-[11px] leading-tight mb-0.5">{item.title}</h5>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-400 leading-normal">
                      {item.message}
                    </p>
                    <button
                      onClick={() => clearNotification(item.id)}
                      className="absolute right-2.5 top-2 text-[9px] text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 font-bold cursor-pointer transition-opacity duration-200 px-1 hover:bg-rose-500/10 rounded"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Spotlight shortcut promotion helper */}
            <div className="mt-4 p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] text-center font-medium border border-sky-500/20">
              💡 Tip: Click search icon at top right or press <kbd className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">Alt + Space</kbd> to launch Spotlight instantly.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md pointer-events-auto p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`w-full max-w-xl rounded-3xl shadow-2xl border flex flex-col overflow-hidden max-h-[85vh] ${
                isDarkMode 
                  ? 'bg-neutral-900/95 border-neutral-800 text-neutral-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]' 
                  : 'bg-white/95 border-neutral-250 text-neutral-850 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]'
              } backdrop-blur-2xl`}
            >
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-neutral-150 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/10">
                    <Key size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] tracking-tight leading-tight">Keyboard Shortcuts</h3>
                    <p className="text-[11px] text-neutral-450 dark:text-neutral-400 mt-1">Live reference of system bindings for search, layout controls, and operations.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHelpOpen(false);
                    setShortcutSearch('');
                    setActiveShortcutTab('all');
                  }}
                  className="p-1 px-2 text-[11px] font-bold rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer transition"
                >
                  Dismiss
                </button>
              </div>

              {/* Live Search and Tab Filter Controls */}
              <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-950/20">
                {/* Visual Category Selector */}
                <div className="flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-thin">
                  {[
                    { id: 'all', label: 'All Bindings' },
                    { id: 'nav', label: 'Navigation & Spotlight' },
                    { id: 'window', label: 'Window Layout' },
                    { id: 'files', label: 'File & Desktop' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveShortcutTab(tab.id as any)}
                      className={`px-3 py-1 text-[10.5px] font-bold rounded-full transition cursor-pointer shrink-0 whitespace-nowrap ${
                        activeShortcutTab === tab.id
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Filter Search Input */}
                <div className="relative shrink-0 md:w-44">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                    <Search size={11} />
                  </span>
                  <input
                    type="text"
                    value={shortcutSearch}
                    onChange={(e) => setShortcutSearch(e.target.value)}
                    placeholder="Search shortcuts..."
                    className="w-full pl-7 pr-3 py-1 text-[11px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:border-sky-500 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 font-medium"
                  />
                </div>
              </div>

              {/* Scrollable Cheat Sheet Grid */}
              <div className="flex-1 overflow-y-auto max-h-[50vh] p-4.5 space-y-1.5">
                {(() => {
                  const shortcutsData = [
                    { category: 'nav', name: 'Spotlight Search (macOS)', keys: ['⌥ Option', 'Space'], altKeys: ['⌘ Cmd', 'Space'], desc: 'Toggle the search launcher overlay.' },
                    { category: 'nav', name: 'Spotlight Search (Win)', keys: ['⌃ Ctrl', 'Space'], desc: 'Alternative search launcher binding for Windows setups.' },
                    { category: 'nav', name: 'Launchpad', keys: ['⌃ Ctrl', 'L'], desc: 'Toggle visual overlay of installed apps.' },
                    { category: 'nav', name: 'Mission Control Settings', keys: ['⌃ Ctrl', '↑ ArrowUp'], desc: 'Trigger Mission Control window grid preferences.' },
                    { category: 'nav', name: 'App Task Switcher', keys: ['⌥ Option', 'Tab'], desc: 'Switch highlights & focus active apps in sequence.' },
                    { category: 'nav', name: 'Toggle this Cheat Sheet', keys: ['⌥ Option', '⌘ Cmd', 'K'], altKeys: ['⌥ Option', '⌘ Cmd', 'H'], desc: 'Open or close this interactive guide directly.' },
                    
                    { category: 'window', name: 'Close Active Window', keys: ['⌘ Cmd', 'W'], altKeys: ['⌃ Ctrl', 'W'], desc: 'Instantly close the currently focused app file/frame.' },
                    { category: 'window', name: 'Minimize Focused App', keys: ['⌘ Cmd', 'M'], altKeys: ['⌃ Ctrl', 'M'], desc: 'Minimize active app frame into the system dock.' },
                    { category: 'window', name: 'Zoom / Maximize Window', keys: ['⌥ Option', '⌘ Cmd', 'M'], desc: 'Maximize window frame layout bounds.' },
                    { category: 'window', name: 'Bring All Window Front', keys: ['⌥ Option', '⌘ Cmd', 'F'], desc: 'Synchronize windows index offsets to foreground.' },

                    { category: 'files', name: 'Create Folder Node', keys: ['⇧ Shift', '⌘ Cmd', 'N'], altKeys: ['⇧ Shift', '⌃ Ctrl', 'N'], desc: 'Generate new directory on the Virtual Desktop.' },
                    { category: 'files', name: 'Create Rich Text Document', keys: ['⌘ Cmd', 'N'], altKeys: ['⌃ Ctrl', 'N'], desc: 'Generate new rich document template on Desktop.' },
                    { category: 'files', name: 'Cut Selected Node', keys: ['⌘ Cmd', 'X'], altKeys: ['⌃ Ctrl', 'X'], desc: 'Cut active directory node to the transfer block.' },
                    { category: 'files', name: 'Copy Selected Node', keys: ['⌘ Cmd', 'C'], altKeys: ['⌃ Ctrl', 'C'], desc: 'Copy selected virtual node address into active clipboard.' },
                    { category: 'files', name: 'Paste Clipboard Nodes', keys: ['⌘ Cmd', 'V'], altKeys: ['⌃ Ctrl', 'V'], desc: 'Paste copied or cut virtual nodes into directories.' },
                    { category: 'files', name: 'Undo Desktop Action', keys: ['⌘ Cmd', 'Z'], altKeys: ['⌃ Ctrl', 'Z'], desc: 'Roll back and undo last desk file alteration.' },
                    { category: 'files', name: 'Redo Cached Action', keys: ['⇧ Shift', '⌘ Cmd', 'Z'], altKeys: ['⇧ Shift', '⌃ Ctrl', 'Z'], desc: 'Redo desktop transaction.' },
                    { category: 'files', name: 'Select All Nodes', keys: ['⌘ Cmd', 'A'], altKeys: ['⌃ Ctrl', 'A'], desc: 'Select all visual files or folders in current scope.' },
                    { category: 'files', name: 'Navigate Up (Finder)', keys: ['↑ ArrowUp'], desc: 'Navigate to parent folder inside the Finder panel directories.' }
                  ];

                  const filtered = shortcutsData.filter(item => {
                    if (activeShortcutTab !== 'all' && item.category !== activeShortcutTab) return false;
                    if (!shortcutSearch) return true;
                    const q = shortcutSearch.toLowerCase();
                    return (
                      item.name.toLowerCase().includes(q) ||
                      item.desc.toLowerCase().includes(q) ||
                      item.keys.some(k => k.toLowerCase().includes(q))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 text-neutral-400 select-none">
                        <Key size={26} className="mx-auto mb-2 text-neutral-300 dark:text-neutral-700 animate-bounce" />
                        <h4 className="font-semibold text-[11.5px] text-neutral-500 dark:text-neutral-400">No matching bindings found</h4>
                        <p className="text-[10px] mt-1 opacity-70">Try using simpler criteria like "Space", "N", or "Cmd".</p>
                      </div>
                    );
                  }

                  return filtered.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-neutral-100/60 dark:border-neutral-850/40 bg-neutral-50/20 dark:bg-neutral-950/10 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 hover:border-neutral-200 dark:hover:border-neutral-850 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.category === 'nav' 
                              ? 'bg-amber-400' 
                              : item.category === 'window' 
                                ? 'bg-sky-500' 
                                : 'bg-emerald-500'
                          }`} />
                          <h4 className="font-extrabold text-[11.5px] tracking-tight text-neutral-800 dark:text-neutral-200">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[10px] text-neutral-450 dark:text-neutral-450 mt-1 leading-normal">
                          {item.desc}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-start sm:items-end justify-center">
                        {/* Primary Combination Keys representation */}
                        <div className="flex items-center gap-1.5">
                          {item.keys.map((key, kIdx) => (
                            <React.Fragment key={kIdx}>
                              {kIdx > 0 && <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-bold">+</span>}
                              <kbd className="font-sans font-bold text-[10px] min-w-[18px] text-center bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-250 dark:border-neutral-850 border-b-2 border-b-neutral-300 dark:border-b-neutral-950 px-1.5 py-0.5 rounded shadow-[0_1px_1px_rgba(0,0,0,0.08)] whitespace-nowrap">
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>

                        {/* Alt Keys Representation */}
                        {item.altKeys && (
                          <div className="flex items-center gap-1 mt-1.5 opacity-60 text-[9px] group-hover:opacity-85 transition">
                            <span className="text-neutral-400 dark:text-neutral-500 text-[8.5px] uppercase font-bold mr-0.5">Alt:</span>
                            {item.altKeys.map((key, kIdx) => (
                              <React.Fragment key={kIdx}>
                                {kIdx > 0 && <span className="text-[9px] font-bold text-neutral-450 px-[1px]">+</span>}
                                <kbd className="font-sans font-medium text-[8.5px] px-1 py-0 rounded border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-850/40 text-neutral-600 dark:text-neutral-300">
                                  {key}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Modal Footer Tip */}
              <div className="p-4 border-t border-neutral-150 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/45 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
                <span className="text-neutral-450 dark:text-neutral-500 leading-normal text-center sm:text-left">
                  💡 Pressing <kbd className="px-1 py-0.5 border dark:border-neutral-800 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px]">Alt + Cmd + K</kbd> toggles this cheat sheet instantly from anywhere.
                </span>
                <button
                  onClick={() => {
                    setHelpOpen(false);
                    setShortcutSearch('');
                    setActiveShortcutTab('all');
                  }}
                  className="w-full sm:w-auto shrink-0 py-1.5 px-4.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-xl text-[11px] cursor-pointer shadow transition"
                >
                  Close Reference
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm p-5 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'}`}
            >
              <h4 className="font-bold text-sm text-sky-500 mb-2">Macify Helpdesk & Support</h4>
              <p className="text-xs text-neutral-405 dark:text-neutral-400 mb-4 leading-normal">Submit a virtual query or report a bug directly to our Cupertino engineers.</p>
              <textarea
                placeholder="Type your feedback or Windows/macOS bridge interface query here..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 focus:outline-none focus:border-sky-500 resize-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-450 bg-transparent"
              />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setFeedbackOpen(false)}
                  className="flex-1 py-1.5 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-805 rounded-xl text-xs font-semibold cursor-pointer text-center text-neutral-500 dark:text-neutral-350 bg-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setFeedbackOpen(false);
                    alert('Feedback shared! Thank you for helping build Macify OS.');
                  }}
                  className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold cursor-pointer text-center"
                >
                  Send Query
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
