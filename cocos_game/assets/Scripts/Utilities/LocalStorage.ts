import { GlobalVar } from "../GlobalVariables/GlobalVariables";
import SoundPlayer from "../System/SoundPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalStorage extends cc.Component {

   public static setLastBetType(value: number) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'LastBetType', value) }
   public static getLastBetType() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'LastBetType')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'LastBetType', 0);
         return 0;
      } else return data;
   }

   public static setComingSoonClickCount(value: number) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'ComingSoonClickCount', value) }
   public static getComingSoonClickCount(): number {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'ComingSoonClickCount')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'ComingSoonClickCount', 0);
         return 0;
      } else return parseInt(data);
   }

   public static setFirstTimePlaying(value: boolean) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'FirstTimePlaying', value) }
   public static getFirstTimePlaying() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'FirstTimePlaying')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'FirstTimePlaying', true);
         return true;
      } else return data;
   }

   public static setPlayerUUID(value: string) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerUUID', value) }
   public static getPlayerUUID() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'PlayerUUID')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerUUID', 'null');
         return 'null';
      } else return data;
   }
   public static setPlayerAvatarURL(value: string) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerAvatarURL', value) }
   public static getPlayerAvatarURL() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'PlayerAvatarURL')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerAvatarURL', 'null');
         return 'null';
      } else return data;
   }
   public static setMaskSkinIndex(value: number) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'MaskSkinIndex', value) }
   public static getMaskSkinIndex() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'MaskSkinIndex')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'MaskSkinIndex', 0);
         return 0;
      } else return data;
   }
   public static setPlayerName(value: string) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerName', value) }
   public static getPlayerName() {
      let data = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'PlayerName')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'PlayerName', 'null');
         return 'null';
      } else return data;
   }
   public static setDataRoom(value: any) { localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'currentRoom', value); }
   public static getDataRoom(): any {
      let dt = localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'currentRoom')
      if (!cc.isValid(dt)) return "";
      else return localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'currentRoom')
   }

   public static setHighScore(value: number) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'HighScore', value) }

   public static setStar(value: number) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Star', value);
   }

   public static setAudio(value: boolean) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Audio', value);
   }

   public static setMusic(value: boolean) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Music', value);
      if (SoundPlayer.ins) SoundPlayer.ins.updateMusicVolume((value) ? 0.5 : 0)
   }

   public static setSpriteSkinIndex(value: number) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'SpriteSkinIndex', value);
   }

   public static setNodeSkinIndex(value: number) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'NodeSkinIndex', value);
   }

   public static setNodeUnlockAtIndex(value: boolean, index: number) {
      cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + index.toString() + 'NodeUnlocked', value);
   }

   public static getSpriteSkinIndex(): number {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'SpriteSkinIndex') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'SpriteSkinIndex', 0);
         return 0;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'SpriteSkinIndex'));
   }

   public static getNodeSkinIndex(): number {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'NodeSkinIndex') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'NodeSkinIndex', 0);
         return 0;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'NodeSkinIndex'));
   }

   public static getNodeUnlockAtIndex(index: number): boolean {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + index.toString() + 'NodeUnlocked') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + index.toString() + 'NodeUnlocked', false);
         return false;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + index.toString() + 'NodeUnlocked'));
   }

   public static getHighScore(): number {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'HighScore') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'HighScore', 0);
         return 0;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'HighScore'));
   }

   public static getStar(): number {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Star') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Star', 0);
         return 0;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Star'));
   }

   public static getAudio(): boolean {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Audio') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Audio', true);
         return true;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Audio'));
   }

   public static getMusic(): boolean {
      if (cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Music') == null) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Music', true);
         return true;
      } else return JSON.parse(cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Music'));
   }


   public static setLanguage(value: string) { cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Language', value); }
   public static getLanguage(): string {
      let dt = cc.sys.localStorage.getItem(GlobalVar.GAME_NAME + '-' + 'Language')
      if (!cc.isValid(dt)) {
         cc.sys.localStorage.setItem(GlobalVar.GAME_NAME + '-' + 'Language', 'en')
         return 'en';
      } else return dt;
   }


   public static setPlayerPower(value: number) { cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerPower', value) }
   public static getPlayerPower() {
      let data = cc.sys.localStorage.getItem("GameBox"+ '-' + 'PlayerPower')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerPower', 0);
         return 0;
      } else return data;
   }
   public static setPlayerKnown(value: number) { cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerKnown', value) }
   public static getPlayerKnown() {
      let data = cc.sys.localStorage.getItem("GameBox"+ '-' + 'PlayerKnown')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerKnown', 0);
         return 0;
      } else return data;
   }
   public static setPlayerTrust(value: number) { cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerTrust', value) }
   public static getPlayerTrust() {
      let data = cc.sys.localStorage.getItem("GameBox"+ '-' + 'PlayerTrust')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerTrust', 0);
         return 0;
      } else return data;
   }
   public static setPlayerConnect(value: number) { cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerConnect', value) }
   public static getPlayerConnect() {
      let data = cc.sys.localStorage.getItem("GameBox"+ '-' + 'PlayerConnect')
      if (!cc.isValid(data)) {
         cc.sys.localStorage.setItem("GameBox"+ '-' + 'PlayerConnect', 0);
         return 0;
      } else return data;
   }

}
