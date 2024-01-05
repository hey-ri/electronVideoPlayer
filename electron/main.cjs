const { app, BrowserWindow } = require('electron');
const path = require('path');
const { join } = require('path');

const isDev = !app.isPackaged;

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: join(__dirname, '../node_modules', '.bin', 'electron'),
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    // mainWindow.loadFile('./dist/index.html');
    mainWindow.loadURL('http://localhost:8000');
    // mainWindow.loadFile(path.join(__dirname, "../dist", "index.html"));
    mainWindow.webContents.openDevTools();
  } else {
    // mainWindow.loadURL('http://localhost:8000');
    mainWindow.loadFile(path.join(__dirname, '../dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
