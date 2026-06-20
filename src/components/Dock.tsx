import React, { useState, useRef } from 'react';
import { useMacify } from '../store';
import { AppID } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from './AppIcon';

// Maps app identity string dynamically to physical custom premium macOS icons
export const getAppIcon = (appId: AppID | 'trash' | 'launchpad', size: number = 44, className: string = '') => {
  return <AppIcon appId={appId} size={size} className={className} />;
};

export default function Dock() {
  const {
    dockApps,
    setDockApps,
    windows,
    openApp,
    isDarkMode,
    fileSystem,
    deleteNode,
    addNotification,
    dockSize,
    dockMagnification,
    bouncingApps,
    allApps
  } = useMacify();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [contextMenuApp, setContextMenuApp] = useState<{ appId: AppID; x: number; y: number } | null>(null);

  // Checks if an application has any running windows
  const isAppRunning = (appId: AppID): boolean => {
    return windows.some(w => w.appId === appId);
  };

  // Reordering of apps inside dock (left / right shifts)
  const shiftApp = (index: number, direction: 'left' | 'right') => {
    const nextApps = [...dockApps];
    if (direction === 'left' && index > 0) {
      const temp = nextApps[index];
      nextApps[index] = nextApps[index - 1];
      nextApps[index - 1] = temp;
    } else if (direction === 'right' && index < nextApps.length - 1) {
      const temp = nextApps[index];
      nextApps[index] = nextApps[index + 1];
      nextApps[index + 1] = temp;
    }
    setDockApps(nextApps);
  };

  const handleDockIconClick = (appId: AppID) => {
    openApp(appId);
  };

  const handleRightClick = (e: React.MouseEvent, appId: AppID) => {
    e.preventDefault();
    setContextMenuApp({
      appId,
      x: e.clientX,
      y: e.clientY - 120
    });
  };

  const removePin = (appId: AppID) => {
    if (dockApps.length <= 3) {
      alert('Keep at least some apps in your dock to maintain usability.');
      return;
    }
    setDockApps(dockApps.filter(id => id !== appId));
    setContextMenuApp(null);
  };

  const handleEmptyTrash = () => {
    alert('Trash Cleared. Virtual storage nodes recycled!');
    setContextMenuApp(null);
  };

  // Magnification wave factors
  const getMagnifiedStyle = (index: number) => {
    if (hoveredIdx === null) return { scale: 1, y: 0 };
    const dist = Math.abs(index - hoveredIdx);
    
    // Scale is proportional to custom dockMagnification factor (default 1.35)
    // Offset standard y displacements to prevent overlapping top bounds
    if (dist === 0) return { scale: dockMagnification, y: -(16 * (dockMagnification - 1) / 0.35) };
    if (dist === 1) return { scale: 1 + (dockMagnification - 1) * 0.5, y: -(8 * (dockMagnification - 1) / 0.35) };
    if (dist === 2) return { scale: 1 + (dockMagnification - 1) * 0.15, y: -(2 * (dockMagnification - 1) / 0.35) };
    return { scale: 1, y: 0 };
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none select-none">
      <div
        className={`flex items-end px-4 py-2 rounded-2xl border pointer-events-auto shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-neutral-900/40 border-neutral-800 text-white'
            : 'bg-white/40 border-neutral-200/60 text-neutral-900'
        } backdrop-blur-xl`}
        style={{ height: `${dockSize + 16}px` }}
        onMouseLeave={() => setHoveredIdx(null)}
        id="macify-dock-anchor"
      >
        {/* Core application items */}
        {dockApps.map((appId, i) => {
          const isRunning = isAppRunning(appId);
          const { scale, y } = getMagnifiedStyle(i);
          const isBouncing = bouncingApps.includes(appId);

          // Calculate scaled width
          const containerWidth = dockSize + 6;
          const innerSize = dockSize - 6;
          const iconSize = Math.max(16, dockSize - 22);

          return (
            <div
              key={appId}
              className="relative px-1 cursor-pointer flex flex-col items-center justify-end"
              onMouseEnter={() => setHoveredIdx(i)}
              onClick={() => handleDockIconClick(appId)}
              onContextMenu={(e) => handleRightClick(e, appId)}
              style={{ width: `${containerWidth}px`, height: '100%' }}
            >
              {/* Tooltip or Dynamic App Preview on Hover */}
              {hoveredIdx === i && (() => {
                const runningWins = windows.filter(w => w.appId === appId);
                const hasWindows = runningWins.length > 0;
                const displayName = allApps?.find(a => a.id === appId)?.name || appId.toUpperCase();

                if (hasWindows) {
                  return (
                    <div className="absolute -top-24 px-3 py-2 bg-neutral-900/95 dark:bg-black/95 text-white rounded-xl shadow-2xl border border-neutral-800 pointer-events-none flex flex-col min-w-[130px] z-50 backdrop-blur-md">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-1 mb-1">
                        {displayName}
                      </span>
                      {runningWins.map((w) => (
                        <div key={w.id} className="flex flex-col space-y-0.5 mt-1">
                          <span className="text-[9.5px] font-semibold text-sky-400 truncate max-w-[120px]">
                            {w.title}
                          </span>
                          <span className="text-[8px] text-neutral-500 font-mono">
                            Task ID: {w.id.slice(0, 8)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div className="absolute -top-10 px-2.5 py-1 text-[10px] font-bold tracking-tight bg-neutral-900 text-white rounded-md whitespace-nowrap shadow-md pointer-events-none border border-neutral-800">
                    {displayName}
                  </div>
                );
              })()}

              {/* Icon Container with magnification effect */}
              <motion.div
                animate={isBouncing ? {
                  scale: [1, 1.15, 1, 1.08, 1],
                  y: [0, -32, 0, -14, 0]
                } : { scale, y }}
                transition={isBouncing ? {
                  duration: 0.95,
                  times: [0, 0.28, 0.55, 0.8, 1],
                  ease: "easeInOut"
                } : { type: 'spring', stiffness: 300, damping: 20 }}
                className={`rounded-xl flex items-center justify-center shadow-lg transition-colors relative ${
                  isDarkMode
                    ? 'hover:bg-neutral-800/80 bg-neutral-900/60'
                    : 'hover:bg-neutral-100/85 bg-neutral-50/70'
                }`}
                style={{ width: `${innerSize}px`, height: `${innerSize}px`, padding: '8px' }}
              >
                {getAppIcon(appId, iconSize)}

                {/* Mirror reflection element under icon */}
                <div 
                  className="absolute top-[104%] left-0 right-0 pointer-events-none opacity-25 blur-[1px] origin-top flex items-center justify-center -z-10"
                  style={{ transform: `scaleY(-0.55) translateY(${-innerSize * 0.05}px)` }}
                >
                  {getAppIcon(appId, iconSize)}
                </div>
              </motion.div>

              {/* Running App dot indicator */}
              <div className="h-1 flex items-center justify-center mt-1">
                {isRunning && (
                  <motion.div
                    layoutId={`running-dot-${appId}`}
                    className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-neutral-850'}`}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Separator indicator line */}
        <div className="w-[1px] h-10 bg-neutral-300 dark:bg-neutral-700 mx-2 self-center" />

        {/* Trash & Extras */}
        <div
          className="relative px-1 cursor-pointer flex flex-col items-center justify-end"
          onClick={() => {
            alert('Finder Trash Directory Active. No files are currently cached in physical trash nodes.');
          }}
          style={{ width: '48px', height: '100%' }}
          onMouseEnter={() => setHoveredIdx(dockApps.length)}
        >
          {hoveredIdx === dockApps.length && (
            <div className="absolute -top-10 px-2.5 py-1 text-[10px] font-bold bg-neutral-900 text-white rounded-md whitespace-nowrap shadow-md border border-neutral-800">
              Trash Bin
            </div>
          )}
          <motion.div
            animate={{
              scale: hoveredIdx === dockApps.length ? 1.35 : 1,
              y: hoveredIdx === dockApps.length ? -16 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`p-2 rounded-xl flex items-center justify-center shadow-lg relative ${
              isDarkMode ? 'bg-neutral-900/60' : 'bg-neutral-50/70'
            }`}
            style={{ width: '42px', height: '42px' }}
          >
            {getAppIcon('trash', 22)}

            {/* Trash Mirror reflection */}
            <div 
              className="absolute top-[104%] left-0 right-0 pointer-events-none opacity-25 blur-[0.75px] origin-top flex items-center justify-center -z-10"
              style={{ transform: 'scaleY(-0.55) translateY(-2px)' }}
            >
              {getAppIcon('trash', 22)}
            </div>
          </motion.div>
          <div className="h-1 mt-1" />
        </div>
      </div>

      {/* Floating Right-Click Context Menu for Dock apps */}
      <AnimatePresence>
        {contextMenuApp && (
          <div className="fixed inset-0 z-50 pointer-events-auto" onClick={() => setContextMenuApp(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 } as any}
              style={{ left: contextMenuApp.x, top: contextMenuApp.y }}
              className={`absolute w-52 rounded-xl shadow-2xl border p-1 ${
                isDarkMode ? 'bg-neutral-950 text-neutral-200 border-neutral-800' : 'bg-white text-neutral-850 border-neutral-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1 font-extrabold text-[10px] uppercase tracking-wider text-neutral-400">
                {contextMenuApp.appId} Options
              </div>

              <button
                onClick={() => {
                  openApp(contextMenuApp.appId);
                  setContextMenuApp(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs text-current font-medium hover:bg-sky-600 hover:text-white rounded-md"
              >
                Open Application
              </button>

              <button
                onClick={() => removePin(contextMenuApp.appId)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-sky-600 hover:text-white rounded-md text-orange-500 font-semibold"
              >
                Remove from Dock
              </button>

              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

              {/* Simple reordering buttons */}
              <div className="flex items-center space-x-1 px-3 py-1.5 justify-between">
                <span className="text-[10px] text-neutral-400 font-bold">Shift Dock Slot:</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      const idx = dockApps.indexOf(contextMenuApp.appId);
                      shiftApp(idx, 'left');
                      setContextMenuApp(null);
                    }}
                    className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-sky-500 hover:text-white text-[9px] font-bold"
                  >
                    ← Left
                  </button>
                  <button
                    onClick={() => {
                      const idx = dockApps.indexOf(contextMenuApp.appId);
                      shiftApp(idx, 'right');
                      setContextMenuApp(null);
                    }}
                    className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-sky-500 hover:text-white text-[9px] font-bold"
                  >
                    Right →
                  </button>
                </div>
              </div>

              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

              <button
                onClick={handleEmptyTrash}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs text-rose-500 font-bold hover:bg-rose-500/10 rounded-md"
              >
                Clean Recycled Buffers
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
