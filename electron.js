import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import childProcess from 'child_process';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let db;

// Initialize SQLite Database
function initDatabase() {
  try {
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'macify.db');
    console.log('Initializing local offline SQLite database at:', dbPath);
    
    db = new sqlite3.Database(dbPath);
    db.serialize(() => {
      // 1. Settings Table (Local settings, themes, preferences)
      db.run(`CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        isDarkMode INTEGER DEFAULT 0,
        dockSize INTEGER DEFAULT 48,
        dockMagnification REAL DEFAULT 1.35,
        brightness INTEGER DEFAULT 90,
        volume INTEGER DEFAULT 75,
        clockFormat TEXT DEFAULT 'short'
      )`);

      // Seed default settings row if not exists
      db.run(`INSERT OR IGNORE INTO settings (id) VALUES ('system')`);

      // 2. User Data Table (Notes, conversations, wallpapers, icons, recent files, and bookmarks)
      db.run(`CREATE TABLE IF NOT EXISTS user_data (
        id TEXT PRIMARY KEY,
        dataType TEXT, -- 'note', 'wallpaper', 'desktop_icon', 'bookmark', 'ai_history', 'recent_file'
        name TEXT,
        value TEXT, -- JSON content string
        updatedAt TEXT
      )`);
    });
  } catch (err) {
    console.error('Failed to initialize local SQLite database:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Macify OS',
    frame: true, // Frameless is also an option, but window frame ensures cross-platform menus
    titleBarStyle: 'hidden', // Give a beautiful native look
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Sandbox must be disabled for full system/file access
    }
  });

  // Load local Port 3000 in dev mode, or load built HTML in production
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register Offline Local Settings and User Data IPC handlers
ipcMain.handle('get-local-settings', async () => {
  return new Promise((resolve) => {
    if (!db) { resolve(null); return; }
    db.get(`SELECT * FROM settings WHERE id = 'system'`, [], (err, row) => {
      if (err || !row) {
        resolve(null);
      } else {
        resolve({
          isDarkMode: row.isDarkMode === 1,
          dockSize: row.dockSize,
          dockMagnification: row.dockMagnification,
          brightness: row.brightness,
          volume: row.volume,
          clockFormat: row.clockFormat
        });
      }
    });
  });
});

ipcMain.handle('save-local-settings', async (event, settings) => {
  return new Promise((resolve) => {
    if (!db) { resolve({ success: false }); return; }
    db.run(
      `INSERT OR REPLACE INTO settings (id, isDarkMode, dockSize, dockMagnification, brightness, volume, clockFormat) VALUES ('system', ?, ?, ?, ?, ?, ?)`,
      [
        settings.isDarkMode ? 1 : 0,
        settings.dockSize ?? 48,
        settings.dockMagnification ?? 1.35,
        settings.brightness ?? 90,
        settings.volume ?? 75,
        settings.clockFormat ?? 'short'
      ],
      function (err) {
        resolve({ success: !err, error: err?.message });
      }
    );
  });
});

ipcMain.handle('get-local-data-items', async (event, { dataType }) => {
  return new Promise((resolve) => {
    if (!db) { resolve([]); return; }
    db.all(`SELECT id, name, value, updatedAt FROM user_data WHERE dataType = ?`, [dataType], (err, rows) => {
      if (err || !rows) {
        resolve([]);
      } else {
        resolve(rows.map(r => ({
          id: r.id,
          dataType,
          name: r.name,
          value: JSON.parse(r.value),
          updatedAt: r.updatedAt
        })));
      }
    });
  });
});

ipcMain.handle('save-local-data-item', async (event, { dataType, id, name, value }) => {
  return new Promise((resolve) => {
    if (!db) { resolve({ success: false }); return; }
    const valueStr = JSON.stringify(value);
    const updatedAt = new Date().toISOString();
    db.run(
      `INSERT OR REPLACE INTO user_data (id, dataType, name, value, updatedAt) VALUES (?, ?, ?, ?, ?)`,
      [id, dataType, name, valueStr, updatedAt],
      function (err) {
        resolve({ success: !err, error: err?.message });
      }
    );
  });
});

ipcMain.handle('delete-local-data-item', async (event, { id }) => {
  return new Promise((resolve) => {
    if (!db) { resolve({ success: false }); return; }
    db.run(`DELETE FROM user_data WHERE id = ?`, [id], function (err) {
      resolve({ success: !err, error: err?.message });
    });
  });
});

