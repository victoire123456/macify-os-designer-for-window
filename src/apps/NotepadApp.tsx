import React, { useState, useEffect } from 'react';
import { useMacify } from '../store';
import { FileSystemNode } from '../types';
import { Save, FileText, Check, Plus, RefreshCw, Layers } from 'lucide-react';

export default function NotepadApp({ params }: { params?: any }) {
  const {
    fileSystem,
    updateFileContent,
    createFile,
    isDarkMode,
    addNotification
  } = useMacify();

  // Find initial file if loaded or default to first txt file
  const txtFiles = fileSystem.filter(f => f.type === 'file' && f.name.endsWith('.txt'));
  
  const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(() => {
    if (params?.initialFileId) {
      return fileSystem.find(f => f.id === params.initialFileId && f.type === 'file') || null;
    }
    return txtFiles[0] || null;
  });

  const [editorContent, setEditorContent] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync editor on track select change
  useEffect(() => {
    if (selectedFile) {
      setEditorContent(selectedFile.content || '');
    } else {
      setEditorContent('');
    }
  }, [selectedFile]);

  const handleSave = () => {
    if (!selectedFile) {
      // Prompt creation
      const raw = prompt('No active file is open. Enter a filename to save this text:', 'notes.txt');
      if (raw) {
        createFile(raw, 'Desktop', 'file', editorContent);
        addNotification('File Created & Saved', `Created ${raw} on your Desktop.`, 'Notepad');
        // Retrieve newest node
        const newestTxtFiles = fileSystem.filter(f => f.type === 'file' && f.name.endsWith('.txt'));
        if (newestTxtFiles.length > 0) {
          setSelectedFile(newestTxtFiles[newestTxtFiles.length - 1]);
        }
      }
      return;
    }

    updateFileContent(selectedFile.id, editorContent);
    setSaveSuccess(true);
    addNotification('File Saved', `Changes written to "${selectedFile.name}" successfully.`, 'Notepad');
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCreateNewFile = () => {
    const raw = prompt('Enter a new document title (.txt):', 'draft.txt');
    if (raw) {
      createFile(raw, 'Desktop', 'file', '');
    }
  };

  return (
    <div className="flex flex-1 h-full select-none text-xs font-sans text-neutral-800 dark:text-neutral-200" id="notepad-app-root">
      {/* File Drawer left */}
      <div className="w-14 border-r border-neutral-700/10 dark:border-neutral-800 p-2 bg-neutral-100/40 dark:bg-neutral-900/40 shrink-0 flex flex-col justify-between">
        <div>
          <div className="space-y-1 mt-2">
            {txtFiles.map(file => {
              const isActive = selectedFile?.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center justify-center py-2 text-xs rounded-lg transition select-none cursor-pointer ${
                    isActive ? 'bg-sky-500 text-white font-bold' : 'hover:bg-white/10 text-neutral-600 dark:text-neutral-300'
                  }`}
                  title={file.name}
                >
                  <FileText size={13} className="text-current" />
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleCreateNewFile}
          className="w-full flex items-center justify-center py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition cursor-pointer leading-tight shadow"
          title="New Document"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Main Text Area editor content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/5 dark:bg-neutral-950/20">
        {/* Editor controls bar */}
        <div className={`h-10 px-4 flex items-center justify-between border-b shrink-0 ${
          isDarkMode ? 'border-neutral-800 bg-neutral-905' : 'border-neutral-200 bg-neutral-100'
        }`}>
          <div className="text-xs font-bold flex items-center text-neutral-500 dark:text-neutral-400">
            <Layers size={11} className="mr-1.5 text-sky-400" />
            <span>Editing: <span className="text-current">{selectedFile ? selectedFile.name : 'Unsaved Draft'}</span></span>
          </div>

          <button
            onClick={handleSave}
            className={`cursor-pointer p-2 rounded-lg transition flex items-center justify-center shadow ${
              saveSuccess ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
            title={saveSuccess ? 'Saved!' : 'Save Changes'}
          >
            {saveSuccess ? <Check size={11} /> : <Save size={11} />}
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
          placeholder="Start typing your notes here. Press Save to persist updates directly to Finder disk."
          className="flex-1 p-8 focus:outline-none resize-none overflow-auto font-serif text-sm sm:text-base leading-relaxed tracking-wide bg-transparent text-current h-full placeholder-neutral-400 dark:placeholder-neutral-500 select-text outline-none border-none focus:ring-0"
        />
      </div>
    </div>
  );
}
