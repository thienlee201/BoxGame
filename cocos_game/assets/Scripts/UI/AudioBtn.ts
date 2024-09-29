import SoundPlayer from "../System/SoundPlayer";
import LocalStorage from "../Utilities/LocalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioBtn extends cc.Component {
   public onClickEvt
   @property(cc.Node) checkMark: cc.Node = null
   protected onLoad(): void {
      let audioActive = LocalStorage.getAudio()
      this.checkMark.active = audioActive
   }

   public onclick() {
      let audioActive = !LocalStorage.getAudio()
      this.checkMark.active = audioActive
      LocalStorage.setAudio(audioActive)
      SoundPlayer.ins.play('Button Sound')
      if (this.onClickEvt) this.onClickEvt()
   }
}
