import React, { useState } from 'react';
import { useMacify } from '../store';
import { Play, Code, FileCode, CheckCircle, Bug, Terminal, RefreshCw, X } from 'lucide-react';

interface MockFile {
  name: string;
  lang: string;
  content: string;
}

const VSCODE_FILES: MockFile[] = [
  {
    name: 'index.ts',
    lang: 'typescript',
    content: `// Macify Windows Integration Engine API
import { WindowsCOM } from "macify-core";

const comBridge = new WindowsCOM();
comBridge.on("launch", (app) => {
  console.log(\`Successfully launched real-time application: \${app.name}\`);
});

const isConnected = comBridge.detectHost("Windows 11");
if (isConnected) {
  console.log("Status: OK - Windows Application Support Pipeline is ACTIVE.");
}
`
  },
  {
    name: 'app.py',
    lang: 'python',
    content: `# macOS Sequoia Wallpaper Generator
import numpy as np

def generate_gradient(colors):
    print("Simulating neural backdrop mapping...")
    for idx, col in enumerate(colors):
        print(f"Index [{idx}] -> rendered hex: {col}")
    return "Sequoia Peak Red Gradient Successfully Formed."

generate_gradient(["#FF5E62", "#FF9966", "#a18cd1"])
`
  },
  {
    name: 'package.json',
    lang: 'json',
    content: `{
  "name": "macify-windows-agent",
  "version": "1.0.0",
  "description": "Virtual background proxy mapping physical host assets to Macify web container.",
  "scripts": {
    "start": "tsx server.ts",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.19.0",
    "socket.io": "^4.7.5"
  }
}`
  }
];

export default function VSCodeApp() {
  const { isDarkMode } = useMacify();
  const [selectedFile, setSelectedFile] = useState<MockFile>(VSCODE_FILES[0]);
  const [code, setCode] = useState(selectedFile.content);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to VS Code for Macify OS Compiler Terminal V1.',
    'Ready for execution tests on sandbox core standard streams.'
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const handleSelectFile = (file: MockFile) => {
    setSelectedFile(file);
    setCode(file.content);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `[Running] ts-node ${selectedFile.name}...`]);

    setTimeout(() => {
      let outputLogs: string[] = [];
      if (selectedFile.lang === 'typescript') {
        outputLogs = [
          'Detecting local Host node connection...',
          'Status: OK - Windows Application Support Pipeline is ACTIVE.',
          '[Done] exited with code=0 (Successfully Compiled in 240ms).'
        ];
      } else if (selectedFile.lang === 'python') {
        outputLogs = [
          'Simulating neural backdrop mapping...',
          'Index [0] -> rendered hex: #FF5E62',
          'Index [1] -> rendered hex: #FF9966',
          'Index [2] -> rendered hex: #a18cd1',
          'Sequoia Peak Red Gradient Successfully Formed.',
          '[Done] python compiler closed stream successfully.'
        ];
      } else {
        outputLogs = [
          'JSON Manifest analyzed successfully.',
          'Detected 2 global dependencies. Packages in audit checks: 0 vulnerabilities.',
          '[Done] manifest validated.'
        ];
      }
      setTerminalOutput(prev => [...prev, ...outputLogs]);
      setIsRunning(false);
    }, 800);
  };

  const handleClearOutput = () => {
    setTerminalOutput(['Terminal output buffer recycled.']);
  };

  return (
    <div className="flex flex-1 h-full select-none text-neutral-300 font-sans" id="vscode-app-root">
      {/* File sidebar explorer */}
      <div className="w-14 bg-[#181818] border-r border-[#2b2b2b] flex flex-col p-2 shrink-0">
        <div className="mt-3.5 space-y-1 select-none">
          {VSCODE_FILES.map(file => {
            const isSelected = file.name === selectedFile.name;
            return (
              <button
                key={file.name}
                onClick={() => handleSelectFile(file)}
                className={`w-full flex items-center justify-center py-2 rounded-md transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30'
                    : 'hover:bg-neutral-800/60'
                }`}
                title={file.name}
              >
                <FileCode size={13} className="text-sky-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
        {/* Editor tabs toolbar */}
        <div className="h-9 px-4 flex items-center justify-between bg-[#252526] border-b border-[#2d2d2d]">
          <div className="flex items-center space-x-2 text-xs font-medium text-neutral-400">
            <span className="text-white font-bold">{selectedFile.name}</span>
            <span className="text-[10px] uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-bold font-mono">
              {selectedFile.lang}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer flex items-center justify-center transition shadow-md ${
                isRunning ? 'opacity-50 cursor-wait' : ''
              }`}
              title={isRunning ? 'Compiling...' : 'Run Code'}
            >
              <Play size={11} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Code Input Block with simulated line numbers */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs text-neutral-300">
          <div className="w-10 bg-[#1e1e1e] text-neutral-600 text-right pr-2 py-4 select-none border-r border-[#2b2b2b] select-none text-[11px] font-mono leading-relaxed space-y-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent p-4 focus:outline-none resize-none overflow-auto font-mono text-neutral-200 leading-relaxed text-[11px] h-full"
            spellCheck="false"
          />
        </div>

        {/* Console / Compiler output Drawer */}
        <div className="h-36 bg-[#181818] border-t border-[#2d2d2d] flex flex-col overflow-hidden font-mono text-[10px] select-none text-neutral-400 shrink-0">
          <div className="h-8.5 px-4 bg-[#1e1e1e] flex items-center justify-between border-b border-[#2d2d2d]">
            <span className="font-extrabold flex items-center text-neutral-300">
              <Terminal size={11} className="mr-1.5 text-sky-500" /> Compiler Terminal Output Console
            </span>
            <button
              onClick={handleClearOutput}
              className="px-2 py-0.5 bg-neutral-800 text-neutral-300 hover:text-white rounded text-[9px] hover:bg-neutral-700 font-bold"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-0.5 bg-[#151515] font-mono select-text text-neutral-300">
            {terminalOutput.map((log, i) => {
              const isError = log.includes('[Error]');
              const isDone = log.includes('[Done]');
              const isRunningLabel = log.includes('[Running]');
              let logClass = 'text-neutral-400';
              if (isDone) logClass = 'text-emerald-500 font-bold';
              else if (isError) logClass = 'text-rose-500 font-medium';
              else if (isRunningLabel) logClass = 'text-sky-400 font-bold';
              
              return (
                <div key={i} className={`flex ${logClass}`}>
                  <span className="text-neutral-650 mr-1.5">{`>`}</span>
                  <span>{log}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
