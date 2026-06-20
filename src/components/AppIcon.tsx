import React from 'react';

interface AppIconProps {
  appId: string;
  size?: number;
  className?: string;
}

export default function AppIcon({ appId, size = 48, className = '' }: AppIconProps) {
  const normId = appId.toLowerCase();

  // Unified outer container styles for standard macOS round squircles
  const getContainerStyle = () => {
    switch (normId) {
      case 'finder':
        return 'bg-gradient-to-b from-[#7bc1ff] via-[#1a81ff] to-[#004bb5]';
      case 'safari':
        return 'bg-gradient-to-b from-[#fdfdfd] via-[#f5f5f7] to-[#e1e1e4]';
      case 'vscode':
        return 'bg-gradient-to-b from-[#2d2d30] via-[#1e1e1f] to-[#121213]';
      case 'spotify':
        return 'bg-gradient-to-b from-[#222326] via-[#18191a] to-[#0f1012]';
      case 'settings':
        return 'bg-gradient-to-b from-[#fcfcfd] via-[#dee0e3] to-[#c7c9cc]';
      case 'calculator':
        return 'bg-gradient-to-b from-[#5c5c5e] via-[#3a3a3c] to-[#1e1e1f]';
      case 'notepad':
        return 'bg-gradient-to-b from-[#fff6d1] via-[#ffd670] to-[#f2b23a]';
      case 'terminal':
        return 'bg-gradient-to-b from-[#3a3a3c] via-[#242426] to-[#1c1c1e]';
      case 'discord':
        return 'bg-gradient-to-b from-[#7f8ff4] via-[#5865f2] to-[#404eed]';
      case 'telegram':
        return 'bg-gradient-to-b from-[#3ba2e8] via-[#2481cc] to-[#1561a1]';
      case 'edge':
        return 'bg-gradient-to-b from-[#ffffff] to-[#eef7ff]';
      case 'vlc':
        return 'bg-gradient-to-b from-[#ff8d3b] via-[#ff5a00] to-[#ca4100]';
      case 'obs':
        return 'bg-gradient-to-b from-[#4a4d53] via-[#242629] to-[#0f1011]';
      case 'steam':
        return 'bg-gradient-to-b from-[#2d4e6d] via-[#1b2838] to-[#10141a]';
      case 'photoshop':
        return 'bg-gradient-to-b from-[#0e3a5f] via-[#001c3a] to-[#000a18]';
      case 'notepadplusplus':
        return 'bg-gradient-to-b from-[#99f071] via-[#2eaf13] to-[#105e04]';
      case 'word':
        return 'bg-gradient-to-b from-[#4176cc] via-[#245394] to-[#103061]';
      case 'excel':
        return 'bg-gradient-to-b from-[#32af32] via-[#1e6b41] to-[#0d3c20]';
      case 'powerpoint':
        return 'bg-gradient-to-b from-[#f55a33] via-[#cb3618] to-[#7f1805]';
      case 'launchpad':
        return 'bg-gradient-to-b from-white/35 via-white/10 to-transparent backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]';
      case 'creatorhub':
        return 'bg-gradient-to-b from-[#0a0f1d] via-[#111827] to-[#1e1b4b] border-[0.5px] border-sky-500/25 shadow-[inset_0_1.5px_1.5px_rgba(56,189,248,0.3)]';
      case 'taskmanager':
        return 'bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#111827]';
      case 'trash':
      case 'trash-full':
        return 'bg-transparent'; // Trash has transparent backdrop since it is a physical basket
      default:
        return 'bg-gradient-to-b from-sky-400 to-sky-700';
    }
  };

  const ringStyle = normId === 'trash' || normId === 'trash-full' 
    ? '' 
    : 'shadow-[0_4px_10px_rgba(0,0,0,0.18),0_1.5px_3.5px_rgba(0,0,0,0.12),inset_0_0.75px_0.75px_rgba(255,255,255,0.45),inset_0_-0.75px_0.75px_rgba(0,0,0,0.12)] border-[0.5px] border-black/15';

  // Specific high fidelity vector glyphs matching Apple's SF system style
  const renderGlyph = () => {
    switch (normId) {
      case 'finder':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Split face background */}
            <path d="M12 64C12 28 28 12 64 12V116C28 116 12 100 12 64Z" fill="url(#finder-left)" />
            <path d="M64 12C100 12 116 28 116 64C116 100 100 116 64 116V12Z" fill="url(#finder-right)" />
            
            {/* Center Separation Nose curve profile */}
            <path d="M64 12C68 34 50 49 55 68C60 85 64 94 64 116" stroke="#001d4a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Eyes */}
            <circle cx="38" cy="52" r="7.5" fill="#001d4a" />
            <circle cx="90" cy="52" r="7.5" fill="#001d4a" />

            {/* Smilin mouth */}
            <path d="M34 80C34 94 94 94 94 80" stroke="#001d4a" strokeWidth="6.5" strokeLinecap="round" />
            
            <defs>
              <linearGradient id="finder-left" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#82c7ff" />
                <stop offset="100%" stopColor="#1a81ff" />
              </linearGradient>
              <linearGradient id="finder-right" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ca1ff" />
                <stop offset="100%" stopColor="#0152cb" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'safari':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Compass Outer Bezel */}
            <circle cx="64" cy="64" r="48" fill="url(#safari-dial-bg)" stroke="#b8b8ba" strokeWidth="2.5" />
            
            {/* Rotating coordinates ring */}
            <circle cx="64" cy="64" r="40" stroke="#b0b0b3" strokeWidth="1" strokeDasharray="3 5" />
            
            {/* Compass needles */}
            {/* Red pointer */}
            <path d="M64 64L76 40L64 24L52 40L64 64Z" fill="url(#safari-red)" filter="drop-shadow(0 2px 3px rgba(184,0,0,0.3))" />
            {/* Silver pointer */}
            <path d="M64 64L52 88L64 104L76 88L64 64Z" fill="url(#safari-silver)" filter="drop-shadow(0 -2px 3px rgba(0,0,0,0.15))" />
            
            {/* Center knob */}
            <circle cx="64" cy="64" r="4.5" fill="#fcfcfd" stroke="#68686a" strokeWidth="1.5" />

            <defs>
              <linearGradient id="safari-dial-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e5efff" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d2e3fc" />
              </linearGradient>
              <linearGradient id="safari-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5e62" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
              <linearGradient id="safari-silver" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e0e0e0" />
                <stop offset="100%" stopColor="#8e8e93" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'vscode':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 84L46 102V26L22 44L14 49V79L22 84Z" fill="#1f9cfd" opacity="0.85" />
            <path d="M106 44L82 26V102L106 84L114 79V49L106 44Z" fill="#a480ff" opacity="0.85" />
            <path d="M82 26L46 102L14 49L82 26Z" fill="url(#vscode-blue-grad)" />
            <path d="M46 26L82 102L114 49L46 26Z" fill="url(#vscode-purple-grad)" />
            
            <circle cx="64" cy="64" r="4" fill="#ffffff" className="animate-pulse" />

            <defs>
              <linearGradient id="vscode-blue-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#007acc" />
                <stop offset="100%" stopColor="#1f9cfd" />
              </linearGradient>
              <linearGradient id="vscode-purple-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6721a3" />
                <stop offset="100%" stopColor="#b474ff" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'spotify':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Spotify Green Circular badge embossed in dark shell */}
            <circle cx="64" cy="64" r="46" fill="#1db954" stroke="#000000" strokeWidth="0.5" />
            
            {/* Precise curves */}
            <path d="M34 46C48 41.5 78 41.5 94 46" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <path d="M39 60C51 56 75 56 89 60" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
            <path d="M43 74C52 71 70 71 83 74" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        );

      case 'settings':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Intersecting metallic gear rings with shadow detail */}
            <g filter="url(#gear-shadow)">
              <circle cx="64" cy="64" r="32" fill="#d1d1d6" stroke="#8e8e93" strokeWidth="8" />
              {/* Gear teeth representations */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <rect
                  key={angle}
                  x="60"
                  y="20"
                  width="8"
                  height="12"
                  rx="1.5"
                  fill="#bcbcc0"
                  stroke="#8e8e93"
                  strokeWidth="1.5"
                  transform={`rotate(${angle} 64 64)`}
                />
              ))}
              <circle cx="64" cy="64" r="14" fill="#dee0e2" stroke="#48484a" strokeWidth="3" />
              <circle cx="64" cy="64" r="5" fill="#3a3a3c" />
            </g>
            <defs>
              <filter id="gear-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodOpacity="0.3" />
              </filter>
            </defs>
          </svg>
        );

      case 'calculator':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Digital grid elements */}
            <rect x="20" y="20" width="88" height="24" rx="4" fill="#1c1c1e" stroke="#3a3a3c" strokeWidth="1.5" />
            {/* Simulated green LCD readout text */}
            <rect x="88" y="28" width="14" height="8" rx="1" fill="#ff9f0a" />
            
            {/* Keyboard grids */}
            <g fill="#bfbfbf">
              <rect x="20" y="54" width="18" height="14" rx="3.5" fill="#fcfcfd" />
              <rect x="43" y="54" width="18" height="14" rx="3.5" fill="#fcfcfd" />
              <rect x="66" y="54" width="18" height="14" rx="3.5" fill="#fcfcfd" />
              <rect x="89" y="54" width="18" height="14" rx="3.5" fill="#ff9f0a" />

              <rect x="20" y="74" width="18" height="14" rx="3.5" fill="#8e8e93" />
              <rect x="43" y="74" width="18" height="14" rx="3.5" fill="#8e8e93" />
              <rect x="66" y="74" width="18" height="14" rx="3.5" fill="#8e8e93" />
              <rect x="89" y="74" width="18" height="14" rx="3.5" fill="#ff9f0a" />

              <rect x="20" y="94" width="41" height="14" rx="3.5" fill="#8e8e93" />
              <rect x="66" y="94" width="18" height="14" rx="3.5" fill="#8e8e93" />
              <rect x="89" y="94" width="18" height="14" rx="3.5" fill="#ff9f0a" />
            </g>

            {/* Arithmetic signs symbols */}
            <text x="94" y="65" fill="#ffffff" fontFamily="sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle">÷</text>
            <text x="94" y="85" fill="#ffffff" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">×</text>
            <text x="94" y="105" fill="#ffffff" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">=</text>
          </svg>
        );

      case 'notepad':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bottom Pages stacked look */}
            <path d="M16 32V112C16 116 20 120 24 120H104C108 120 112 116 112 112V32" fill="#faf9f5" />
            <path d="M18 30V110H110V30" fill="#fdfcf7" />
            
            {/* Top header leather binding */}
            <path d="M14 12C14 12 114 12 114 12C114 26 100 30 64 30C28 30 14 26 14 12Z" fill="url(#leather-top)" />
            
            {/* Double stitch circles */}
            <circle cx="28" cy="19" r="2.5" fill="#fcdb75" />
            <circle cx="100" cy="19" r="2.5" fill="#fcdb75" />

            {/* Notebook lines */}
            <line x1="28" y1="46" x2="100" y2="46" stroke="#90b1e4" strokeWidth="1.5" />
            <line x1="28" y1="62" x2="100" y2="62" stroke="#cbd7e9" strokeWidth="1" />
            <line x1="28" y1="78" x2="100" y2="78" stroke="#cbd7e9" strokeWidth="1" />
            <line x1="28" y1="94" x2="100" y2="94" stroke="#cbd7e9" strokeWidth="1" />
            <line x1="28" y1="110" x2="100" y2="110" stroke="#cbd7e9" strokeWidth="1" />
            
            {/* Left red margin line */}
            <line x1="42" y1="34" x2="42" y2="120" stroke="#ff8484" strokeWidth="1" />

            <defs>
              <linearGradient id="leather-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bf6c00" />
                <stop offset="100%" stopColor="#5c3100" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'terminal':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="16" width="100" height="96" rx="14" fill="#0c0d10" stroke="#48484a" strokeWidth="3" />
            <rect x="15" y="17" width="98" height="24" rx="13" fill="#242529" />
            {/* Core Apple control dots */}
            <circle cx="28" cy="29" r="3.5" fill="#ff5f56" />
            <circle cx="40" cy="29" r="3.5" fill="#ffbd2e" />
            <circle cx="52" cy="29" r="3.5" fill="#27c93f" />

            {/* Prompts terminal indicator */}
            <path d="M28 58L42 68L28 78" stroke="#4ef037" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="49" y="74" width="22" height="4.5" fill="#4ef037" className="animate-pulse" />
          </svg>
        );

      case 'discord':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Discord pure white representation controller */}
            <path d="M96.4 34.6C89 31.1 81 28.9 72.8 28C71.8 29.8 70.6 32.2 69.8 34.1C61 32.8 52.2 32.8 43.6 34.1C42.8 32.2 41.6 29.8 40.6 28C32.3 28.9 24.3 31.2 16.9 34.6C1.9 57.3 -2.1 79.4 1 101C11 108.4 20.6 113 30.1 116C32.5 112.7 34.6 109.1 36.4 105.3C33 104 29.6 102.4 26.5 100.4C27.3 99.8 28.1 99.2 28.9 98.5C48.2 107.5 69.2 107.5 88.2 98.5C89 99.2 89.8 99.8 90.6 100.4C87.4 102.4 84.1 104 80.7 105.3C82.5 109.1 84.6 112.7 87 116C96.5 113 106.3 108.4 116.2 101C119.8 74.3 110.3 52.4 96.4 34.6ZM42.6 86.6C36.9 86.6 32.1 81.3 32.1 74.9C32.1 68.5 36.7 63.2 42.6 63.2C48.5 63.2 53.1 68.5 52.9 74.9C52.9 81.3 48.3 86.6 42.6 86.6ZM85.5 86.6C79.8 86.6 75.1 81.3 75.1 74.9C75.1 68.5 79.7 63.2 85.5 63.2C91.4 63.2 96 68.5 95.8 74.9C95.8 81.3 91.2 86.6 85.5 86.6Z" fill="#ffffff" />
          </svg>
        );

      case 'telegram':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Telegram Origami Paper Plane */}
            <path d="M98.5 32L18.5 63.5C17.5 64 17.5 65.5 19 66L39.5 72.5L88 41.5C88.5 41 89 42 88.2 42.8L48.8 79L45.5 94.5C45.2 96 47 97 48 95.8L59.5 84.5L78.5 99.2C79.5 100 81 99.5 81.2 98.2L101.8 34.2C102.2 32.8 100 31.4 98.5 32Z" fill="#ffffff" />
          </svg>
        );

      case 'edge':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#edge-back-shadow)">
              <path d="M64 16C50 16 35 24 24 38C13 52 14 74 24 88C34 102 54 114 74 112C94 110 108 92 112 74C116 56 104 38 88 24C80 18 70 16 64 16Z" fill="url(#edge-radial)" />
              <path d="M112 74C114 62 108 48 98 42C86 35 68 38 52 48C36 58 35 78 44 92C53 106 72 112 88 108C104 104 111 88 112 74Z" fill="url(#edge-front)" />
              <circle cx="64" cy="64" r="16" fill="#005ca5" opacity="0.15" />
            </g>
            <defs>
              <linearGradient id="edge-front" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00c3ff" />
                <stop offset="100%" stopColor="#0063d8" />
              </linearGradient>
              <radialGradient id="edge-radial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22f0c7" />
                <stop offset="60%" stopColor="#00aa92" />
                <stop offset="100%" stopColor="#003760" />
              </radialGradient>
              <filter id="edge-back-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="3" stdDeviation="3.5" floodOpacity="0.25" />
              </filter>
            </defs>
          </svg>
        );

      case 'launchpad':
        return (
          <div className="w-full h-full p-2 grid grid-cols-3 gap-1 flex items-center justify-center">
            {/* 3x3 rounded cells with individual custom glowing templates */}
            <div className="rounded-[4px] bg-sky-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-rose-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-teal-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            
            <div className="rounded-[4px] bg-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-violet-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-emerald-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            
            <div className="rounded-[4px] bg-pink-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-stone-300 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
            <div className="rounded-[4px] bg-orange-400 shadow-[0_1px_2px_rgba(0,0,0,0.15)] h-3.5 w-3.5" />
          </div>
        );

      case 'vlc':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="64" cy="108" rx="42" ry="7" fill="#ff5a00" />
            <ellipse cx="64" cy="108" rx="34" ry="4" fill="#ca4100" />
            <path d="M46 90 L60 20 H68 L82 90 H46Z" fill="#ff7f1a" />
            <path d="M48 83 L50 71 H78 L80 83 H48ZM52 60 L54 48 H74 L76 60 H52Z" fill="#ffffff" opacity="0.9" />
          </svg>
        );

      case 'obs':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-3" fill="none" xmlns="http://www.w3.org/2050/svg">
            <circle cx="64" cy="64" r="42" stroke="white" strokeWidth="8" strokeDasharray="30 15" />
            <circle cx="64" cy="64" r="22" stroke="white" strokeWidth="4" />
            <circle cx="64" cy="64" r="10" fill="#242629" />
          </svg>
        );

      case 'steam':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-3" fill="none" xmlns="http://www.w3.org/2050/svg">
            <path d="M64 24 A22 22 0 1 0 86 46 A22 22 0 0 0 64 24 Z M64 36 A10 10 0 1 1 54 46 A10 10 0 0 1 64 36 Z" fill="white" />
            <path d="M38 74 A14 14 0 1 0 52 88 A14 14 0 0 0 38 74 Z M38 82 A6 6 0 1 1 32 88 A6 6 0 0 1 38 82 Z" fill="white" />
            <path d="M50 42 L34 76 L40 82 L58 48 Z" fill="white" opacity="0.8" />
          </svg>
        );

      case 'photoshop':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center font-sans tracking-tighter" id="photoshop-icon-inner">
            <span className="text-[25px] font-black text-[#00c5ff] leading-none">Ps</span>
            <span className="text-[7px] font-mono font-bold tracking-widest text-[#00c5ff]/60 leading-none mt-1">CREATIVE SUITE</span>
          </div>
        );

      case 'notepadplusplus':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-3.5" fill="none" xmlns="http://www.w3.org/2050/svg">
            <path d="M96 24 C80 12 40 12 32 36 C24 60 48 84 32 104 C48 108 80 104 96 84 C112 64 112 36 96 24 Z" fill="url(#npp-cham)" />
            <rect x="52" y="32" width="22" height="40" rx="3" fill="white" opacity="0.25" />
            <path d="M46 76 L82 76" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <defs>
              <linearGradient id="npp-cham" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fffb00" />
                <stop offset="100%" stopColor="#2eaf13" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'word':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center font-sans" id="word-icon-inner">
            <span className="text-[32px] font-black text-white leading-none">W</span>
            <span className="text-[8px] font-mono tracking-wider text-white/50 uppercase font-bold leading-none mt-1">Word Suite</span>
          </div>
        );

      case 'excel':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center font-sans" id="excel-icon-inner">
            <span className="text-[32px] font-black text-white leading-none">X</span>
            <span className="text-[8px] font-mono tracking-wider text-white/50 uppercase font-bold leading-none mt-1">Excel Sheet</span>
          </div>
        );

      case 'powerpoint':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center font-sans" id="pp-icon-inner">
            <span className="text-[32px] font-black text-white leading-none">P</span>
            <span className="text-[8px] font-mono tracking-wider text-white/50 uppercase font-bold leading-none mt-1">Slide Show</span>
          </div>
        );

      case 'trash':
      case 'trash-full':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Trash Basket mesh body */}
            <g opacity="0.95" filter="url(#trash-shadow)">
              <path d="M30 40 L35 110 C36 114 40 118 45 118 H83 C88 118 92 114 93 110 L98 40" fill="url(#trash-basket-grad)" stroke="#8e8e93" strokeWidth="2.5" />
              {/* Metallic meshes wireframe */}
              {[38, 46, 54, 62, 70, 78, 86, 90].map((x) => (
                <line key={x} x1={x} y1="41" x2={x + (x > 64 ? -5 : 5)} y2="117" stroke="#acaeaf" strokeWidth="1" />
              ))}
              {[55, 70, 85, 100].map((y) => (
                <path key={y} d={`M${30 + (y-40)/2} ${y} H${98 - (y-40)/2}`} stroke="#acaeaf" strokeWidth="1" />
              ))}
              {/* Rim */}
              <ellipse cx="64" cy="40" rx="34" ry="7" fill="#bcbcbe" stroke="#8e8e93" strokeWidth="2.5" />
              <ellipse cx="64" cy="40" rx="27" ry="4" fill="#a1a1a4" opacity="0.6" />
              
              {/* Crumpled sheets peaks if full */}
              {normId === 'trash-full' && (
                <path d="M42 38 Q50 20 62 36 Q74 15 84 37" fill="#fcfcfd" stroke="#bfbfc1" strokeWidth="1" />
              )}
            </g>
            <defs>
              <linearGradient id="trash-basket-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e1e1e3" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#bcbcbe" stopOpacity="0.8" />
              </linearGradient>
              <filter id="trash-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
              </filter>
            </defs>
          </svg>
        );

      case 'creatorhub':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#hub-glow)">
              <rect x="20" y="20" width="88" height="88" rx="20" fill="url(#hub-inner-gradient)" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
              {/* Outer circular wireframe */}
              <circle cx="64" cy="64" r="30" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 4" opacity="0.6" />
              {/* Glowing diamond/spark core */}
              <path d="M64 42L72 64L64 86L56 64Z" fill="url(#hub-spark)" />
              <path d="M42 64L64 72L86 64L64 56Z" fill="url(#hub-spark)" />
              <circle cx="64" cy="64" r="4" fill="#ffffff" />
            </g>
            <defs>
              <linearGradient id="hub-inner-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <linearGradient id="hub-spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="hub-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.5" />
              </filter>
            </defs>
          </svg>
        );

      case 'taskmanager':
        return (
          <svg viewBox="0 0 128 128" className="w-full h-full p-2.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="16" width="96" height="96" rx="16" fill="#0b0f19" stroke="#1f2937" strokeWidth="2" />
            {/* Grid line background */}
            <path d="M16 40H112 M16 64H112 M16 88H112 M40 16V112 M64 16V112 M88 16V112" stroke="#111827" strokeWidth="1" />
            {/* Animated activity pulse wave */}
            <path d="M22 68H42L48 30L56 98L64 50L72 82L78 68H106" stroke="#10b981" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#tm-g)" />
            <circle cx="106" cy="68" r="4" fill="#34d399" />
            <defs>
              <filter id="tm-g" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.85" />
              </filter>
            </defs>
          </svg>
        );

      default:
        // Generic fallback squircle design with custom initial
        return (
          <div className="w-full h-full flex items-center justify-center font-bold text-white text-lg font-serif italic drop-shadow-md">
            {appId.substring(0, 1).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-[22.5%] relative flex items-center justify-center transition-all ${getContainerStyle()} ${ringStyle} ${className}`}
      id={`ios-squircle-${normId}`}
    >
      {/* Sub-pixel metallic rim shines */}
      {normId !== 'trash' && normId !== 'trash-full' && (
        <div className="absolute inset-[0.5px] rounded-[22%] bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none mix-blend-overlay" />
      )}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        {renderGlyph()}
      </div>
    </div>
  );
}
