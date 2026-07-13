import React from 'react';
import { useMacify } from '../store';
import { motion } from 'motion/react';
import { Play, Cpu, HardDrive, Zap, Info, ShieldAlert } from 'lucide-react';
import AppLogo from './AppLogo';

export default function PowerOffConsole() {
  const { startSystem, addNotification } = useMacify();

  const handleStartShell = () => {
    startSystem();
    // Start notification will be fired upon Boot completion in App.tsx
  };

  return (
    <div className="fixed inset-0 bg-radial from-neutral-900 to-black select-none text-white z-[999999] flex flex-col items-center justify-center font-sans p-6">
      {/* Background grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative max-w-md w-full rounded-[32px] border border-white/5 p-8 text-center backdrop-blur-2xl bg-neutral-950/70 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center space-y-6"
        id="macify-power-off-card"
      >
        {/* Decorative ambient top glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-rose-500/10 blur-[60px] pointer-events-none" />

        {/* Macify logo frame with off-state border */}
        <div className="w-20 h-20 rounded-3xl bg-neutral-950 flex items-center justify-center border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          <AppLogo size={68} className="opacity-40 grayscale" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Macify OS Subsystems Offline</h2>
          <p className="text-xs text-neutral-400 mt-1.5 max-w-xs mx-auto">
            The shell engine has been powered down gracefully. All active window threads and rendering layers have been closed.
          </p>
        </div>

        {/* Glowing pulsing Play / Start Shell action trigger */}
        <button
          onClick={handleStartShell}
          className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_0_40px_rgba(14,165,233,0.35)] hover:shadow-[0_0_50px_rgba(14,165,233,0.55)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
          id="macify-power-start-button"
          title="Boot Macify OS Engine"
        >
          {/* Animated ripple circle */}
          <span className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping group-hover:animate-none pointer-events-none" />
          <Play size={32} className="fill-white translate-x-0.5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]" />
        </button>

        <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-sky-400 animate-pulse">
          Click to Start Engine
        </p>

        {/* Diagnostic Metrics */}
        <div className="w-full bg-neutral-900/40 rounded-2xl border border-white/5 p-4 text-left space-y-2.5 font-mono text-[10px]">
          <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-neutral-500 border-b border-white/5 pb-1.5 flex items-center justify-between">
            <span>System Standby Profile</span>
            <span className="flex items-center space-x-1 text-rose-500">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Offline</span>
            </span>
          </h4>

          <div className="flex justify-between items-center text-neutral-400">
            <span className="flex items-center"><Cpu size={10} className="mr-1.5 text-neutral-500" /> Virtualized Kernel</span>
            <span className="text-neutral-500">STANDBY</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400">
            <span className="flex items-center"><HardDrive size={10} className="mr-1.5 text-neutral-500" /> Storage State</span>
            <span className="text-emerald-500 font-bold">SQLITE_SYNCD</span>
          </div>

          <div className="flex justify-between items-center text-neutral-400">
            <span className="flex items-center"><Zap size={10} className="mr-1.5 text-neutral-500" /> Active Threads</span>
            <span className="text-neutral-500">0 IDLE</span>
          </div>
        </div>

        <div className="text-[9px] text-neutral-500 font-medium">
          Macify OS v14.1 Sequoia • PWA Ready
        </div>
      </motion.div>
    </div>
  );
}