// IPC handler to browse directories safely
ipcMain.handle('read-folder', async (event, folderPath) => {
  try {
    let resolvedPath = folderPath;
    const userProfile = process.env.USERPROFILE || process.env.HOME || '';
    
    // Convert friendly OS aliases to real paths
    if (!resolvedPath || resolvedPath === 'Root' || resolvedPath === '/' || resolvedPath === 'Desktop') {
      resolvedPath = path.join(userProfile, 'Desktop');
    } else if (resolvedPath === 'Documents') {
      resolvedPath = path.join(userProfile, 'Documents');
    } else if (resolvedPath === 'Downloads') {
      resolvedPath = path.join(userProfile, 'Downloads');
    } else if (resolvedPath === 'Pictures') {
      resolvedPath = path.join(userProfile, 'Pictures');
    } else if (resolvedPath === 'Videos') {
      resolvedPath = path.join(userProfile, 'Videos');
    } else if (resolvedPath === 'Music') {
      resolvedPath = path.join(userProfile, 'Music');
    }

    if (!fs.existsSync(resolvedPath)) {
      resolvedPath = userProfile;
    }

    const files = await fs.promises.readdir(resolvedPath, { withFileTypes: true });
    
    const nodes = files.map(file => {
      const filePath = path.join(resolvedPath, file.name);
      let size = '0 KB';
      let mtimeStr = new Date().toLocaleDateString();
      try {
        const stats = fs.statSync(filePath);
        mtimeStr = stats.mtime.toLocaleDateString();
        if (file.isDirectory()) {
          size = '--';
        } else {
          const kb = Math.round(stats.size / 1024);
          size = `${kb} KB`;
        }
      } catch (err) {
        // Safe fallback for unreadables
      }

      return {
        id: file.name + '-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
        path: filePath,
        size: size,
        category: folderPath,
        lastModified: mtimeStr
      };
    });

    return nodes;
  } catch (error) {
    console.error('Error reading native folder:', error);
    return [];
  }
});

// IPC handler to move a file or folder safely to the native OS Trash/Recycle Bin
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    if (!filePath) {
      return { success: false, error: 'Path is required' };
    }
    if (fs.existsSync(filePath)) {
      await shell.trashItem(filePath);
      return { success: true };
    }
    return { success: false, error: 'File does not exist' };
  } catch (err) {
    console.error('Error deleting native file:', err);
    return { success: false, error: err.message };
  }
});

