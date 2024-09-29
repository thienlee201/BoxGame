import { GlobalVar, TRAN_HIS_TYPE } from "../GlobalVariables/GlobalVariables";
import HomeController from "../HomeScene/HomeController";
import { CONSTANT } from "../Utilities/Config";
import LocalStorage from "../Utilities/LocalStorage";
import Utils from "../Utilities/Utils";
import DepositView from "./DepositView";
import WalletHistoryItem from "./WalletHistoryItem";
import WithdrawView from "./WidthrawView";

const { ccclass, property } = cc._decorator;

enum HISTORY_TYPE {
   PVP = 0,
   WALLET = 1,
}

@ccclass
export default class TonWalletView extends cc.Component {
   public static ins: TonWalletView = null

   @property(cc.Node) historyContentContainer: cc.Node = null
   @property(cc.Label) balanceDigitLb: cc.Label = null
   @property(cc.Label) balanceDecimalLb: cc.Label = null
   @property(cc.Label) yourTONAddressTitleLb: cc.Label = null
   @property(cc.Label) walletAddressLb: cc.Label = null
   @property(cc.Node) connectWalletBtn: cc.Node = null
   @property(cc.Node) disconnectWalletBtn: cc.Node = null
   @property(cc.Node) brand: cc.Node = null

   @property([cc.Button]) actionBtns: cc.Button[] = []
   @property([cc.Label]) historyBtnLbs: cc.Label[] = []
   @property([cc.Color]) historyBtnLbColors: cc.Color[] = []
   @property([cc.Color]) balanceColors: cc.Color[] = []

   @property(cc.Node) depositView: cc.Node = null
   @property(cc.Node) withdrawView: cc.Node = null
   @property([cc.Node]) comingSoon: cc.Node[] = []

   @property([cc.String]) transactionStateLbLocalizeCodes: String[] = []
   @property([cc.SpriteFrame]) transactionStateSprFrames: cc.SpriteFrame[] = []
   @property([cc.SpriteFrame]) transactionTypeIcons: cc.SpriteFrame[] = []

   @property(cc.Prefab) historyItemPref: cc.Prefab = null

   // @property(cc.Node) historyContentContainer: cc.Node = null
   onDestroy() { TonWalletView.ins = null }

   isWalletConnected = false;
   walletAddress = '';

   blockClickAnyBtn = false
   currentHistoryIndex = -1

   fetchWalletAddressSchedule
   fetchHistorySchedule
   currentHistoryRequestType

   historyItemByOrderId = {}

   onLoad(): void {
      if (window) {
         //@ts-ignore 
         window.walletActionState = "NONE"
      }

      TonWalletView.ins = this
      this.currentHistoryIndex = -1
      this.onClickHistory(null, '1')
      this.schedule(this.getWalletInfo, 1);
   }

   onEnable(): void {
      let change = ((cc.view.getVisibleSize().height - 833) / 2)

      this.brand.position = cc.v3(0,
         -(cc.view.getVisibleSize().height / 2)
         + (this.brand.height / 2)
         - change
      )

      if (GlobalVar.walletAddress != "") {

         this.isWalletConnected = true
         this.walletAddress = GlobalVar.walletAddress
      }

      this.updateWalletState()

      if (this.fetchWalletAddressSchedule) this.unschedule(this.fetchWalletAddressSchedule)

      this.fetchWalletAddressSchedule = () => {
         let dataSend = {
            op: GlobalVar.OPCODE.FETCH_PROFILE_BALANCE,
            uuid: GlobalVar.playerUUID
         }
         Utils.callAPI((dataReturn) => {
            if (dataReturn != null) {
               GlobalVar.tonBalance = dataReturn.balance
               TonWalletView.ins.setBalanceInfo(dataReturn.balance.toString())
            }
         }, { data: dataSend })
      }

      this.fetchWalletAddressSchedule()

      this.schedule(this.fetchWalletAddressSchedule, 5)
      //

      if (this.fetchHistorySchedule) this.unschedule(this.fetchHistorySchedule)

      this.fetchHistorySchedule = () => {
         this.sendRequestHistory(this.currentHistoryRequestType)
      }

      this.clearHistoryLayout()
      this.fetchHistorySchedule()

      this.scheduleOnce(() => { this.fetchHistorySchedule() }, 0.05)
      this.schedule(this.fetchHistorySchedule, 5)

      for (let i = 0; i < this.comingSoon.length; i++) {
         const node = this.comingSoon[i];
         node.active = !(LocalStorage.getComingSoonClickCount() >= 20)

      }
   }

   onData() {

   }

