// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import LocalStorage from "../../Utilities/LocalStorage";
import Utils from "../../Utilities/Utils";
import SceneController from "../SceneController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProfileController extends cc.Component {

    @property(cc.Label) value1: cc.Label = null;
    @property(cc.Label) value2: cc.Label = null;
    @property(cc.Label) value3: cc.Label = null;
    @property(cc.Label) value4: cc.Label = null;
    @property(cc.Label) walletTon: cc.Label = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.value1.string = LocalStorage.getPlayerPower();
        this.value2.string = LocalStorage.getPlayerKnown();
        this.value3.string = LocalStorage.getPlayerTrust();
        this.value4.string = LocalStorage.getPlayerConnect();
    }

    getTonWalletInfo() {
        if(!this.walletConnected){
            this.connectWallet()
        }
    }


    getEthereumWalletInfo() {
        if(cc.sys.isNative){
            cc.sys.openURL('https://metamask.app.link/dapp/84f6b991b7c0.ngrok.app/CMS/')
        }else{

        }
    }




    walletAddress = '';
    shopData;
    walletConnected = false;
    async connectWallet() {
        this.getWalletInfo()
        if (this.walletConnected) return;
        //@ts-ignore
        let result = await window.TON_SDK.connectWallet();
        if(result){
            this.getWalletInfo();
        }
    }

    disconnectWallet() {
        //@ts-ignore
        window.TON_SDK.disconnectWallet();
        this.walletAddress = "";
    }

    async sendTokenSingle(data) {
        //@ts-ignore
        let result = await window.TON_SDK.sendTokenSingle(data);
        if (result) {
            // console.log("ABCDEF__________________-")
        }
    }

    getWalletInfo() {
        //@ts-ignore
        let result = window.TON_SDK.getWalletInfo();
        if (result.currentAccount?.address) {
            this.walletConnected = true;
            this.walletAddress = result.currentAccount.address.toString();
            this.walletTon.string = this.walletAddress.slice(0, 7)+"***";
        } else {
            this.walletConnected = false;
        }
    }

    onGoHome(){
        SceneController.instance.openScene("MainScene")
    }

    // update (dt) {}
}
