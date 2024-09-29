const { ccclass, property } = cc._decorator;

@ccclass
export default class WalletHistoryItem extends cc.Component {
   @property(cc.Sprite) statusIcon: cc.Sprite = null
   @property(cc.Label) transactionDesc: cc.Label = null
   @property(cc.Label) transactionOriginAddress: cc.Label = null
   @property([cc.Node]) transactionOriginDirection: cc.Node[] = []
   @property(cc.Label) transactionValue: cc.Label = null
   @property(cc.Label) transactionTime: cc.Label = null

   setOriginFrom() {
      this.transactionOriginDirection[0].active = false
      this.transactionOriginDirection[1].active = true
      this.transactionOriginDirection[0].parent.getComponent(cc.Layout).updateLayout()
   }

   setOriginTo() {
      this.transactionOriginDirection[0].active = true
      this.transactionOriginDirection[1].active = false
      this.transactionOriginDirection[0].parent.getComponent(cc.Layout).updateLayout()
   }
}