   getWalletInfo() {
      try {
         // if (this.isWalletConnected) return;
         //@ts-ignore
         let result = window.TON_SDK.getWalletInfo();
         if (result.currentAccount?.address) {
            if (!this.isWalletConnected) {
               this.showLoading();
            }
            this.blockClickAnyBtn = false;
            this.walletAddress = result.currentAccount.address.toString();
            GlobalVar.walletAddress = this.walletAddress
            this.isWalletConnected = true;
            let dataSend = {
               op: GlobalVar.OPCODE.PARSE_WALLET,
               uuid: GlobalVar.playerUUID,
               name: GlobalVar.playerName,
               address: this.walletAddress
            }
            Utils.callAPI((result) => {
               if (result.data?.wallet) {
                  GlobalVar.readableWalletAddress = result.data.wallet
                  let trimAddress = result.data.wallet.slice(0, 3) + "..." + result.data.wallet.slice(-4)
                  this.setWalletAddressLb(trimAddress)
                  this.updateWalletState();
               }
            },
               { data: dataSend })
         } else {
            this.isWalletConnected = false;
            this.setWalletAddressLb("???")
            this.updateWalletState();
         }
      } catch (error) {
         console.warn(error)
      }
   }

   showLoading() {
      Utils.popupNode(HomeController.ins.loadingPopup);
      this.scheduleOnce(() => {
         Utils.collapseNode(HomeController.ins.loadingPopup);
      }, 0.5)
   }

   setBalanceInfo(balanceAsString: string) {
      // console.log(balanceAsString, balanceAsString.includes('.'));

      if (balanceAsString.includes('.')) {
         let parts = balanceAsString.split('.');
         this.balanceDigitLb.string = parts[0] // ?.decimal
         this.balanceDecimalLb.node.active = true
         this.balanceDecimalLb.string = '.' + parts[1] + '' // digit.?
      } else {
         this.balanceDigitLb.string = balanceAsString
         this.balanceDecimalLb.node.active = false
         // this.balanceDecimalLb.string = '' // digit.?
      }
      // this.balanceDecimalLb.node.parent.getComponent(cc.Layout).updateLayout()
      this.withdrawView.getComponent(WithdrawView).balanceLb.string = balanceAsString
   }

   setWalletAddressLb(addressAsString: string) {
      this.walletAddressLb.string = addressAsString;
   }

   onClickBack() {
      Utils.fadeOutNode(this.node, 0.25, () => {
         Utils.fadeInNode(HomeController.ins.mainView)
      })
   }

   onClickConnectWallet() {
      if (this.blockClickAnyBtn) return

      // this.blockClickAnyBtn = true
      try {
         //@ts-ignore

         window.TON_SDK.connectWallet();
      } catch (error) {
         console.log("onClickConnectWallet error: ", error);

      }
   }

   onClickDisconnectWallet() {
      if (this.blockClickAnyBtn) return
      try {
         //@ts-ignore
         window.TON_SDK.disconnectWallet();
         this.showLoading();
      } catch (error) {

      }
      // this.blockClickAnyBtn = true

   }

   onClickDeposit() {
      if (this.blockClickAnyBtn) return

      Utils.fadeInNode(this.depositView)
      // this.blockClickAnyBtn = true
   }

   onClickWithdraw() {
      if (this.blockClickAnyBtn) return

      Utils.fadeInNode(this.withdrawView)
      // this.blockClickAnyBtn = true
   }

   onClickSwap() {
      if (this.blockClickAnyBtn) return

      // this.blockClickAnyBtn = true
   }

   onClickHistory(evt, customEvtData) {
      let historyIndex = parseInt(customEvtData)

      for (let i = 0; i < this.historyBtnLbs.length; i++) {
         const lb = this.historyBtnLbs[i];
         lb.node.color = this.historyBtnLbColors[0]
         lb.node.opacity = this.historyBtnLbColors[0].a
      }

      this.historyBtnLbs[historyIndex].node.color = this.historyBtnLbColors[1]
      this.historyBtnLbs[historyIndex].node.opacity = this.historyBtnLbColors[1].a

      let historyRequestType
      switch (historyIndex) {
         case HISTORY_TYPE.PVP:
            historyRequestType = TRAN_HIS_TYPE.PVP
            break
         case HISTORY_TYPE.WALLET:
            historyRequestType = TRAN_HIS_TYPE.WALLET
            break
      }

      if (this.currentHistoryRequestType != historyRequestType)
         this.clearHistoryLayout()
      this.currentHistoryRequestType = historyRequestType
      this.sendRequestHistory(historyRequestType)
   }

   updateWalletState() {
      if (!this.isWalletConnected) {
         this.walletAddressLb.node.active = false
         this.yourTONAddressTitleLb.node.active = false
         this.connectWalletBtn.active = true
         this.disconnectWalletBtn.active = false

         for (let i = 0; i < this.actionBtns.length; i++) {
            const btn = this.actionBtns[i];
            btn.interactable = false
            btn.node.opacity = 90
         }
      } else {
         this.walletAddressLb.node.active = true
         this.yourTONAddressTitleLb.node.active = true
         this.connectWalletBtn.active = false
         this.disconnectWalletBtn.active = true

         for (let i = 0; i < this.actionBtns.length; i++) {
            const btn = this.actionBtns[i];
            btn.interactable = true
            btn.node.opacity = 255
         }
      }

      let swapBtn = this.actionBtns[2]
      swapBtn.interactable = false
      swapBtn.node.opacity = 90
   }

