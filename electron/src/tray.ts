import {app, BrowserWindow, Menu, Tray} from "electron";
import {newAppWindow} from "./window.js";

export function setupTray(tray: Tray) {

    // Set up tray: we should follow the advice in https://github.com/electron/electron/issues/27128
    tray = new Tray('IconTemplate.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show app', click: () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    newAppWindow()
                }
            }
        },
        {type: 'separator'},
        {type: 'separator'},
        {
            label: 'Quit', click: () => {
                app.quit()
            }
        }
    ])
    tray.setToolTip('BoltConn')
    tray.setContextMenu(contextMenu)
}
