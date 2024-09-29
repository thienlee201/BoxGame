import { GlobalVar } from "../GlobalVariables/GlobalVariables";
import { LocalizationManager } from "../Utilities/LocalizationManager";
import Utils from "../Utilities/Utils";
import TonWalletView from "./TonWalletView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WithdrawView extends cc.Component {
   @property(cc.Button) actionBtn: cc.Button = null
   @property([cc.Color]) actionBtnStateColors: cc.Color[] = []
   @property([cc.Color]) actionTextStateColors: cc.Color[] = []
   @property([cc.String]) actionTextStateStrings: String[] = []
   @property([cc.String]) popupTextStateStrings: String[] = []
   @property(cc.Node) withdrawAmountLayout: cc.Node = null

   @property(cc.EditBox) editBox: cc.EditBox = null
   @property(cc.Label) withdrawAmountLb: cc.Label = null
   @property(cc.Label) withdrawAmountEditDummyLb: cc.Label = null

   @property(cc.Label) minWithdrawLb: cc.Label = null
   @property(cc.Label) balanceLb: cc.Label = null
   @property(cc.Node) notifyPopup: cc.Node = null

   private balanceAsFloat = 0
   private withdrawAmount = 0
   private blockRequest = false
   private releaseBlockRequestTimeout = null

   protected onLoad(): void {
      this.editBox.node.on('editing-did-began', this.onWithdrawAmountEditBegan, this)
      this.editBox.node.on('text-changed', this.onWithdrawAmountEditChange, this)
      this.editBox.node.on('editing-return', this.onWithdrawAmountEditEnd, this)
      this.editBox.node.on('editing-did-ended', this.onWithdrawAmountEditEnd, this)
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
   }

   onClickMax() {
      this.withdrawAmountLb.string = this.balanceLb.string
      this.withdrawAmount = parseFloat(this.balanceLb.string)
   }

   isEditing = false
   appendedDot = false
   lastDummyLbStringLength = 0
   onWithdrawAmountEditBegan(evt) {
      this.isEditing = true
      this.appendedDot = false
      this.editBox.fontColor = new cc.Color(0, 0, 0, 0)
      console.log(this.editBox);

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

      this.withdrawAmountLb.node.opacity = 255
      this.withdrawAmountLb.string = ''
      this.withdrawAmountLayout.getComponent(cc.Layout).updateLayout()

      this.onDummyLbStringChange()
   }

   onWithdrawAmountEditChange(evt) {
      let string = this.ensureSingleDecimalPoint(this.withdrawAmountEditDummyLb.string.replace(/[^0-9.]/g, ''))
      string = Utils.clampToFourDecimals(string)

      this.editBox.string = string
      this.withdrawAmountEditDummyLb.string = string

      this.onDummyLbStringChange()
      this.lastDummyLbStringLength = this.withdrawAmountEditDummyLb.string.length
   }

   onWithdrawAmountEditEnd(evt) {
      if (!this.isEditing) return
      this.isEditing = false

      this.withdrawAmountLb.node.opacity = 255

      this.onDummyLbStringChange()
      this.editBox.string = ""
      this.withdrawAmountEditDummyLb.string = ""
   }

   onDummyLbStringChange() {
      this.withdrawAmountEditDummyLb.node.opacity = 0
      let string = this.withdrawAmountEditDummyLb.string
      string = Utils.clampToFourDecimals(string)

      let insert = false

      if (this.withdrawAmountEditDummyLb.string[0] == "0" && this.withdrawAmountEditDummyLb.string.length >= 1) {
         insert = true
      }

      if (insert) {
         let original = string
         let toInsert = ".";
         let position = 1;
         string = original.slice(0, position) + toInsert + original.slice(position);
      }
      this.withdrawAmountLb.string = this.ensureSingleDecimalPoint(string)
      this.withdrawAmount = parseFloat(string)
      this.withdrawAmountLayout.getComponent(cc.Layout).updateLayout()
   }

   ensureSingleDecimalPoint(input) {
      let parts = input.split('.');
      if (parts.length > 2) {
         input = parts[0] + '.' + parts.slice(1).join('');
      }
      return input;
   }

   onClickWithdraw() {
      if (this.blockRequest) return

      let amount = parseFloat(this.withdrawAmountLb.string)

      if (cc.isValid(amount) && amount != 0 && amount <= GlobalVar.tonBalance) {
         this.onMakeWithdrawRequest(amount)
      } else {
         this.notifyPopup.getChildByName('success').active = false
         this.notifyPopup.getChildByName('failed').active = true
         this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[2].toString())
         Utils.popupNode(this.notifyPopup);

         this.scheduleOnce(() => {
            Utils.collapseNode(this.notifyPopup, 0.25, () => {
               this.releaseActionBtnState()
            });
         }, 1.5)
      }
   }

   onMakeWithdrawRequest(amount) {
      if (this.blockRequest) return

      if (window) {
         //@ts-ignore
         window.walletActionState = "REQUESTING_WITHDRAW_PAYLOAD"
      }

      this.blockRequest = true

      this.releaseBlockRequestTimeout = setTimeout(() => {
         this.blockRequest = false
      }, 1000);

      this.setActionBtnProcessingState()

      let dataSend = {
         op: GlobalVar.OPCODE.CREATE_WALLET_WITHDRAW_ORDER,
         uuid: GlobalVar.playerUUID,
         name: GlobalVar.playerName,
         walletAddress: GlobalVar.readableWalletAddress,
         amount: amount
      }
      Utils.callAPI((result) => {
         // console.log(result);
         switch (result.status) {
            case "OK": {
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
               break
            }
            case "SOMETHING_WRONG": {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[4].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break
            }
            case "WITHDRAW_AMOUNT_TOO_LOW": {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[3].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break
            }
            case "INSUFFICIENT_FUND": {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[2].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break
            }
            case "MULTIPLE_WITHDRAW": {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[5].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break
            }
            case "SPAM": {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[5].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break
            }
            default: {
               //@ts-ignore 
               window.walletActionState = "NONE"

               this.notifyPopup.getChildByName('success').active = false
               this.notifyPopup.getChildByName('failed').active = true
               this.notifyPopup.getChildByName('lb').getComponent(cc.Label).string = LocalizationManager.getText(this.popupTextStateStrings[0].toString())
               Utils.popupNode(this.notifyPopup);

               this.scheduleOnce(() => {
                  Utils.collapseNode(this.notifyPopup, 0.25, () => {
                     this.releaseActionBtnState()
                  });
               }, 1.5)
               break;
            }
         }
      }, { data: dataSend })
   }

   updateBalance(balance: string) {
      this.balanceLb.string = balance
      this.balanceAsFloat = parseFloat(balance)
   }

   setActionBtnProcessingState() {
      this.actionBtn.interactable = false
      this.actionBtn.node.color = this.actionBtnStateColors[0]
      this.actionBtn.getComponentInChildren(cc.Label).string = LocalizationManager.getText(this.actionTextStateStrings[0].toString())
   }

   releaseActionBtnState() {
      if (this.releaseBlockRequestTimeout) {
         clearTimeout(this.releaseBlockRequestTimeout)
         this.releaseBlockRequestTimeout = null
      }

      this.actionBtn.interactable = true
      this.actionBtn.node.color = this.actionBtnStateColors[1]
      this.actionBtn.getComponentInChildren(cc.Label).string = LocalizationManager.getText(this.actionTextStateStrings[1].toString())
   }
}
