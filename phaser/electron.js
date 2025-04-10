const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({ width: 600, height: 600 });
    win.setMenuBarVisibility(false);
    win.loadFile('dist/index.html');
}

app.whenReady().then(createWindow);
