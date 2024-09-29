import Utils from "../Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderBoardItem extends cc.Component {
   @property(cc.Label) rankLb: cc.Label = null
   @property(cc.Label) nameLb: cc.Label = null
   @property(cc.Label) scoreLb: cc.Label = null
   @property(cc.Sprite) cardBGSprite: cc.Sprite = null
   @property(cc.Sprite) rankSprite: cc.Sprite = null
   @property(cc.Sprite) avatarSprite: cc.Sprite = null
   @property(cc.Sprite) avatarFrameSprite: cc.Sprite = null
   @property([cc.Sprite]) currencySprites: cc.Sprite[] = []
   @property(cc.Label) scorePvp: cc.Label = null
   @property(cc.Label) betCoin: cc.Label = null
   @property(cc.Node) anim: cc.Node = null;
   @property(cc.Sprite) bg: cc.Sprite = null
   @property(cc.Sprite) round: cc.Sprite = null

   checkVisible = true
   protected update(dt: number): void {
      if (!this.checkVisible) return
      let worldPos = Utils.getWorldPos(this.node)

      if (worldPos.y < -50 || worldPos.y > cc.view.getVisibleSize().height - 50) this.node.opacity = 0
      else this.node.opacity = 255
   }
}
