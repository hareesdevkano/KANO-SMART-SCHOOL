const { app, BrowserWindow, globalShortcut, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_URL = process.env.CBT_APP_URL?.trim() || 'https://smartschoolkano.netlify.app/exam-portal';
const USER_DATA_PATH = app.getPath('userData');
const OFFLINE_DATA_DIR = path.join(USER_DATA_PATH, 'offline-data');

let mainWindow;
let hasShownLoadError = false;
let isOffline = false;

// Ensure offline data directory exists
if (!fs.existsSync(OFFLINE_DATA_DIR)) {
  fs.mkdirSync(OFFLINE_DATA_DIR, { recursive: true });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, 'icon.png'),
    title: 'SmartSchool CBT Exam Portal',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      // Enable offline cache
      partition: 'persist:cbt-exam',
    },
  });

  // ── Aggressive caching for offline support ──
  const ses = mainWindow.webContents.session;
  
  // Cache all web content aggressively
  ses.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders };
    // Allow caching of all resources
    delete headers['cache-control'];
    delete headers['Cache-Control'];
    headers['Cache-Control'] = ['public, max-age=86400, stale-while-revalidate=604800'];
    callback({ responseHeaders: headers });
  });

  mainWindow.loadURL(APP_URL).catch((error) => {
    console.error('Failed to load app URL:', error);
    loadOfflineFallback();
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -3) return; // Ignore aborted loads
    
    console.log(`Load failed: ${errorDescription} (${errorCode})`);
    
    // Try loading from cache first
    if (!isOffline) {
      isOffline = true;
      console.log('Switching to offline mode...');
      // Electron's persist partition will serve cached content
      mainWindow.loadURL(APP_URL).catch(() => {
        loadOfflineFallback();
      });
      return;
    }

    if (hasShownLoadError) return;
    hasShownLoadError = true;
    loadOfflineFallback();
  });

  // Save page content for offline use when online
  mainWindow.webContents.on('did-finish-load', () => {
    isOffline = false;
    hasShownLoadError = false;
    console.log('Page loaded successfully. Caching for offline use...');
  });

  // ── Exam Security: Fullscreen & Kiosk Mode ──
  mainWindow.setFullScreen(true);
  mainWindow.setKiosk(true);

  // Prevent closing during exam (user must submit first)
  mainWindow.on('close', (e) => {
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'warning',
      buttons: ['Cancel', 'Exit Anyway'],
      defaultId: 0,
      title: 'Exit CBT Portal',
      message: 'Are you sure you want to exit? If you have an exam in progress, it will be auto-submitted.',
    });

    if (choice === 0) {
      e.preventDefault();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function loadOfflineFallback() {
  const offlineHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartSchool CBT - Offline</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #0d6b58 0%, #0a5848 50%, #074236 100%);
        color: white; min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
      }
      .container { text-align: center; max-width: 500px; padding: 40px; }
      .icon { font-size: 64px; margin-bottom: 24px; }
      h1 { font-size: 28px; margin-bottom: 12px; }
      p { font-size: 16px; opacity: 0.85; line-height: 1.6; margin-bottom: 24px; }
      .status { 
        background: rgba(255,255,255,0.15); border-radius: 12px; 
        padding: 20px; margin: 20px 0; 
      }
      .status h3 { font-size: 18px; margin-bottom: 8px; }
      .retry-btn {
        background: white; color: #0d6b58; border: none;
        padding: 14px 32px; border-radius: 8px; font-size: 16px;
        font-weight: 600; cursor: pointer; margin-top: 16px;
      }
      .retry-btn:hover { background: #f0f0f0; }
      .info { font-size: 13px; opacity: 0.7; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="icon">📡</div>
      <h1>No Internet Connection</h1>
      <p>The CBT Exam Portal requires an internet connection for the first login. After your first successful login, the app will cache your data for offline use.</p>
      <div class="status">
        <h3>🔄 What to do:</h3>
        <p style="margin-bottom:0">
          1. Check your WiFi or network cable<br>
          2. Ask your IT admin for help<br>
          3. Click "Try Again" when connected
        </p>
      </div>
      <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      <p class="info">SmartSchool CBT v1.1.0 • Offline Mode<br>
      Once connected, exam data will be cached for future offline use.</p>
    </div>
  </body>
  </html>`;

  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(offlineHTML)}`);
}

function registerLockedShortcuts() {
  globalShortcut.register('Alt+F4', () => {});
  globalShortcut.register('Alt+Tab', () => {});
  globalShortcut.register('CommandOrControl+W', () => {});
  globalShortcut.register('CommandOrControl+Q', () => {});
  globalShortcut.register('F11', () => {});
}

app.whenReady().then(() => {
  createWindow();
  registerLockedShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
