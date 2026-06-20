import React, { useState } from 'react';
import { useMacify } from '../store';
import { AppID } from '../types';
import { Search, X, AppWindow, Sparkles, LayoutGrid, Star, Pin, PinOff, RefreshCw, Layers, SortAsc, SortDesc, Filter } from 'lucide-react';
import { getAppIcon } from './Dock';
import { motion, AnimatePresence } from 'motion/react';

type SortOption = 'name-asc' | 'name-desc' | 'type';
type FilterCategory = 'all' | 'favorites' | 'system' | 'windows' | 'Media' | 'Developer' | 'Office' | 'Browsers';

export default function Launchpad() {
  const {
    allApps,
    dockApps,
    openApp,
    setLaunchpadOpen,
    toggleFavoriteApp,
    togglePinApp,
    scanWindowsApps,
    isDarkMode
  } = useMacify();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  
  // Simulated scan state
  const [scanActive, setScanActive] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  // App Options Context Menu State
  const [menuAppId, setMenuAppId] = useState<string | null>(null);

  const startLocalAppScan = async () => {
    setScanActive(true);
    setScanProgress(0);
    setScanStep('Initializing win32 discovery engine...');
    
    // Tweak local progress values to tie to steps
    const handleStep = (stepText: string) => {
      setScanStep(stepText);
      setScanProgress(p => Math.min(95, p + 13));
    };

    try {
      await scanWindowsApps(handleStep);
      setScanProgress(100);
      setScanStep('Database synchronized!');
      setTimeout(() => {
        setScanActive(false);
        setScanProgress(0);
      }, 800);
    } catch {
      setScanActive(false);
    }
  };

  // 1. Filtering Logic
  const filteredApps = allApps.filter(app => {
    // Search filter
    const matchesSearch = app.name.toLowerCase().includes(query.toLowerCase());
    if (!matchesSearch) return false;

    // Category Filter
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return app.isFavorite;
    if (selectedCategory === 'windows') return app.isWindowsNative;
    if (selectedCategory === 'system') return !app.isWindowsNative;
    
    // Sub-category filters
    if (app.windowsCategory === selectedCategory) return true;
    if (app.category === selectedCategory) return true;

    return false;
  });

  // 2. Sorting Logic
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else {
      // Sort system first, then windows
      const valA = a.isWindowsNative ? 1 : 0;
      const valB = b.isWindowsNative ? 1 : 0;
      return valA - valB;
    }
  });

  const handleLaunch = (appId: string) => {
    openApp(appId as AppID);
    setQuery('');
    setLaunchpadOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-start select-none bg-neutral-950/80 backdrop-blur-3xl px-8 sm:px-16 md:px-20 py-12 text-white"
      id="macify-launchpad"
    >
      {/* 4K Scanning Progress Overlay Overlay */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/90 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-sky-500/10 border border-sky-400/20 rounded-full flex items-center justify-center mb-6 relative">
              <RefreshCw size={28} className="text-sky-400 animate-spin" />
              <div className="absolute inset-1 rounded-full border border-dashed border-sky-400/40 animate-reverse-spin" />
            </div>
            
            <h2 className="text-lg font-bold tracking-tight text-white mb-2">Scanning Host File System</h2>
            <p className="text-xs text-neutral-400 font-mono max-w-sm h-6 overflow-hidden">
              {scanStep}
            </p>

            <div className="w-64 h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-6 border border-white/5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full shadow-inner"
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase mt-3">
              {Math.round(scanProgress)}% COMPLETE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Row with Launchpad Indicator & Discovery Scan Action */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none text-white">App Library</h1>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-medium leading-none">Macify Launchpad Dynamic Shelf</p>
          </div>
        </div>

        {/* Windows Live Scanner Controller */}
        <button
          onClick={startLocalAppScan}
          className="flex items-center px-4 py-2 rounded-xl bg-neutral-900 hover:bg-sky-500 hover:text-white transition-all text-xs font-bold border border-white/5 mr-1 text-sky-400 shadow-md group cursor-pointer"
        >
          <RefreshCw size={13} className="mr-2 group-hover:rotate-180 transition-transform duration-700" />
          Scan Windows Applications
        </button>
      </div>

      {/* Search & Tool Shelf */}
      <div className="w-full max-w-5xl mx-auto shrink-0 mb-8 bg-neutral-900/40 p-4 rounded-2xl border border-white/5 space-y-4">
        {/* Search bar inside shelf */}
        <div className="w-full relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search all apps, executables, or registry keys..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2.5 pl-11 pr-11 rounded-xl bg-neutral-950/60 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold text-xs transition text-left"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Categories Horizontal Tab List & Sorting Selectors */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1 border-t border-white/5">
          <div className="flex items-center space-x-2 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
            <Filter size={11} className="text-neutral-500" />
            <span>Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 flex-1 max-w-3xl overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'favorites', label: 'Favorites' },
              { id: 'system', label: 'Native macOS' },
              { id: 'windows', label: 'Windows Native' },
              { id: 'Browsers', label: 'Browsers' },
              { id: 'Media', label: 'Media' },
              { id: 'Developer', label: 'Developer' },
              { id: 'Office', label: 'Office' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FilterCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none cursor-pointer transition ${
                  selectedCategory === cat.id
                    ? 'bg-sky-500 text-white shadow-inner shadow-white/10'
                    : 'bg-neutral-950/50 text-neutral-400 hover:bg-neutral-900 border border-white/5 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto self-stretch md:self-auto shrink-0 justify-end">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold font-mono">Sort:</span>
            <div className="flex bg-neutral-950/50 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setSortOption('name-asc')}
                className={`p-1.5 rounded-md cursor-pointer transition ${sortOption === 'name-asc' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Sort Name A-Z"
              >
                <SortAsc size={13} />
              </button>
              <button
                onClick={() => setSortOption('name-desc')}
                className={`p-1.5 rounded-md cursor-pointer transition ${sortOption === 'name-desc' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Sort Name Z-A"
              >
                <SortDesc size={13} />
              </button>
              <button
                onClick={() => setSortOption('type')}
                className={`p-1.5 rounded-md cursor-pointer transition ${sortOption === 'type' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Sort by Category"
              >
                <Layers size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Apps Canvas */}
      <div className="flex-1 max-w-5xl mx-auto w-full overflow-y-auto pb-12 relative" onClick={() => setMenuAppId(null)}>
        {sortedApps.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 flex flex-col items-center">
            <LayoutGrid size={48} className="stroke-1 text-neutral-750 mb-3" />
            <span className="font-bold text-sm">No Matches Located</span>
            <span className="text-xs opacity-75 mt-0.5 max-w-md">
              No registered applications match your query. Run the "Scan Windows Applications" procedure to index additional files on the disk.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-10">
            {sortedApps.map((app, i) => {
              const isPinned = dockApps.includes(app.id as AppID);
              const isFav = app.isFavorite;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(24, i) * 0.015 }}
                  className="flex flex-col items-center group relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch(app.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuAppId(menuAppId === app.id ? null : app.id);
                  }}
                >
                  {/* Glass Card Container with high contrast border */}
                  <div className="w-18 h-18 rounded-2xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center p-3 relative shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-white/5 active:scale-95">
                    {getAppIcon(app.id, 38)}
                    
                    {/* Small visual dot for running state */}
                    {app.isWindowsNative && (
                      <span className="absolute -top-1.5 -right-1.5 text-[8px] font-mono tracking-widest bg-[#0067b8] text-white font-bold px-1.5 py-0.5 leading-none rounded-md shadow-md border border-white/10">
                        WIN32
                      </span>
                    )}

                    {/* Quick Action Overlay Badges */}
                    <div className="absolute -bottom-1 left-1 flex space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {isFav && (
                        <div className="bg-amber-500 text-white rounded-full p-1 leading-none shadow">
                          <Star size={7} className="fill-current" />
                        </div>
                      )}
                      {isPinned && (
                        <div className="bg-sky-500 text-white rounded-full p-1 leading-none shadow">
                          <Pin size={7} className="fill-current" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Program Name Label */}
                  <span className="mt-4 text-[11px] font-bold tracking-tight text-neutral-350 group-hover:text-white text-center leading-normal truncate max-w-full font-sans select-none">
                    {app.name}
                  </span>

                  {/* Brand category line indicator */}
                  <span className="text-[8px] font-mono font-bold tracking-widest text-neutral-500 uppercase mt-0.5 tracking-wider truncate max-w-full">
                    {app.isWindowsNative ? (app.windowsCategory || 'Windows') : 'macOS'}
                  </span>

                  {/* Custom dynamic interactive context options dropdown shelf */}
                  <AnimatePresence>
                    {menuAppId === app.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-18 z-30 w-44 rounded-xl bg-neutral-900 border border-white/5 p-1 text-left shadow-2xl overflow-hidden font-sans border-neutral-800"
                      >
                        <div className="px-2.5 py-1 text-[8px] font-mono tracking-widest text-[#00c3ff] font-bold uppercase truncate border-b border-white/5 mb-1 bg-white/2">
                          {app.name}
                        </div>
                        
                        <button
                          onClick={() => {
                            toggleFavoriteApp(app.id);
                            setMenuAppId(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                            isFav ? 'text-amber-400 hover:bg-amber-500/10' : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center">
                            <Star size={11} className={`mr-2 ${isFav ? 'fill-current text-amber-400' : 'text-neutral-400'}`} />
                            {isFav ? 'Unfavorite App' : 'Favorite App'}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            togglePinApp(app.id);
                            setMenuAppId(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                            isPinned ? 'text-orange-400 hover:bg-orange-500/10' : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center">
                            {isPinned ? (
                              <>
                                <PinOff size={11} className="mr-2 text-orange-400" />
                                Unpin from Dock
                              </>
                            ) : (
                              <>
                                <Pin size={11} className="mr-2 text-neutral-400" />
                                Pin to Dock
                              </>
                            )}
                          </span>
                        </button>

                        {app.isWindowsNative && (
                          <div className="mt-1 p-1.5 bg-neutral-950 text-[8px] font-mono text-neutral-500 border-t border-white/5 leading-normal space-y-0.5 select-text rounded-lg">
                            <div className="truncate" title={app.exePath}>EXE: {app.exePath?.split('\\').pop() || 'win32.exe'}</div>
                            <div className="truncate" title={app.registryKey}>REG: {app.registryKey}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom shelf status */}
      <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-xs text-neutral-500 font-sans border-t border-white/5 pt-4 shrink-0">
        <span className="font-bold flex items-center">
          <Sparkles size={11} className="mr-2 text-amber-500 animate-pulse" /> Double click wall empty spaces to escape • Right-click apps for settings
        </span>
        <button
          onClick={() => setLaunchpadOpen(false)}
          className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 text-neutral-300 font-bold cursor-pointer transition duration-300 text-xs"
        >
          Close Shelf
        </button>
      </div>
    </motion.div>
  );
}
