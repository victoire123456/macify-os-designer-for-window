import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Apple, Play, Volume2 } from 'lucide-react';
import AppLogo from './AppLogo';

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [bootBegun, setBootBegun] = useState(false);

  // Auto-fill progress bar
  useEffect(() => {
    if (!bootBegun) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // randomized speed steps
        const step = Math.floor(Math.random() * 12) + 4;
        return Math.min(100, prev + step);
      });
    }, 180);

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
    // Mimic the classic high fidelity startup sound via visual feedback or playing synthesised web audio
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // G-chord rich warm frequencies
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
      console.log("Audio boot frequency sound synthesize blocked by user sandbox permissions.");
    }
  };

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Show splash press-button triggers if audio autoplay protection is strict or automatically begin setup
    const initialDelay = setTimeout(() => {
      setShowButton(true);
    }, 200);
    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-center select-none text-white">
      {!bootBegun ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 flex flex-col items-center"
        >
          {/* Logo Button - Interactive and fully filled with loge.png */}
          <button
            onClick={handleStartBoot}
            className="w-28 h-28 rounded-[32px] overflow-hidden bg-neutral-950 border border-neutral-800 hover:border-sky-500/80 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group relative flex items-center justify-center p-0"
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
            {/* Subtle glow border overlay on hover */}
            <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />
          </button>
          
          <div className="mt-5 text-[10px] tracking-[0.25em] font-bold text-neutral-500 hover:text-white transition duration-300 uppercase pointer-events-none select-none">
            Click to Launch
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-14 text-white"
          >
            <AppLogo size={64} className="fill-current text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)]" />
          </motion.div>

          {/* Symmetrical simple white progress bar load cycles */}
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden relative border border-white/5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-white rounded-full shadow-inner"
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <p className="mt-4 font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
            {progress < 40
              ? 'Initializing Win32 Bridge...'
              : progress < 75
              ? 'Loading Sequoia Workspace Canvas...'
              : 'Opening Finder session...'}
          </p>
        </div>
      )}
    </div>
  );
}
