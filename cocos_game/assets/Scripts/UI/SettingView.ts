import SoundPlayer from "../System/SoundPlayer";
import LocalStorage from "../Utilities/LocalStorage";
import Utils from "../Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends cc.Component {
   @property(Array(cc.Node)) musicStateNodes: Array<cc.Node> = []
   @property(Array(cc.Node)) soundStateNodes: Array<cc.Node> = []

   onCloseCall

   protected onLoad(): void {
      this.updateMusicState(LocalStorage.getMusic())
      this.updateSoundState(LocalStorage.getAudio())
   }

   onClickOnMusic() {
      if (LocalStorage.getMusic()) return
      LocalStorage.setMusic(true)
      this.updateMusicState(LocalStorage.getMusic())
      SoundPlayer.ins.play('Button Sound')
   }
   onClickOnSound() {
      if (LocalStorage.getAudio()) return
      LocalStorage.setAudio(true)
      this.updateSoundState(LocalStorage.getAudio())
      SoundPlayer.ins.play('Button Sound')
   }
   onClickOffMusic() {
      if (!LocalStorage.getMusic()) return
      LocalStorage.setMusic(false)
      this.updateMusicState(LocalStorage.getMusic())
      SoundPlayer.ins.play('Button Sound')
   }
   onClickOffSound() {
      if (!LocalStorage.getAudio()) return
      LocalStorage.setAudio(false)
      this.updateSoundState(LocalStorage.getAudio())
      SoundPlayer.ins.play('Button Sound')
   }

   updateMusicState(on) {
      this.musicStateNodes[0].active = on
      this.musicStateNodes[1].active = !on
      this.musicStateNodes[2].active = on
      this.musicStateNodes[3].active = !on
      this.musicStateNodes[4].active = !on
      this.musicStateNodes[5].active = on
   }
   updateSoundState(on) {
      this.soundStateNodes[0].active = on
      this.soundStateNodes[1].active = !on
      this.soundStateNodes[2].active = on
      this.soundStateNodes[3].active = !on
      this.soundStateNodes[4].active = !on
      this.soundStateNodes[5].active = on
   }

   openingSettingView = true
   onClickCloseSetting() {
      if (!this.openingSettingView) return
      this.openingSettingView = false
      SoundPlayer.ins.play('Button Sound')

      Utils.fadeOutNode(this.node, 0.25, () => {
         this.openingSettingView = true
         if (this.onCloseCall) this.onCloseCall()
      })
   }
}
