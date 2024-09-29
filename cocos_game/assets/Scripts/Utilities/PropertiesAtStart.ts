// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropertiesAtStart extends cc.Component {

    public angle: number = 0;
    public scaleX: number = 0;
    public scaleY: number = 0;
    public position: cc.Vec3 = null;

    onLoad() {
        this.angle = this.node.angle;
        this.scaleX = this.node.scaleX;
        this.scaleY = this.node.scaleY;
        this.position = this.node.position;
    }
}
