import { app, BrowserWindow } from 'electron';
import * as path from 'path';
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
function createWindow() {
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    if (isDev) {
        // Use the actual port from your Vite server
        mainWindow.loadURL('http://localhost:5173'); // or whatever port shows up
        mainWindow.webContents.openDevTools();
    }
    else {
        // Load from built files in production
        mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
