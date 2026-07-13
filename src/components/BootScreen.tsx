import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Play, Download, Globe, Shield, Laptop, Monitor, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useMacify } from '../store';
import AppLogo from './AppLogo';

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const { 
    deferredPrompt, 
    setDeferredPrompt, 
    pwaInteracted, 
    setPwaInteracted, 
    addNotification 
  } = useMacify();

  const [progress, setProgress] = useState(0);
  const [bootBegun, setBootBegun] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top);
    } catch (e) {
      setIsIframe(true);
    }
  }, []);

  // Detect if running as standalone PWA
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches || 
    (navigator as any).standalone === true;

  // Track if user has completed the installer interaction in the current screen
  const [installerInteracted, setInstallerInteracted] = useState(() => {
    return pwaInteracted || isStandalone;
  });

  // Auto-fill progress bar when booting is active
  useEffect(() => {
    if (!bootBegun) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // randomized speed steps for a realistic boot sequence
        const step = Math.floor(Math.random() * 14) + 5;
        return Math.min(100, prev + step);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [bootBegun]);

  // Handle boot completion cleanly when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onBootComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onBootComplete]);

  const handleStartBoot = () => {
    setBootBegun(true);
    // Synthesize the classic premium macOS start chime!
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const frequencies = [220, 275, 330, 440, 550, 660];
      frequencies.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.12 - idx * 0.015, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.8);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 3.0);
      });
    } catch (e) {
      console.log("Audio boot frequency sound synthesize blocked by browser autoplay rules.");
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          addNotification(
            '🎉 Installation Started', 
            'Macify OS is being added to your desktop workspaces.', 
            'System Kernel'
          );
        }
      } catch (err) {
        console.error('Error in prompt choice:', err);
      }
      setDeferredPrompt(null);
    } else {
      // Simulate if PWA trigger is blocked/unsupported (e.g. inside an iframe)
      addNotification(
        '🚀 Simulation Mode', 
        'Browser frame sandbox detected. Macify OS simulated native desktop install successfully.', 
        'System Kernel'
      );
    }
    
    // Set interacted to true to unlock the Start button
    setPwaInteracted(true);
    setInstallerInteracted(true);
  };

  const handleRejectInstall = () => {
    setPwaInteracted(true);
    setInstallerInteracted(true);
    addNotification(
      '🌐 Browser Mode', 
      'Running Macify OS in standard browser session. High fidelity canvas enabled.', 
      'System Kernel'
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 z-[9999999] flex flex-col items-center justify-center select-none text-white font-sans overflow-hidden">
      {/* Dynamic ambient organic light flow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-500/10 via-indigo-500/5 to-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-30" />

      {!bootBegun ? (
        <AnimatePresence mode="wait">
          {!installerInteracted ? (
            /* INTERACTIVE PWA CHOOSE STEP (Asked to install or reject first) */
            <motion.div
              key="installer-step"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 } as any}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative max-w-lg w-[calc(100vw-3rem)] rounded-[32px] border border-white/10 p-8 backdrop-blur-3xl bg-neutral-900/60 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col items-center text-center space-y-7 z-10"
              id="pwa-installer-modal"
            >
              {/* Elegant header glow and badge */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold font-mono uppercase tracking-widest flex items-center space-x-1.5 shadow-sm">
                <Sparkles size={11} className="animate-pulse" />
                <span>Launch Assistant v14.1</span>
              </div>

              {/* High precision Apple design system icon block */}
              <div className="w-20 h-20 rounded-[24px] bg-neutral-950 flex items-center justify-center border border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.5)] overflow-hidden">
                <AppLogo size={74} />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Choose Workspace Mode</h2>
                <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  To experience premium macOS Sequoia frameless workspaces, custom offline support, and system key-mappings, install the app directly.
                </p>
              </div>

              {/* Dynamic Step-by-Step Native Installation Helper Guides */}
              {isIframe ? (
                <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                    <AlertCircle size={14} />
                    <span>Sandbox Sandbox Frame Detected</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-normal">
                    To install this app natively onto your computer:
                  </p>
                  <ol className="list-decimal list-inside text-[10px] text-neutral-400 space-y-1 pl-1">
                    <li>Click the <strong className="text-white">"Open in New Tab"</strong> button in the top-right corner of the preview.</li>
                    <li>Once open in a new browser tab, click <strong className="text-white">"Install App"</strong> to save Macify OS instantly onto your desktop or taskbar!</li>
                  </ol>
                </div>
              ) : (
                <div className="w-full bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
                    <Info size={14} />
                    <span>Desktop App Installation</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-normal">
                    Click <strong className="text-white">"Install App"</strong> below to download Macify OS directly to your local computer. It will launch in a dedicated frameless workspace and support offline startup.
                  </p>
                  {!deferredPrompt && (
                    <p className="text-[10px] text-neutral-400 italic">
                      Tip: If the prompt doesn't open automatically, click the <strong className="text-neutral-300">Install (+) Icon</strong> in your browser's address bar.
                    </p>
                  )}
                </div>
              )}

              {/* Two Option Cards side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* OPTION A: Install (PWA) */}
                <button
                  onClick={handleInstallApp}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-2 border-sky-500/40 hover:border-sky-500 bg-sky-950/20 hover:bg-sky-500/10 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="w-11 h-11 rounded-full bg-sky-500/15 flex items-center justify-center mb-3 text-sky-400 group-hover:scale-110 transition-transform">
                    <Download size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">Install App</h3>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Frameless screen, taskbar integration, and offline utility.
                  </p>
                </button>

                {/* OPTION B: Browser Mode (Reject) */}
                <button
                  onClick={handleRejectInstall}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center mb-3 text-neutral-400 group-hover:scale-110 transition-transform">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">Standard Browser Mode</h3>
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Quick launch directly inside your regular web browser tab.
                  </p>
                </button>
              </div>

              {/* Subtle secure footer */}
              <div className="flex items-center space-x-1.5 text-[10px] text-neutral-500 font-medium">
                <Shield size={11} className="text-neutral-500" />
                <span>Zero configuration required • Sandbox safe</span>
              </div>
            </motion.div>
          ) : (
            /* SYSTEM START/LAUNCH BUTTON (Unlocked after interaction) */
            <motion.div
              key="launch-step"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 } as any}
              className="text-center p-8 flex flex-col items-center z-10 space-y-6"
            >
              {/* Pulsing launcher button */}
              <button
                onClick={handleStartBoot}
                className="w-28 h-28 rounded-[32px] overflow-hidden bg-neutral-950 border border-neutral-800 hover:border-sky-500/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group relative flex items-center justify-center p-0"
                title="Launch Macify OS"
              >
                {!imgError ? (
                  <img 
                    src="/loge.png" 
                    alt="Macify OS" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Apple size={52} className="text-white animate-pulse" />
                )}
                {/* Glow ring layout on hover */}
                <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />
              </button>
              
              <div className="text-center">
                <div className="text-[10px] tracking-[0.25em] font-extrabold text-sky-400 animate-pulse uppercase pointer-events-none">
                  Start Macify Shell
                </div>
                <p className="text-[10px] text-neutral-500 font-semibold mt-1 font-mono">
                  {isStandalone ? 'NATIVE APPLICATION ACTIVE' : 'BROWSER SESSION READY'}
                </p>
              </div>

              {/* Extra prominent helper option to install the App directly from the start screen if not running standalone */}
              {!isStandalone && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleInstallApp}
                  className="px-5 py-2 rounded-full text-xs font-bold border border-white/10 hover:border-sky-500/50 bg-white/5 hover:bg-sky-500/15 text-neutral-300 hover:text-white transition-all duration-300 flex items-center space-x-2 shadow-md cursor-pointer hover:scale-105"
                >
                  <Download size={14} className="text-sky-400" />
                  <span>Install App</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        /* BOOT PROGRESS CYCLE SCREEN */
        <div className="flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-14 text-white"
          >
            <AppLogo size={64} className="fill-current text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)]" />
          </motion.div>

          {/* Symmetrical simple white progress bar load cycles */}
          <div className="w-52 h-1 bg-neutral-800 rounded-full overflow-hidden relative border border-white/5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-white rounded-full shadow-inner"
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <p className="mt-4 font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
            {progress < 40
              ? 'Initializing Virtual Subsystems...'
              : progress < 75
              ? 'Loading Sequoia Workspace Canvas...'
              : 'Opening Finder session...'}
          </p>
        </div>
      )}
    </div>
  );
}
