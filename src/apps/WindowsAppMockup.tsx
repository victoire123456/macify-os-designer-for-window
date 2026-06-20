import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { AppID } from '../types';
import { motion } from 'motion/react';
import { 
  MessageSquare, Send, Compass, UserCheck, Phone, Video, Search, Plus, Hash, 
  Headphones, User, Image, ThumbsUp, Compass as CompassIcon, Lock,
  Play, Pause, Volume2, Save, FileText, Check, Cpu, Layout, Film, 
  Presentation, Grid, AlignCenter, Flame, Gamepad 
} from 'lucide-react';

interface WindowsAppMockupProps {
  appId: AppID;
}

export default function WindowsAppMockup({ appId }: WindowsAppMockupProps) {
  const { isDarkMode } = useMacify();

  // Telegram Mock state
  const [telegramChats] = useState([
    { id: 1, name: 'Alice (Systems Lead)', lastMsg: 'Windows Integration Bridge is holding smoothly!', time: '12:30 PM', avatar: '👩‍💻' },
    { id: 2, name: 'Macify Dev Channel', lastMsg: 'V1 Sequoia shell released successfully.', time: 'Yesterday', avatar: '🚀' },
    { id: 3, name: 'Mom', lastMsg: 'Did you compile the core yet?', time: 'June 11', avatar: '👵' },
  ]);
  const [telegramActiveMsg, setTelegramActiveMsg] = useState(
    'Windows Integration Bridge is holding smoothly! Everything is extremely fast and fully responsive.'
  );
  const [telegramInputs, setTelegramInputs] = useState('');
  const [tgHistory, setTgHistory] = useState<string[]>([
    'Hey Admin! Are we testing the new launcher controls?',
    'Yes, launching from dock representations functions flawlessly.'
  ]);

  const handleSendTg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramInputs.trim()) return;
    setTgHistory(prev => [...prev, telegramInputs.trim()]);
    setTelegramInputs('');
  };

  // Discord Mock state
  const [discordServers] = useState(['M', '⚛️', '🐍', '🎮']);
  const [activeChannel, setActiveChannel] = useState('windows-agent-chat');
  const [discordMsgInput, setDiscordMsgInput] = useState('');
  const [discordHistory, setDiscordHistory] = useState<string[]>([
    'Welcome to the Macify Discord virtual hub!',
    'Make sure to verify your Windows Agent proxy in System Preferences.',
    'Is drag and drop active? Yes, select-rectangle highlights desktop targets beautifully.'
  ]);

  const handleSendDiscord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordMsgInput.trim()) return;
    setDiscordHistory(prev => [...prev, discordMsgInput.trim()]);
    setDiscordMsgInput('');
  };

  if (appId === 'telegram') {
    return (
      <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-800 dark:text-neutral-200" id="telegram-mock-app">
        {/* Chats drawer */}
        <div className="w-44 border-r border-neutral-700/10 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/40 p-3 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 font-mono px-2">Telegram Messenger</span>
          <div className="space-y-1.5 mt-3">
            {telegramChats.map(c => (
              <div key={c.id} className="p-2 rounded-lg bg-white/5 border border-white/5 text-left cursor-pointer hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] truncate">{c.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-neutral-400">{c.time}</span>
                </div>
                <p className="text-[10px] text-neutral-450 dark:text-neutral-450 truncate mt-0.5">{c.lastMsg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 flex flex-col justify-between bg-white/5 dark:bg-neutral-950/20 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/25">
            <span className="font-bold flex items-center text-xs">
              <span className="mr-1.5">👩‍💻</span> Alice (Systems Lead)
            </span>
            <span className="text-[9px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ONLINE (WINDOWS INTEGRATION CONNECTED)
            </span>
          </div>

          {/* History scroll */}
          <div className="flex-1 py-4 overflow-y-auto space-y-2.5 flex flex-col justify-end">
            {tgHistory.map((msg, i) => (
              <div key={i} className={`p-2.5 rounded-xl max-w-xs ${
                i % 2 === 0
                  ? 'bg-neutral-200 dark:bg-neutral-850 self-start text-left'
                  : 'bg-sky-500 text-white self-end text-left shadow-md'
              }`}>
                {msg}
              </div>
            ))}
          </div>

          {/* Form input messaging */}
          <form onSubmit={handleSendTg} className="flex space-x-2">
            <input
              type="text"
              value={telegramInputs}
              onChange={e => setTelegramInputs(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-200/50 dark:bg-neutral-900/50 border border-neutral-700/20 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button type="submit" className="p-2 px-4 bg-sky-500 hover:bg-sky-600 font-bold text-white rounded-lg cursor-pointer transition shadow">
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (appId === 'discord') {
    return (
      <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-300 bg-[#313338]" id="discord-mock-app">
        {/* Server column */}
        <div className="w-14 bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 shrink-0 select-none">
          {discordServers.map((srv, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 rounded-3xl hover:rounded-xl bg-[#313338] hover:bg-[#5865f2] hover:text-white flex items-center justify-center font-bold font-sans text-xs cursor-pointer transition-all ${
                idx === 0 ? 'bg-[#5865f2] rounded-xl text-white' : 'text-neutral-400'
              }`}
            >
              {srv}
            </div>
          ))}
        </div>

        {/* Channel Drawer */}
        <div className="w-40 bg-[#2b2d31] p-3 flex flex-col justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 font-mono">Macify Guild Server</span>
            <div className="mt-3.5 space-y-1">
              <button
                onClick={() => setActiveChannel('windows-agent-chat')}
                className={`w-full flex items-center px-1.5 py-1 text-xs rounded transition text-left cursor-pointer ${
                  activeChannel === 'windows-agent-chat' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Hash size={12} className="mr-1.5 text-neutral-500 shrink-0" />
                windows-agent-chat
              </button>
              <button
                onClick={() => setActiveChannel('development-bugs')}
                className={`w-full flex items-center px-1.5 py-1 text-xs rounded transition text-left cursor-pointer ${
                  activeChannel === 'development-bugs' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Hash size={12} className="mr-1.5 text-neutral-500 shrink-0" />
                development-bugs
              </button>
            </div>
          </div>

          <div className="p-2 rounded bg-[#1e1f22] flex items-center space-x-2">
            <User size={12} className="text-emerald-500 shrink-0" />
            <div className="truncate text-left leading-none">
              <div className="text-[10px] font-bold truncate">MacifyAdmin</div>
              <span className="text-[8px] text-neutral-550 dark:text-neutral-500 uppercase tracking-widest font-mono font-bold leading-none">Active User</span>
            </div>
          </div>
        </div>

        {/* Chat message layout */}
        <div className="flex-1 flex flex-col justify-between bg-[#313338] p-4 text-left">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-850">
            <span className="font-bold flex items-center text-xs">
              <Hash size={13} className="mr-1.5 text-neutral-500" />
              {activeChannel}
            </span>
          </div>

          {/* History messages */}
          <div className="flex-1 py-4 overflow-y-auto space-y-3.5 flex flex-col justify-end">
            {discordHistory.map((msg, i) => (
              <div key={i} className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5865f2]/25 flex items-center justify-center font-bold text-xs">
                  🎮
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className="font-extrabold text-white">Guest Member Hub</span>
                    <span className="text-neutral-500">12:35 PM</span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-1 leading-normal">{msg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Messaging input block */}
          <form onSubmit={handleSendDiscord} className="flex space-x-1.5 bg-[#383a40] p-1.5 rounded-lg">
            <input
              type="text"
              value={discordMsgInput}
              onChange={e => setDiscordMsgInput(e.target.value)}
              placeholder={`Message #${activeChannel}`}
              className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none pl-1.5"
            />
          </form>
        </div>
      </div>
    );
  }

  if (appId === 'edge') {
    return (
      <div className="flex flex-1 h-full flex-col font-sans select-none text-neutral-800 dark:text-neutral-200" id="edge-mock-app">
        {/* Edge toolbar */}
        <div className="h-11 px-4 flex items-center justify-between border-b shrink-0 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-550 dark:text-neutral-400">
            <CompassIcon size={14} className="text-cyan-500" />
            <span>Microsoft Edge Portal (Virtual Host)</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#0067b8] font-bold">EDGE SIMULATOR</span>
        </div>

        {/* Edge site preview canvas */}
        <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 p-6 overflow-y-auto flex flex-col justify-center items-center text-center">
          <div className="max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-850 flex flex-col items-center">
            <div className="w-14 h-14 bg-[#0067b8]/10 rounded-2xl flex items-center justify-center text-2xl mb-4 text-[#0067b8]">
              🌐
            </div>
            <h1 className="text-xl font-black text-neutral-900 dark:text-white">Edge Workspace sandbox active</h1>
            <p className="text-[11px] text-neutral-455 dark:text-neutral-400 mt-2 font-semibold">
              You are looking at a virtual win32 sandboxed Edge browser core representation. Everything is synced securely through the host connection agent.
            </p>
            <div className="my-5 border-t border-neutral-150 dark:border-neutral-800 w-full" />
            <div className="p-3 bg-neutral-100 dark:bg-neutral-950/40 rounded-xl w-full text-left font-mono text-[9px] text-neutral-450 flex items-center">
              <Lock size={10} className="mr-1.5 text-emerald-500 shrink-0" /> Host isolation verified (No unsafe trackers)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'chrome') {
    const [urlInput, setUrlInput] = useState('https://www.google.com');
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      setUrlInput(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      setSubmittedSearch(searchQuery);
    };

    return (
      <div className="flex flex-1 h-full flex-col font-sans select-none text-neutral-800 dark:text-neutral-200" id="chrome-mock-app">
        {/* Chrome Tabs UI */}
        <div className="h-9 px-2 flex items-end bg-[#dee1e6] dark:bg-[#1f2023] border-b border-[#bdc1c6] dark:border-neutral-800">
          <div className="flex items-center space-x-1">
            <div className="h-7 px-4 rounded-t-lg bg-white dark:bg-[#35363a] font-bold text-[11px] flex items-center shadow-sm text-neutral-800 dark:text-white border-r">
              <span>Google</span>
            </div>
            <div className="h-7 px-3 rounded-t-lg text-neutral-500 font-medium text-[10px] flex items-center hover:bg-neutral-300 dark:hover:bg-neutral-800 cursor-pointer">
              <span>New Tab</span>
            </div>
          </div>
        </div>

        {/* Toolbar with Back/Forward, Refresh, URL Input */}
        <div className="h-10 px-2.5 flex items-center space-x-2 bg-white dark:bg-[#35363a] border-b border-neutral-200 dark:border-neutral-850">
          <span className="text-[14px] text-neutral-400">←</span>
          <span className="text-[14px] text-neutral-400">→</span>
          <span className="text-[14px] text-neutral-400">↻</span>
          <div className="flex-1 bg-neutral-100 dark:bg-[#202124] rounded-full border border-neutral-200 dark:border-neutral-800 h-6 px-3 flex items-center text-xs text-neutral-500">
            <span className="text-emerald-500 text-[9px] mr-1.5 font-bold uppercase tracking-wider font-mono">🔒 Secure</span>
            <span className="truncate">{urlInput}</span>
          </div>
        </div>

        {/* Browser Content View */}
        <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 p-6 overflow-y-auto flex flex-col items-center">
          {!submittedSearch ? (
            <div className="max-w-md w-full flex flex-col items-center pt-8 text-center bg-transparent">
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Google
              </span>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider mb-6 mt-1.5">WIN32 CHROME INSTANCE</p>

              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search Google or type a URL"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#202124] shadow text-xs focus:outline-none focus:border-blue-500 text-neutral-800 dark:text-neutral-200"
                />
                <button type="submit" className="absolute right-3.5 top-2.5 text-neutral-450 hover:text-blue-500 bg-transparent py-1">
                  <Search size={14} />
                </button>
              </form>

              {/* Quick Shortcuts Grid */}
              <div className="grid grid-cols-4 gap-4 mt-8 w-64">
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-850 flex items-center justify-center group-hover:scale-105 transition">
                    🐱
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1.5 font-medium">GitHub</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-850 flex items-center justify-center group-hover:scale-105 transition">
                    📺
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1.5 font-medium">YouTube</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-850 flex items-center justify-center group-hover:scale-105 transition">
                    👽
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1.5 font-medium">Reddit</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-850 flex items-center justify-center group-hover:scale-105 transition">
                    ✉️
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1.5 font-medium">Gmail</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg text-left">
              <button
                onClick={() => {
                  setSubmittedSearch(null);
                  setUrlInput('https://www.google.com');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-550 hover:underline mb-4 font-bold cursor-pointer text-left bg-transparent"
              >
                ← Back to Google Homepage
              </button>
              <h4 className="text-xs font-bold text-neutral-400 font-mono uppercase">Google Search Results for:</h4>
              <h2 className="text-xl font-black mt-0.5 mb-4 select-text font-sans">"{submittedSearch}"</h2>

              <div className="space-y-4 select-text">
                <div className="p-4 bg-white dark:bg-[#202124] rounded-2xl border border-neutral-200 dark:border-neutral-850">
                  <p className="text-[10px] text-neutral-400 font-mono">https://github.com/macify</p>
                  <a href="#macify" className="text-sm font-bold text-blue-500 hover:underline block mt-0.5">Macify OS Core - Open Source GitHub Repository</a>
                  <p className="text-xs text-neutral-450 dark:text-neutral-400 mt-1.5">Browse source code, read compiling instructions for building native desktop simulations, and check developer guides.</p>
                </div>

                <div className="p-4 bg-white dark:bg-[#202124] rounded-2xl border border-neutral-200 dark:border-neutral-850">
                  <p className="text-[10px] text-neutral-400 font-mono">https://lucide.dev/icons</p>
                  <a href="#icons" className="text-sm font-bold text-blue-500 hover:underline block mt-0.5">Vector Icons list - macOS Premium Style symbols</a>
                  <p className="text-xs text-neutral-450 dark:text-neutral-400 mt-1.5">Search more than 2,000 clean display symbols paired for Cupertino menus, dialogs, and launch buttons.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (appId === 'vlc') {
    const [playing, setPlaying] = useState(false);
    const [mediaTime, setMediaTime] = useState(42);
    const [videoVolume, setVideoVolume] = useState(80);

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-[#111112] text-neutral-200 select-none" id="vlc-mock-app">
        {/* Simple Menu Header */}
        <div className="h-7 px-3 bg-[#1e1e20] border-b border-black/30 flex items-center justify-between text-[10px] text-neutral-450">
          <div className="flex space-x-3.5 font-semibold">
            <span className="text-white">Media</span>
            <span>Playback</span>
            <span>Audio</span>
            <span>Video</span>
            <span>Subtitle</span>
            <span>Tools</span>
          </div>
          <span className="font-mono text-amber-500 font-bold">VLC WIN32 PORTABLE</span>
        </div>

        {/* Video Screen Layout */}
        <div className="flex-1 flex items-center justify-center p-4 relative group overflow-hidden bg-black">
          {playing ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-tr from-sky-950/20 via-neutral-950 to-[#ff5a00]/10">
              {/* Dynamic visual equalizer bars represent stereo audio stream */}
              <div className="flex space-x-1.5 items-end h-20 mb-4">
                {[12, 18, 24, 15, 32, 28, 14, 8, 22, 18, 30, 16].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [12, h, 8, h + 6, 12] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
                    className="w-1.5 bg-[#ff5a00] rounded-t-sm"
                  />
                ))}
              </div>
              <span className="text-xs font-bold font-mono tracking-widest text-[#ff8d3b] uppercase animate-pulse">
                LOFI AMBIENT CHILLOUT - PLAYING DIGITAL AUDIO
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff5a00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ff5a00]/25 text-3xl">
                🍊
              </div>
              <p className="text-sm font-bold text-neutral-300">No active video stream</p>
              <p className="text-[10px] text-neutral-500 mt-1 max-w-xs font-medium">
                Drop your multimedia files, .mp3 or mp4 visual target tracks here to play instantly.
              </p>
            </div>
          )}
        </div>

        {/* Playback Controls Footer Grid */}
        <div className="bg-[#1e1e20] p-3 shrink-0 border-t border-black/40 space-y-2">
          {/* Tracking progress bar */}
          <div className="flex items-center space-x-2.5 text-[10px] font-mono text-neutral-450">
            <span>01:{mediaTime.toString().padStart(2, '0')}</span>
            <div 
              className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5 cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setMediaTime(Math.round(pos * 180));
              }}
            >
              <div className="h-full bg-[#ff5a00] rounded-full" style={{ width: `${(mediaTime / 185) * 100}%` }} />
            </div>
            <span>03:05</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPlaying(!playing)}
                className="w-7 h-7 bg-neutral-850 hover:bg-[#ff5a00] hover:text-white rounded-lg flex items-center justify-center text-xs text-[#ff8d3b] transition cursor-pointer"
              >
                {playing ? <Pause size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
              </button>
              <button
                onClick={() => { setPlaying(false); setMediaTime(0); }}
                className="w-7 h-7 bg-neutral-850 hover:bg-neutral-800 text-neutral-400 rounded-lg flex items-center justify-center text-xs transition cursor-pointer"
              >
                ■
              </button>
            </div>

            {/* Volume indicator */}
            <div className="flex items-center space-x-2 text-neutral-400">
              <Volume2 size={13} />
              <input
                type="range"
                min="0"
                max="100"
                value={videoVolume}
                onChange={(e) => setVideoVolume(Number(e.target.value))}
                className="w-18 accent-[#ff5a00] bg-neutral-900 h-1 rounded-full cursor-pointer"
              />
              <span className="text-[9px] font-mono font-bold w-6">{videoVolume}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'notepadplusplus') {
    const [code, setCode] = useState(
      `// Macify OS win32 integration bridge\n#include <windows.h>\n#include <stdio.h>\n\nint main() {\n    printf("Safe Windows Agent: CONNECTED\\n");\n    printf("Theme layout matches Sequoia styling...\\n");\n    return 0;\n}`
    );

    return (
      <div className="flex flex-1 h-full text-xs font-mono text-neutral-300 bg-[#1e1e1e] select-none" id="npp-mock-app">
        {/* NPP Sidebar */}
        <div className="w-40 border-r border-neutral-900 bg-[#252526] p-2 shrink-0 text-left">
          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-2 font-mono">Workspace Files</span>
          <div className="space-y-1 mt-2.5">
            <div className="p-1 px-2 rounded bg-neutral-800 text-white font-bold truncate flex items-center text-[10px]">
              <span className="text-emerald-500 mr-2">C++</span> win32_agent.cpp
            </div>
            <div className="p-1 px-2 rounded text-neutral-400 hover:bg-neutral-850 truncate flex items-center text-[10px] cursor-pointer">
              <span className="text-sky-500 mr-2">H</span> resource.h
            </div>
            <div className="p-1 px-2 rounded text-neutral-400 hover:bg-neutral-850 truncate flex items-center text-[10px] cursor-pointer">
              <span className="text-yellow-500 mr-2">TXT</span> notes.txt
            </div>
          </div>
        </div>

        {/* NPP Main active editing Area */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="h-8 px-3 bg-[#2d2d2d] border-b border-black/45 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1 pl-1">
              <div className="px-3.5 py-1.5 rounded-t-md bg-[#1e1e1e] font-bold text-white flex items-center">
                <span>win32_agent.cpp</span>
                <span className="text-rose-500 font-extrabold ml-2">×</span>
              </div>
            </div>
            <button className="flex items-center text-[9px] bg-sky-600 text-white font-bold py-1 px-3.5 rounded hover:bg-sky-500 transition shadow">
              <Save size={10} className="mr-1.5" /> Save File
            </button>
          </div>

          <div className="flex-1 flex text-[11px] p-3 font-mono text-left select-text bg-[#1e1e1e] overflow-y-auto w-full">
            {/* Active line numbers */}
            <div className="text-neutral-500 text-right pr-3.5 border-r border-[#2d2d2d] select-none text-[11px] font-sans h-fit space-y-0.5 leading-relaxed">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => <div key={n}>{n}</div>)}
            </div>

            {/* Editable code container */}
            <textarea
              className="flex-1 bg-transparent border-none text-neutral-100 focus:outline-none resize-none pl-3.5 h-full font-mono text-[11px] leading-relaxed w-full"
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          {/* Details footer */}
          <div className="h-5 px-3 bg-[#006cc1] text-white flex items-center justify-between text-[9px] leading-none tracking-tight font-mono select-none">
            <span>Language: C++ Source File</span>
            <span>Length: {code.length} bytes • UTF-8</span>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'obs') {
    const [recording, setRecording] = useState(false);

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-[#23272a] text-neutral-200 select-none" id="obs-mock-app">
        {/* OBS Main Screen */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Main Monitor Display Viewport */}
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-4 relative border-r border-neutral-800">
            <div className="absolute top-2.5 left-2.5 text-[9px] font-mono bg-red-600 text-white font-black px-2 py-0.5 rounded flex items-center">
              {recording && <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-ping" />}
              {recording ? 'LIVE RECORDING ACTIVE' : 'OBS PREVIEW TERMINAL'}
            </div>
            
            {recording ? (
              <div className="text-center font-mono text-xs">
                <div className="w-12 h-12 border-4 border-dashed border-red-500 rounded-full animate-spin flex items-center justify-center text-red-500 mb-4 mx-auto" />
                <span className="text-red-500 font-extrabold text-[10px] tracking-widest block uppercase">BROADCASTING DESKTOP COMPONENT STREAM</span>
                <span className="text-[9px] text-neutral-450 mt-1 block">Output frame rate: 60.00 FPS • Delay: 0.1ms</span>
              </div>
            ) : (
              <div className="text-center">
                <Video size={36} className="text-neutral-600 mb-3 mx-auto" />
                <div className="text-xs text-neutral-400 font-bold">Simulator screen ready for streaming</div>
              </div>
            )}
          </div>

          {/* Right mixer side drawer */}
          <div className="w-full md:w-52 bg-[#1b1e20] p-3 text-left font-sans flex flex-col justify-between shrink-0">
            <div>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Stream Mixers</span>
              
              <div className="mt-3.5 space-y-3.5">
                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                    <span>Desktop Audio</span>
                    <span className="text-emerald-500 font-mono font-bold">-12 dB</span>
                  </div>
                  <div className="h-1 bg-neutral-900 rounded mt-1.5 relative overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                    <span>Aux Microphone</span>
                    <span className="text-yellow-500 font-mono font-bold">-22 dB</span>
                  </div>
                  <div className="h-1 bg-neutral-900 rounded mt-1.5 relative overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full w-[45%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Run states trigger buttons */}
            <button
              onClick={() => setRecording(!recording)}
              className={`w-full py-2 rounding text-center text-xs font-bold font-sans transition cursor-pointer rounded-lg hover:brightness-110 select-none shadow ${
                recording ? 'bg-red-650 hover:bg-red-700 text-white' : 'bg-[#eef1f6] text-neutral-800'
              }`}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'steam') {
    const [runningGame, setRunningGame] = useState<string | null>(null);

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-[#171a21] text-neutral-300 select-none" id="steam-mock-app">
        {/* Steam top navigation */}
        <div className="h-9 px-4 bg-[#1b2838] border-b border-black/40 flex items-center justify-between text-xs font-semibold text-neutral-400">
          <div className="flex space-x-4">
            <span className="text-white border-b-2 border-[#1070ff] pb-1 cursor-pointer">STORE</span>
            <span className="hover:text-white cursor-pointer">LIBRARY</span>
            <span className="hover:text-white cursor-pointer">COMMUNITY</span>
            <span className="hover:text-white cursor-pointer">PROFILE</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold">STEAM CLIENT ACTIVE</span>
        </div>

        {/* Display games Grid content */}
        <div className="flex-1 p-4 overflow-y-auto text-left space-y-4">
          <div className="flex justify-between items-center bg-[#101822] p-3 rounded-lg border border-white/5 shadow">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Counter-Strike 2</h4>
                <p className="text-[10px] text-neutral-450 leading-none mt-0.5">320 hours logged • First-person Shooter</p>
              </div>
            </div>
            <button
              onClick={() => setRunningGame(runningGame === 'cs' ? null : 'cs')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                runningGame === 'cs' ? 'bg-[#90b0c0] text-neutral-900' : 'bg-[#66c0f4] hover:bg-[#107ce6] text-white'
              }`}
            >
              {runningGame === 'cs' ? 'RUNNING...' : 'PLAY'}
            </button>
          </div>

          <div className="flex justify-between items-center bg-[#101822] p-3 rounded-lg border border-white/5 shadow1">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌌</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Cyberpunk 2077</h4>
                <p className="text-[10px] text-neutral-450 leading-none mt-0.5">85 hours logged • Action RPG</p>
              </div>
            </div>
            <button
              onClick={() => setRunningGame(runningGame === 'cp' ? null : 'cp')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                runningGame === 'cp' ? 'bg-[#90b0c0] text-neutral-900' : 'bg-[#66c0f4] hover:bg-[#107ce6] text-white'
              }`}
            >
              {runningGame === 'cp' ? 'RUNNING...' : 'PLAY'}
            </button>
          </div>

          <div className="flex justify-between items-center bg-[#101822] p-3 rounded-lg border border-white/5 shadow1">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚔️</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Dota 2</h4>
                <p className="text-[10px] text-neutral-450 leading-none mt-0.5">1,240 hours logged • Strategy MOBA</p>
              </div>
            </div>
            <button
              onClick={() => setRunningGame(runningGame === 'dota' ? null : 'dota')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                runningGame === 'dota' ? 'bg-[#90b0c0] text-neutral-900' : 'bg-[#66c0f4] hover:bg-[#107ce6] text-white'
              }`}
            >
              {runningGame === 'dota' ? 'RUNNING...' : 'PLAY'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'photoshop') {
    const [selectedTool, setSelectedTool] = useState('brush');
    const [brightness, setBrightness] = useState(100);

    return (
      <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-300 bg-[#323232]" id="ps-mock-app border border-black/40">
        {/* Left Photoshop tools sidebar */}
        <div className="w-11 bg-[#222222] border-r border-[#151515] flex flex-col items-center py-4 space-y-3 shrink-0">
          <button 
            onClick={() => setSelectedTool('brush')}
            className={`p-1.5 rounded transition ${selectedTool === 'brush' ? 'bg-[#007acc] text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Paint Brush Tool"
          >
            🖌️
          </button>
          <button 
            onClick={() => setSelectedTool('eraser')}
            className={`p-1.5 rounded transition ${selectedTool === 'eraser' ? 'bg-[#007acc] text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Eraser Tool"
          >
            🧼
          </button>
          <button 
            onClick={() => setSelectedTool('lasso')}
            className={`p-1.5 rounded transition ${selectedTool === 'lasso' ? 'bg-[#007acc] text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Lasso Selection"
          >
            ➰
          </button>
          <button 
            onClick={() => setSelectedTool('crop')}
            className={`p-1.5 rounded transition ${selectedTool === 'crop' ? 'bg-[#007acc] text-white' : 'text-neutral-500 hover:text-white'}`}
            title="Crop Canvas"
          >
            ✂️
          </button>
        </div>

        {/* Main interactive Artboard canvas background */}
        <div className="flex-1 bg-[#1a1a1a] p-4 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center p-3">
            {/* Visual design box simulated artboard */}
            <div 
              style={{ filter: `brightness(${brightness}%)` }}
              className="w-48 h-48 bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-500 rounded-xl relative shadow-2xl flex items-center justify-center border border-white/10"
            >
              <div className="absolute inset-2 border-2 border-dashed border-white/20 rounded-lg" />
              <div className="text-[10px] font-mono font-bold tracking-widest text-white drop-shadow">
                {selectedTool.toUpperCase()} MODE ACTIVE
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-[#222] bg-[#222222] rounded-lg">
            <div className="flex justify-between text-[9px] text-neutral-450 font-mono mb-1 font-semibold">
              <span>Canvas Exposure Contrast:</span>
              <span>{brightness}%</span>
            </div>
            <input 
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#007acc] bg-neutral-900 h-1 rounded pointer-events-auto"
            />
          </div>
        </div>

        {/* Right floating layers stacks */}
        <div className="w-44 bg-[#2c2c2c] border-l border-[#151515] p-2.5 shrink-0 text-left">
          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Canvas Layers</span>
          <div className="space-y-1.5 mt-2.5">
            <div className="p-1 px-2 rounded-md bg-[#444] text-[10px] border border-white/5 font-semibold flex justify-between">
              <span>★ Active Vector Text</span>
              <span>👁️</span>
            </div>
            <div className="p-1 px-2 rounded-md bg-[#333] text-[10px] text-neutral-500 flex justify-between">
              <span>☘ Overlay Filter</span>
              <span>👁️</span>
            </div>
            <div className="p-1 px-2 rounded-md bg-[#333] text-[10px] text-neutral-500 flex justify-between">
              <span>⚃ Grid Background</span>
              <span>👁️</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'word') {
    const [textInput, setTextInput] = useState('Welcome to the Macify win32 workspace summary! You can write documents here securely.');

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-neutral-100 dark:bg-neutral-900 text-neutral-800 select-none pb-1" id="word-mock-app">
        {/* Ribbon toolbar header word */}
        <div className="h-10 px-3 bg-[#2b579a] text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-4 text-xs font-bold pl-1">
            <span className="underline decoration-2">Document</span>
            <span className="opacity-75">Layout</span>
            <span className="opacity-75">Insert</span>
            <span className="opacity-75">Review</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#9ac1f0] font-bold mr-1">WIN32 OFFICE SUITE</span>
        </div>

        {/* Main active blank document sheet */}
        <div className="flex-1 p-6 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-md bg-white dark:bg-neutral-950 p-8 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800 text-left min-h-64 font-serif text-xs leading-relaxed select-text flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-black font-sans mb-3 text-neutral-900 dark:text-white pb-1.5 border-b border-neutral-100 dark:border-neutral-900">
                Macify Office Integration Report
              </h2>
              <textarea
                className="w-full bg-transparent border-none text-neutral-800 dark:text-neutral-200 font-sans focus:outline-none resize-none h-40 leading-relaxed text-xs leading-normal"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                spellCheck="false"
              />
            </div>
            <div className="text-[10px] font-mono text-neutral-400 font-medium text-right pt-2 border-t border-neutral-100 dark:border-neutral-900 font-sans">
              Word count: {textInput.split(/\s+/).filter(Boolean).length} words • A4 standard size
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'excel') {
    const [numVal, setNumVal] = useState(1500);

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-neutral-55 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 select-none" id="excel-mock-app">
        {/* Excel Header Toolbar */}
        <div className="h-10 px-3 bg-[#217346] text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-4 text-xs font-bold pl-1">
            <span className="underline decoration-2">Spreadsheet</span>
            <span className="opacity-75">Formulas</span>
            <span className="opacity-75">Charts</span>
            <span className="opacity-75">Macros</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#a8e2bc] font-bold mr-1">EXCEL WIN32 CONNECTED</span>
        </div>

        {/* Table Rows & Columns layout */}
        <div className="flex-1 overflow-x-auto p-4 flex flex-col justify-between bg-white dark:bg-neutral-950">
          <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shrink-0">
            <table className="w-full text-left border-collapse text-[11px] font-mono select-text">
              <thead>
                <tr className="bg-neutral-100 dark:bg-[#1a1c1e] text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <th className="p-1.5 border-r border-neutral-200 dark:border-neutral-800 text-center w-7">ID</th>
                  <th className="p-1.5 border-r border-neutral-200 dark:border-neutral-800">A</th>
                  <th className="p-1.5 border-r border-neutral-200 dark:border-neutral-800">B</th>
                  <th className="p-1.5">C</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="p-1.5 bg-neutral-50 dark:bg-[#151719] text-center font-bold border-r border-neutral-200 dark:border-neutral-850">1</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-850 font-bold">Macify Revenue</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-850 text-emerald-500 font-extrabold">$14,200.00</td>
                  <td className="p-1.5 text-neutral-400">Monthly gross estimation</td>
                </tr>
                <tr>
                  <td className="p-1.5 bg-neutral-50 dark:bg-[#151719] text-center font-bold border-r border-neutral-200 dark:border-neutral-850">2</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-850 font-bold">System Overhead</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-850 text-rose-500 font-semibold">
                    <input 
                      type="number" 
                      value={numVal} 
                      onChange={(e) => setNumVal(Number(e.target.value))}
                      className="bg-transparent border-none w-20 text-rose-500 font-extrabold focus:outline-none placeholder-rose-500 shrink pointer-events-auto"
                    />
                  </td>
                  <td className="p-1.5 text-neutral-400">Host diagnostics allocation</td>
                </tr>
                <tr className="bg-emerald-500/10 font-extrabold">
                  <td className="p-1.5 bg-neutral-50 dark:bg-[#151719] text-center font-bold border-r border-neutral-200 dark:border-neutral-350">3</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-350 text-emerald-600 dark:text-emerald-400">Net Profit (A1 - A2)</td>
                  <td className="p-1.5 border-r border-neutral-200 dark:border-neutral-350 text-emerald-500 font-extrabold">
                    ${14200 - numVal}
                  </td>
                  <td className="p-1.5 text-neutral-400">Calculated sum formula</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Simple Bento Columns Charts Graphics */}
          <div className="bg-neutral-50 dark:bg-[#1c1f22]/50 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-left flex items-center space-x-4">
            <span className="text-xl shrink-0">📊</span>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-sans">Active Financial Chart Summary:</span>
              <div className="flex space-x-1 items-end h-8 mt-1">
                <div className="w-3 bg-emerald-500 rounded-t h-5" />
                <div className="w-3 bg-emerald-600 rounded-t h-7" />
                <div className="w-3 bg-[#217346] rounded-t h-6" />
                <div className="w-3 bg-sky-500 rounded-t h-[30%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'powerpoint') {
    return (
      <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-300 bg-[#3a3b3c] border border-black/40" id="pp-mock-app">
        {/* Left PowerPoint thumbnails strip */}
        <div className="w-24 bg-[#232425] border-r border-black/35 flex flex-col p-2 space-y-2 shrink-0">
          <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1 font-mono">Slides list</span>
          <div className="p-1 rounded bg-[#b7472a] text-white border border-white/10 text-left scale-95">
            <div className="h-7 w-full bg-black/20 rounded mb-1" />
            <span className="text-[8px] font-bold block truncate">1. Introduction</span>
          </div>
          <div className="p-1 rounded bg-neutral-850 hover:bg-neutral-800 text-neutral-400 text-left scale-95 cursor-pointer">
            <div className="h-7 w-full bg-black/10 rounded mb-1" />
            <span className="text-[8px] block truncate">2. Core VM spec</span>
          </div>
          <div className="p-1 rounded bg-neutral-850 hover:bg-neutral-800 text-neutral-400 text-left scale-95 cursor-pointer">
            <div className="h-7 w-full bg-black/10 rounded mb-1" />
            <span className="text-[8px] block truncate">3. Summary</span>
          </div>
        </div>

        {/* Active main slide display canvas page */}
        <div className="flex-1 bg-neutral-800 flex flex-col justify-between p-4">
          <div className="flex-1 flex items-center justify-center p-2">
            {/* Visual template presentation panel */}
            <div className="w-full max-w-sm bg-gradient-to-br from-[#cb3618] to-[#6d1300] rounded-xl shadow-2xl p-6 text-center border border-white/5 flex flex-col justify-center min-h-48 text-white">
              <h1 className="text-sm font-black tracking-tight font-serif italic mb-2">Introduction</h1>
              <p className="text-[10px] text-orange-200/90 leading-relaxed font-sans select-text">
                Macify Sequoia win32 integration layers bridge multiple host applications cleanly without patching files.
              </p>
              <div className="mt-4 text-[7px] font-mono tracking-widest text-[#f55a33] uppercase font-bold">
                1/3 Slide Overview
              </div>
            </div>
          </div>

          <div className="bg-[#b7472a]/10 p-2 border border-[#b7472a]/20 rounded-lg text-left flex items-center justify-between text-[10px] text-orange-350">
            <span>Presentation template: Cupertino Classic Glow</span>
            <button className="bg-[#b7472a] text-white font-bold py-1 px-3 rounded hover:brightness-110 cursor-pointer">
              Play Show
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic dashboard wrapper representation for user custom applications!
  const customApp = appId;
  const isCustomWindowsApp = appId !== 'finder' && appId !== 'safari' && appId !== 'vscode' && appId !== 'spotify' && appId !== 'settings' && appId !== 'calculator' && appId !== 'notepad' && appId !== 'terminal' && appId !== 'discord' && appId !== 'telegram' && appId !== 'edge' && appId !== 'chrome' && appId !== 'installer';

  if (isCustomWindowsApp) {
    const [ramMb, setRamMb] = useState(128);
    const [cpuUse, setCpuUse] = useState(1.2);

    useEffect(() => {
      const interval = setInterval(() => {
        setRamMb(prev => Math.max(80, Math.min(256, prev + (Math.random() * 10 - 5))));
        setCpuUse(prev => Math.max(0.2, Math.min(6.5, prev + (Math.random() * 1.4 - 0.7))));
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-1 h-full flex-col font-sans bg-neutral-900 border border-black/45 text-neutral-200 select-none p-4" id="custom-app-mock-container">
        {/* Diagnostics diagnostics columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full items-center">
          <div className="p-4 rounded-xl border border-white/5 bg-neutral-950/40 text-left shadow-lg space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🛠</span>
              <div>
                <h3 className="font-extrabold text-xs text-white leading-tight capitalize">{customApp.replace(/[_-]/g, ' ')}</h3>
                <p className="text-[10px] text-neutral-500 font-mono tracking-wide leading-none mt-0.5">Win32 Virtual Wrapper</p>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-[9px] text-neutral-400">
              <div className="truncate">EXE: <span className="text-neutral-300">C:\Program Files\{customApp}\{customApp}.exe</span></div>
              <div className="truncate">REG: <span className="text-neutral-300">HKLM\Software\{customApp}</span></div>
              <div>COM Hook: <span className="text-emerald-500 font-bold">READY (ONLINE)</span></div>
            </div>

            <button 
              onClick={() => alert(`Process hook ${customApp}.exe reset requested. COM ports flushed successfully.`)}
              className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition font-bold text-[10px] text-white border border-white/5 cursor-pointer text-center"
            >
              Reset Connection Port
            </button>
          </div>

          {/* Diagnostics state column gauges */}
          <div className="p-4 rounded-xl border border-white/5 bg-neutral-950/40 text-left shadow-lg space-y-3.5">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 font-semibold mb-1">
                <span>CPU Hook Diagnostics:</span>
                <span className="text-sky-400 font-bold">{cpuUse.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-sky-500 transition-all rounded-full" style={{ width: `${(cpuUse / 8) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 font-semibold mb-1">
                <span>RAM Cache Allocation:</span>
                <span className="text-emerald-400 font-bold">{ramMb.toFixed(0)} MB</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 transition-all rounded-full" style={{ width: `${(ramMb / 300) * 100}%` }} />
              </div>
            </div>

            <div className="p-2.5 bg-neutral-950/80 rounded-lg text-[9px] font-mono text-neutral-500 border border-white/5 leading-normal flex items-center">
              <Cpu size={10} className="text-sky-400 mr-2 shrink-0" /> Memory pages synchronized securely without page faults.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General fallback mockup container
  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-6 text-center select-none text-current" id="general-mockup">
      <div>
        <h3 className="font-extrabold text-sm">{appId.toUpperCase()} Windows App representation</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm">
          Simulating real Windows background execution layers connected via COM. Display state is running actively inside the Macify system frame.
        </p>
      </div>
    </div>
  );
}
