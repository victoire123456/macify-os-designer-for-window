import React, { useState, useRef, useEffect } from 'react';
import { useMacify, WALLPAPERS } from '../store';
import { FileSystemNode, WallpaperConfig } from '../types';
import { getAppIcon } from './Dock';
import { Settings, Folder, File, Layers, RefreshCw, Layers2, Edit3, Grid, Image, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Desktop() {
  const {
    fileSystem,
    createFile,
    deleteNode,
    renameNode,
    openApp,
    setWallpaper,
    wallpaper,
    setMissionControlOpen,
    isDarkMode,
    moveNode,
  } = useMacify();

  // Selection state
  const [selection, setSelection] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Right Click Menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  // File edit state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Selected file ids on desktop
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const desktopRef = useRef<HTMLDivElement>(null);

  // Filter items in desktop
  const desktopNodes = fileSystem.filter(f => f.category === 'Desktop');

  // Cancel menus or selection on click
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setContextMenu(null);
      setSelectedFileIds([]);
    }
  };

  // Drag select initiation
  const handleMouseDown = (e: React.MouseEvent) => {
    // Left click on empty space
    if (e.button !== 0 || e.target !== desktopRef.current) return;
    
    setIsSelecting(true);
    setSelection({
      startX: e.clientX,
      startY: e.clientY - 24, // adjust for menu bar
      endX: e.clientX,
      endY: e.clientY - 24
    });
    setSelectedFileIds([]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selection) return;
    setSelection(prev => {
      if (!prev) return null;
      return {
        ...prev,
        endX: e.clientX,
        endY: e.clientY - 24
      };
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelection(null);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (e.target !== desktopRef.current) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCreateNewFile = () => {
    const rawName = prompt('Enter File Name (e.g. todo.txt):', 'untitled.txt');
    if (rawName) {
      createFile(rawName, 'Desktop', 'file', '');
    }
    setContextMenu(null);
  };

  const handleCreateNewFolder = () => {
    const rawName = prompt('Enter Folder Name:', 'New Folder');
    if (rawName) {
      createFile(rawName, 'Desktop', 'directory', '');
    }
    setContextMenu(null);
  };

  const handleWallpaperChange = () => {
    // rotate wallpapers
    const currentIdx = WALLPAPERS.findIndex(w => w.id === wallpaper.id);
    const nextIdx = (currentIdx + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIdx]);
    setContextMenu(null);
  };

  const handleNodeDoubleClick = (node: FileSystemNode) => {
    if (node.type === 'directory') {
      openApp('finder', { focusCategory: node.name });
    } else {
      openApp('notepad', { initialFileId: node.id });
    }
  };

  const handleRenameSubmit = (nodeId: string) => {
    if (editingName.trim()) {
      renameNode(nodeId, editingName.trim());
    }
    setEditingNodeId(null);
  };

  const handleDropOnFolder = (draggedId: string, folderName: string) => {
    if (draggedId === 'desk-mhd' || draggedId === 'desk-doc' || draggedId === 'desk-dld' || draggedId === 'desk-pic' || draggedId === 'desk-trsh') {
      return; // prevent dragging system folders into themselves
    }
    if (folderName === 'Trash') {
      deleteNode(draggedId);
    } else if (folderName === 'Downloads') {
      moveNode(draggedId, 'Downloads');
    } else if (folderName === 'Documents' || folderName === 'Macintosh HD') {
      moveNode(draggedId, 'Documents');
    } else if (folderName === 'Pictures') {
      moveNode(draggedId, 'Pictures');
    }
  };

  // Keyboard escape handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape edits
      if (e.key === 'Escape') {
        setEditingNodeId(null);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Selection rectangle bounds calculation styles
  const getSelectionRectStyles = () => {
    if (!selection) return {};
    const { startX, startY, endX, endY } = selection;
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(startX - endX);
    const height = Math.abs(startY - endY);
    return { left, top, width, height };
  };

  return (
    <div
      ref={desktopRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleRightClick}
      onClick={handleDesktopClick}
      className="absolute inset-[24px_0_68px_0] select-none grid grid-flow-col auto-cols-[100px] grid-rows-[repeat(auto-fill,105px)] gap-4 p-6 overflow-hidden active:cursor-default z-10"
      id="macify-desktop-wallpaper"
    >
      {/* Premium Animated Wallpaper Underlay */}
      <div className="absolute inset-0 pointer-events-none -z-10" id="macify-wallpaper-underlay">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${wallpaper.id}-${isDarkMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ 
              background: (isDarkMode && wallpaper.valueDark) ? wallpaper.valueDark : wallpaper.value,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="absolute inset-0"
          />
        </AnimatePresence>
      </div>

      {/* File Nodes Grid icons */}
      {desktopNodes.map((node) => {
        const isEditing = editingNodeId === node.id;
        const isSelected = selectedFileIds.includes(node.id);

        return (
          <div
            key={node.id}
            draggable={!isEditing}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', node.id);
            }}
            onDragOver={(e) => {
              if (node.type === 'directory') e.preventDefault();
            }}
            onDrop={(e) => {
              if (node.type === 'directory') {
                e.preventDefault();
                e.stopPropagation();
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId && draggedId !== node.id) {
                  handleDropOnFolder(draggedId, node.name);
                }
              }
            }}
            onDoubleClick={() => handleNodeDoubleClick(node)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFileIds([node.id]);
            }}
            className={`w-24 h-26 flex flex-col items-center justify-center p-1.5 rounded-2xl text-center cursor-pointer transition relative group ${
              isSelected
                ? 'bg-white/20 border border-white/30 text-white font-semibold shadow-lg'
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {/* Context option on hovering selector */}
            {!isEditing && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex items-center space-x-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(node.id);
                    setEditingName(node.name);
                  }}
                  className="p-0.5 rounded bg-neutral-900/40 hover:bg-sky-500 text-white cursor-pointer"
                  title="Rename File"
                >
                  <Edit3 size={10} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Send "${node.name}" to Trash?`)) {
                      deleteNode(node.id);
                    }
                  }}
                  className="p-0.5 rounded bg-neutral-900/40 hover:bg-rose-500 text-white cursor-pointer"
                  title="Delete File"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {/* App Icon visual wrapping */}
            <div className="w-14 h-14 bg-white/15 dark:bg-black/30 rounded-2xl flex items-center justify-center mb-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/5 backdrop-blur-md transition-all group-hover:scale-105">
              {node.type === 'directory' ? (
                <Folder size={32} className="text-amber-400 fill-amber-500/20" />
              ) : (
                <FileText size={31} className="text-sky-300" />
              )}
            </div>

            {/* File text title editor label */}
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRenameSubmit(node.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(node.id);
                }}
                autoFocus
                className="w-full text-[10px] text-center bg-sky-950 text-white rounded border border-sky-400 focus:outline-none"
              />
            ) : (
              <span className="text-[11px] font-sans font-medium tracking-wide truncate w-full px-1 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">
                {node.name}
              </span>
            )}
          </div>
        );
      })}

      {/* Canvas drag selector drawing visual box */}
      {selection && (
        <div
          style={getSelectionRectStyles()}
          className="absolute border border-sky-400/80 bg-sky-500/15 rounded pointer-events-none z-20"
        />
      )}

      {/* Simple Desktop Right-click actions */}
      <AnimatePresence>
        {contextMenu && (
          <div className="fixed inset-0 z-50 pointer-events-auto" onClick={() => setContextMenu(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 } as any}
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className={`absolute w-52 rounded-xl shadow-2xl border p-1 ${
                isDarkMode ? 'bg-neutral-950 text-neutral-200 border-neutral-800' : 'bg-white text-neutral-850 border-neutral-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCreateNewFile}
                className="w-full flex items-center px-4 py-1.5 text-left text-xs text-current hover:bg-sky-600 hover:text-white rounded-md font-semibold"
              >
                <File size={12} className="mr-2 text-sky-400" /> New File (.txt)
              </button>

              <button
                onClick={handleCreateNewFolder}
                className="w-full flex items-center px-4 py-1.5 text-left text-xs text-current hover:bg-sky-600 hover:text-white rounded-md font-semibold"
              >
                <Folder size={12} className="mr-2 text-yellow-400" /> New Folder
              </button>

              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

              <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-neutral-400">
                Choose Desktop Canvas
              </div>
              <div className="grid grid-cols-5 gap-1.5 px-3 py-1 hover:bg-transparent">
                {WALLPAPERS.slice(0, 10).map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setWallpaper(wp)}
                    className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition border ${
                      wallpaper.id === wp.id ? 'border-sky-500 scale-105 shadow' : 'border-neutral-300 dark:border-neutral-800/80'
                    }`}
                    style={{ background: wp.value }}
                    title={wp.name}
                  />
                ))}
              </div>

              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

              <button
                onClick={() => setMissionControlOpen(true)}
                className="w-full flex items-center px-4 py-1.5 text-left text-xs text-current hover:bg-sky-600 hover:text-white rounded-md"
              >
                <Grid size={12} className="mr-2 text-emerald-400" /> Show Mission Control
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
