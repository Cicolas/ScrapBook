const { app, BrowserWindow, globalShortcut } = require("electron");

/*
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});
*/

function createWindow() {
    // Cria uma janela de navegação.
    const win = new BrowserWindow({
        titleBarStyle: 'customButtonsOnHover',
        width: 800,
        height: 650,
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: "#00000000",
        nodeIntegration: false, // is default value after Electron v5

        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.loadFile("index.html");

    // Open the DevTools.
    win.webContents.openDevTools();
}

app.whenReady().then(() => {

    createWindow();
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});