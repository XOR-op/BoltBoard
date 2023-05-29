import * as url from 'url'
import {app, BrowserWindow} from "electron";

function createWindow() {
    // Create the browser window.
    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 400,
        minWidth: 600,
        titleBarStyle: 'hidden'
    })
    appWindow.loadURL(url.format({
        pathname: 'index.html',    /* Attention here: origin is path.join(__dirname, 'index.html') */
        protocol: 'file',
        slashes: true
    }))


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}


export function newAppWindow() {
    createWindow()
    app.dock.show()
}
