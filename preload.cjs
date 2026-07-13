const { contextBridge, ipcRenderer } = require('electron');

// Expose secure, system APIs safely to the browser window via contextBridge
contextBridge.exposeInMainWorld('macifyAPI', {
  scanApps: () => ipcRenderer.invoke('scan-apps'),
  openApp: (exePath) => ipcRenderer.invoke('open-app', exePath),
  readFolder: (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  
  // Local Database SQLite APIs
  getLocalSettings: () => ipcRenderer.invoke('get-local-settings'),
  saveLocalSettings: (settings) => ipcRenderer.invoke('save-local-settings', settings),
  getLocalDataItems: (dataType) => ipcRenderer.invoke('get-local-data-items', { dataType }),
  saveLocalDataItem: (dataType, id, name, value) => ipcRenderer.invoke('save-local-data-item', { dataType, id, name, value }),
  deleteLocalDataItem: (id) => ipcRenderer.invoke('delete-local-data-item', { id })
});
