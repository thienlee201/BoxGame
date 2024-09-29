import SoundPlayer from "../System/SoundPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingBtn extends cc.Component {
   opened = false
   spinning = false

   @property(cc.Node) content: cc.Node = null
   @property(cc.Node) appearance: cc.Node = null

   public onClick() {
      if (this.spinning) return
      const time = 0.14
      const offsetY = 143.499
      this.spinning = true
      SoundPlayer.ins.play('Button Sound')
      if (this.opened) {
         cc.tween(this.content).to(time, { position: cc.v3(this.content.x, this.content.y + offsetY) }).start()
         cc.tween(this.appearance).to(time, { angle: 0 }).call(() => {
            this.spinning = false
         }).start()
      } else {
         cc.tween(this.content).to(time, { position: cc.v3(this.content.x, 0) }).start()
         cc.tween(this.appearance).to(time, { angle: -90 }).call(() => {
            this.spinning = false
         }).start()

      }
      this.opened = !this.opened
   }
}
