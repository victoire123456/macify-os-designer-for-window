const { contextBridge, ipcRenderer } = require('electron');

// Expose secure, system APIs safely to the browser window via contextBridge
contextBridge.exposeInMainWorld('macifyAPI', {
  scanApps: () => ipcRenderer.invoke('scan-apps'),
  openApp: (exePath) => ipcRenderer.invoke('open-app', exePath),
  readFolder: (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath)
});
