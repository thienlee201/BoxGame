import Utils from "../../Scripts/Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelPopupEffect extends cc.Component {

    execute(value: number) {
        const childLabel = this.getComponentInChildren(cc.Label);
        const startPos = childLabel.node.position;
        const startValue = value;
        const startScale = childLabel.node.scale;
        const randSide = (Math.round(Utils.random(0, 1)) == 0) ? 1 : -1;
        const randAngle = Utils.random(0, 15) * randSide;
        this.node.angle = randAngle;
        childLabel.string = (0).toString()
        childLabel.node.position = cc.v3(0, 0);
        childLabel.node.opacity = 100;
        childLabel.node.scale = startScale * 0.2;
        childLabel.node.getComponent(cc.LabelOutline).color = cc.color(Utils.random(150, 230), Utils.random(150, 230), Utils.random(150, 230));
        cc.tween(childLabel.node).to(0.35, { opacity: 255 }).start();
        cc.tween(childLabel.node).to(0.35, { scale: startScale }).start();
        let tempNode = new cc.Node()
        tempNode.opacity = 0
        cc.tween(tempNode).to(0.50, { opacity: startValue }, {
            onUpdate: () => {
                childLabel.string = '+' + Math.ceil(tempNode.opacity).toString()
            }
        }).call(() => tempNode.destroy()).start()
        cc.tween(childLabel.node).to(0.35, { position: startPos }).call(() => {
            cc.tween(childLabel.node).to(1.5, { position: cc.v3(startPos.x, startPos.y + Utils.random(15, 30)) }).start();
            cc.tween(childLabel.node).delay(1).to(0.5, { opacity: 0 }).call(() => {
                this.node.destroy();
            }).start();
            cc.tween(this.node).to(1.5, { angle: randAngle + Utils.random(10, 20) * randSide }).start();
        }
        ).start();
    }
}
