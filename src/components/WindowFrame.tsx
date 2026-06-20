import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMacify } from '../store';
import { WindowInstance } from '../types';
import { Minus, Square, X, Move } from 'lucide-react';

interface SnapZone {
  type: 'max' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
  rect: { x: number; y: number; width: number; height: number };
}

interface WindowFrameProps {
  windowState: WindowInstance;
  children: React.ReactNode;
}

export default function WindowFrame({ windowState, children }: WindowFrameProps) {
  const {
    focusedWindowId,
    focusApp,
    closeApp,
    minimizeApp,
    toggleMaximizeApp,
    isDarkMode
  } = useMacify();

  const { id, title, isMaximized, x, y, width, height, zIndex } = windowState;

  const windowRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x, y, width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, winX: 0, winY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, winW: 0, winH: 0 });

  const [snapPreview, setSnapPreview] = useState<SnapZone>({
    type: null,
    rect: { x: 0, y: 0, width: 0, height: 0 }
  });
  const snapPreviewRef = useRef<SnapZone>({
    type: null,
    rect: { x: 0, y: 0, width: 0, height: 0 }
  });

  const isFocused = focusedWindowId === id;

  // Sync coords from windowState if changed from somewhere else
  useEffect(() => {
    setCoords({ x, y, width, height });
  }, [x, y, width, height]);

  // Handle Dragging
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    focusApp(id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      winX: coords.x,
      winY: coords.y
    });
    e.preventDefault();
  };

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsResizing(true);
    focusApp(id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      winW: coords.width,
      winH: coords.height
    });
    e.preventDefault();
    e.stopPropagation();
  };

  // Mouse move and up listeners for global window dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const availH = screenH - 24 - 68; // 24 menu, 68 dock space
      const halfW = screenW / 2;
      const halfH = availH / 2;

      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        // Prevent window top menu from going above 24px (menu bar height safety)
        const nextY = Math.max(24, dragStart.winY + dy);
        const nextX = dragStart.winX + dx;
        
        setCoords(prev => ({
          ...prev,
          x: nextX,
          y: nextY
        }));

        // Detect snap zone based on current mouse coordinate (e.clientX, e.clientY)
        let activeZone: SnapZone['type'] = null;
        let snapRect = { x: 0, y: 0, width: 0, height: 0 };
        const threshold = 35; // margin to trigger snapping near screen edge

        if (e.clientY < 40) {
          activeZone = 'max';
          snapRect = { x: 0, y: 24, width: screenW, height: availH };
        } else if (e.clientX < threshold) {
          if (e.clientY < screenH * 0.3) {
            activeZone = 'top-left';
            snapRect = { x: 0, y: 24, width: halfW, height: halfH };
          } else if (e.clientY > screenH * 0.7) {
            activeZone = 'bottom-left';
            snapRect = { x: 0, y: 24 + halfH, width: halfW, height: halfH };
          } else {
            activeZone = 'left';
            snapRect = { x: 0, y: 24, width: halfW, height: availH };
          }
        } else if (e.clientX > screenW - threshold) {
          if (e.clientY < screenH * 0.3) {
            activeZone = 'top-right';
            snapRect = { x: halfW, y: 24, width: halfW, height: halfH };
          } else if (e.clientY > screenH * 0.7) {
            activeZone = 'bottom-right';
            snapRect = { x: halfW, y: 24 + halfH, width: halfW, height: halfH };
          } else {
            activeZone = 'right';
            snapRect = { x: halfW, y: 24, width: halfW, height: availH };
          }
        }

        const nextSnap: SnapZone = { type: activeZone, rect: snapRect };
        setSnapPreview(nextSnap);
        snapPreviewRef.current = nextSnap;
      }

      if (isResizing) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        
        // Min bounds safety
        const nextW = Math.max(280, resizeStart.winW + dx);
        const nextH = Math.max(200, resizeStart.winH + dy);

        setCoords(prev => ({
          ...prev,
          width: nextW,
          height: nextH
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);

      const snap = snapPreviewRef.current;
      if (snap && snap.type) {
        if (snap.type === 'max') {
          if (!isMaximized) {
            toggleMaximizeApp(id);
          }
        } else {
          if (isMaximized) {
            toggleMaximizeApp(id);
          }
          setCoords(snap.rect);
        }
      }

      // Reset snap states
      setSnapPreview({ type: null, rect: { x: 0, y: 0, width: 0, height: 0 } });
      snapPreviewRef.current = { type: null, rect: { x: 0, y: 0, width: 0, height: 0 } };
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, isMaximized]);

  // Window Focus click-through
  const handleWindowClick = () => {
    if (!isFocused) {
      focusApp(id);
    }
  };

  const style: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: '24px', // menu bar offset
        left: 0,
        right: 0,
        bottom: '68px', // dock space
        zIndex: zIndex,
        borderRadius: '0px'
      }
    : {
        position: 'absolute',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${coords.width}px`,
        height: `${coords.height}px`,
        zIndex: zIndex
      };

  return (
    <>
      <div
        ref={windowRef}
        style={style}
        onClick={handleWindowClick}
        className={`rounded-xl flex flex-col overflow-hidden text-sm shadow-2xl transition-all duration-150 border active-grab ${
          isFocused
            ? isDarkMode
              ? 'bg-neutral-900/90 border-neutral-700/80 shadow-[0_15px_45px_rgba(0,0,0,0.6)]'
              : 'bg-white/90 border-neutral-250 shadow-[0_15px_40px_rgba(0,0,0,0.25)]'
            : isDarkMode
            ? 'bg-neutral-950/85 border-neutral-800 shadow-lg opacity-85'
            : 'bg-white/80 border-neutral-200 shadow-md opacity-85'
        } backdrop-blur-xl`}
        id={`win-frame-${id}`}
      >
        {/* Title Bar Header */}
        <div
          onMouseDown={handleHeaderMouseDown}
          onDoubleClick={() => toggleMaximizeApp(id)}
          className={`h-11 px-4 flex items-center justify-between cursor-move select-none relative border-b shrink-0 ${
            isDarkMode ? 'border-neutral-800/60 text-white' : 'border-neutral-100 text-neutral-800'
          }`}
        >
          {/* macOS Traffic Light Buttons */}
          <div className="flex items-center space-x-2 z-10">
            {/* Close button (Red) */}
            <button
              onClick={(e) => { e.stopPropagation(); closeApp(id); }}
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition flex items-center justify-center group relative cursor-pointer"
            >
              <X size={7} className="text-rose-950 opacity-0 group-hover:opacity-100 font-bold" />
            </button>

            {/* Minimize button (Yellow) */}
            <button
              onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
              className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center group relative cursor-pointer"
            >
              <Minus size={7} className="text-amber-950 opacity-0 group-hover:opacity-100 font-bold" />
            </button>

            {/* Maximize button (Green) */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMaximizeApp(id); }}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition flex items-center justify-center group relative cursor-pointer"
            >
              <Square size={6} className="text-emerald-950 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* Dynamic Title */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs select-none pointer-events-none tracking-wide text-neutral-600 dark:text-neutral-300">
            {title}
          </div>

          {/* Windows Bridge Flag Badge */}
          <span className="text-[10px] font-mono opacity-40 select-none">
            {windowState.appId.toUpperCase()}
          </span>
        </div>

        {/* Main Window Inner Content Area */}
        <div className="flex-1 overflow-auto relative flex flex-col bg-slate-50/50 dark:bg-neutral-950/20 text-current">
          {children}
        </div>

        {/* Window Resize Handle (Bottom right corner) */}
        {!isMaximized && (
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-0 right-0 w-4.5 h-4.5 cursor-se-resize flex items-end justify-end p-0.5 z-30"
            id={`resize-handle-${id}`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-neutral-400 dark:text-neutral-500 fill-current opacity-60">
              <line x1="6" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
              <line x1="6" y1="3" x2="3" y2="6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {snapPreview.type && createPortal(
        <div
          style={{
            position: 'absolute',
            left: `${snapPreview.rect.x}px`,
            top: `${snapPreview.rect.y}px`,
            width: `${snapPreview.rect.width}px`,
            height: `${snapPreview.rect.height}px`,
          }}
          className="border-2 border-sky-400 dark:border-sky-400 bg-sky-400/10 dark:bg-sky-500/15 backdrop-blur-[2px] rounded-2xl transition-all duration-350 ease-out shadow-[0_0_25px_rgba(56,189,248,0.3)] pointer-events-none z-[9999] animate-pulse"
        />,
        document.getElementById('macify-windows-layer') || document.body
      )}
    </>
  );
}
