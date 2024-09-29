import { GlobalVar } from "../GlobalVariables/GlobalVariables";
import { CCFS } from "../Utilities/CCFS";
import { CONSTANT } from "../Utilities/Config";
import { LocalizationManager } from "../Utilities/LocalizationManager";
import Utils from "../Utilities/Utils";
import TonWalletView from "./TonWalletView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DepositView extends cc.Component {
   @property(cc.Button) actionBtn: cc.Button = null
   @property([cc.Color]) actionBtnStateColors: cc.Color[] = []
   @property([cc.Color]) actionTextStateColors: cc.Color[] = []
   @property([cc.String]) actionTextStateStrings: String[] = []
   @property([cc.String]) popupTextStateStrings: String[] = []
   @property(cc.Node) depositAmountLayout: cc.Node = null

   @property(cc.EditBox) editBox: cc.EditBox = null
   @property(cc.Label) depositAmountLb: cc.Label = null
   @property(cc.Label) depositAmountEditDummyLb: cc.Label = null
   @property(cc.Label) minDepositLb: cc.Label = null
   @property(cc.Node) notifyPopup: cc.Node = null

   private depositAmount = 0
   private blockRequest = false
   private lastDepositRequest = null

   protected onLoad(): void {

      this.editBox.node.on('editing-did-began', this.onDepositAmountEditBegan, this)
      this.editBox.node.on('text-changed', this.onDepositAmountEditChange, this)
      this.editBox.node.on('editing-return', this.onDepositAmountEditEnd, this)
      this.editBox.node.on('editing-did-ended', this.onDepositAmountEditEnd, this)

      this.schedule(() => {
         if (window) {
            //@ts-ignore 
            if (window.walletActionState == "FINISHED") {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = true
               this.notifyPopup.getChildByName('failed').active = false
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[1].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.scheduleOnce(() => {
                        this.onClickBack()
                        this.releaseActionBtnState()
                        TonWalletView.ins.clearHistoryLayout()
                        TonWalletView.ins.fetchHistorySchedule()
                     }, 1)
                  });
               }, 1.5)
               //@ts-ignore 
            } else if (window.walletActionState == "FAILED") {
               //@ts-ignore 
               window.walletActionState = "NONE"
               this.onProcessTransactionFail()
            }
         }
      })
   }

   onClickBack() {
      Utils.fadeOutNode(this.node, 0.25, () => {
         TonWalletView.ins.blockClickAnyBtn = false
      })
   }

   onEnable(): void {
      let change = ((cc.view.getVisibleSize().height - 833) / 2)

      this.actionBtn.node.position = cc.v3(0,
         -(cc.view.getVisibleSize().height / 2)
         + (this.actionBtn.node.height / 2)
         - change
      )


      // if (location.hostname === "localhost" || location.hostname.includes('192.168')) {
      //    this.comingSoon.active = false
      // }
   }

   onClickMin() {
      let minString = this.minDepositLb.string.replace(/[^0-9.]/g, '')
      this.depositAmountLb.string = minString
      this.depositAmount = parseFloat(minString)
   }

   isEditing = false
   appendedDot = false
   lastDummyLbStringLength = 0
   releaseBlockRequestTimeout = null

   onDepositAmountEditBegan(evt) {
      this.isEditing = true
      this.appendedDot = false
      this.editBox.fontColor = new cc.Color(0, 0, 0, 0)
      // console.log(this.editBox);

      try {
         //@ts-ignore
         this.editBox._impl._elem.writingSuggestions = "false"
         //@ts-ignore
         this.editBox._impl._elem.translate = "false"
         //@ts-ignore
         this.editBox._impl._elem.spellcheck = "false"
      } catch (error) {
         console.log(error);
      }
      // this.editBox.inputMode = cc.EditBox.InputMode.DECIMAL
      // console.log(this.editBox);

      this.depositAmountLb.node.opacity = 255
      this.depositAmountLb.string = ''
      this.depositAmountLayout.getComponent(cc.Layout).updateLayout()

      this.onDummyLbStringChange()
   }

   onDepositAmountEditChange(evt) {
      let string = this.ensureSingleDecimalPoint(this.depositAmountEditDummyLb.string.replace(/[^0-9.]/g, ''))
      string = Utils.clampToFourDecimals(string)

      this.editBox.string = string
      this.depositAmountEditDummyLb.string = string

      this.onDummyLbStringChange()
      this.lastDummyLbStringLength = this.depositAmountEditDummyLb.string.length
   }

   onDepositAmountEditEnd(evt) {
      if (!this.isEditing) return
      this.isEditing = false

      this.depositAmountLb.node.opacity = 255

      this.onDummyLbStringChange()
      this.editBox.string = ""
      this.depositAmountEditDummyLb.string = ""
   }

   onClickDeposit() {
      if (this.blockRequest) return

      let amount = parseFloat(this.depositAmountLb.string)
      if (cc.isValid(amount) && amount != 0) {
         this.onMakeDepositRequest(amount, TonWalletView.ins.walletAddress)
      }
   }

   onMakeDepositRequest(amount, wallet) {
      if (this.blockRequest) return

      if (window) {
         //@ts-ignore
         window.walletActionState = "REQUESTING_DEPOSIT_PAYLOAD"
      }

      this.blockRequest = true

      this.releaseBlockRequestTimeout = setTimeout(() => {
         this.blockRequest = false
      }, 1000);

      this.setActionBtnProcessingState()

      let dataSend = {
         op: GlobalVar.OPCODE.CREATE_WALLET_DEPOSIT_ORDER,
         uuid: GlobalVar.playerUUID,
         name: GlobalVar.playerName,
         walletAddress: GlobalVar.readableWalletAddress,
         amount: amount
      }
      Utils.callAPI((result) => {
         if (!result) {
            this.notifyPopup.getChildByName('success').active = false
            this.notifyPopup.getChildByName('failed').active = true
            this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[0].toString())
            Utils.popupNode(this.notifyPopup);

            this.scheduleOnce(() => {
               Utils.collapseNode(this.notifyPopup, 0.25);
               this.releaseActionBtnState()
            }, 1.5)
         }

         console.log(result.status, result);

         this.lastDepositRequest = result
         result.doNotRegisTxHandle = true

         if (result.status == CONSTANT.DEPOSIT_STATUS.OK) this.sendTokenSingle(result)
         else {
            this.notifyPopup.getChildByName('success').active = false
            this.notifyPopup.getChildByName('failed').active = true
            this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[0].toString())
            Utils.popupNode(this.notifyPopup);

            this.scheduleOnce(() => {
               Utils.collapseNode(this.notifyPopup, 0.25);
               this.releaseActionBtnState()
            }, 1.5)
         }
      }, { data: dataSend })
   }

   onProcessTransactionFail() {
      if (!this.lastDepositRequest) return

      console.log('this.lastDepositRequest', this.lastDepositRequest);

      this.notifyPopup.getChildByName('success').active = false
      this.notifyPopup.getChildByName('failed').active = true
      this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[2].toString())
      Utils.popupNode(this.notifyPopup);

      this.scheduleOnce(() => {
         Utils.collapseNode(this.notifyPopup, 0.25, () => {
            this.scheduleOnce(() => {
               this.onClickBack()
               this.releaseActionBtnState()
               TonWalletView.ins.clearHistoryLayout()
               TonWalletView.ins.fetchHistorySchedule()
            }, 1)
         });
      }, 1.5)


      let dataSend = {
         op: GlobalVar.OPCODE.REPORT_FAIL_TRANSACTION,
         orderID: this.lastDepositRequest.orderID
      }
      Utils.callAPI((result) => {

      }, { data: dataSend })

      this.lastDepositRequest = null
   }

   async verifyPaymentData(_data) {
      let dataSend = _data;
      dataSend.op = GlobalVar.OPCODE.AFTER_PAYMENT,
         dataSend.uuid = GlobalVar.playerUUID,
         dataSend.name = GlobalVar.playerName,
         dataSend.status = "pending",
         dataSend.time = Date.now(),
         Utils.callAPI(
            (verifyData) => {
               if (verifyData.status == "success") {
                  //@ts-ignore 
                  window.currentTxState = "done"
               } else {
                  //@ts-ignore 
                  window.currentTxState = "none"
               }
            }
            , { data: dataSend })
   }

   async sendTokenSingle(data) {
      if (window) {
         //@ts-ignore 
         window.walletActionState = "TRANSPORTING_TOKEN"
      }

      //@ts-ignore
      let result = await window.TON_SDK.sendTokenSingle(data);
      if (result) {
         console.log("DONE SEND TOKEN__________________-")
      }
   }

   onDummyLbStringChange() {
      this.depositAmountEditDummyLb.node.opacity = 0
      let string = this.depositAmountEditDummyLb.string
      string = Utils.clampToFourDecimals(string)

      let insert = false

      if (this.depositAmountEditDummyLb.string[0] == "0" && this.depositAmountEditDummyLb.string.length >= 1) {
         insert = true
      }

      if (insert) {
         let original = string
         let toInsert = ".";
         let position = 1;
         string = original.slice(0, position) + toInsert + original.slice(position);
      }
      this.depositAmountLb.string = this.ensureSingleDecimalPoint(string)
      this.depositAmount = parseFloat(string)
      this.depositAmountLayout.getComponent(cc.Layout).updateLayout()
   }

   ensureSingleDecimalPoint(input) {
      let parts = input.split('.');
      if (parts.length > 2) {
         input = parts[0] + '.' + parts.slice(1).join('');
      }
      return input;
   }

   setActionBtnProcessingState() {
      this.actionBtn.interactable = false
      this.actionBtn.node.color = this.actionBtnStateColors[0]
      this.actionBtn.getComponentInChildren(cc.Label).node.color = this.actionTextStateColors[0]
      this.actionBtn.getComponentInChildren(cc.Label).string = LocalizationManager.getText(this.actionTextStateStrings[0].toString())
   }

   releaseActionBtnState() {
      if (this.releaseBlockRequestTimeout) {
         clearTimeout(this.releaseBlockRequestTimeout)
         this.releaseBlockRequestTimeout = null
      }

      this.actionBtn.interactable = true
      this.actionBtn.node.color = this.actionBtnStateColors[1]
      this.actionBtn.getComponentInChildren(cc.Label).node.color = this.actionTextStateColors[1]
      this.actionBtn.getComponentInChildren(cc.Label).string = LocalizationManager.getText(this.actionTextStateStrings[1].toString())
   }
}
