import { GlobalVar } from "../GlobalVariables/GlobalVariables";
import AssetContainer from "../HomeScene/AssetContainer";
import HomeController from "../HomeScene/HomeController";
import ShopController from "../HomeScene/ShopController";
import NetworkClient from "../Networking/NetworkClient";
import SoundPlayer from "../System/SoundPlayer";
import Utils from "../Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopItemCard extends cc.Component {
   @property(cc.Label) cost: cc.Label = null;
   @property(cc.Label) itemGetLb: cc.Label = null;
   @property([cc.Sprite]) costIcon: cc.Sprite[] = [];
   @property([cc.Sprite]) itemSprite: cc.Sprite[] = [];
   @property(cc.Label) magnet: cc.Label = null;
   @property(cc.Label) speed: cc.Label = null;
   @property(cc.Label) bonus: cc.Label = null;
   @property(cc.ParticleSystem) particle: cc.ParticleSystem = null
   @property(cc.Node) bg: cc.Node = null;
   protected onLoad(): void {
      if (this.particle) {
         this.scheduleOnce(() => {
            this.particle.enabled = true
            // this.particle.setA = true
         }, 0.3)
      }
   }
   price: number = 0;
   id: number = 0;
   buyAble: boolean = true;
   setInfo(data) {
      if (data.id) {
         this.id = data.id;
      }
      if (data.magnet) {
         this.magnet.string = "+" + data.magnet + "%";
      }
      if (data.speed) {
         this.speed.string = "+" + data.speed + "%";
      }
      if (data.bonus) {
         this.bonus.string = "+" + data.bonus + "%";
      }
      if (data.rate) {
         switch (data.rate) {
            case 1:
               // this.bg.color = new cc.Color().fromHEX("#27FC52");
               break;
            case "Rare":
               // this.bg.color = new cc.Color().fromHEX("#C962FA");
               break;
            case 2:
               // this.bg.color = new cc.Color().fromHEX("#FF6600");
               break;
            case "Legendary":
               // this.bg.color = new cc.Color().fromHEX("#FF0000");
               break;
            case 3:
               // this.bg.color = new cc.Color().fromHEX("#FF00FF");
               break;
            default:
               break;
         }
      }
      if (data.name) {
         this.bg.getComponent(cc.Sprite).spriteFrame = AssetContainer.ins.rarityBGSprites[Utils.parseRarityNameToIndex(data.name)]
      }
   }

   onClickThis() {
      SoundPlayer.ins.play('Button Sound')
      ShopController.ins.onClickBuyItem(this.id)
   }

   onClickBuyPoint() {
      SoundPlayer.ins.play('Button Sound')
      if (!this.buyAble) return;
      this.buyAble = false;
      // let dataSend = {
      //    evt: "BUY_ITEM_SHOP",
      //    data:
      //    {
      //       type: "BUY_VSNAKE",
      //       uuid: GlobalVar.playerUUID,
      //       packageId: this.id
      //    }
      // };
      // NetworkClient.ins.sendData(dataSend)
      HomeController.ins.postBuyVSnake(GlobalVar.playerUUID, this.id)
      Utils.popupNode(HomeController.ins.loadingPopup);
      setTimeout(() => {
         this.buyAble = true;
         Utils.collapseNode(HomeController.ins.loadingPopup);
      }, 300)
   }

   onClickBuyMask() {
      SoundPlayer.ins.play('Button Sound')
      if (!this.buyAble) return;
      this.buyAble = false;
      // let dataSend = {
      //    evt: "BUY_ITEM_SHOP",
      //    data:
      //    {
      //       type: "BUY_MASK",
      //       uuid: GlobalVar.playerUUID,
      //       packageId: this.id
      //    }
      // };
      // NetworkClient.ins.sendData(dataSend)
      HomeController.ins.postBuyMask(GlobalVar.playerUUID, this.id)
      Utils.popupNode(HomeController.ins.loadingPopup);
      setTimeout(() => {
         this.buyAble = true;
         Utils.collapseNode(HomeController.ins.loadingPopup);
      }, 300)

   }
}
