import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { ChevronLeft, ChevronRight, RotateCw, Shield, HelpCircle, HardDrive, Cpu, Compass, Globe } from 'lucide-react';

interface PredefinedSite {
  url: string;
  title: string;
  icon: string;
  heroText: string;
  subText: string;
}

const PREDEFINED_SITES: PredefinedSite[] = [
  {
    url: 'https://apple.com',
    title: 'Apple Cupertino Official',
    icon: '🍎',
    heroText: 'MacBook Pro Sequoia Edition',
    subText: 'Supercharged by Apple virtual container nodes inside Windows host spaces.'
  },
  {
    url: 'https://microsoft.com',
    title: 'Microsoft Windows Core Agent',
    icon: '💻',
    heroText: 'Windows 11 Integration Agent',
    subText: 'Proxy pipeline connecting COM, win32 hooks directly into your browser workspace.'
  },
  {
    url: 'https://google.com',
    title: 'Google AI Studio',
    icon: '🤖',
    heroText: 'Google DeepMind Gemini API',
    subText: 'Accelerating code generation structures globally with AI Studio build portals.'
  }
];

export default function SafariApp({ params }: { params?: any }) {
  const { isDarkMode } = useMacify();
  const [urlInput, setUrlInput] = useState('https://apple.com');
  const [activeSite, setActiveSite] = useState<PredefinedSite>(PREDEFINED_SITES[0]);

  useEffect(() => {
    if (params?.searchQuery) {
      const q = params.searchQuery;
      setUrlInput(`https://google.com/search?q=${encodeURIComponent(q)}`);
      setActiveSite({
        url: `https://google.com/search?q=${encodeURIComponent(q)}`,
        title: 'Google Search Engine',
        icon: '🔍',
        heroText: `Search Results: "${q}"`,
        subText: `Displaying dynamic query results matching index: "${q}" on Cupertino Sandbox.`
      });
    }
  }, [params?.searchQuery]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = urlInput.trim().toLowerCase();
    
    // Find matching mock site or fallback
    const matched = PREDEFINED_SITES.find(site => cleanUrl.includes(site.url) || site.url.includes(cleanUrl));
    if (matched) {
      setActiveSite(matched);
      setUrlInput(matched.url);
    } else {
      // Create fallback mock site
      const fallbackSite: PredefinedSite = {
        url: urlInput.startsWith('http') ? urlInput : `https://${urlInput}`,
        title: `Exploring ${urlInput}`,
        icon: '🌐',
        heroText: `Welcome to ${urlInput}`,
        subText: 'This sandbox virtual web shell supports exploring any visual link mockups securely.'
      };
      setActiveSite(fallbackSite);
      setUrlInput(fallbackSite.url);
    }
  };

  const selectSitePreset = (site: PredefinedSite) => {
    setActiveSite(site);
    setUrlInput(site.url);
  };

  return (
    <div className="flex flex-1 h-full flex-col font-sans select-none text-neutral-800 dark:text-neutral-200" id="safari-app-root">
      {/* Browser address bar / Controls */}
      <div className={`h-11 px-4 flex items-center justify-between border-b shrink-0 ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
      }`}>
        {/* Nav Arrows */}
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded text-neutral-450 dark:text-neutral-500 hover:bg-white/10" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 rounded text-neutral-450 dark:text-neutral-500 hover:bg-white/10" disabled>
            <ChevronRight size={16} />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-sky-500 cursor-pointer text-neutral-400">
            <RotateCw size={14} />
          </button>
        </div>

        {/* Address input */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-lg mx-6 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-emerald-500">
            <Shield size={12} className="mr-1" />
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Secure</span>
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full py-1.5 pl-16 pr-6 rounded-lg bg-neutral-200/50 dark:bg-neutral-950/50 border border-neutral-700/20 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs text-center font-medium placeholder-neutral-500"
          />
        </form>

        {/* Home / Explorer presets */}
        <span className="text-[10px] font-bold font-mono text-neutral-450 dark:text-neutral-400">
          SAFARI SHELL
        </span>
      </div>

      {/* Side-by-side: Tab strip and Main page content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Safari Side Presets Bar */}
        <div className={`w-14 border-r p-2 shrink-0 flex flex-col justify-between ${
          isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50 border-neutral-250'
        }`}>
          <div>
            <div className="space-y-1 mt-2">
              {PREDEFINED_SITES.map(site => {
                const isSelected = activeSite.url === site.url;
                return (
                  <button
                    key={site.url}
                    onClick={() => selectSitePreset(site)}
                    className={`w-full flex items-center justify-center py-2 text-xs font-semibold rounded-lg transition select-none cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border border-sky-500/30 text-sky-500 font-bold'
                        : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                    }`}
                    title={site.title}
                  >
                    <span className="text-sm">{site.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2 bg-sky-500/10 text-sky-500 rounded-lg text-center text-[9px] font-mono leading-tight">
            ⚡ Container Sandbox Active
          </div>
        </div>

        {/* Simulated Website Frame */}
        <div className="flex-1 flex flex-col justify-start bg-neutral-100 dark:bg-neutral-950/40 p-6 overflow-y-auto">
          {/* Site header mockup card */}
          <div className="max-w-2xl mx-auto w-full bg-white dark:bg-neutral-900/60 rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-800 p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md">
              {activeSite.icon}
            </div>

            <h1 className="text-3xl font-serif text-neutral-900 dark:text-white leading-tight italic">
              {activeSite.heroText}
            </h1>
            
            <p className="mt-2 text-sm text-neutral-550 dark:text-neutral-400 max-w-md font-semibold font-mono leading-relaxed">
              {activeSite.subText}
            </p>

            <div className="my-6 border-t border-neutral-100 dark:border-neutral-800 w-full" />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200/50 dark:border-neutral-850 text-left">
                <h4 className="font-bold text-xs flex items-center"><Globe size={13} className="mr-1.5 text-teal-400" /> Host Domain</h4>
                <p className="text-[10px] text-neutral-400 mt-1 font-mono">{activeSite.url}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200/50 dark:border-neutral-850 text-left">
                <h4 className="font-bold text-xs flex items-center"><Shield size={13} className="mr-1.5 text-sky-400" /> Secure Protocol</h4>
                <p className="text-[10px] text-neutral-400 mt-1 font-mono">SHA-256 Virtual Proxy verified.</p>
              </div>
            </div>

            {/* Simulated Live iframe browser button to direct */}
            <button
              onClick={() => alert(`Redirecting simulation to: ${activeSite.url}. Mock payload processed.`)}
              className="mt-6 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white cursor-pointer text-xs font-bold transition shadow-md"
            >
              Sync Connection Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
