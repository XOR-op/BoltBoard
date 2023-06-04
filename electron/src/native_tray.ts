import {app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray} from "electron";
import {newAppWindow} from "./window.js";
import {api_call} from "./request";
import {GroupRpcData, ProxyRpcData} from "./type";

const dashboardItem = {
    label: 'Dashboard', click: () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            newAppWindow()
        }
    }, accelerator: 'CommandOrControl+D', acceleratorWorksWhenHidden: false
}

const quitItem = {
    label: 'Quit', click: () => {
        app.quit()
    }, accelerator: 'CommandOrControl+Q', acceleratorWorksWhenHidden: false
}

export function setupNativeTray(tray: Tray) {

    // Set up tray: we should follow the advice in https://github.com/electron/electron/issues/27128
    tray = new Tray('IconTemplate.png')
    tray.setIgnoreDoubleClickEvents(true)
    // tray.setTitle('BoltConn\u2070\u2080')
    // tray.setImage('test.png')
    tray.on('click', async () => {
        let menu = await freshApp(tray)
        tray.popUpContextMenu(menu)
    })
}

function updateTrayMenu(tray: Tray, proxies: MenuItemConstructorOptions[], tun: MenuItemConstructorOptions) {
    let contextMenu: MenuItemConstructorOptions[] = []
    contextMenu = contextMenu.concat(proxies)
    contextMenu.push({type: 'separator'})
    contextMenu.push(tun)
    contextMenu.push({type: 'separator'})
    contextMenu.push(dashboardItem)
    contextMenu.push(quitItem)
    return Menu.buildFromTemplate(contextMenu)
}

const minSpaceLen = 2

function getMaxProxyLength(list: ProxyRpcData[]) {
    let l = 0
    for (const e of list) {
        let sum = (e.name + e.latency).length
        if (sum > l) l = sum
    }
    return l + minSpaceLen
}

export async function freshApp(tray: Tray) {
    let proxies: GroupRpcData[] = []
    let tunEnabled = false
    let p1 = api_call('GET', '/proxies').then(res => res.json()).then(p => {
        proxies = p
    }).catch(e => console.log(e))
    let p2 = api_call('GET', '/tun').then(res => res.json()).then(p => {
        if ("enabled" in p) {
            tunEnabled = p.enabled
        }
    }).catch(e => console.log(e))
    await p1
    await p2
    let proxiesItems: MenuItemConstructorOptions[] = proxies.map(g => {
            let maxProxyLen = getMaxProxyLength(g.list)
            return {
                label: g.name,
                submenu: g.list.map(p => {
                    return {
                        label: p.name,
                        type: 'radio',
                        checked: p.name == g.selected,
                        click: () => {
                            api_call('PUT', '/proxies/' + g.name,
                                JSON.stringify({
                                    'selected': p.name
                                })
                            ).then(res => {
                                if (res.status === 200) {
                                    console.log("Set " + g.name + " to " + p.name)
                                }
                            }).catch(e => console.log(e))
                        }
                    }
                })
            }
        }
    )
    let tun_copy = tunEnabled;
    let tunItem: MenuItemConstructorOptions = {
        label: 'Enable TUN mode',
        type: 'checkbox',
        checked: tunEnabled,
        click: () => {
            api_call('PUT', '/tun', JSON.stringify({
                enabled: !tun_copy
            })).then(res => {
                if (res.status === 200) {
                }
            }).catch(e => console.log(e))
        }
    }
    return updateTrayMenu(tray, proxiesItems, tunItem)
}
