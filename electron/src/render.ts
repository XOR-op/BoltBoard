import {GroupRpcData} from "./type";
import {nativeImage} from 'electron'
import {Buffer} from 'node:buffer';
import {createCanvas} from "canvas";

export function renderGroup(group: GroupRpcData) {
    const width = 192
    const height = 16
    const fontSize = 16

    const canvas = createCanvas(width, height)

    const ctx = canvas.getContext('2d')
    ctx.font = `${fontSize}px Arial`
    ctx.fillText(group.name, 0, fontSize, 96)
    ctx.fillText(group.selected, 96, fontSize, 96)

    const imageData = ctx.getImageData(0, 0, width, height);
    const bitmap = Buffer.alloc(width * height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const alpha = imageData.data[i + 3];
        const pixelIndex = i / 4;
        if ((imageData[i] | imageData[i + 1] | imageData[i + 2] | imageData[i + 3]) !== 0) {
            console.log(' ' + imageData[i] + ',' + imageData[i + 1] + ',' + imageData[i + 2] + ',' + imageData[i + 3])
        }
        bitmap[pixelIndex] = alpha === 0 ? 0 : 1;
    }
    let img = nativeImage.createFromBuffer(bitmap, {width: width, height: height})
    img.setTemplateImage(true)
    return img
}
