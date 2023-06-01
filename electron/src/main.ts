// Modules to control application life and create native browser window
import {app, BrowserWindow, globalShortcut, protocol, Tray} from 'electron'
import {newAppWindow} from "./window.js";
import {setupTray} from "./tray.js";

import * as path from 'path'


let tray: Tray | null = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+R', () => {
    })
    protocol.interceptFileProtocol('file', (request, callback) => {
        try {
            const url = request.url.substr(7)    /* all urls start with 'file://' */
            let nextPath = path.normalize(`${__dirname}/../../boltboard/dist/${url}`)
            callback({path: nextPath})
        } catch (err) {
            console.error('Failed to register protocol')
        }
    })

    setupTray(tray)
    newAppWindow()


    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            newAppWindow()
        }
    })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        globalShortcut.unregisterAll()
        app.quit()
    } else {
        app.dock.hide()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
