
import { GlobalVar } from "../GlobalVariables/GlobalVariables";
import AssetContainer from "../HomeScene/AssetContainer";
import NetworkClient, { EVT } from "../Networking/NetworkClient";
import SoundPlayer from "../System/SoundPlayer";
import Drawer from "../Utilities/Drawer";
import LocalStorage from "../Utilities/LocalStorage";
import Utils from "../Utilities/Utils";
import LeaderBoardItem from "./LeaderBoardItem";

const { ccclass, property } = cc._decorator;

export enum MODE_TYPE {
   PVP = "PVP",
   PVE = "PVE",
}
export enum DATE_TYPE {
   DAY = "DAY",
   WEEK = "WEEK",
   MONTH = "MONTH",
   ALL_TIME = "ALL_TIME"
}
@ccclass
export default class LeaderBoard extends cc.Component {
   public static ins: LeaderBoard = null
   @property(cc.ScrollView) scroll: cc.ScrollView = null
   @property(cc.Node) cardLayoutContainer: cc.Node = null
   @property(cc.Node) timeInformationContainer: cc.Node = null
   @property(cc.Node) updateLoading: cc.Node = null
   @property(cc.Node) myRank: cc.Node = null
   @property(cc.Prefab) cardPref: cc.Prefab = null
   @property(cc.Prefab) loading: cc.Prefab = null
   @property(cc.Prefab) blank: cc.Prefab = null
   @property(cc.Prefab) noRank: cc.Prefab = null
   @property(cc.Label) updateTimeLeftLb: cc.Label = null
   @property([cc.Node]) modeBtns: cc.Node[] = []
   @property([cc.Node]) timeBtns: cc.Node[] = []
   @property([cc.Node]) timeLbs: cc.Node[] = []
   @property([cc.SpriteFrame]) topCardBGSprites: cc.SpriteFrame[] = []
   @property([cc.SpriteFrame]) listBGSprite: cc.SpriteFrame[] = []
   @property([cc.SpriteFrame]) listRoundSprite: cc.SpriteFrame[] = []
   @property([cc.SpriteFrame]) listTimeBtnSprite: cc.SpriteFrame[] = []
   @property([cc.SpriteFrame]) listModeBtnSprite: cc.SpriteFrame[] = []
   currentMode: MODE_TYPE = MODE_TYPE.PVP
   currentDateIndex = 0

   lastRequestReceived = true
   updateTimeUpdateInterval = 1
   updateTimeUpdateElapseTime = this.updateTimeUpdateInterval
   lastUpdateTime = -1
   nextUpdateTime = -1
   lastRequestDateType: DATE_TYPE

   asset: AssetContainer
   protected onLoad(): void {
      LeaderBoard.ins = this
      this.asset = AssetContainer.ins
   }
   protected onEnable(): void {
      this.onClickMode(null, '1')

      let change = ((cc.view.getVisibleSize().height - 833) / 2)

      this.myRank.position = cc.v3(0,
         -(cc.view.getVisibleSize().height / 2)
         + (this.myRank.height / 2)
         - change
      )

      if (this.myRank.getComponent(LeaderBoardItem)) this.myRank.getComponent(LeaderBoardItem).destroy()
   }
   protected update(dt: number): void {
      let newUpdateTime = this.updateTimeUpdateElapseTime - dt

      if (newUpdateTime < 0) {
         this.updateTimeUpdateElapseTime = this.updateTimeUpdateInterval + newUpdateTime

         let now = Date.now()

         if (now < this.nextUpdateTime) {
            let timeLeft = this.nextUpdateTime - now
            this.updateTimeLeftLb.string = Utils.parseTimeToReadableString(timeLeft)
            this.updateTimeLeftLb.node.active = true
            this.updateLoading.active = false
         } else {
            this.updateTimeLeftLb.node.active = false
            this.updateLoading.active = true
         }

         if (!this.lastRequestReceived) {
            this.updateTimeLeftLb.node.active = false
            this.updateLoading.active = true
         }
      }
      else this.updateTimeUpdateElapseTime = newUpdateTime
   }
   protected onDestroy(): void {
      LeaderBoard.ins = null
   }
   public onClickMode(evt, cusEvtDta) {
      if (!this.lastRequestReceived) return
      let index = parseInt(cusEvtDta)

      if (index == 0) {
         if (this.currentMode == MODE_TYPE.PVP) return
         this.currentMode = MODE_TYPE.PVP
      } else {
         if (this.currentMode == MODE_TYPE.PVE) return
         this.currentMode = MODE_TYPE.PVE
      }

      this.onClickDate(this.currentDateIndex, true)
      this.updateMode()
   }
   public onClickDate(index, force = false) {
      if (!this.lastRequestReceived || (index == this.currentDateIndex && !force)) return
      SoundPlayer.ins.play('Button Sound')
      this.currentDateIndex = index
      for (let i = 0; i < this.timeLbs.length; i++) {
         const lb = this.timeLbs[i];
         lb.color = new cc.Color().fromHEX('#FFFFFF')
      }
      for (let i = 0; i < this.timeBtns.length; i++) {
         const btn = this.timeBtns[i];

         for (let j = 0; j < btn.children.length; j++) {
            const bg = btn.children[j];
            bg.getComponent(cc.Sprite).spriteFrame = this.listTimeBtnSprite[0]
         }
      }

      this.timeLbs[index].color = new cc.Color().fromHEX('#FDEF1B')
      for (let j = 0; j < this.timeBtns[index].children.length; j++) {
         const bg = this.timeBtns[index].children[j];
         bg.getComponent(cc.Sprite).spriteFrame = this.listTimeBtnSprite[1]
      }

      switch (index) {
         case 0: this.getLeaderBoardData(DATE_TYPE.DAY); break;
         case 1: this.getLeaderBoardData(DATE_TYPE.WEEK); break;
         case 2: this.getLeaderBoardData(DATE_TYPE.MONTH); break;
         case 3: this.getLeaderBoardData(DATE_TYPE.ALL_TIME); break;
      }

      this.scroll.scrollToTop(1, true)
      this.cardLayoutContainer.removeAllChildren()
      let bl = cc.instantiate(this.blank);
      let ld = cc.instantiate(this.loading);
      this.cardLayoutContainer.addChild(bl);
      this.cardLayoutContainer.addChild(ld);
      this.cardLayoutContainer.getComponent(cc.Layout).updateLayout();
   }

