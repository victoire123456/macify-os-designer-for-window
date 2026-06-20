import React from 'react';
import { useMacify } from '../store';
import { Monitor, X, LayoutGrid, Layers, HelpCircle } from 'lucide-react';
import { getAppIcon } from './Dock';
import { motion } from 'motion/react';

export default function MissionControl() {
  const {
    setMissionControlOpen,
    windows,
    focusApp,
    activeWorkspace,
    isDarkMode
  } = useMacify();

  // Render open windows on grid layers
  const handleSelectWindow = (id: string) => {
    focusApp(id);
    setMissionControlOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-2xl flex flex-col justify-start select-none py-10 px-8 text-white"
      id="macify-mission-control"
    >
      {/* Workspace bar (Desktops) */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 mb-10 border-b border-neutral-800">
        <span className="font-extrabold text-sm tracking-tight flex items-center">
          <Layers size={16} className="mr-2 text-sky-500" /> Macify Workspaces (Mission Control)
        </span>
        
        {/* Desktops Selection */}
        <div className="flex items-center space-x-3">
          {[1, 2].map(workspaceNum => (
            <button
              key={workspaceNum}
              onClick={() => alert(`Workspace ${workspaceNum} activated.`)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center cursor-pointer border ${
                activeWorkspace === workspaceNum
                  ? 'bg-sky-500 text-white border-sky-400 font-extrabold shadow-lg'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
            >
              <Monitor size={11} className="mr-1.5" /> Desktop {workspaceNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMissionControlOpen(false)}
          className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Grid of open window representations */}
      <div className="flex-1 max-w-6xl mx-auto w-full overflow-y-auto">
        {windows.length === 0 ? (
          <div className="text-center py-20 text-neutral-450 flex flex-col items-center">
            <LayoutGrid size={56} className="stroke-1 text-neutral-700 mb-4" />
            <h4 className="font-bold text-sm text-neutral-400">No Open Windows</h4>
            <p className="text-xs opacity-75 mt-0.5">Boot applications from the Launchpad or Dock first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {windows.map((w, index) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleSelectWindow(w.id)}
                className={`p-4 rounded-xl border border-neutral-700 hover:border-sky-500 bg-neutral-900/40 relative cursor-pointer shadow-lg hover:shadow-2xl transition duration-150 ${
                  w.isMinimized ? 'opacity-50' : ''
                }`}
              >
                {/* Header preview line */}
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-neutral-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold tracking-tight text-neutral-300 ml-1 truncate max-w-[150px]">
                      {w.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded text-sky-400">
                    {w.appId}
                  </span>
                </div>

                {/* Simulated inner thumbnail grid placeholder for visual fidelity */}
                <div className="h-32 rounded-lg bg-neutral-950/40 border border-neutral-850 flex flex-col items-center justify-center p-3 text-center text-[11px] text-neutral-400">
                  <div className="p-2 sm:p-2.5 bg-neutral-900 rounded-lg mb-1 shadow-md">
                    {getAppIcon(w.appId, 24)}
                  </div>
                  <span className="font-bold">{w.title} App View</span>
                  {w.isMinimized ? (
                    <span className="text-[10px] font-mono text-amber-500/90 font-bold mt-1">
                      [ Minimized to Dock ]
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-500 font-mono mt-0.5">[ Layer Active ]</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-neutral-450 mt-10">
        💡 Keyboard Trigger Tip: Press <kbd className="px-1.5 py-0.5 bg-neutral-800 border-neutral-700/80 rounded font-bold text-[10px]">Ctrl + ↑</kbd> or click wallpaper empty space to open Mission Control.
      </div>
    </motion.div>
  );
}
