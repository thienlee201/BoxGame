// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Color extends cc.Component {

    private static colorPalette: Array<string> = [
        '#FF4E66',
        '#AEEC1A',
        '#cb50ff',
        '#00e5ff',
        '#ffbb00',
        '#ff8331'
    ]

    public static ValueToColor(value: number): cc.Color {
        let index = Math.floor((value % 100) / 10)
        let color: cc.Color = new cc.Color(); cc.Color.fromHEX(color, this.colorPalette[index])

        color.r += Utils.random(0, 10) * Utils.getOneOrMinusOne()
        color.g += Utils.random(0, 10) * Utils.getOneOrMinusOne()
        color.b += Utils.random(0, 10) * Utils.getOneOrMinusOne()
        return color
    }

    public static RandomColor(): cc.Color {
        let color: cc.Color = new cc.Color(); cc.Color.fromHEX(color, this.colorPalette[Utils.random(0, this.colorPalette.length - 1)])

        color.r += Utils.random(0, 2) * Utils.getOneOrMinusOne()
        color.g += Utils.random(0, 2) * Utils.getOneOrMinusOne()
        color.b += Utils.random(0, 2) * Utils.getOneOrMinusOne()
        return color
    }
}
