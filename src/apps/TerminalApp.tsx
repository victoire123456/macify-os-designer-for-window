import React, { useState, useRef, useEffect } from 'react';
import { useMacify } from '../store';
import { Terminal, Shield, Sparkles } from 'lucide-react';

export default function TerminalApp() {
  const { fileSystem, createFile, isDarkMode } = useMacify();
  
  // Terminal tracking
  const [currentDir, setCurrentDir] = useState<'Desktop' | 'Documents' | 'Downloads' | 'Pictures' | 'Music' | 'Root'>('Desktop');
  const [history, setHistory] = useState<string[]>([
    'Macify Virtual POSIX Shell [Version 1.4.1]',
    '(c) 2026 Apple Virtualizer Core Inc. All rights reserved.',
    'Host Connection Active. Type "help" to list instructions.',
    'Type "neofetch" to display system telemetry logo.',
    ''
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const parts = cmd.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let responses: string[] = [`macify-shell:${currentDir.toLowerCase()} admin$ ${cmd}`];

    switch (mainCommand) {
      case 'help':
        responses.push(
          'Available POSIX emulated shell commands:',
          '  ls              List active files in current directory',
          '  cd [dir]        Navigate to sub-directory (e.g. Documents, Pictures)',
          '  cat [file]      Print content of specified notepad file',
          '  mkdir [folder]  Create a folder in current directory context',
          '  clear           Reset terminal screen log buffers',
          '  neofetch        Analyze host device specifications logo',
          '  help            Retrieve instruction logs'
        );
        break;

      case 'ls':
        const files = fileSystem.filter(f => f.category === currentDir);
        if (files.length === 0) {
          responses.push('(empty directory)');
        } else {
          files.forEach(f => {
            responses.push(`  ${f.type === 'directory' ? '📁' : '📄'}  ${f.name}   [${f.size}]`);
          });
        }
        break;

      case 'cd':
        const targetDir = arg.trim();
        if (!targetDir || targetDir === '..') {
          setCurrentDir('Desktop');
          responses.push('Returned to home Desktop hub.');
        } else {
          const matched = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music'].find(
            d => d.toLowerCase() === targetDir.toLowerCase()
          );
          if (matched) {
            setCurrentDir(matched as any);
            responses.push(`Successfully navigated to: /${matched}`);
          } else {
            responses.push(`cd: directory not found: ${targetDir}`);
          }
        }
        break;

      case 'cat':
        const targetFile = arg.trim();
        if (!targetFile) {
          responses.push('cat: argument required. Usage: cat [filename]');
        } else {
          const matchedFile = fileSystem.find(
            f => f.category === currentDir && f.name.toLowerCase() === targetFile.toLowerCase()
          );
          if (matchedFile) {
            responses.push(matchedFile.content || '(empty file content buffer)');
          } else {
            responses.push(`cat: file not found in /${currentDir}: ${targetFile}`);
          }
        }
        break;

      case 'mkdir':
        const newFolder = arg.trim();
        if (!newFolder) {
          responses.push('mkdir: folder title required. Usage: mkdir [foldername]');
        } else {
          createFile(newFolder, currentDir as any, 'directory', '');
          responses.push(`Directory "${newFolder}" successfully allocated in Cupertino clusters.`);
        }
        break;

      case 'clear':
        setHistory(['Terminal screen reset successfully.']);
        setInputVal('');
        return;

      case 'neofetch':
        responses.push(
          ' `.-:////:-.`       admin@macify-virtual-pc',
          ' `/++++++++++++++/.`     -------------------------',
          ' `/+++++++++++++++++/`    OS: Macify OS Sequoia 14.1 on Win11 CPU',
          ' `/++++/````````/++++/`   Host: Windows 11 Pro build x64',
          ' /++++/          /++++/   Kernel: WSL2 virtualized browser node',
          ' /++++/          /++++/   Uptime: 2 hours, 14 minutes',
          ' `/++++/````````/++++/`   Shell: POSIX emulated shell',
          '  `/+++++++++++++++++/`   Resolution: 1920x1080 (Responsive frame)',
          '   `/++++++++++++++/.`    Memory Buffers: 24 GB Allocated',
          '     `.-:////:-.`         GPU: Apple Dual Core Emulation'
        );
        break;

      default:
        responses.push(`macify-shell: command not found: ${mainCommand}. Type "help" for core list.`);
    }

    setHistory(prev => [...prev, ...responses]);
    setInputVal('');
  };

  return (
    <div className="flex flex-1 h-full select-none text-white font-mono bg-neutral-950 p-4 overflow-hidden flex-col justify-between" id="terminal-app-root">
      {/* Console output body */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-1 font-mono text-[11px] leading-relaxed">
        {history.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap font-mono">
            {log}
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Input line bar */}
      <form onSubmit={handleCommandSubmit} className="mt-2.5 pt-2 border-t border-neutral-900 flex items-center shrink-0">
        <span className="text-emerald-500 font-mono text-[11px] mr-2">
          macify-shell:{currentDir.toLowerCase()} admin$
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent border-none text-white font-mono focus:outline-none text-[11px]"
          autoFocus
          spellCheck="false"
        />
      </form>
    </div>
  );
}
