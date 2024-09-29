import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FollowButKeptOffsetFromStart extends cc.Component {

   startOffset: cc.Vec2 = null;
   destroyIfTargetIsNull = false
   callBeforeUpdate = null
   @property(cc.Node) target: cc.Node = null;
   @property(cc.Boolean) isWorldSpace: boolean = false;
   @property(cc.Boolean) isFollowX: boolean = true;
   @property(cc.Boolean) isFollowY: boolean = true;

   protected onLoad(): void {
      if (!this.target) return;

      if (this.isWorldSpace) this.startOffset = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).sub(this.target.convertToWorldSpaceAR(cc.Vec2.ZERO));
      else this.startOffset = cc.v2(this.node.position.sub(this.target.position))
   }

   protected update(dt: number): void {
      if (!cc.isValid(this.target)) return;
      if (this.callBeforeUpdate) this.callBeforeUpdate()
      if (this.isWorldSpace) {
         var newPos = this.node.parent.convertToNodeSpaceAR(cc.v3(this.target.convertToWorldSpaceAR(cc.Vec2.ZERO).add(this.startOffset)))
         if (this.isFollowX) this.node.position = cc.v3(newPos.x, this.node.position.y)
         if (this.isFollowY) this.node.position = cc.v3(this.node.position.x, newPos.y)
      } else {
         var newPos = cc.v3(this.target.position).add(cc.v3(this.startOffset))
         if (this.isFollowX) this.node.position = cc.v3(newPos.x, this.node.position.y)
         if (this.isFollowY) this.node.position = cc.v3(this.node.position.x, newPos.y)
      }
   }
   protected lateUpdate(dt: number): void {
      if (!cc.isValid(this.target) && this.destroyIfTargetIsNull) Utils.collapseNode(this.node, 0.25, () => { this.node.destroy() })
   }
}
