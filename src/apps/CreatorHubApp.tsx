import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Terminal, Layers, Monitor, Image, ArrowRight, ExternalLink, Code, Undo, Redo } from 'lucide-react';

interface CustomizerState {
  promptWallpaper: string;
  promptStyle: string;
  promptSidebars: boolean;
  aspectRatio: string;
  engineVersion: string;
  stylize: string;
}

export default function CreatorHubApp() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'midjourney' | 'electron' | 'figma'>('prompt');
  
  // Tab-wide Unified State History array & cursor
  const [history, setHistory] = useState<CustomizerState[]>([
    {
      promptWallpaper: 'Cinematic mountain sunset with soft fog and light rays',
      promptStyle: 'Dark elegant theme, subtle neon blue highlights, strong glassmorphism',
      promptSidebars: true,
      aspectRatio: '16:9',
      engineVersion: 'v6.0',
      stylize: '750',
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Get current active state projection
  const currentState = history[historyIndex];
  const { promptWallpaper, promptStyle, promptSidebars, aspectRatio, engineVersion, stylize } = currentState;

  // React + Electron Script selector
  const [activeScript, setActiveScript] = useState<'package' | 'main' | 'vite'>('package');

  // Unified updater that commits state to history
  const updateField = <K extends keyof CustomizerState>(key: K, value: CustomizerState[K]) => {
    const nextState = { ...currentState, [key]: value };
    const cleanHistory = history.slice(0, historyIndex + 1);
    setHistory([...cleanHistory, nextState]);
    setHistoryIndex(cleanHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };

  // Keyboard undo/redo shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrMeta = isMac ? e.metaKey : e.ctrlKey;
      
      const isUndo = isCtrlOrMeta && e.key.toLowerCase() === 'z' && !e.shiftKey;
      const isRedo = (isCtrlOrMeta && e.key.toLowerCase() === 'y') ||
                     (isCtrlOrMeta && e.key.toLowerCase() === 'z' && e.shiftKey);
      
      if (isUndo) {
        e.preventDefault();
        undo();
      } else if (isRedo) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history.length]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate customized prompt
  const generatedPrompt = `Design a futuristic desktop operating system interface called "Macify OS".

The UI should be a premium hybrid between Windows and macOS, but with its own unique identity (not a direct copy of either).

Include the following:
- A centered macOS-style dock at the bottom with glowing, reflective app icons and smooth hover animations.
- A Macify OS Start Button on the bottom-left corner (NOT Windows-style), styled as a minimalist circular glowing futuristic logo icon that opens a glassmorphic floating Start Panel.
- A translucent macOS-style top menu bar with system indicators (WiFi, battery, time, search).
- A clean modern File Explorer window open in the center with rounded corners, soft shadows, and elegant sidebar navigation.
${promptSidebars ? '- A left-side quick access / widgets panel similar to Windows 11 (weather, calendar, shortcuts).\n- A right-side system widgets stack (weather, CPU usage, battery, notifications).' : ''}

Design style:
- ${promptStyle}
- Soft reflections and depth lighting.
- Smooth, fluid animations (macOS Ventura + Windows 11 Fluent Design blend).

Background:
- ${promptWallpaper}

Overall feel:
- Must look like a real installable operating system (Macify OS), not a website mockup.
- Ultra realistic, 4K resolution, high-end futuristic OS concept, production-ready UI design.`;

  // Generate customized Midjourney prompt
  const generatedMidjourneyPrompt = `High-end desktop OS UI concept screenshot of a futuristic operating system called "Macify OS", premium hybrid between macOS Sequoia and Windows 11 Fluent layout. Centered glowing glassmorphism dock at the bottom with high-gloss reflective icons. On the far left, a gorgeous glowing neon-blue circular Start button. In the center, a highly detailed dark theme File Explorer folder window with elegant rounded glass corners, blurred drop shadows, and visual side navbar. Cinematic ultra-realistic wallpaper depicting ${promptWallpaper.toLowerCase()}. Dark elegant theme with subtle neon-blue style highlights, realistic screen gloss glow. Ultra-high definition 8K, sophisticated product design mockup presentation, insanely detailed UI design elements --ar ${aspectRatio} --stylize ${stylize} --v ${engineVersion} --style raw`;

  const packageJsonContent = `{
  "name": "macify-os-desktop",
  "version": "1.0.0",
  "main": "electron.js",
  "description": "Futuristic Macify OS Electron wrapper",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "start": "electron .",
    "package": "electron-builder"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.390.0",
    "motion": "^11.11.17"
  },
  "devDependencies": {
    "electron": "^31.0.0",
    "electron-builder": "^24.13.3",
    "vite": "^5.3.1",
    "@types/react": "^18.3.3"
  }
}`;

  const electronJsContent = `const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    titleBarStyle: 'hidden', // Premium borderless macOS header
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Serve Vite in development or run compiled index.html in production
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

  const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist'
  }
});`;

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 font-sans" id="creator-hub-root">
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-850 bg-neutral-900/40 backdrop-blur-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Macify OS Creator Hub</h1>
            <p className="text-[10px] text-neutral-400">Export prompts, setups, guides & art configs</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl">
          {[
            { id: 'prompt', label: 'Specs Prompt', icon: Layers },
            { id: 'midjourney', label: 'AI Art Prompt', icon: Image },
            { id: 'electron', label: 'Electron setup', icon: Terminal },
            { id: 'figma', label: 'Figma tokens', icon: Monitor }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Interactive Control Box */}
        <div className="w-full md:w-[320px] bg-neutral-900/50 border border-neutral-850 rounded-2xl p-4 flex flex-col gap-4 self-start">
          <div className="flex items-center justify-between border-b border-neutral-850 pb-2.5">
            <h2 className="text-[11px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <SettingsIcon size={12} /> Live customizer
            </h2>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className={`p-1.5 rounded-lg border transition-all text-[10px] flex items-center justify-center ${
                  historyIndex === 0
                    ? 'border-neutral-800 text-neutral-600 opacity-40 cursor-not-allowed'
                    : 'border-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer hover:border-neutral-700'
                }`}
                title="Undo (Ctrl+Z / ⌘Z)"
              >
                <Undo size={11} className="mr-0.5" />
                <span>Undo</span>
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className={`p-1.5 rounded-lg border transition-all text-[10px] flex items-center justify-center ${
                  historyIndex === history.length - 1
                    ? 'border-neutral-800 text-neutral-600 opacity-40 cursor-not-allowed'
                    : 'border-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer hover:border-neutral-700'
                }`}
                title="Redo (Ctrl+Y / ⌘⇧Z)"
              >
                <span>Redo</span>
                <Redo size={11} className="ml-0.5" />
              </button>
            </div>
          </div>

          {activeTab === 'prompt' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1.5 uppercase">Visual Style theme</label>
                <select
                  value={promptStyle}
                  onChange={(e) => updateField('promptStyle', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 outline-none focus:border-sky-500 transition font-medium"
                >
                  <option value="Dark elegant theme, subtle neon blue highlights, strong glassmorphism">Twilight Neon Blue (Default)</option>
                  <option value="Warm minimalist off-white aesthetic, refined typography, soft drop shadows">Warm Luxury Light (Minimal)</option>
                  <option value="Cyber-terminal Matrix green aesthetic, pure monospace displays, scanline filters">Retro Terminal Grid (Matrix)</option>
                  <option value="Deep space cosmic violet theme, stellar dust accents, blurred nebulae backdrops">Cosmic Nebulous Purple</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1.5 uppercase">Wallpaper Style</label>
                <select
                  value={promptWallpaper}
                  onChange={(e) => updateField('promptWallpaper', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 outline-none focus:border-sky-500 transition font-medium"
                >
                  <option value="Cinematic mountain sunset with soft fog and light rays">Sunset Mist Mountains</option>
                  <option value="Premium digital vector abstraction with golden curves and deep obsidian voids">Obsidian Gold Abstraction</option>
                  <option value="Spectacular retro synthwave horizon with glowing neon lines and twilight sun grid">Outrun Synthwave Grid</option>
                  <option value="Cozy atmospheric rainy cafe window looking into blurred high-rise skylines">Rainy City Lofi Blur</option>
                </select>
              </div>

              <div className="pt-2 border-t border-neutral-850">
                <label className="flex items-center justify-between text-neutral-200 py-1 cursor-pointer select-none">
                  <span className="font-bold">Include Win11 sidebars?</span>
                  <input
                    type="checkbox"
                    checked={promptSidebars}
                    onChange={(e) => updateField('promptSidebars', e.target.checked)}
                    className="w-4 h-4 accent-sky-500 cursor-pointer"
                  />
                </label>
                <p className="text-[10px] text-neutral-400 mt-1">Include details for both left-side quick access and right-side system widgets context.</p>
              </div>
            </div>
          )}

          {activeTab === 'midjourney' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1.5 uppercase">Mockup Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['16:9', '21:9', '4:3'].map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => updateField('aspectRatio', ratio)}
                      className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold text-center transition cursor-pointer ${
                        aspectRatio === ratio
                          ? 'border-sky-500 bg-sky-500/10 text-white'
                          : 'border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold mb-1.5 uppercase">Midjourney Engine</label>
                <select
                  value={engineVersion}
                  onChange={(e) => updateField('engineVersion', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 outline-none focus:border-sky-500 transition font-medium"
                >
                  <option value="v6.0">Midjourney v6.0 (High Detail)</option>
                  <option value="v5.2">Midjourney v5.2 (Stylized classic)</option>
                  <option value="niji 6">Niji v6 (Futuristic Anime/Cyber)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between block text-[10px] text-neutral-400 font-bold mb-1.5 uppercase">
                  <span>Stylization weight</span>
                  <span className="text-sky-400 font-bold font-mono">--s {stylize}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={stylize}
                  onChange={(e) => updateField('stylize', e.target.value)}
                  className="w-full accent-sky-500 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <p className="text-[9px] text-neutral-400 mt-1">Higher styling boosts artistic flair; lower values stick strictly to layout elements.</p>
              </div>
            </div>
          )}

          {activeTab === 'electron' && (
            <div className="space-y-3.5 text-xs">
              <p className="text-[10px] text-neutral-400 leading-normal">
                Packaging this React application into a standalone light desktop installer is incredibly easy using <b>Electron</b>.
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-[9px] text-sky-300 font-bold uppercase tracking-wider">Select file buffer</label>
                {[
                  { id: 'package', label: 'package.json (manifest)', icon: Code },
                  { id: 'main', label: 'electron.js (main process)', icon: Terminal },
                  { id: 'vite', label: 'vite.config.ts (bundler)', icon: Layers }
                ].map(scriptObj => {
                  const SIcon = scriptObj.icon;
                  return (
                    <button
                      key={scriptObj.id}
                      onClick={() => setActiveScript(scriptObj.id as any)}
                      className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 border transition duration-150 cursor-pointer ${
                        activeScript === scriptObj.id
                          ? 'bg-neutral-800/80 border-sky-500/40 text-white'
                          : 'bg-transparent border-transparent hover:bg-neutral-850 text-neutral-400'
                      }`}
                    >
                      <SIcon size={12} className={activeScript === scriptObj.id ? 'text-sky-400' : 'text-neutral-500'} />
                      <span className="text-[10px] font-bold">{scriptObj.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'figma' && (
            <div className="space-y-3.5 text-xs text-neutral-300">
              <div className="p-3 bg-sky-500/10 border border-sky-400/20 rounded-xl">
                <p className="text-[10.5px] leading-relaxed text-sky-400 font-medium">
                  We have extracted the precise visual design codes used in Macify OS so you can flawlessly recreate it in Figma.
                </p>
              </div>
              <ul className="space-y-2 text-[10px] font-mono leading-normal">
                <li className="flex justify-between py-1 border-b border-neutral-850">
                  <span className="text-neutral-400">Glass blur:</span>
                  <span className="text-neutral-200">24px to 40px Backdrop Blur</span>
                </li>
                <li className="flex justify-between py-1 border-b border-neutral-850">
                  <span className="text-neutral-400">Window Border:</span>
                  <span className="text-neutral-200">1px Solid, White #FFFFFF (12%)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-neutral-850">
                  <span className="text-neutral-400">Main Neon Glow:</span>
                  <span className="text-neutral-200">rgba(56, 189, 248, 0.2)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-neutral-850">
                  <span className="text-neutral-400">Window Radius:</span>
                  <span className="text-neutral-200">24px (Start menu is 28px)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-neutral-850">
                  <span className="text-neutral-400">Inner Shadows:</span>
                  <span className="text-neutral-200">Blur 1px, offset-y 1px, overlay style</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Preview/Output Frame */}
        <div className="flex-1 flex flex-col bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden self-stretch min-h-[400px]">
          
          {/* Output Code / Prompt Header Bar */}
          <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-850 flex items-center justify-between">
            <span className="font-mono text-[10.5px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Code size={11} className="text-sky-400" />
              {activeTab === 'prompt' && 'Macify OS Design Specifications Prompt'}
              {activeTab === 'midjourney' && 'Midjourney Interactive Output'}
              {activeTab === 'electron' && `Code Buffer: ${activeScript === 'package' ? 'package.json' : activeScript === 'main' ? 'electron.js' : 'vite.config.ts'}`}
              {activeTab === 'figma' && 'Design tokens & styling parameters'}
            </span>
            
            <button
              onClick={() => {
                if (activeTab === 'prompt') copyToClipboard(generatedPrompt, 'prompt');
                else if (activeTab === 'midjourney') copyToClipboard(generatedMidjourneyPrompt, 'mj');
                else if (activeTab === 'electron') {
                  const txt = activeScript === 'package' ? packageJsonContent : activeScript === 'main' ? electronJsContent : viteConfigContent;
                  copyToClipboard(txt, 'electron');
                } else {
                  copyToClipboard(`Glass blur: 32px Backdrop Blur\nBorder: 1px #FFFFFF @ 12%\nWindow Radius: 24px\nAccents: Neon Blue #0fa5e9\nShadows: 0 25px 60px -15px rgba(0,0,0,0.85)`, 'figma-tokens');
                }
              }}
              className="py-1 px-3 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[10.5px] rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {copiedText ? <Check size={11} className="text-emerald-300 animate-bounce" /> : <Copy size={11} />}
              <span>{copiedText ? 'Copied to clipboard' : 'Copy Code Output'}</span>
            </button>
          </div>

          {/* Buffer Content Viewer */}
          <div className="flex-1 p-5 overflow-auto bg-neutral-950/80 font-mono text-[11px] leading-relaxed text-neutral-300">
            {activeTab === 'prompt' && (
              <pre className="whitespace-pre-wrap selection:bg-sky-500/30 selection:text-white">
                {generatedPrompt}
              </pre>
            )}

            {activeTab === 'midjourney' && (
              <div className="space-y-4">
                <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-400/10 text-xs text-sky-400 flex items-start gap-2.5">
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    This prompt is specifically engineered to render an incredibly beautiful, sleek screenshot mockup of Macify OS. Paste it directly into Discord's <b>/imagine</b> block!
                  </p>
                </div>
                <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-200">
                  <p className="selection:bg-sky-500/30 selection:text-white break-words">
                    {generatedMidjourneyPrompt}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'electron' && (
              <pre className="whitespace-pre selection:bg-sky-500/30 selection:text-white text-neutral-200">
                {activeScript === 'package' && packageJsonContent}
                {activeScript === 'main' && electronJsContent}
                {activeScript === 'vite' && viteConfigContent}
              </pre>
            )}

            {activeTab === 'figma' && (
              <div className="space-y-5 flex flex-col justify-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/30">
                    <h3 className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                      <Layers size={12} fill="currentColor" fillOpacity="0.2" /> Layer Glass Effect
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mb-3">
                      Recreate the stunning system blurring on layers. In Figma, apply standard blur and stroke combinations:
                    </p>
                    <ul className="space-y-1 text-[9.5px] text-neutral-300">
                      <li>• <b>Effects</b>: Background Blur 40px</li>
                      <li>• <b>Fill</b>: Solid #171717 with <b>80%</b> Opacity (Dark)</li>
                      <li>• <b>Stroke</b>: 1px Inside Solid #FFFFFF with <b>12%</b> Opacity</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/30">
                    <h3 className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                      <Monitor className="text-sky-400" size={12} /> Color Swatches
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mb-3">
                      Set up your Figma style library with Macify OS brand-compliant hex coordinates:
                    </p>
                    <ul className="space-y-1 text-[9.5px] text-neutral-300">
                      <li>• <b>Sky Accent</b>: <code>#0ea5e9</code> | rgb(14, 165, 233)</li>
                      <li>• <b>Neon Glow</b>: <code>#38bdf8</code> | rgb(56, 189, 248)</li>
                      <li>• <b>Dark Ground</b>: <code>#0a0a0a</code> | rgb(10, 10, 10)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-extrabold text-neutral-200 mb-0.5">Need the full design framework asset package?</h4>
                    <p className="text-[9.5px] text-neutral-400">Export assets, SVG curves and design code repositories dynamically.</p>
                  </div>
                  <button
                    onClick={() => alert('Exporting visual asset pack is already fully synthesized with the current React bundle!')}
                    className="py-1.5 px-4 bg-neutral-800 hover:bg-neutral-750 text-white font-extrabold rounded-xl text-[10px] transition cursor-pointer"
                  >
                    Generate CAD Assets Package
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Copy Action Row */}
          <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-850 text-[10px] text-neutral-400 flex items-center justify-between">
            <span>💡 Copy and paste seamlessly inside Figma or your terminal wraps.</span>
            <span className="font-mono text-neutral-500 font-bold">4K Production Ready UI Specs</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline settings icon and Lucide SVG mimics for compactness
function SettingsIcon({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