   sendRequestHistory(historyRequestType) {
      // this.historyContentContainer.removeAllChildren()

      let dataSend = {
         op: GlobalVar.OPCODE.GET_WALLET_HISTORY,
         uuid: GlobalVar.playerUUID,
         historyType: historyRequestType
      }
      Utils.callAPI((dataReturn) => {
         // ON DATA HISTORY
         if (!dataReturn) return
         // console.log(dataReturn);

         if (dataReturn.length > 1) {
            dataReturn.sort((a, b) => {
               let aTime = a.createTime
               if (a.updateTime) aTime = a.updateTime

               let bTime = b.createTime
               if (b.updateTime) bTime = b.updateTime

               return bTime - aTime
            })
         }

         for (let i = 0; i < dataReturn.length; i++) {
            let historyDataItem = dataReturn[i]
            let historyItemScript: WalletHistoryItem

            if (this.historyItemByOrderId[historyDataItem.orderID]) {
               historyItemScript = this.historyItemByOrderId[historyDataItem.orderID]
            } else {
               let item = cc.instantiate(this.historyItemPref);
               historyItemScript = item.getComponent(WalletHistoryItem);
               this.historyContentContainer.addChild(item);
               this.historyItemByOrderId[historyDataItem.orderID] = item.getComponent(WalletHistoryItem);
            }

            if (historyRequestType == TRAN_HIS_TYPE.WALLET)
               historyItemScript.transactionDesc.string = historyDataItem.description + ' - ' + historyDataItem.status
            else
               historyItemScript.transactionDesc.string = historyDataItem.description

            switch (historyDataItem.description) {
               case "Deposit":
                  historyItemScript.setOriginTo();
                  historyItemScript.transactionOriginAddress.string = Utils.shortenWalletAddress(historyDataItem.fromAddress)
                  historyItemScript.statusIcon.spriteFrame = this.transactionStateSprFrames[0]
                  break;
               case "Withdraw":
                  historyItemScript.setOriginFrom();
                  historyItemScript.transactionOriginAddress.string = Utils.shortenWalletAddress(historyDataItem.toAddress)
                  historyItemScript.statusIcon.spriteFrame = this.transactionStateSprFrames[1]
                  break;
            }

            if (historyDataItem.status == CONSTANT.TRAN_STATUS.COMPLETE) {
               if (historyDataItem.changeAmount > 0) {

                  historyItemScript.transactionValue.string = '+' + historyDataItem.changeAmount + " TON";
                  historyItemScript.transactionValue.node.color = this.balanceColors[1]

                  if (historyDataItem.description == "Withdraw") {

                     historyItemScript.transactionValue.string = '-' + Math.abs(historyDataItem.changeAmount) + " TON";
                     historyItemScript.transactionValue.node.color = this.balanceColors[0]

                  }
               } else {

                  historyItemScript.transactionValue.string = '-' + Math.abs(historyDataItem.changeAmount) + " TON";
                  historyItemScript.transactionValue.node.color = this.balanceColors[0]

               }

               historyItemScript.transactionDesc.node.color = this.balanceColors[1]

            } else if (historyDataItem.status == CONSTANT.TRAN_STATUS.FAILED) {
               historyItemScript.transactionValue.string = Math.abs(historyDataItem.changeAmount) + " TON";
               historyItemScript.transactionValue.node.color = this.balanceColors[0]
               historyItemScript.transactionDesc.node.color = this.balanceColors[0]
            } else {
               historyItemScript.transactionValue.string = Math.abs(historyDataItem.changeAmount) + " TON";
            }

            if (historyDataItem.updateTime) {
               // historyItemScript.transactionTime.string = (Date.now() - historyDataItem.updateTime)
               historyItemScript.transactionTime.string = Utils.parseToTimeSince(historyDataItem.updateTime)
            }
            else {
               // historyItemScript.transactionTime.string = (Date.now() - historyDataItem.createTime)
               historyItemScript.transactionTime.string = Utils.parseToTimeSince(historyDataItem.createTime)
            }
         }

         this.historyContentContainer.getComponent(cc.Layout).updateLayout();

         if (dataReturn.balance != null) {
            TonWalletView.ins.setBalanceInfo(dataReturn.balance.toString())
         }
      }, { data: dataSend })
   }

   clearHistoryLayout() {
      this.historyContentContainer.removeAllChildren(true)
      this.historyItemByOrderId = {}
   }

   sendRequestRefresh() {
      if (!this.currentHistoryRequestType) this.currentHistoryRequestType = TRAN_HIS_TYPE.WALLET

      this.sendRequestHistory(this.currentHistoryRequestType)
      this.fetchWalletAddressSchedule()
   }

   onClickComingSoon() {
      LocalStorage.setComingSoonClickCount(LocalStorage.getComingSoonClickCount() + 1)

      if (LocalStorage.getComingSoonClickCount() >= 20) {

         for (let i = 0; i < this.comingSoon.length; i++) {
            const node = this.comingSoon[i];
            node.active = false

         }
      }
   }

   onDisable(): void {

   }
}
