// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class KeptAngleAsChild extends cc.Component {

    parentAngleAtStart = 0;
    angleAtStart = 0;

    protected onLoad(): void {
        this.parentAngleAtStart = this.node.parent.angle;
        this.angleAtStart = this.node.angle;
    }

    protected update(dt: number): void {
        this.node.angle = this.angleAtStart + (-this.node.parent.angle) + (this.parentAngleAtStart)
    }
}
