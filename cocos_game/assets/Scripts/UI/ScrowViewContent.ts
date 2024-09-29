const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollViewContent extends cc.Component {
   @property(cc.Node) layout: cc.Node = null
   @property cardHeight = 0
   @property cardSpacing = 0
   t = 1
   tInterval = 1
   protected update(dt: number): void {
      try {
         this.t -= dt
         if (this.t <= 0) {
            this.t = this.tInterval

            let cardVerCount = Math.ceil(this.layout.children.length / 2)
            let cardHeight = cardVerCount * this.layout.children[0].height + (cardVerCount - 1) * 10
            if (cardHeight > 693) this.node.setContentSize(this.node.width, cardHeight)
            else this.node.setContentSize(this.node.width, 693)
         }
      } catch (error) {
      }
   }
}
