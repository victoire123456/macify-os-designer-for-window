import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Download, X } from 'lucide-react';
import AppLogo from './AppLogo';

export default function InstallPrompt() {
  const { addNotification, isDarkMode } = useMacify();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect if running as standalone PWA
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;

    const isDismissed = localStorage.getItem('macify_install_dismissed') === 'true';

    if (isStandalone || isDismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Stagger slightly for premium entrance feel after page load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('macify_install_dismissed', 'true');
      addNotification(
        '🎉 Installation Success', 
        'Macify OS has been installed as a native desktop application. Enjoy!', 
        'System Kernel'
      );
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [addNotification]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowPrompt(false);
    deferredPrompt.prompt();
    
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        addNotification(
          '🎉 Installation Started', 
          'Macify OS installation has been accepted.', 
          'System Kernel'
        );
      } else {
        addNotification(
          'ℹ️ Installation Cancelled', 
          'Installation cancelled. You can install anytime from the browser address bar.', 
          'System Kernel'
        );
      }
    } catch (err) {
      console.error('Error during PWA installation choice:', err);
    }
    setDeferredPrompt(null);
  };

  const handleNotNowClick = () => {
    setShowPrompt(false);
    localStorage.setItem('macify_install_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 } as any}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-[999999] max-w-sm w-[calc(100vw-3rem)] rounded-2xl border border-white/25 dark:border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 text-neutral-850 dark:text-neutral-100 flex flex-col space-y-4 font-sans"
          id="macify-pwa-install-prompt"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-neutral-950 flex items-center justify-center shadow-lg border border-white/15 overflow-hidden">
                <AppLogo size={42} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Desktop App</h4>
                <p className="text-sm font-semibold tracking-tight">Macify OS Environment</p>
              </div>
            </div>
            <button 
              onClick={handleNotNowClick}
              className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Main Text */}
          <p className="text-xs leading-normal font-medium opacity-90">
            Install Macify OS for the best desktop experience.
          </p>

          {/* Buttons */}
          <div className="flex items-center space-x-2.5 pt-1">
            <button
              onClick={handleNotNowClick}
              className="flex-1 px-4 py-2 rounded-xl text-xs font-bold border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer text-center"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer text-center flex items-center justify-center space-x-1.5"
            >
              <Download size={13} />
              <span>Install</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
