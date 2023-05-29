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
    let indexUrl = new URL('file:///index.html')
    indexUrl.protocol = 'file'
    indexUrl.host = '/'
    indexUrl.pathname = '/index.html'
    console.log(indexUrl)
    let k = url.format({
        pathname: 'index.html',    /* Attention here: origin is path.join(__dirname, 'index.html') */
        protocol: 'file',
        slashes: true
    })
    console.log("old:" + k)
    appWindow.loadURL(k)


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}


export function newAppWindow() {
    createWindow()
    app.dock.show()
}
