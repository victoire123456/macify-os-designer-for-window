import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMacify } from '../store';
import { AppConfig, FileSystemNode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Power, RefreshCw, Moon, User, Pin, Clock, 
  Folder, FileText, ShieldAlert, Monitor, Check, Compass, 
  Settings, Calculator, Terminal, Activity, Sparkles, LogOut, Lock
} from 'lucide-react';
import { getAppIcon } from './Dock';

export default function StartMenu() {
  const { 
    isDarkMode, 
    allApps, 
    fileSystem, 
    openApp, 
    addNotification, 
    isBatteryCharging, 
    batteryLevel 
  } = useMacify();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Power overlay states
  const [powerState, setPowerState] = useState<'normal' | 'sleeping' | 'shuttingdown' | 'shutdown' | 'restarting'>('normal');
  const [restartProgress, setRestartProgress] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Restart simulation countdown
  useEffect(() => {
    if (powerState === 'restarting') {
      const interval = setInterval(() => {
        setRestartProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            // Simulate hard reload
            window.location.reload();
            return 100;
          }
          return p + 8;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [powerState]);

  // Escape key cancels power menu or start menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (powerState === 'sleeping') {
          setPowerState('normal');
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [powerState]);

  // Filter apps matching search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return allApps;
    return allApps.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allApps, searchQuery]);

  // Filter files matching search query or grab default recents
  const recentFiles = useMemo(() => {
    const allFiles = fileSystem.filter(n => n.type === 'file');
    if (!searchQuery) {
      // return a mix of default recents
      return allFiles.slice(0, 5);
    }
    return allFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [fileSystem, searchQuery]);

  const handleAppLaunch = (appId: string) => {
    openApp(appId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleRecentFileClick = (file: FileSystemNode) => {
    openApp('notepad', { initialFileId: file.id });
    setIsOpen(false);
    addNotification('File Opened', `Opened recent file "${file.name}"`, 'Finder');
  };

  return (
    <>
      {/* Start Button at Bottom-Left side (Hybrid Start layout position) */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-3 left-4 z-[45] w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group shadow-lg ${
          isOpen
            ? 'bg-sky-500 scale-95 border border-sky-400 rotate-45'
            : isDarkMode
            ? 'bg-neutral-900/90 hover:bg-neutral-800/95 border border-neutral-800 text-white'
            : 'bg-white/90 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-800'
        } backdrop-blur-md`}
        id="macify-windows-start-trigger"
        title="Start Menu (Windows + macOS Hybrid)"
      >
        <div className={`relative transition-transform duration-300 ${isOpen ? '-rotate-45' : 'group-hover:scale-105 active:scale-95'}`}>
          {/* Windows-style four panes graphic, styled as soft organic curved circles */}
          <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
            <div className={`w-2 h-2 rounded-[2px] transition-colors ${isOpen ? 'bg-white' : 'bg-red-400 dark:bg-sky-400/90'}`} />
            <div className={`w-2 h-2 rounded-[2px] transition-colors ${isOpen ? 'bg-white' : 'bg-emerald-400 dark:bg-amber-400/90'}`} />
            <div className={`w-2 h-2 rounded-[2px] transition-colors ${isOpen ? 'bg-white' : 'bg-purple-400 dark:bg-emerald-400/90'}`} />
            <div className={`w-2 h-2 rounded-[2px] transition-colors ${isOpen ? 'bg-white' : 'bg-amber-400 dark:bg-rose-400/90'}`} />
          </div>
        </div>
      </button>

      {/* Start Popup Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 } as any}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`fixed bottom-16 left-4 z-[45] w-[450px] h-[550px] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.35)] border flex flex-col p-4 backdrop-blur-2xl ${
              isDarkMode 
                ? 'bg-neutral-950/85 border-neutral-800 text-neutral-200' 
                : 'bg-white/85 border-neutral-200 text-neutral-850'
            }`}
            id="macify-windows-start-menu"
          >
            {/* 1. Glassmorphic Search Input bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 text-neutral-400" size={14} />
              <input
                type="text"
                placeholder="Search apps, recent document buffers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full outline-none pl-10 pr-4 py-2 text-xs rounded-xl border font-medium transition-all ${
                  isDarkMode
                    ? 'bg-black/40 border-neutral-800 text-white focus:border-sky-500/80 focus:bg-black/60'
                    : 'bg-neutral-100/50 border-neutral-200 text-neutral-800 focus:border-sky-500/80 focus:bg-white'
                }`}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[10px] font-bold text-neutral-400 hover:text-sky-500"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 2. Main Content Dividers (Pinned and Recents) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              
              {/* Pinned Apps Header */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-neutral-400 flex items-center">
                    <Pin size={10} className="mr-1 rotate-45 text-sky-500" /> Pinned Apps
                  </span>
                  {!searchQuery && (
                    <span className="text-[9px] font-bold text-neutral-400 opacity-80">
                      Fully Interactive
                    </span>
                  )}
                </div>

                {/* Gridded pinned apps */}
                {filteredApps.length === 0 ? (
                  <div className="text-center py-4 text-[11px] text-neutral-400">
                    No matching applications found.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2.5">
                    {filteredApps.slice(0, 12).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleAppLaunch(app.id)}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                          isDarkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-100'
                        }`}
                      >
                        <div className="mb-2.5">
                          {getAppIcon(app.id, 32)}
                        </div>
                        <span className="text-[10.5px] font-semibold truncate w-full">
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Files Section */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-neutral-400 flex items-center">
                    <Clock size={10} className="mr-1 text-emerald-500" /> Recent Documents
                  </span>
                  <span className="text-[9.5px] font-bold text-sky-500 hover:underline cursor-pointer" onClick={() => handleAppLaunch('finder')}>
                    Show All
                  </span>
                </div>

                <div className="space-y-1">
                  {recentFiles.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleRecentFileClick(file)}
                      className={`w-full flex items-center p-2 rounded-xl text-left text-xs font-semibold cursor-pointer transition-colors ${
                        isDarkMode ? 'hover:bg-white/5 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 dark:bg-sky-500/5 flex items-center justify-center mr-3 shrink-0">
                        <FileText size={14} className="text-sky-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[11.5px]">{file.name}</div>
                        <div className="text-[9px] text-neutral-400 font-medium truncate">
                          {file.category} folder · Modified {file.lastModified}
                        </div>
                      </div>
                    </button>
                  ))}
                  {recentFiles.length === 0 && (
                    <div className="text-center py-4 text-[11px] text-neutral-400">
                      No document files in recent registers.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 3. Bottom User Profile & Power Controls */}
            <div className={`mt-3 pt-3 border-t flex items-center justify-between ${
              isDarkMode ? 'border-neutral-850' : 'border-neutral-150'
            }`}>
              
              {/* User Identity Profile card */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[11.5px] shadow border border-white/10 shrink-0">
                  JA
                </div>
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-extrabold truncate">Joseph Atuyishime</div>
                  <div className="text-[9px] text-neutral-400 font-semibold truncate leading-none mt-0.5">
                    josephatuyishime
                  </div>
                </div>
              </div>

              {/* Power operations */}
              <div className="flex items-center space-x-1.5">
                {/* Sleep button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPowerState('sleeping');
                    addNotification('System Sleep', 'Visual display backlights dimmed. Click screen to wake up.', 'System Kernel');
                  }}
                  className="p-2 rounded-lg cursor-pointer hover:bg-neutral-250/20 dark:hover:bg-white/5 text-neutral-400 hover:text-sky-400 transition"
                  title="Put System to Sleep"
                >
                  <Moon size={14} />
                </button>

                {/* Restart button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPowerState('restarting');
                  }}
                  className="p-2 rounded-lg cursor-pointer hover:bg-neutral-250/20 dark:hover:bg-white/5 text-neutral-400 hover:text-amber-500 transition"
                  title="Restart Machine"
                >
                  <RefreshCw size={14} />
                </button>

                {/* Shutdown button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setPowerState('shuttingdown');
                    setTimeout(() => {
                      setPowerState('shutdown');
                    }, 1800);
                  }}
                  className="p-2 rounded-lg cursor-pointer hover:bg-neutral-250/20 dark:hover:bg-white/5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition"
                  title="Shut Down System"
                >
                  <Power size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FULL SCALE INTERACTIVE POWER STATE OVERLAYS ===== */}

      {/* A. RESTARTING SPLASH OVERLAY */}
      {powerState === 'restarting' && (
        <div className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center text-white text-center font-sans">
          <div className="w-12 h-12 rounded-full border-4 border-sky-500/30 border-t-sky-500 animate-spin mb-4" />
          <h2 className="text-base font-bold">Restarting Macify OS</h2>
          <p className="text-[11px] text-neutral-400 mt-1 max-w-xs leading-relaxed">
            Reconfiguring hybrid environment threads, saving buffers... {restartProgress}%
          </p>
        </div>
      )}

      {/* B. SHUTTING DOWN TRANSITION */}
      {powerState === 'shuttingdown' && (
        <div className="fixed inset-0 z-[9999999] bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center text-white text-center font-sans transition-all duration-1000">
          <div className="w-10 h-10 rounded-full border-2 border-neutral-800 border-t-rose-500 animate-spin mb-4" />
          <h2 className="text-sm font-bold">Shutting down</h2>
          <p className="text-[10px] text-neutral-500 mt-0.5">Powering down virtual motherboard nodes...</p>
        </div>
      )}

      {/* C. FULL SHUTDOWN BLACK SCREEN WITH POWER UP BUTTON */}
      {powerState === 'shutdown' && (
        <div className="fixed inset-0 z-[99999999] bg-black flex flex-col items-center justify-center text-white font-sans">
          <div className="relative flex flex-col items-center scale-100">
            <button
              onClick={() => {
                setPowerState('restarting'); // Boot up triggers spin and fresh startup
              }}
              className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-700/50 hover:border-emerald-500 flex items-center justify-center cursor-pointer hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] transition duration-300 transform hover:scale-105 active:scale-95 group text-rose-500 hover:text-emerald-500"
            >
              <Power size={32} />
            </button>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-extrabold mt-6 group-hover:text-emerald-400 transition">
              Boot Macify OS
            </span>
            <p className="text-[9.5px] text-neutral-500 mt-2 text-center max-w-xs">
              Motherboard powered down. Click the power node above to boot other workstation kernels.
            </p>
          </div>
        </div>
      )}

      {/* D. SYSTEM SLEEP SEAMLESS DIMMER */}
      {powerState === 'sleeping' && (
        <div
          onClick={() => {
            setPowerState('normal');
            addNotification('System Awakened', 'Welcome back, Joseph!', 'Security Core');
          }}
          className="fixed inset-0 z-[9999999] bg-neutral-950/95 flex flex-col items-center justify-center cursor-pointer font-sans"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="text-center font-sans select-none"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-550 border border-neutral-800 mb-4 mx-auto">
              <Lock size={20} className="text-neutral-500" />
            </div>
            <h2 className="text-sm font-bold text-neutral-200">System Sleeping...</h2>
            <p className="text-[10px] text-neutral-500 mt-1">Press any key or click the screen to wake up Joseph's session.</p>
          </motion.div>
        </div>
      )}
    </>
  );
}
