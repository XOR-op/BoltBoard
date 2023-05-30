import {GroupRpcData} from "./type";
import {nativeImage} from 'electron'
import {createCanvas} from "canvas";

export function renderGroup(group: GroupRpcData) {
    const width = 192
    const height = 16
    const fontSize = 12

    const canvas = createCanvas(width, height)

    const ctx = canvas.getContext('2d')
    ctx.font = `${fontSize}px Arial`
    ctx.fillText(group.name, 0, fontSize, 96)
    ctx.fillText(group.selected, 96, fontSize, 96)
    let buffer = canvas.toBuffer()

    let img = nativeImage.createFromBuffer(buffer, {width: width, height: height})
    img.setTemplateImage(true)
    return img
}

export function renderTrayIcon() {
}
