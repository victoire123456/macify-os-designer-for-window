import React, { useState, useMemo } from 'react';
import { useMacify } from '../store';
import { FileSystemNode } from '../types';
import { Folder, File, Search, Grid, List, Plus, Trash2, Copy, Move, Check, Info, FileText, ChevronRight, CornerDownRight, Image, Music, Download, Monitor, Video, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const parseModifiedDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  const lower = dateStr.toLowerCase().trim();
  if (lower.includes('just now')) {
    return Date.now();
  }
  if (lower.includes('yesterday')) {
    return Date.now() - 24 * 60 * 60 * 1000;
  }
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return 0;
};

const parseFileSize = (sizeStr: string): number => {
  if (!sizeStr || sizeStr === '--') return -1; // Directories / Empty Size sorted to top or bottom
  const matches = sizeStr.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  if (!matches) {
    const parsedNum = parseFloat(sizeStr);
    return isNaN(parsedNum) ? 0 : parsedNum;
  }
  const value = parseFloat(matches[1]);
  const unit = matches[2].toUpperCase();
  switch (unit) {
    case 'B': return value;
    case 'KB': return value * 1024;
    case 'MB': return value * 1024 * 1024;
    case 'GB': return value * 1024 * 1024 * 1024;
    case 'TB': return value * 1024 * 1024 * 1024 * 1024;
    default: return value;
  }
};

const getCategoryIcon = (cat: string, size: number = 14, className: string = '') => {
  switch (cat) {
    case 'Desktop':
      return <Monitor size={size} className={`text-sky-500 ${className}`} />;
    case 'Documents':
      return <FileText size={size} className={`text-blue-400 ${className}`} />;
    case 'Downloads':
      return <Download size={size} className={`text-emerald-500 ${className}`} />;
    case 'Pictures':
      return <Image size={size} className={`text-purple-500 ${className}`} />;
    case 'Videos':
      return <Video size={size} className={`text-rose-500 ${className}`} />;
    case 'Music':
      return <Music size={size} className={`text-pink-500 ${className}`} />;
    default:
      return <Folder size={size} className={`text-yellow-500 ${className}`} />;
  }
};

