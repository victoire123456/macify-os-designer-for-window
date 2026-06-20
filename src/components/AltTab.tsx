import React from 'react';
import { useMacify } from '../store';
import { getAppIcon } from './Dock';
import { AnimatePresence, motion } from 'motion/react';

export default function AltTab() {
  const {
    setAltTabOpen,
    windows,
    focusApp,
    altTabActiveIndex,
    setAltTabActiveIndex,
    isDarkMode,
  } = useMacify();

  if (windows.length === 0) return null;

  const handleSelect = (idx: number) => {
    const target = windows[idx];
    if (target) {
      focusApp(target.id);
    }
    setAltTabOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950/25 flex items-center justify-center pointer-events-none select-none"
      id="macify-alttab-layer"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`pointer-events-auto p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border flex flex-col items-center max-w-lg ${
          isDarkMode ? 'bg-neutral-900/90 border-neutral-800 text-white' : 'bg-white/90 border-neutral-200 text-neutral-900'
        } backdrop-blur-xl`}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-450 dark:text-neutral-400 mb-2 font-mono">
          Task App Switcher
        </span>

        {/* Applications Strip */}
        <div className="flex space-x-2.5">
          {windows.map((w, index) => {
            const isActive = index === altTabActiveIndex;
            return (
              <div
                key={w.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setAltTabActiveIndex(index)}
                className={`w-18 h-18 rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-sky-500/15 border-sky-500 text-sky-500 scale-105 shadow-md'
                    : 'border-transparent hover:bg-neutral-150 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 shadow-sm leading-none flex items-center justify-center">
                  {getAppIcon(w.appId, 24)}
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center mt-1.5 leading-none">
                  {w.title.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Application Meta */}
        <div className="mt-3.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 w-full text-center text-xs font-semibold text-neutral-500 dark:text-neutral-300">
          Switch to <span className="text-sky-500 font-extrabold">{windows[altTabActiveIndex]?.title || 'Application'}</span>
        </div>
      </motion.div>
    </div>
  );
}
