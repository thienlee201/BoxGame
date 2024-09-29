import { LANGUAGE, LocalizationManager } from './LocalizationManager';
import LocalStorage from '../Utilities/LocalStorage';
const { ccclass, property, executeInEditMode } = cc._decorator;



@ccclass('CCFS')
@executeInEditMode
export class CCFS extends cc.Component {
   @property(Array(cc.Font)) fonts: cc.Font[] = []
   @property
   key: string = ""

   @property changeFont = true
   labelComp: cc.Label = null

   static currentScene: cc.Scene = null
   static currentSceneLabels: cc.Label[] = []

   static resetLabels() {
      switch (LocalStorage.getLanguage()) {
         case "ru": {
            LocalizationManager.language = LANGUAGE.RU
            break;
         }
         case "jp": {
            LocalizationManager.language = LANGUAGE.JP
            break;
         }
         case "es": {
            LocalizationManager.language = LANGUAGE.SP
            break;
         }
         case "ko": {
            LocalizationManager.language = LANGUAGE.KR
            break;
         }
         case "pt": {
            LocalizationManager.language = LANGUAGE.PO
            break;
         }
         default: {
            LocalizationManager.language = LANGUAGE.EN
            break
         }
      }
      for (let i = 0; i < this.currentSceneLabels.length; i++) {
         const lb = this.currentSceneLabels[i];
         if (cc.isValid(lb)) {
            let ccfs = lb.getComponent(CCFS)
            if (cc.isValid(ccfs)) {
               ccfs.setText()
            }
         }
      }
   }
   static clearLabels() {
      CCFS.currentSceneLabels = []
   }

   onLoad() {
      if (!CCFS.currentScene || CCFS.currentScene != cc.director.getScene()) {
         CCFS.currentScene = cc.director.getScene()
         CCFS.clearLabels()
         CCFS.resetLabels()
      }

      let lb = this.getComponent(cc.Label)
      if (cc.isValid(lb)) {
         // lb.useSystemFont = false
         CCFS.currentSceneLabels.push(lb)
         if (this.changeFont) {
            lb.font = this.fonts[
               LocalStorage.getLanguage() == "ru" ? 1 : 0
            ]
         }
      }

      this.labelComp = lb
      this.setText()
   }
   start() {
   }

   update(deltaTime: number) {

   }

   setText() {
      if (!cc.isValid(this.labelComp)) {
         cc.warn("Label component missing!")
         return
      }

      let text = LocalizationManager.getText(this.key)
      if (text) this.labelComp.string = text
   }
}

