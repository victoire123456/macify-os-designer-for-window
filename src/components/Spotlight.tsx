import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { AppID } from '../types';
import { Search, FileCode, AppWindow, Calculator, ChevronRight, X, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Spotlight() {
  const {
    spotlightOpen,
    toggleSpotlight,
    allApps,
    fileSystem,
    openApp,
    isDarkMode
  } = useMacify();

  const [query, setQuery] = useState('');
  const [mathResult, setMathResult] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!spotlightOpen) {
      setQuery('');
      setMathResult(null);
    }
  }, [spotlightOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle live math calculation in spotlight
  useEffect(() => {
    if (!query) {
      setMathResult(null);
      return;
    }

    // If query contains characters usually for simple math e.g. "12 + 45" or "100 * 5"
    if (/^[0-9+\-*/().\s]+$/.test(query) && /[+\-*/()]/.test(query)) {
      try {
        // Safe evaluation
        const result = new Function(`return (${query})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          setMathResult(`= ${result}`);
        } else {
          setMathResult(null);
        }
      } catch {
        setMathResult(null);
      }
    } else {
      setMathResult(null);
    }
  }, [query]);

  // Unified list of active results for linear index keyboard navigation
  const matchingWindowsApps = allApps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase()) && app.isWindowsNative
  );

  const matchingSystemApps = allApps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase()) && !app.isWindowsNative
  );

  const matchingFiles = fileSystem.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase())
  );

  const flatResultItems = [
    ...(mathResult ? [{ type: 'math', value: mathResult }] : []),
    ...matchingWindowsApps.map(app => ({ type: 'app', id: app.id })),
    ...matchingSystemApps.map(app => ({ type: 'app', id: app.id })),
    ...matchingFiles.map(file => ({ type: 'file', file })),
    ...(query ? [{ type: 'web' }] : [])
  ];

  const handleLaunchApp = (appId: AppID) => {
    openApp(appId);
    toggleSpotlight();
  };

  const handleLaunchFile = (file: any) => {
    if (file.type === 'directory') {
      openApp('finder', { focusCategory: file.name });
    } else {
      openApp('notepad', { initialFileId: file.id });
    }
    toggleSpotlight();
  };

  const handleWebSearch = () => {
    openApp('safari', { searchQuery: query });
    toggleSpotlight();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!spotlightOpen || flatResultItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatResultItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatResultItems.length) % flatResultItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = flatResultItems[selectedIndex];
        if (activeItem) {
          if (activeItem.type === 'math') {
            alert(`Calculation preview evaluate: ${mathResult}`);
          } else if (activeItem.type === 'app' && activeItem.id) {
            handleLaunchApp(activeItem.id);
          } else if (activeItem.type === 'file' && activeItem.file) {
            handleLaunchFile(activeItem.file);
          } else if (activeItem.type === 'web') {
            handleWebSearch();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spotlightOpen, selectedIndex, flatResultItems, mathResult]);

  return (
    <div
      onClick={toggleSpotlight}
      className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-24 select-none pointer-events-auto"
      id="spotlight-layer-click"
    >
      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] border p-4 flex flex-col ${
          isDarkMode ? 'bg-neutral-900/90 border-neutral-800 text-white' : 'bg-white/95 border-neutral-300 text-neutral-950'
        } backdrop-blur-2xl`}
      >
        {/* Input Bar */}
        <div className="relative flex items-center mb-3">
          <Search size={18} className="absolute left-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Windows apps, macOS apps, files, formulas or web..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-neutral-250/50 dark:bg-neutral-950/45 border border-neutral-700/20 text-sm focus:outline-none"
            autoFocus
            spellCheck="false"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 text-neutral-400 hover:text-white cursor-pointer">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Results Stream */}
        {query ? (
          (() => {
            let globalIndex = 0;
            return (
              <div className="max-h-80 overflow-y-auto space-y-4 mt-2 pr-1">
                {/* Live Math Calculation */}
                {mathResult && (
                  (() => {
                    const isSelected = globalIndex === selectedIndex;
                    globalIndex++;
                    return (
                      <div key="math-calc">
                        <span className="text-[10px] font-bold font-mono uppercase text-sky-500 px-1.5">Calculation</span>
                        <div
                          onClick={() => alert(`Calculation Result: ${mathResult}`)}
                          className={`flex items-center justify-between p-2.5 rounded-lg font-bold font-mono text-xs mt-1 transition cursor-pointer ${
                            isSelected ? 'bg-sky-500 text-white' : 'bg-sky-500/10 text-sky-500 dark:text-sky-405'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Calculator size={13} />
                            <span>{query}</span>
                          </div>
                          <span>{mathResult}</span>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Applications (Windows Dev Built-in Applets) */}
                {matchingWindowsApps.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-teal-500 dark:text-teal-400 px-1.5 font-mono tracking-wider">Windows Applications</span>
                    <div className="space-y-0.5 mt-1">
                      {matchingWindowsApps.map(app => {
                        const isSelected = globalIndex === selectedIndex;
                        globalIndex++;
                        return (
                          <div
                            key={app.id}
                            onClick={() => handleLaunchApp(app.id)}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition group ${
                              isSelected ? 'bg-sky-500 text-white shadow' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-current'
                            }`}
                          >
                            <span className="flex items-center">
                              <AppWindow size={13} className={`mr-2.5 ${isSelected ? 'text-white' : 'text-teal-500'}`} />
                              {app.name}
                              <span className={`ml-2 text-[8px] font-mono px-1 rounded font-bold uppercase ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                              }`}>WIN32 BRIDGE</span>
                            </span>
                            <ChevronRight size={10} className={isSelected ? 'text-white' : 'text-neutral-500'} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* System Macintosh Applications */}
                {matchingSystemApps.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-sky-500 dark:text-sky-400 px-1.5 font-mono tracking-wider">Macify System Apps</span>
                    <div className="space-y-0.5 mt-1">
                      {matchingSystemApps.map(app => {
                        const isSelected = globalIndex === selectedIndex;
                        globalIndex++;
                        return (
                          <div
                            key={app.id}
                            onClick={() => handleLaunchApp(app.id)}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition group ${
                              isSelected ? 'bg-sky-500 text-white shadow' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-current'
                            }`}
                          >
                            <span className="flex items-center">
                              <AppWindow size={13} className={`mr-2.5 ${isSelected ? 'text-white' : 'text-sky-500'}`} />
                              {app.name}
                            </span>
                            <ChevronRight size={10} className={isSelected ? 'text-white' : 'text-neutral-500'} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files & Documents */}
                {matchingFiles.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-500 px-1.5 font-mono tracking-wider">Files & Folders</span>
                    <div className="space-y-0.5 mt-1">
                      {matchingFiles.map(file => {
                        const isSelected = globalIndex === selectedIndex;
                        globalIndex++;
                        return (
                          <div
                            key={file.id}
                            onClick={() => handleLaunchFile(file)}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition group ${
                              isSelected ? 'bg-sky-500 text-white shadow' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-current'
                            }`}
                          >
                            <span className="flex items-center">
                              <FileCode size={13} className={`mr-2.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                              {file.name}
                            </span>
                            <span className={`text-[9px] font-mono font-bold uppercase p-0.5 px-1.5 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                            }`}>{file.category}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Search Web */}
                {(() => {
                  const isSelected = globalIndex === selectedIndex;
                  globalIndex++;
                  return (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 px-1.5 font-mono tracking-wider">Web Search</span>
                      <div className="space-y-0.5 mt-1">
                        <div
                          onClick={handleWebSearch}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition group ${
                            isSelected ? 'bg-sky-500 text-white shadow' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-current'
                          }`}
                        >
                          <span className="flex items-center">
                            <Globe size={13} className={`mr-2.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                            <span>Search the Web with Google for <span className="font-bold underline">"{query}"</span></span>
                          </span>
                          <ChevronRight size={10} className={isSelected ? 'text-white' : 'text-neutral-500'} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()
        ) : (
          <div className="text-center py-12 text-xs text-neutral-450 select-none">
            💡 Keyboard Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold border border-neutral-700/20 text-[10px]">Cmd + Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold border border-neutral-700/20 text-[10px]">Alt + Space</kbd> to activate Spotlight instantly.
          </div>
        )}
      </motion.div>
    </div>
  );
}
