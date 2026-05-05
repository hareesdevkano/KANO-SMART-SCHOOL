const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer for offline support
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isDesktop: true,
  appVersion: '1.1.0',
  
  // Offline storage APIs
  isOffline: () => !navigator.onLine,
  
  // Listen for online/offline events
  onOnlineStatusChange: (callback) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  },
});
