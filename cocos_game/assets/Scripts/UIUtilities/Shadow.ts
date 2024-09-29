// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shadow extends cc.Component {

   @property(Number) opacity: number = 100;
   @property(cc.Vec2) offset: cc.Vec2 = new cc.Vec2(1, -1);
   @property(cc.Boolean) updateAppearance: boolean = false;
   @property(cc.Boolean) followWorldPos: boolean = false;

   shadow: cc.Node = null;

   protected onLoad(): void {
      //   this.node.zIndex += 1;
      //   this.shadow = new cc.Node();

      //   if (this.getComponent(cc.Sprite) != null) {
      //       var newSprite = this.shadow.addComponent(cc.Sprite)
      //       newSprite.spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
      //   }

      //   if (this.getComponent(cc.Label) != null) {
      //       var newLabel = this.shadow.addComponent(cc.Label)
      //       newLabel.fontSize = this.getComponent(cc.Label).fontSize;
      //       newLabel.lineHeight = this.getComponent(cc.Label).lineHeight;
      //       newLabel.font = this.getComponent(cc.Label).font;
      //       newLabel.string = this.getComponent(cc.Label).string;
      //   }

      //   this.shadow.color = this.node.color;
      //   this.shadow.angle = this.node.angle
      //   this.shadow.anchorX = this.node.anchorX
      //   this.shadow.anchorY = this.node.anchorY
      //   this.shadow.opacity = this.opacity
      //   this.shadow.parent = this.node.parent
      //   this.shadow.scaleX = this.node.scaleX
      //   this.shadow.scaleY = this.node.scaleY
      //   this.shadow.setContentSize(this.node.getContentSize())
   }

   protected update(dt: number): void {
      //   this.shadow.zIndex = this.node.zIndex;
      //   if (this.followWorldPos) this.shadow.position = this.shadow.parent.convertToNodeSpaceAR(
      //       cc.v3(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).add(this.offset)));
      //   else this.shadow.position = cc.v3(this.node.position.x + this.offset.x, this.node.position.y + this.offset.y)


      //   if (this.updateAppearance) {
      //       if (this.getComponent(cc.Sprite) != null) this.shadow.getComponent(cc.Sprite).spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
      //       if (this.getComponent(cc.Label) != null) this.shadow.getComponent(cc.Label).string = this.getComponent(cc.Label).string;
      //       this.shadow.setContentSize(this.node.getContentSize())
      //   }
   }
}
