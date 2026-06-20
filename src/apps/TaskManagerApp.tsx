import React, { useState, useEffect, useMemo } from 'react';
import { useMacify } from '../store';
import { WindowInstance } from '../types';
import { Activity, Cpu, HardDrive, Network, Trash2, XCircle } from 'lucide-react';

export default function TaskManagerApp() {
  const { windows, closeApp, isDarkMode } = useMacify();

  // Simulated system aggregates
  const [systemCPU, setSystemCPU] = useState(12);
  const [systemRAM, setSystemRAM] = useState(42); // percentage
  const [networkSpeed, setNetworkSpeed] = useState({ up: 120, down: 450 }); // KB/s
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(24).fill(12));
  const [ramHistory, setRamHistory] = useState<number[]>(Array(24).fill(42));

  // Simulating live resource usage oscillations
  useEffect(() => {
    const timer = setInterval(() => {
      // Base usage based on open windows quantity
      const windowCount = windows.length;
      const baseCpu = Math.max(5, windowCount * 4);
      const baseRam = Math.max(25, windowCount * 8 + 20);

      const nextCpu = Math.min(99, Math.max(2, Math.round(baseCpu + Math.random() * 15 - 7)));
      const nextRam = Math.min(95, Math.max(10, Math.round(baseRam + Math.random() * 2 - 1)));
      
      setSystemCPU(nextCpu);
      setSystemRAM(nextRam);
      setNetworkSpeed({
        up: Math.floor(20 + Math.random() * 200),
        down: Math.floor(100 + Math.random() * 800)
      });

      setCpuHistory(prev => [...prev.slice(1), nextCpu]);
      setRamHistory(prev => [...prev.slice(1), nextRam]);
    }, 1200);

    return () => clearInterval(timer);
  }, [windows.length]);

  // Map each window to a running process with simulated stable metrics
  const activeProcesses = useMemo(() => {
    return windows.map((w, index) => {
      // Deterministic metrics based on appId
      let pCpu = 2;
      let pRam = 120; // MB
      let pDisk = 0.1; // MB/s

      switch (w.appId) {
        case 'vscode':
          pCpu = 6;
          pRam = 680;
          pDisk = 1.2;
          break;
        case 'safari':
        case 'browser':
          pCpu = 4;
          pRam = 480;
          pDisk = 0.5;
          break;
        case 'spotify':
          pCpu = 3;
          pRam = 220;
          pDisk = 2.4;
          break;
        case 'terminal':
          pCpu = 1;
          pRam = 45;
          pDisk = 0;
          break;
        case 'creatorhub':
          pCpu = 8;
          pRam = 512;
          pDisk = 0.8;
          break;
        default:
          pCpu = 2;
          pRam = 110;
          pDisk = 0.1;
      }

      // Add small fluctuations
      pCpu = Math.max(1, pCpu + (index % 3) - 1);
      pRam = pRam + (index * 5) % 15;

      return {
        id: w.id,
        name: w.title,
        appId: w.appId,
        cpu: pCpu,
        ram: pRam,
        disk: pDisk,
      };
    });
  }, [windows]);

  // Graph helper function
  const renderPath = (history: number[], maxVal: number = 100) => {
    const width = 240;
    const height = 60;
    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={`flex-1 h-full flex flex-col font-sans ${isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-850'}`} id="task-manager-root">
      {/* Metrics Bento Row */}
      <div className="grid grid-cols-4 gap-3 p-4 border-b border-neutral-200 dark:border-neutral-850 bg-neutral-100/50 dark:bg-neutral-900/40">
        
        {/* CPU Panel */}
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center">
              <Cpu size={12} className="text-sky-500 mr-1" /> CPU
            </span>
            <span className="text-xs font-bold font-mono">{systemCPU}%</span>
          </div>
          <div className="h-10 w-full bg-neutral-50 dark:bg-neutral-950/80 rounded border border-neutral-100 dark:border-neutral-900 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={renderPath(cpuHistory)}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* RAM Panel */}
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center">
              <Activity size={12} className="text-emerald-500 mr-1" /> Memory
            </span>
            <span className="text-xs font-bold font-mono">{systemRAM}%</span>
          </div>
          <div className="h-10 w-full bg-neutral-50 dark:bg-neutral-950/80 rounded border border-neutral-100 dark:border-neutral-900 relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={renderPath(ramHistory)}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Disk Panel */}
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center">
              <HardDrive size={12} className="text-pink-500 mr-1" /> Storage
            </span>
            <span className="text-[10px] font-bold text-neutral-500">SSD Pool</span>
          </div>
          <div className="flex flex-col justify-center h-10">
            <div className="text-sm font-extrabold leading-none">248 GB / 512 GB</div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: '48.4%' }} />
            </div>
          </div>
        </div>

        {/* Network Panel */}
        <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm font-sans">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center">
              <Network size={12} className="text-amber-500 mr-1" /> Network
            </span>
            <span className="text-[9px] font-bold text-sky-500">Wi-Fi 6</span>
          </div>
          <div className="h-10 flex flex-col justify-center font-mono">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-neutral-400">DOWN:</span>
              <span className="text-emerald-500">{networkSpeed.down} KB/s</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold mt-1">
              <span className="text-neutral-400">UP:</span>
              <span className="text-amber-500">{networkSpeed.up} KB/s</span>
            </div>
          </div>
        </div>

      </div>

      {/* Processes Table Grid */}
      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400 flex items-center">
            Active System Processes ({activeProcesses.length})
          </span>
          {activeProcesses.length > 0 && (
            <span className="text-[9px] font-bold text-neutral-400 opacity-75">
              Click kill icon to end a window task
            </span>
          )}
        </div>

        {activeProcesses.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <Activity className="text-neutral-300 dark:text-neutral-800 mb-2.5 animate-pulse" size={32} />
            <h3 className="text-xs font-bold">No active windows open</h3>
            <p className="text-[10px] text-neutral-400 max-w-xs mt-1">
              All applications are currently suspended. Open apps from the launchpad or dock to inspect processes.
            </p>
          </div>
        ) : (
          <div className="border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm flex-1 flex flex-col max-h-[300px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-850 text-neutral-400 sticky top-0">
              <div className="col-span-4">Process Name</div>
              <div className="col-span-2 text-right">CPU</div>
              <div className="col-span-3 text-right">Memory</div>
              <div className="col-span-2 text-right">Disk I/O</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Table Entries */}
            <div className="overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850 flex-1">
              {activeProcesses.map((proc) => (
                <div
                  key={proc.id}
                  className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] font-medium items-center hover:bg-neutral-50 dark:hover:bg-neutral-900 bg-white dark:bg-neutral-900 transition-colors"
                >
                  <div className="col-span-4 font-bold flex items-center truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 shrink-0 animate-ping" />
                    <span className="truncate">{proc.name}</span>
                  </div>
                  <div className="col-span-2 text-right font-mono font-bold text-sky-500">{proc.cpu}%</div>
                  <div className="col-span-3 text-right font-mono text-neutral-600 dark:text-neutral-300">{proc.ram} MB</div>
                  <div className="col-span-2 text-right font-mono text-neutral-400">{proc.disk} MB/s</div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => closeApp(proc.id)}
                      className="p-1 rounded-full text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                      title="Kill Process"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer statistics */}
      <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-850 bg-neutral-100/40 dark:bg-neutral-950/20 text-[9.5px] font-bold text-neutral-400 flex items-center justify-between">
        <div>Kernel Threads: Virtual-982</div>
        <div>Uptime: Simulated 01:24:45</div>
        <div>Platform: Macify Hybrid OS Kernel</div>
      </div>
    </div>
  );
}
