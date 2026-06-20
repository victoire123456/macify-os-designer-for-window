/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { MacifyProvider, useMacify } from './store';
import MenuBar from './components/MenuBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import StartMenu from './components/StartMenu';
import WindowFrame from './components/WindowFrame';
import Launchpad from './components/Launchpad';
import MissionControl from './components/MissionControl';
import AltTab from './components/AltTab';
import Spotlight from './components/Spotlight';
import { AnimatePresence } from 'motion/react';

import BootScreen from './components/BootScreen';
import SetupWizard from './components/SetupWizard';
import PremiumOnboarding from './components/PremiumOnboarding';
import { UserProfile } from './firebase';
import { User } from 'firebase/auth';

// Immersive virtual applications
import FinderApp from './apps/FinderApp';
import VSCodeApp from './apps/VSCodeApp';
import SafariApp from './apps/SafariApp';
import SpotifyApp from './apps/SpotifyApp';
import SettingsApp from './apps/SettingsApp';
import CalculatorApp from './apps/CalculatorApp';
import NotepadApp from './apps/NotepadApp';
import TerminalApp from './apps/TerminalApp';
import WindowsAppMockup from './apps/WindowsAppMockup';
import InstallerApp from './apps/InstallerApp';
import CreatorHubApp from './apps/CreatorHubApp';
import TaskManagerApp from './apps/TaskManagerApp';
import { WindowInstance } from './types';

