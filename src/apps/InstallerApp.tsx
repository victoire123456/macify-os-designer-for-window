import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { HardDrive, Check, ShieldCheck, Download, Laptop, Folder, AlertCircle, Sparkles, Terminal, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallerApp() {
  const {
    isDarkMode,
    addNotification,
    openApp
  } = useMacify();

  const [step, setStep] = useState<number>(1);
  const [installPath, setInstallPath] = useState<string>('C:\\Program Files\\MacifyOS');
  const [createDesktopShortcut, setCreateDesktopShortcut] = useState<boolean>(true);
  const [createStartMenu, setCreateStartMenu] = useState<boolean>(true);
  const [enableAutoUpdate, setEnableAutoUpdate] = useState<boolean>(true);
  const [offlineModeOnly, setOfflineModeOnly] = useState<boolean>(true);
  
  // Progress states
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [currentActionText, setCurrentActionText] = useState<string>('Pre-allocating space...');

  useEffect(() => {
    if (step === 4) {
      setInstallProgress(0);
      const actionSteps = [
        { progress: 12, text: 'Creating safe Windows system restore point...' },
        { progress: 28, text: 'Backing up original desktop layout and user settings files...' },
        { progress: 48, text: 'Mapping Discord, VS Code, Chrome and standard win32 visual wrapper hooks...' },
        { progress: 68, text: 'Configuring safe uninstaller and rollback recovery registries...' },
        { progress: 88, text: 'Mapping direct local folders to interactive Finder nodes...' },
        { progress: 96, text: 'Optimizing background RAM footprint and low CPU standby regimes...' },
        { progress: 100, text: 'MacifyOSSetup.exe complete. Ready!' }
      ];

      let actionIdx = 0;
      const interval = setInterval(() => {
        setInstallProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep(5);
            addNotification(
              'Transformation Interface Configured',
              'Windows Desktop redesigned successfully with full settings and file preservation.',
              'Settings'
            );
            return 100;
          }
          
          if (actionIdx < actionSteps.length && prev >= actionSteps[actionIdx].progress) {
            setCurrentActionText(actionSteps[actionIdx].text);
            actionIdx++;
          }

          return prev + Math.floor(Math.random() * 8) + 2;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Actual mock installer file download trigger!
  const triggerDesktopDownload = () => {
    const text = `===========================================
MACIFY OS NATIVE INDEPENDENT WINDOWS LAUNCHER
===========================================

Your standalone offline desktop environment was compiled.

Launch Instructions:
1. Extract the main ZIP file into any folder (e.g., C:\\Program Files\\MacifyOS)
2. Run 'npm install' to cache direct packages safely.
3. Use 'npm run start' or double click the 'MacifyOffline.bat' wrapper to launch completely disconnected from any active Internet servers.

Features Active:
- Complete Offline support
- Fast startup caches
- Extreme 60 FPS hardware-accelerated animations
- Safe local database storage loop

Enjoy using Macify OS on Windows!`;
    const blob = new Blob([text], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'macify-os-setup.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addNotification('Installer Downloaded', 'macify-os-setup.exe saved locally.', 'System Info');
  };

  return (
    <div className="flex flex-col h-full select-none text-xs font-sans text-neutral-800 dark:text-neutral-200" id="installer-wizard-root">
      {/* Top Banner Accent */}
      <div className="h-16 px-6 bg-linear-to-r from-sky-500 via-indigo-500 to-rose-400 text-white flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-sm font-black tracking-tight uppercase flex items-center">
            <Laptop size={14} className="mr-2" /> Macify OS Windows Installer Setup
          </h2>
          <p className="text-[10px] opacity-80 mt-0.5 font-medium">Configure Offline Standalone Desktop Workspace Client</p>
        </div>
        <div className="absolute right-4 text-white/10 -bottom-4 select-none">
          <HardDrive size={72} className="stroke-[1.5]" />
        </div>
      </div>

      {/* Main Installer Frame Area */}
      <div className="flex-1 bg-neutral-50 dark:bg-neutral-900/40 p-6 flex flex-col justify-between overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome & Setup */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 } as any}
              className="space-y-4 text-xs"
            >
              <div className="flex space-x-4 items-start bg-sky-500/5 dark:bg-sky-550/10 p-4 rounded-xl border border-sky-500/15">
                <ShieldCheck className="text-sky-500 stroke-[2] shrink-0 mt-0.5" size={28} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white leading-tight">Welcome to the Macify OS Transform Wizard</h3>
                  <p className="text-neutral-400 mt-1 dark:text-neutral-300 leading-normal">
                    This wizard deploys the visual transformation layer on top of Windows. <strong>Your original user files, accounts, registry, device drivers, and installed application folders are preserved 100% untouched.</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold font-mono uppercase text-neutral-400">Core Installer Packaging Specifications:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <p className="font-bold text-neutral-700 dark:text-neutral-300">Offline Standalone</p>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Use completely offline without any servers.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <p className="font-bold text-neutral-700 dark:text-neutral-300">Low Resources</p>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Optimized RAM, CPU and ultra fast startup times.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 p-4 flex items-center justify-between bg-neutral-100/20">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Local Setup File</span>
                  <span className="text-[10px] text-neutral-400">macify-os-win64-setup.exe (84 MB)</span>
                </div>
                <button
                  onClick={triggerDesktopDownload}
                  className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold inline-flex items-center justify-center shadow-lg shadow-emerald-500/15 active:scale-95 cursor-pointer transition"
                  title="Get Launcher File"
                >
                  <Download size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: License Agreement */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 } as any}
              className="space-y-3 text-xs"
            >
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white leading-none">Offline Deployment License Agreement</h3>
                <p className="text-[10px] text-neutral-400">Please review and accept terms before deploying offline client hooks.</p>
              </div>

              {/* Scrollable License box */}
              <div className="h-44 overflow-y-auto p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950/80 font-mono text-[9px] text-neutral-500 dark:text-neutral-400 leading-relaxed scrollbar-thin">
                <p className="font-bold text-neutral-700 dark:text-neutral-200 mb-2">=================================
                  END USER LICENSE AGREEMENT
                  =================================</p>
                <p className="mb-2">1. GRANT OF LICENSE: Macify virtual workspace is licensed under this EULA, for personal and professional application. You are permitted to compile local Electron, system service daemon executables, and custom DLL shortcuts on Windows machinery.</p>
                <p className="mb-2">2. OFFLINE CAPABILITY: The local client is self-contained. LocalStorage, cache databases, and static vector assets are buffered inside standard client runtimes, avoiding external telemetry. No telemetry data leaves the computer hosts.</p>
                <p className="mb-2">3. PERFORMANCE RATIO: Code bundles must execute at clean 60 fps. Hardware-accelerated CSS layers and custom spring physics elements must maintain less than 0.5% standby CPU consumption.</p>
                <p>4. WARRANTY: Offered as-is, without direct liabilities. Build, run, and enjoy your pristine macOS Sequoian style desktop wrapper safely.</p>
              </div>

              <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-sky-500" disabled />
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">I accept all clauses of the Offline Deployment Agreement.</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Installation Settings */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 } as any}
              className="space-y-4 text-xs"
            >
              <div className="flex flex-col space-y-1.5">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">Installation Directory Path</label>
                <div className="flex space-x-2">
                  <div className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 font-mono text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                    <span>{installPath}</span>
                    <Folder size={12} className="text-sky-500" />
                  </div>
                  <button
                    onClick={() => {
                      const ans = prompt('Select Windows Destination Directory:', installPath);
                      if (ans) setInstallPath(ans);
                    }}
                    className="px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-bold transition"
                  >
                    Browse...
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-neutral-200 dark:border-neutral-800/40 pt-3">
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Additional Desktop Configurations</label>
                
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="desktopS"
                    checked={createDesktopShortcut}
                    onChange={(e) => setCreateDesktopShortcut(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500"
                  />
                  <label htmlFor="desktopS" className="font-medium cursor-pointer">Assemble interactive Desktop Icon</label>
                </div>

                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="startM"
                    checked={createStartMenu}
                    onChange={(e) => setCreateStartMenu(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500"
                  />
                  <label htmlFor="startM" className="font-medium cursor-pointer">Assemble Start Menu Launcher directory</label>
                </div>

                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="autoU"
                    checked={enableAutoUpdate}
                    onChange={(e) => setEnableAutoUpdate(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500"
                  />
                  <label htmlFor="autoU" className="font-medium cursor-pointer">Optimise updates check loop under background idle regimes</label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Act of Installation Progress */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 } as any}
              className="space-y-5 py-6 text-center text-xs"
            >
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="font-bold text-neutral-900 dark:text-white flex items-center justify-center">
                  <Sparkles size={14} className="mr-2 text-sky-550 animate-pulse" /> Packing local binaries...
                </h3>
                <p className="text-[10px] text-neutral-400">Caching dependencies into offline storage volumes.</p>
              </div>

              {/* Progress Bar container */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-250 dark:border-neutral-850">
                  <div
                    style={{ width: `${installProgress}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-400 rounded-full shadow-inner transition-all duration-150"
                  />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-neutral-450 uppercase tracking-widest px-1">
                  <span>{currentActionText}</span>
                  <span className="font-bold">{installProgress}%</span>
                </div>
              </div>

              <div className="flex flex-col items-center pt-2 space-y-1 text-sky-500/80">
                <span className="font-bold font-mono text-[9px] uppercase flex items-center bg-sky-500/10 p-1.5 px-3 rounded-full">
                  <Terminal size={11} className="mr-1.5" /> SEEDING OFFLINE VIRTUAL SYSTEM PIPELINES
                </span>
              </div>
            </motion.div>
          )}

          {/* Step 5: Success & Complete Experience */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center py-4 text-xs"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Check size={28} className="stroke-[3]" />
              </div>
              
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-bold text-neutral-950 dark:text-white text-sm">Deployment Completed Successfully!</h3>
                <p className="text-neutral-400 leading-normal">
                  Windows shortcuts, launch entries, offline system registries, and host diagnostic proxies have been fully configured.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-500/5 dark:bg-orange-550/10 border border-orange-500/15 text-left text-[11px] leading-relaxed flex items-start space-x-2.5 max-w-sm mx-auto">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={14} />
                <p className="text-neutral-400 dark:text-neutral-300">
                  <span className="font-bold text-orange-500">First Launch sequence:</span> Setup created desktop links. Click <strong>Restart Shell</strong> to observe the premium Sequoian experience.
                </p>
              </div>

              <div className="flex justify-center space-x-2 pt-2">
                <button
                  onClick={triggerDesktopDownload}
                  className="p-3.5 rounded-xl border border-neutral-250 dark:border-neutral-800 font-bold transition flex items-center justify-center hover:bg-neutral-100"
                  title="Save Windows Files"
                >
                  <Download size={14} className="text-neutral-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions with back/next logic */}
        <div className="border-t border-neutral-200 dark:border-neutral-800/40 pt-4 flex justify-between items-center bg-transparent mt-4">
          <span className="text-[10px] font-mono p-0.5 leading-none font-bold uppercase text-neutral-400">
            {step < 4 ? `Step ${step} of 3` : step === 4 ? `Deploying...` : `Status: Completed`}
          </span>

          <div className="space-x-2 flex items-center">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-1.5 border border-neutral-350 dark:border-neutral-800 rounded-lg font-bold hover:bg-neutral-150 transition cursor-pointer"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow shadow-sky-500/10 cursor-pointer"
              >
                Next &gt;
              </button>
            ) : step === 3 ? (
              <button
                onClick={() => setStep(4)}
                className="px-4 py-1.5 font-black uppercase rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow shadow-emerald-500/10 cursor-pointer animate-pulse"
              >
                Install Now
              </button>
            ) : step === 5 ? (
              <button
                onClick={() => {
                  // Restart system/close app simulated
                  window.location.reload();
                }}
                className="px-5 py-1.5 font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
              >
                Finish & Restart Shell
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
