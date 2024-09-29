// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoRotate extends cc.Component {

    @property(cc.Integer)
    public rotation_per_sec: number = 1

    @property(cc.Boolean)
    public is_radom_angle_at_start = true;
    @property(cc.Boolean)
    public is_keep_children_world_angle = true;

    protected start(): void {
        if (this.is_radom_angle_at_start) this.node.angle = Utils.random(0, 360);
    }

    update(dt: number) {
        this.node.angle += 360 * dt * this.rotation_per_sec;

        if (this.is_keep_children_world_angle) {
            const children = this.node.children;
            children.forEach(child => {
                child.angle = -this.node.angle;
            });
        }
    }

}
