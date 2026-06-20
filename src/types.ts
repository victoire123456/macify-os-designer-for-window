export type AppID = string;

export interface AppConfig {
  id: AppID;
  name: string;
  icon: string; // Lucide icon name or beautiful visual or emoji representation
  isWindowsNative: boolean; // Is it a Windows native app representation
  category: 'system' | 'windows' | 'utilities';
  exePath?: string;
  registryKey?: string;
  windowsCategory?: 'Browsers' | 'Developer' | 'Media' | 'Communication' | 'Office' | 'Gaming' | 'System' | 'Other';
  brandColor?: string; // used for custom Glassmorphism template colors
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface WindowInstance {
  id: string; // unique window ID (e.g., 'finder-1', 'vscode-win')
  appId: AppID;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  params?: any; // App specific state params
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string; // Absolute path from root, e.g., '/Desktop/MyNotes.txt'
  size: string;
  content?: string;
  category: 'Desktop' | 'Documents' | 'Downloads' | 'Pictures' | 'Videos' | 'Music' | 'Root';
  lastModified: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  app: string;
}

export interface WallpaperConfig {
  id: string;
  name: string;
  type: 'gradient' | 'color' | 'image';
  value: string; // CSS style value or link (Light mode standard)
  valueDark?: string; // Optional dark mode version
  category: 'macos' | 'keynote' | 'abstract' | 'landscape' | 'minimal' | 'aurora' | 'glassmorphism' | 'custom';
  themeSupport: 'light' | 'dark' | 'dynamic';
  author?: string;
}

declare global {
  interface Window {
    macifyAPI?: {
      scanApps: () => Promise<AppConfig[]>;
      openApp: (exePath: string) => Promise<{ success: boolean; error?: string }>;
      readFolder: (folderPath: string) => Promise<FileSystemNode[]>;
      deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

