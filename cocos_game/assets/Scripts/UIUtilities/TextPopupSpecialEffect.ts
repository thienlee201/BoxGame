// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TextPopupSpecialEffect extends cc.Component {

    onLoad() {
        const childLabel = this.getComponentInChildren(cc.Label);
        const startPos = childLabel.node.position;
        const randSide = (Math.round(Utils.random(0, 1)) == 0) ? 1 : -1;
        const randAngle = Utils.random(0, 30) * randSide;
        this.node.angle = randAngle;
        childLabel.node.position = cc.v3(0, 0);
        childLabel.node.opacity = 100;
        childLabel.node.getComponent(cc.LabelOutline).color = cc.color(Utils.random(150, 230), Utils.random(150, 230), Utils.random(150, 230));
        cc.tween(childLabel.node).to(0.25, { opacity: 255 }).start();
        cc.tween(childLabel.node).to(0.25, { position: startPos }).call(() => {
            cc.tween(childLabel.node).to(1.5, { position: cc.v3(startPos.x, startPos.y + Utils.random(15, 30)) }).start();
            cc.tween(childLabel.node).delay(1).to(0.5, { opacity: 0 }).call(() => {
                this.node.destroyAllChildren();
                this.node.destroy();
                this.destroy();
            }).start();
            cc.tween(this.node).to(1.5, { angle: randAngle + Utils.random(10, 20) * randSide }).start();
        }
        ).start();

    }
}