// IPC handler to execute/open a local file or application
ipcMain.handle('open-app', async (event, exePath) => {
  try {
    if (!exePath) {
      return { success: false, error: 'Path is required' };
    }

    if (fs.existsSync(exePath) || exePath.startsWith('http') || exePath.includes(':\\')) {
      childProcess.exec(`"${exePath}"`, (err) => {
        if (err) console.error('Exec error:', err);
      });
      return { success: true };
    } else {
      // Try default shell handling (e.g. system commands or links)
      childProcess.exec(`start "" "${exePath}"`, (err) => {
        if (err) {
          childProcess.exec(exePath, (err2) => {
            if (err2) console.error('Final app launch attempt failed:', err2);
          });
        }
      });
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC handler to live-scan installed Windows desktop applications
ipcMain.handle('scan-apps', async (event) => {
  try {
    const userProfile = process.env.USERPROFILE || process.env.HOME || '';
    const localAppData = process.env.LOCALAPPDATA || path.join(userProfile, 'AppData', 'Local');
    const appData = process.env.APPDATA || path.join(userProfile, 'AppData', 'Roaming');
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

    // Comprehensive map of popular installations for professional scanning
    const scannerMappings = [
      {
        id: 'chrome',
        name: 'Google Chrome',
        icon: 'Chrome',
        category: 'windows',
        windowsCategory: 'Browsers',
        brandColor: '#4285F4',
        paths: [
          path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
          path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe')
        ]
      },
      {
        id: 'edge',
        name: 'Microsoft Edge',
        icon: 'Compass',
        category: 'windows',
        windowsCategory: 'Browsers',
        brandColor: '#0078D4',
        paths: [
          path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
          path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
        ]
      },
      {
        id: 'vscode',
        name: 'VS Code',
        icon: 'Code',
        category: 'windows',
        windowsCategory: 'Developer',
        brandColor: '#007ACC',
        paths: [
          path.join(localAppData, 'Programs', 'Microsoft VS Code', 'Code.exe'),
          path.join(programFiles, 'Microsoft VS Code', 'Code.exe'),
          path.join(programFilesX86, 'Microsoft VS Code', 'Code.exe')
        ]
      },
      {
        id: 'vlc',
        name: 'VLC Media Player',
        icon: 'Play',
        category: 'windows',
        windowsCategory: 'Media',
        brandColor: '#FF5A00',
        paths: [
          path.join(programFiles, 'VideoLAN', 'VLC', 'vlc.exe'),
          path.join(programFilesX86, 'VideoLAN', 'VLC', 'vlc.exe')
        ]
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: 'MessageSquare',
        category: 'windows',
        windowsCategory: 'Communication',
        brandColor: '#5865F2',
        dynamicSearch: {
          base: path.join(localAppData, 'Discord'),
          pattern: /app-[\d|.]+/i,
          exe: 'Discord.exe'
        }
      },
      {
        id: 'telegram',
        name: 'Telegram Desktop',
        icon: 'Send',
        category: 'windows',
        windowsCategory: 'Communication',
        brandColor: '#24A1DE',
        paths: [
          path.join(appData, 'Telegram Desktop', 'Telegram.exe'),
          path.join(localAppData, 'Telegram Desktop', 'Telegram.exe')
        ]
      },
      {
        id: 'spotify',
        name: 'Spotify Music',
        icon: 'Music',
        category: 'windows',
        windowsCategory: 'Media',
        brandColor: '#1DB954',
        paths: [
          path.join(appData, 'Spotify', 'Spotify.exe'),
          path.join(localAppData, 'Spotify', 'Spotify.exe')
        ]
      },
      {
        id: 'steam',
        name: 'Steam',
        icon: 'Gamepad',
        category: 'windows',
        windowsCategory: 'Gaming',
        brandColor: '#171A21',
        paths: [
          path.join(programFilesX86, 'Steam', 'steam.exe'),
          path.join(programFiles, 'Steam', 'steam.exe')
        ]
      },
      {
        id: 'photoshop',
        name: 'Adobe Photoshop',
        icon: 'Palette',
        category: 'windows',
        windowsCategory: 'Media',
        brandColor: '#31A8FF',
        dynamicSearch: {
          base: path.join(programFiles, 'Adobe'),
          pattern: /Adobe Photoshop/i,
          exe: 'Photoshop.exe'
        }
      },
      {
        id: 'word',
        name: 'Microsoft Word',
        icon: 'FileText',
        category: 'windows',
        windowsCategory: 'Office',
        brandColor: '#2B579A',
        paths: [
          path.join(programFiles, 'Microsoft Office', 'root', 'Office16', 'WINWORD.EXE'),
          path.join(programFilesX86, 'Microsoft Office', 'root', 'Office16', 'WINWORD.EXE')
        ]
      },
      {
        id: 'excel',
        name: 'Microsoft Excel',
        icon: 'Grid',
        category: 'windows',
        windowsCategory: 'Office',
        brandColor: '#217346',
        paths: [
          path.join(programFiles, 'Microsoft Office', 'root', 'Office16', 'EXCEL.EXE'),
          path.join(programFilesX86, 'Microsoft Office', 'root', 'Office16', 'EXCEL.EXE')
        ]
      },
      {
        id: 'powerpoint',
        name: 'Microsoft PowerPoint',
        icon: 'Presentation',
        category: 'windows',
        windowsCategory: 'Office',
        brandColor: '#B7472A',
        paths: [
          path.join(programFiles, 'Microsoft Office', 'root', 'Office16', 'POWERPNT.EXE'),
          path.join(programFilesX86, 'Microsoft Office', 'root', 'Office16', 'POWERPNT.EXE')
        ]
      }
    ];

    const discoveredApps = [];

    for (const app of scannerMappings) {
      let foundPath = '';
      
      if (app.paths) {
        for (const p of app.paths) {
          if (fs.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
      }

      if (!foundPath && app.dynamicSearch) {
        try {
          const baseDir = app.dynamicSearch.base;
          if (fs.existsSync(baseDir)) {
            const items = fs.readdirSync(baseDir);
            for (const item of items) {
              if (app.dynamicSearch.pattern.test(item)) {
                const potentialPath = path.join(baseDir, item, app.dynamicSearch.exe);
                if (fs.existsSync(potentialPath)) {
                  foundPath = potentialPath;
                  break;
                }
              }
            }
          }
        } catch (e) {
          // ignore error
        }
      }

      if (foundPath) {
        discoveredApps.push({
          id: app.id,
          name: app.name,
          icon: app.icon,
          isWindowsNative: true,
          category: app.category,
          exePath: foundPath,
          registryKey: `HKLM\\Software\\${app.name}`,
          windowsCategory: app.windowsCategory,
          brandColor: app.brandColor,
          isFavorite: false
        });
      }
    }

    return discoveredApps;
  } catch (error) {
    console.error('Error during app scanning:', error);
    return [];
  }
});

// App Startup Management
app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