   onClickDayDate() { this.onClickDate(0) }
   onClickWeekDate() { this.onClickDate(1) }
   onClickMonthDate() { this.onClickDate(2) }
   onClickAllTimeDate() { this.onClickDate(3) }

   updateMode() {
      if (this.currentMode == MODE_TYPE.PVP) {
         this.modeBtns[0].opacity = 255
         let children = this.modeBtns[0].children
         for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i == 1) child.color = cc.color().fromHEX("#4C5494")
            if (i == 0) child.active = true;
         }
         this.modeBtns[1].opacity = 255
         children = this.modeBtns[1].children
         for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i == 1) child.color = cc.color().fromHEX("#ffffff")
            if (i == 0) child.active = false;
         }
      } else {
         this.modeBtns[1].opacity = 255
         let children = this.modeBtns[1].children
         for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i == 1) child.color = cc.color().fromHEX("#4C5494")
            if (i == 0) child.active = true;
         }
         this.modeBtns[0].opacity = 255
         children = this.modeBtns[0].children
         for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i == 1) child.color = cc.color().fromHEX("#ffffff")
            if (i == 0) child.active = false;
         }
      }
   }

   public getLeaderBoardData(dateType) {
      this.timeInformationContainer.active = (dateType != DATE_TYPE.ALL_TIME)

      this.lastRequestDateType = dateType
      this.lastRequestReceived = false

      let dataSend = {
         op: GlobalVar.OPCODE.GET_RANK_DATA,
         uuid: GlobalVar.playerUUID,
         name: GlobalVar.playerName,
         type: dateType,
         mode: this.currentMode
      }

      Utils.callAPI((result) => {
         this.onData(result.data)
      },
      {data: dataSend})

   }

   onData(data) {
      this.lastRequestReceived = true
      this.myRank.getChildByName("Index").getComponent(cc.Label).string = '?';
      this.myRank.getChildByName("Score").getComponent(cc.Label).string = '?';
      if (this.lastRequestDateType != DATE_TYPE.ALL_TIME) this.setLastUpdateTime(data.lastUpdateTime)

      this.cardLayoutContainer.removeAllChildren();
      let layout = this.cardLayoutContainer.getComponent(cc.Layout)
      if (data.dataRank.length < 1) {
         let nr = cc.instantiate(this.noRank);
         this.cardLayoutContainer.addChild(nr);
         this.cardLayoutContainer.getComponent(cc.Layout).updateLayout();
         return;
      }
      layout.enabled = true

      let rankArray = data.dataRank
      let count = data.dataRank.length
      if (count > 100) count = 100

      for (let i = 0; i < 3; i++) {
         if (i == this.currentDateIndex) {

            this.timeBtns[i].opacity = 255
            let children = this.timeBtns[i].children
            for (let j = 0; j < children.length; j++) {
               const child = children[j];
               if (j == 2) child.color = cc.color().fromHEX("#fdef1b")
               if (j == 1) child.getComponent(cc.Sprite).spriteFrame = this.listTimeBtnSprite[1]
            }
         } else {
            this.timeBtns[i].opacity = 255
            let children = this.timeBtns[i].children
            for (let j = 0; j < children.length; j++) {
               const child = children[j];
               if (j == 2) child.color = cc.color().fromHEX("#ffffff")
               if (j == 1) child.getComponent(cc.Sprite).spriteFrame = this.listTimeBtnSprite[0]
            }
         }
      }

      let cards = []
      for (let i = 0; i < count; i++) {
         let dataRank = rankArray[i]
         let card = cc.instantiate(this.cardPref)
         cards.push({ card: card, score: dataRank.score })
         let script = card.getComponent(LeaderBoardItem)

         try {
            if (i == 0) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[1];
               script.avatarFrameSprite.spriteFrame = this.asset.leaderBoardAvatarFrames[1]
               card.getChildByName("top_1").active = true;
               card.getChildByName("Index").active = false;
               let effect = cc.instantiate(this.asset.leaderBoardCardEffects[0])
               effect.setParent(script.node)
               effect.setPosition(cc.v3(0, 0))

            }
            else if (i == 1) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[2];
               script.avatarFrameSprite.spriteFrame = this.asset.leaderBoardAvatarFrames[2]
               card.getChildByName("top_2").active = true;
               card.getChildByName("Index").active = false;
               let effect = cc.instantiate(this.asset.leaderBoardCardEffects[1])
               effect.setParent(script.node)
               effect.setPosition(cc.v3(0, 0))

            } else if (i == 2) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[3];
               script.avatarFrameSprite.spriteFrame = this.asset.leaderBoardAvatarFrames[3]
               card.getChildByName("top_3").active = true;
               card.getChildByName("Index").active = false;
               let effect = cc.instantiate(this.asset.leaderBoardCardEffects[2])
               effect.setParent(script.node)
               effect.setPosition(cc.v3(0, 0))

            } else if (i < 10) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[4];
               script.rankLb.node.color = new cc.Color().fromHEX('#7BFFEF')

            } else if (i < 50) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[5];
               script.rankLb.node.color = new cc.Color().fromHEX('#B4FF96')

            } else if (i < 100) {

               script.bg.spriteFrame = this.asset.leaderBoardItemBGs[6];
               script.rankLb.node.color = new cc.Color().fromHEX('#D1D1D1')

            }

            script.rankLb.string = '' + (i + 1)
            script.nameLb.string = '' + dataRank.name
            // script.scoreLb.string = '' + Math.floor(dataRank.data.score)
            Utils.loadImgFromUrl(script.avatarSprite, dataRank.avatar);

            card.parent = this.cardLayoutContainer
            card.opacity = 0
            if (dataRank.uuid == GlobalVar.playerUUID) {
               this.myRank.getChildByName("Index").getComponent(cc.Label).string = '' + (i + 1);
               this.myRank.getChildByName("Score").getComponent(cc.Label).string = Utils.parseToBalanceString(dataRank.score);
            }
            this.myRank.getChildByName("Name").getComponent(cc.Label).string = LocalStorage.getPlayerName();
            Utils.loadImgFromUrl(this.myRank.getChildByName("Mask").getChildByName("Profile").getComponent(cc.Sprite), LocalStorage.getPlayerAvatarURL())
         } catch (e) {
            console.log(e);
         }
      }
      layout.updateLayout();

      for (let i = 0; i < cards.length; i++) {
         const data = cards[i];
         let card = data.card
         let script = card.getComponent(LeaderBoardItem)

         card.opacity = 0.1
         script.checkVisible = false
         if (card.y > -833) {
            this.scheduleOnce(() => {
               Utils.tweenLb(script.scoreLb, 0, Math.floor(data.score), 0.45, 'sineIn', null, '', '', Utils.parseToBalanceString)
               Utils.popupNode(card, 0.4, () => {
                  script.checkVisible = true
                  // card.children.forEach((child) => {
                  //    child.setParent(card.parent)
                  // })
               })
            }, i * 0.05)
         } else {
            script.checkVisible = true
            card.active = true
            card.opacity = 0
            script.scoreLb.string = Utils.parseToBalanceString(Math.floor(data.score))
         }
      }
      // this.cardLayoutContainer.getComponent(cc.Lay)
      // layout.enabled = false
   }

   setLastUpdateTime(time) {
      this.lastUpdateTime = time

      switch (this.lastRequestDateType) {
         case DATE_TYPE.DAY:
            this.nextUpdateTime = Utils.getMidnightNextDayMillisecondsUTC()
            break;
         case DATE_TYPE.WEEK:
            this.nextUpdateTime = Utils.getFirstDayOfNextWeekMillisecondsUTC()
            break;
         case DATE_TYPE.MONTH:
            this.nextUpdateTime = Utils.getFirstDayOfNextMonthMillisecondsUTC()
            break;
      }

      this.updateTimeUpdateElapseTime = 0
   }
}