export default function FinderApp({ params }: { params?: any }) {
  const {
    fileSystem,
    createFile,
    deleteNode,
    copyNode,
    cutNode,
    pasteNode,
    renameNode,
    clipboard,
    isDarkMode,
    openApp
  } = useMacify();

  // Sidebar links
  const categories: FileSystemNode['category'][] = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos', 'Music'];
  const [currentCategory, setCurrentCategory] = useState<FileSystemNode['category']>(
    params?.focusCategory || 'Desktop'
  );

  const [currentPath, setCurrentPath] = useState<string>(params?.focusCategory || 'Desktop');
  const [nativeFolderFiles, setNativeFolderFiles] = useState<FileSystemNode[]>([]);
  const [isLoadingNative, setIsLoadingNative] = useState(false);

  React.useEffect(() => {
    setCurrentPath(currentCategory);
  }, [currentCategory]);

  React.useEffect(() => {
    if (window.macifyAPI) {
      setIsLoadingNative(true);
      window.macifyAPI.readFolder(currentPath)
        .then(files => {
          setNativeFolderFiles(files);
        })
        .catch(err => {
          console.error('Error reading native folder:', err);
        })
        .finally(() => {
          setIsLoadingNative(false);
        });
    }
  }, [currentPath]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastModified' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Selected file details in finder
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileSystemNode | null;
  } | null>(null);

  // Filtered files in currently chosen sidebar category
  const categoryFiles = useMemo(() => {
    return fileSystem.filter(f => f.category === currentCategory);
  }, [fileSystem, currentCategory]);

  const activeFilesList = useMemo(() => {
    return window.macifyAPI ? nativeFolderFiles : categoryFiles;
  }, [nativeFolderFiles, categoryFiles]);

  const displayedFiles = useMemo(() => {
    if (!searchQuery) return activeFilesList;
    return activeFilesList.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeFilesList, searchQuery]);

  const sortedFiles = useMemo(() => {
    const files = [...displayedFiles];
    files.sort((a, b) => {
      // Group folders on top by default
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;

      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      } else if (sortBy === 'lastModified') {
        comparison = parseModifiedDate(a.lastModified) - parseModifiedDate(b.lastModified);
      } else if (sortBy === 'size') {
        comparison = parseFileSize(a.size) - parseFileSize(b.size);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return files;
  }, [displayedFiles, sortBy, sortOrder]);

  const selectedFile = useMemo(() => {
    return (
      fileSystem.find(f => f.id === selectedFileId) ||
      nativeFolderFiles.find(f => f.id === selectedFileId) ||
      null
    );
  }, [fileSystem, nativeFolderFiles, selectedFileId]);

  const handleCreateNewFile = () => {
    const raw = prompt('Enter text file name:', 'notes.txt');
    if (raw) {
      createFile(raw, currentCategory, 'file', 'Created inside macOS Finder Hub.');
    }
  };

  const handleCreateNewFolder = () => {
    const raw = prompt('Enter folder name:', 'Custom Folder');
    if (raw) {
      createFile(raw, currentCategory, 'directory', '');
    }
  };

  const handleDeleteFile = async (file: FileSystemNode, bypassConfirm = false) => {
    if (window.macifyAPI && file.path) {
      if (bypassConfirm || confirm(`Are you sure you want to move "${file.name}" to the Trash?`)) {
        try {
          const res = await window.macifyAPI.deleteFile(file.path);
          if (res.success) {
            const files = await window.macifyAPI.readFolder(currentPath);
            setNativeFolderFiles(files);
            setSelectedFileId(null);
          } else {
            alert(`Error moving file to trash: ${res.error}`);
          }
        } catch (err: any) {
          console.error('Failed to delete file natively:', err);
          alert(`Failed to delete file: ${err.message || err}`);
        }
      }
    } else {
      if (bypassConfirm || confirm(`Are you sure you want to delete "${file.name}"?`)) {
        deleteNode(file.id);
        setSelectedFileId(null);
      }
    }
  };

  const handleNavigateUp = () => {
    if (currentPath.includes('\\')) {
      const parts = currentPath.split('\\');
      if (parts.length > 1) {
        parts.pop();
        const parentPath = parts.join('\\');
        setCurrentPath(parentPath || 'C:\\');
      }
    } else if (currentPath.includes('/')) {
      const parts = currentPath.split('/');
      if (parts.length > 1) {
        parts.pop();
        const parentPath = parts.join('/');
        setCurrentPath(parentPath || '/');
      }
    }
  };

  const handleDoubleClick = (file: FileSystemNode) => {
    if (file.type === 'directory') {
      if (window.macifyAPI) {
        setCurrentPath(file.path || '');
      } else {
        alert(`Virtual folder navigated: "${file.name}". Entering simulated sub-nodes.`);
      }
    } else {
      if (window.macifyAPI && file.path) {
        window.macifyAPI.openApp(file.path).catch(err => {
          console.error('Failed to open file natively:', err);
        });
      } else {
        openApp('notepad', { initialFileId: file.id });
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileSystemNode | null) => {
    e.preventDefault();
    e.stopPropagation();
    const containerRect = document.getElementById('finder-app-root')?.getBoundingClientRect();
    const x = e.clientX - (containerRect?.left || 0);
    const y = e.clientY - (containerRect?.top || 0) + 10;
    setContextMenu({ x, y, file });
  };

  const handleDropFile = (fileId: string, targetCategory: FileSystemNode['category']) => {
    const fileNode = fileSystem.find(f => f.id === fileId);
    if (fileNode) {
      cutNode(fileNode);
      setTimeout(() => {
        pasteNode(targetCategory);
      }, 50);
    }
  };

  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div className="flex flex-1 h-full select-none" id="finder-app-root">
      {/* Sidebar Navigation */}
      <div className={`w-14 border-r flex flex-col justify-between p-2 shrink-0 ${
        isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-100/40 border-neutral-200'
      }`}>
        <div className="space-y-4">
          <div>
            <div className="space-y-1 mt-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentCategory(cat);
                    setSelectedFileId(null);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fileId = e.dataTransfer.getData('text/plain');
                    handleDropFile(fileId, cat);
                  }}
                  className={`w-full flex items-center justify-center py-2 text-xs rounded-lg transition ${
                    currentCategory === cat
                      ? 'bg-sky-500 text-white font-bold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-white/10'
                  }`}
                  title={cat}
                >
                  {getCategoryIcon(cat, 15, currentCategory === cat ? 'text-white' : '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Finder Help footnote icon alignment */}
        <div className="text-[9px] text-neutral-400 font-mono tracking-tight leading-normal text-center">
          <span className="w-2.5 h-2.5 inline-block bg-emerald-500 rounded-full" title="Local Files Active - offline synced" />
        </div>
      </div>

      {/* Main Folder Explorer */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/5 dark:bg-neutral-950/20">
        {/* Finder Toolbar */}
        <div className={`h-11 px-4 flex items-center justify-between border-b shrink-0 ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-400">
            {window.macifyAPI && currentPath !== currentCategory && (
              <button
                onClick={handleNavigateUp}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-300 transition duration-150 flex items-center justify-center cursor-pointer"
                title="Navigate Up"
              >
                <ArrowUp size={11} />
              </button>
            )}
            <span>Macify Disk</span>
            <ChevronRight size={10} />
            <span className="text-current truncate max-w-xs" title={window.macifyAPI ? currentPath : currentCategory}>
              {window.macifyAPI ? currentPath : currentCategory}
            </span>
            {isLoadingNative && (
              <span className="text-[10px] text-amber-500 font-normal animate-pulse ml-2">(reading...)</span>
            )}
          </div>

          {/* Controls: Search, View modes, paste config */}
          <div className="flex items-center space-x-3">
            {/* Action quick creator */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCreateNewFile}
                className="p-1 px-2 hover:bg-sky-500/10 hover:text-sky-500 rounded border border-neutral-700/30 text-xs font-bold cursor-pointer"
                title="Create File"
              >
                + FIle
              </button>
              <button
                onClick={handleCreateNewFolder}
                className="p-1 px-2 hover:bg-sky-500/10 hover:text-sky-500 rounded border border-neutral-700/30 text-xs font-bold cursor-pointer"
                title="Create Folder"
              >
                + Folder
              </button>
            </div>

            {/* Separator */}
            <span className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

            {/* Clipboard Paste indicator */}
            {clipboard && (
              <button
                onClick={() => pasteNode(currentCategory)}
                className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center justify-center shadow cursor-pointer animate-pulse"
                title="Paste Clipboard"
              >
                <CornerDownRight size={12} />
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 rounded-lg p-0.5 border border-neutral-700/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                <Grid size={13} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                <List size={13} />
              </button>
            </div>

            {/* Sort Options Dropdown */}
            <div className="relative group">
              <button
                className={`p-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-700/10 text-[11px] font-semibold flex items-center justify-center transition hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer ${
                  sortBy !== 'name' ? 'text-sky-550 font-bold' : 'text-neutral-600 dark:text-neutral-400'
                }`}
                title={`Sort Options: ${sortBy === 'lastModified' ? 'Date' : sortBy} (${sortOrder})`}
              >
                <ArrowUpDown size={12} />
              </button>
              
              {/* Dropdown list on hover/click */}
              <div className="absolute right-0 top-full mt-1 w-36 py-1 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 hidden group-hover:block hover:block z-50">
                <div className="px-2.5 py-1 text-[9px] font-bold text-neutral-450 uppercase tracking-wider">Sort Folder By</div>
                <button
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center justify-between font-medium cursor-pointer ${
                    sortBy === 'name' ? 'text-sky-500 font-extrabold' : 'text-neutral-750 dark:text-neutral-300'
                  }`}
                >
                  <span>Name</span>
                  {sortBy === 'name' && sortOrder === 'asc' && <ArrowUp size={10} />}
                  {sortBy === 'name' && sortOrder === 'desc' && <ArrowDown size={10} />}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === 'lastModified') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('lastModified');
                      setSortOrder('desc');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center justify-between font-medium cursor-pointer ${
                    sortBy === 'lastModified' ? 'text-sky-500 font-extrabold' : 'text-neutral-750 dark:text-neutral-300'
                  }`}
                >
                  <span>Date Modified</span>
                  {sortBy === 'lastModified' && sortOrder === 'asc' && <ArrowUp size={10} />}
                  {sortBy === 'lastModified' && sortOrder === 'desc' && <ArrowDown size={10} />}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === 'size') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('size');
                      setSortOrder('desc');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-sky-500 hover:text-white flex items-center justify-between font-medium cursor-pointer ${
                    sortBy === 'size' ? 'text-sky-500 font-extrabold' : 'text-neutral-750 dark:text-neutral-300'
                  }`}
                >
                  <span>Size</span>
                  {sortBy === 'size' && sortOrder === 'asc' && <ArrowUp size={10} />}
                  {sortBy === 'size' && sortOrder === 'desc' && <ArrowDown size={10} />}
                </button>
                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                <button
                  onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                  className="w-full text-left px-2.5 py-1 text-[10px] text-neutral-450 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold uppercase tracking-wide flex items-center justify-between cursor-pointer"
                >
                  <span>Reverse Order</span>
                  <ArrowUpDown size={10} />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-32 py-1 pl-7 pr-3 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-700/35 text-xs text-white placeholder-neutral-450 focus:outline-none focus:w-44 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Folder items canvas structure */}
        <div
          className="flex-1 overflow-auto p-4 relative"
          onContextMenu={(e) => handleContextMenu(e, null)}
          id="finder-canvas-inner"
        >
          {sortedFiles.length === 0 ? (
            <div className="text-center py-20 text-neutral-450 flex flex-col items-center">
              <Folder size={32} className="stroke-1 text-neutral-700 mb-2" />
              <span className="text-xs font-bold">This Directory is Empty</span>
              <p className="text-[10px] opacity-75 mt-0.5">Create virtual files or folders from the top menu toolbar or right-click here.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {sortedFiles.map(file => {
                const isSelected = file.id === selectedFileId;
                return (
                  <div
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleDoubleClick(file);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', file.id);
                    }}
                    onDragOver={(e) => {
                      if (file.type === 'directory') e.preventDefault();
                    }}
                    onDrop={(e) => {
                      if (file.type === 'directory') {
                        e.preventDefault();
                        e.stopPropagation();
                        const draggedId = e.dataTransfer.getData('text/plain');
                        handleDropFile(draggedId, currentCategory);
                      }
                    }}
                    className={`p-3 rounded-xl flex flex-col items-center text-center cursor-pointer border select-none transition ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-300 font-bold'
                        : 'border-transparent hover:bg-white/5 text-current'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-1.5 border border-white/5">
                      {file.type === 'directory' ? (
                        <Folder size={20} className="text-yellow-500 fill-yellow-500/20" />
                      ) : (
                        <FileText size={20} className="text-sky-400" />
                      )}
                    </div>
                    <span className="text-[11px] truncate w-full px-1">{file.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-1">
              <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-neutral-450 font-mono tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-1.5 px-2 select-none">
                <button
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                  className="col-span-6 text-left flex items-center hover:text-sky-500 cursor-pointer font-bold uppercase tracking-wider"
                >
                  <span>Name</span>
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ArrowUp size={10} className="ml-1 text-sky-500 animate-pulse" /> : <ArrowDown size={10} className="ml-1 text-sky-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === 'lastModified') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('lastModified');
                      setSortOrder('desc');
                    }
                  }}
                  className="col-span-3 text-left flex items-center hover:text-sky-500 cursor-pointer font-bold uppercase tracking-wider"
                >
                  <span>Date Modified</span>
                  {sortBy === 'lastModified' && (
                    sortOrder === 'asc' ? <ArrowUp size={10} className="ml-1 text-sky-500 animate-pulse" /> : <ArrowDown size={10} className="ml-1 text-sky-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (sortBy === 'size') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('size');
                      setSortOrder('desc');
                    }
                  }}
                  className="col-span-3 text-left flex items-center hover:text-sky-500 cursor-pointer font-bold uppercase tracking-wider"
                >
                  <span>Size</span>
                  {sortBy === 'size' && (
                    sortOrder === 'asc' ? <ArrowUp size={10} className="ml-1 text-sky-500 animate-pulse" /> : <ArrowDown size={10} className="ml-1 text-sky-500 animate-pulse" />
                  )}
                </button>
              </div>
              <div className="mt-1.5 space-y-0.5">
                {sortedFiles.map(file => {
                  const isSelected = file.id === selectedFileId;
                  return (
                    <div
                      key={file.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileId(file.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleDoubleClick(file);
                      }}
                      onContextMenu={(e) => handleContextMenu(e, file)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', file.id);
                      }}
                      onDragOver={(e) => {
                        if (file.type === 'directory') e.preventDefault();
                      }}
                      onDrop={(e) => {
                        if (file.type === 'directory') {
                          e.preventDefault();
                          e.stopPropagation();
                          const draggedId = e.dataTransfer.getData('text/plain');
                          handleDropFile(draggedId, currentCategory);
                        }
                      }}
                      className={`grid grid-cols-12 items-center text-xs p-1.5 px-2 rounded-lg cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-sky-500 text-white font-semibold'
                          : 'hover:bg-white/5 text-current'
                      }`}
                    >
                      <span className="col-span-6 flex items-center font-medium">
                        <span className="mr-2">
                          {file.type === 'directory' ? (
                            <Folder size={14} className="text-yellow-500 fill-yellow-500/10 inline" />
                          ) : (
                            <FileText size={14} className="text-sky-400 inline" />
                          )}
                        </span>
                        {file.name}
                      </span>
                      <span className="col-span-3 text-neutral-400 text-[10px] font-mono">{file.lastModified}</span>
                      <span className="col-span-3 text-neutral-400 text-[10px] font-mono">{file.size}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Context Menu Dropdown */}
          {contextMenu && (
            <div
              style={{ left: contextMenu.x, top: contextMenu.y }}
              className={`absolute z-[9999] w-48 rounded-lg shadow-2xl border p-1 ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
              } backdrop-blur-md`}
            >
              {contextMenu.file ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoubleClick(contextMenu.file!);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs font-semibold cursor-pointer"
                  >
                    Open Item
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyNode(contextMenu.file!);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer"
                  >
                    Copy Item
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cutNode(contextMenu.file!);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer"
                  >
                    Move / Cut Item
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = prompt('Enter new item name:', contextMenu.file!.name);
                      if (newName && newName.trim()) {
                        renameNode(contextMenu.file!.id, newName.trim());
                      }
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer"
                  >
                    Rename...
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(contextMenu.file!, false);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-orange-500 hover:text-white rounded text-orange-600 dark:text-orange-400 text-left text-xs font-semibold cursor-pointer"
                  >
                    Move to Trash...
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(contextMenu.file!, true);
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-rose-600 hover:text-white rounded text-rose-500 text-left text-xs font-bold cursor-pointer"
                  >
                    ⚡ Delete Instantly (Fast)
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateNewFile();
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer"
                  >
                    New File
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateNewFolder();
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer"
                  >
                    New Folder
                  </button>
                  {clipboard && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pasteNode(currentCategory);
                        setContextMenu(null);
                      }}
                      className="flex w-full items-center px-3 py-1.5 hover:bg-sky-500 hover:text-white rounded text-left text-xs cursor-pointer animate-pulse"
                    >
                      Paste Item Here
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Node Inspector Sidebar */}
      {selectedFile && (
        <div className={`w-52 border-l p-4 flex flex-col justify-between shrink-0 ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
        }`}>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-500">File Inspector</span>
            <div className="mt-4 flex flex-col items-center text-center pb-4 border-b border-neutral-800/40">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center p-2 mb-2 shadow-inner border border-white/5">
                {selectedFile.type === 'directory' ? (
                  <Folder size={32} className="text-yellow-500 fill-yellow-500/20" />
                ) : (
                  <FileText size={32} className="text-sky-400" />
                )}
              </div>
              <h5 className="font-serif italic text-sm mt-0.5 truncate w-full text-neutral-900 dark:text-neutral-50">{selectedFile.name}</h5>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full mt-1.5 font-semibold font-mono uppercase">
                {selectedFile.type}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-[11px]">
              <div className="flex justify-between leading-none">
                <span className="text-neutral-400 font-medium">Target Size:</span>
                <span className="font-mono">{selectedFile.size}</span>
              </div>
              <div className="flex justify-between leading-none">
                <span className="text-neutral-400 font-medium">Modified:</span>
                <span className="font-mono">{selectedFile.lastModified}</span>
              </div>
              <div className="flex justify-between leading-none">
                <span className="text-neutral-400 font-medium">Path:</span>
                <span className="font-mono text-[9px] truncate max-w-[120px]" title={selectedFile.path}>{selectedFile.path}</span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="space-y-1.5 pt-4 border-t border-neutral-800/40">
            <button
              onClick={() => copyNode(selectedFile)}
              className="w-full flex items-center justify-center px-3 py-1.5 rounded-lg text-xs bg-sky-500 hover:bg-sky-600 text-white cursor-pointer font-bold transition shadow-md"
            >
              <Copy size={11} className="mr-1.5" /> Copy Node
            </button>
            <button
              onClick={() => cutNode(selectedFile)}
              className="w-full flex items-center justify-center px-3 py-1.5 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer transition border border-neutral-700"
            >
              <Move size={11} className="mr-1.5 text-sky-400" /> Move / Cut Node
            </button>
            <button
              onClick={() => handleDeleteFile(selectedFile, false)}
              className="w-full flex items-center justify-center px-3 py-1.5 rounded-lg text-xs bg-orange-500/10 hover:bg-orange-650 text-orange-600 hover:text-white dark:text-orange-400 border border-orange-500/20 hover:border-transparent cursor-pointer font-semibold transition"
            >
              <Trash2 size={11} className="mr-1.5" /> Move to Trash...
            </button>
            <button
              onClick={() => handleDeleteFile(selectedFile, true)}
              className="w-full flex items-center justify-center px-3 py-1.5 rounded-lg text-xs bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white cursor-pointer font-bold transition"
            >
              <Trash2 size={11} className="mr-1.5" /> ⚡ Delete Instantly (Fast)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