function MacifyShell() {
  const {
    windows,
    openApp,
    closeApp,
    minimizeApp,
    focusedWindowId,
    createFile,
    focusApp,
    launchpadOpen,
    setLaunchpadOpen,
    missionControlOpen,
    setMissionControlOpen,
    spotlightOpen,
    toggleSpotlight,
    altTabOpen,
    setAltTabOpen,
    altTabActiveIndex,
    setAltTabActiveIndex,
    isDarkMode,
    brightness,
    userPlan,
    setUserPlan,
    premiumModalOpen,
    setPremiumModalOpen
  } = useMacify();

  const [booting, setBooting] = React.useState(true);
  const [firebaseUser, setFirebaseUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);

  // Global Keyboard shortcuts & Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Spotlight Search shortcut: Cmd + Space, Ctrl + Space, or Alt + Space
      if (e.code === 'Space' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        toggleSpotlight();
      }

      // 2. Mission Control shortcut: Ctrl + ArrowUp
      if (e.ctrlKey && e.code === 'ArrowUp') {
        e.preventDefault();
        setMissionControlOpen(!missionControlOpen);
      }

      // 3. Launchpad Shortcut: F4 / Fn + F4 or Ctrl + L
      if (e.ctrlKey && e.key.toLowerCase() === 'l') { // Safety mapping
        e.preventDefault();
        setLaunchpadOpen(!launchpadOpen);
      }

      // Task Manager Shortcut: Ctrl + Shift + Escape
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        openApp('taskmanager');
      }

      // 4. Escape general drawer closer
      if (e.key === 'Escape') {
        setLaunchpadOpen(false);
        setMissionControlOpen(false);
        setAltTabOpen(false);
        // Spotlight doesn't get closed if input is focused, toggleSpotlight closes it properly
      }

      // 5. Alt + Tab macOS Task Switcher Shortcut
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (windows.length > 0) {
          if (!altTabOpen) {
            setAltTabOpen(true);
            setAltTabActiveIndex(0);
          } else {
            // Loop indices forwards
            setAltTabActiveIndex((prev: number) => (prev + 1) % windows.length);
          }
        }
      }

      // 6. Keyboard Shortcuts for Window operations
      if (focusedWindowId && (e.metaKey || e.ctrlKey)) {
        if (e.code === 'KeyW') {
          e.preventDefault();
          closeApp(focusedWindowId);
        }
        if (e.code === 'KeyM') {
          e.preventDefault();
          minimizeApp(focusedWindowId);
        }
      }

      // 7. Keyboard Shortcuts for Node creation
      if (e.metaKey || e.ctrlKey) {
        if (e.code === 'KeyN') {
          e.preventDefault();
          if (e.shiftKey) {
            createFile('New Folder', 'Desktop', 'directory');
          } else {
            createFile('notes-' + Math.floor(Math.random() * 100) + '.txt', 'Desktop', 'file', 'Macify OS dynamic rich editor buffered content.');
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Releasing ALT key triggers task focus execution for Alt-Tab
      if (e.key === 'Alt') {
        if (altTabOpen && windows.length > 0) {
          const targetWin = windows[altTabActiveIndex];
          if (targetWin) {
            focusApp(targetWin.id);
          }
          setAltTabOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    windows,
    altTabOpen,
    altTabActiveIndex,
    missionControlOpen,
    launchpadOpen,
    toggleSpotlight,
    setLaunchpadOpen,
    setMissionControlOpen,
    setAltTabOpen,
    setAltTabActiveIndex,
    focusApp
  ]);

  // Maps which visual app renders in standard Window wrapper bounds
  const renderAppContent = (w: WindowInstance) => {
    switch (w.appId) {
      case 'finder':
        return <FinderApp params={w.params} />;
      case 'safari':
        return <SafariApp params={w.params} />;
      case 'vscode':
        return <VSCodeApp />;
      case 'spotify':
        return <SpotifyApp />;
      case 'settings':
        return <SettingsApp params={w.params} />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notepad':
        return <NotepadApp params={w.params} />;
      case 'terminal':
        return <TerminalApp />;
      case 'installer':
        return <InstallerApp />;
      case 'creatorhub':
        return <CreatorHubApp />;
      case 'taskmanager':
        return <TaskManagerApp />;
      case 'discord':
      case 'telegram':
      case 'edge':
      case 'chrome':
        return <WindowsAppMockup appId={w.appId} />;
      default:
        return <div className="p-4">App not implemented</div>;
    }
  };

  if (booting) {
    return <BootScreen onBootComplete={() => {
      setBooting(false);
      // Auto open Finder on first launch (startup experience)
      if (windows.length === 0) {
        openApp('finder');
      }
    }} />;
  }

  // Blocker authenticating overlay check
  if (!firebaseUser || !userProfile) {
    return (
      <PremiumOnboarding 
        onLoginComplete={(user, profile) => {
          setFirebaseUser(user);
          setUserProfile(profile);
          setUserPlan(profile.plan);
        }}
        onLogout={() => {
          setFirebaseUser(null);
          setUserProfile(null);
          setUserPlan('free');
        }}
        currentProfile={userProfile}
        onPlanUpdated={(newPlan) => {
          if (userProfile) {
            const updated = { ...userProfile, plan: newPlan };
            setUserProfile(updated);
          }
          setUserPlan(newPlan);
        }}
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 overflow-hidden w-full h-full select-none ${
        isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
      id="macify-desktop-shell-root"
    >
      {/* Top macOS Menu Bar */}
      <MenuBar />

      {/* Main Wallpaper & Desktop items grid */}
      <Desktop />

      {/* Dynamic Window instances */}
      <div className="absolute inset-0 pointer-events-none" id="macify-windows-layer">
        {windows.map((w) => {
          if (w.isMinimized) return null;
          return (
            <div key={w.id} className="pointer-events-auto">
              <WindowFrame windowState={w}>
                {renderAppContent(w)}
              </WindowFrame>
            </div>
          );
        })}
      </div>

      {/* Bottom responsive magnifying Dock */}
      <Dock />

      {/* Windows Start Button & Start Menu Popup */}
      <StartMenu />

      {/* Full-screen Overlays with exit transitions */}
      <AnimatePresence mode="wait">
        {launchpadOpen && <Launchpad />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {missionControlOpen && <MissionControl />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {altTabOpen && <AltTab />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {spotlightOpen && <Spotlight />}
      </AnimatePresence>

      {/* Launcher Button on Empty wallpaper double-click to simplify navigation */}
      <div
        onDoubleClick={() => setLaunchpadOpen(true)}
        className="fixed bottom-20 left-6 text-[10px] bg-neutral-900/60 text-white rounded-md p-2 hover:bg-neutral-900 cursor-pointer shadow border border-white/5 active:scale-95 transition-all text-center leading-normal"
        id="launchpad-trigger-badge"
        title="Double click empty wallpaper space or click here to launch apps list"
      >
        <p className="font-extrabold text-sky-400">LAUNCHPAD ACTIVE</p>
        <p className="opacity-75">Click or press Ctrl + L</p>
      </div>

      {/* Screen Brightness Overlay Dimmer */}
      <div
        className="fixed inset-0 pointer-events-none z-[999999] bg-black transition-opacity duration-150"
        style={{ opacity: (100 - (brightness ?? 100)) / 100 * 0.7 }}
        id="macify-backlight-dimmer"
      />

      {/* First launch interactive configuration wizard */}
      <SetupWizard />

      {/* Floating actively synced user account profile, plan status, and premium subscription payment flows on Desktop */}
      <PremiumOnboarding 
        isDesktopWidget={true}
        onLoginComplete={(user, profile) => {
          setFirebaseUser(user);
          setUserProfile(profile);
          setUserPlan(profile.plan);
        }}
        onLogout={() => {
          setFirebaseUser(null);
          setUserProfile(null);
          setUserPlan('free');
        }}
        currentProfile={userProfile}
        onPlanUpdated={(newPlan) => {
          if (userProfile) {
            const updated = { ...userProfile, plan: newPlan };
            setUserProfile(updated);
          }
          setUserPlan(newPlan);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <MacifyProvider>
      <MacifyShell />
    </MacifyProvider>
  );
}
