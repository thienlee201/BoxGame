import SoundPlayer from "../System/SoundPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopBtn extends cc.Component {
   opened = false
   spinning = false

   @property(cc.Node) content: cc.Node = null

   public onClick() {
      if (this.spinning) return
      const time = 0.14
      const offsetY = 100
      this.spinning = true
      SoundPlayer.ins.play('Button Sound')

      this.opened = !this.opened
   }
}
