const { app, Menu, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 800, 
        height: 600, 
        frame: false,
        //追記
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // コメントアウトで開発者ツール起動
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //////////独自の機能//////////

    //最小化機能
    ipcMain.handle('window-minimize', () => {
        mainWindow.minimize();
    });

    //最大化機能
    let fullScreen = false;
    ipcMain.handle('window-maximize', () => {
        mainWindow.setFullScreen((fullScreen = !fullScreen));
    });

    //閉じる機能
    ipcMain.handle('window-close', () => {
        app.quit();
    })

    /////////独自の機能　ここまで///////////
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});