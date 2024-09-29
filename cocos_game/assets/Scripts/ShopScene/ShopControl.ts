// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopControl extends cc.Component {
    @property(cc.Label) label: cc.Label = null;
    @property(cc.Node) grid: cc.Node = null;

    currentWallet = '';
    shopData;
    walletConnected = false;
    connectWallet() {
        this.getWalletInfo()
        if (this.walletConnected) return;
        //@ts-ignore
        let result = window.TON_SDK.connectWallet();
    }

    disconnectWallet() {
        //@ts-ignore
        window.TON_SDK.disconnectWallet();
        this.currentWallet = "";
    }

    async sendTokenSingle(data) {
        //@ts-ignore
        let result = await window.TON_SDK.sendTokenSingle(data.address, data.amount, data.payload);
        if (result) {
        } else {
        }
    }

    getWalletInfo() {
        //@ts-ignore
        let result = window.TON_SDK.getWalletInfo();
        if (result.currentAccount?.publicKey) {
            this.walletConnected = true;
            this.currentWallet = result.currentAccount.publicKey.toString();
            this.label.string =
                result.currentAccount.publicKey.toString().slice(0, 4)
                + "...."
                + result.currentAccount.publicKey.toString().slice(-4, -0);
        } else {
            this.walletConnected = false;
            this.label.string = "Connect Wallet"
        }
    }



    protected onEnable(): void {
        // this.scheduleOnce(()=>{
        //     this.getWalletInfo();
        // }, 3)

        // window.callGameUpdateWallet = this.getWalletInfo();
    }

    async fetchPaymentData(index, userId) {
        this.progressHandle("http://localhost:3214/buyOrder", "POST", (data) => {
            this.sendTokenSingle(data)
        }, { orderID: index, userID: userId })
    }

    async verifyPaymentData(_data) {
        this.progressHandle("http://localhost:3214/verify", "POST", (data_) => {

        }, { data: _data })
    }

    fetchShopData() {
        this.progressHandle("http://localhost:3214/fetchShopData", "GET", (data) => {
            this.loadShopData(data);
        })
    }

    loadShopData(data) {
        this.grid.children.map((child, index) => {
            child.getChildByName('buyBtn').getChildByName('lb').getComponent(cc.Label).string = data.data[index].info;
        })
    }


    async progressHandle(url, method = "POST", onComplete = null, param = null) {
        console.log(url, method, onComplete, param)
        try {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    let data = null
                    try {
                        data = JSON.parse(xhr.responseText)
                    } catch (e) {
                        console.log("Err :", e)
                    }
                    if (onComplete)
                        onComplete(data)
                }
            });

            xhr.open(method, url, true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

            xhr.timeout = 10000
            console.log("param: ", param)
            if (param != null) {
                xhr.send(JSON.stringify(param));
            } else
                xhr.send();
            xhr.onerror = () => {
                console.log("On onerror: ")
            }
            xhr.ontimeout = () => {
                console.log("On ontimeout: ")
            }
        } catch (e) {
            console.log("On trycatch: ", e)
        }
    }


    onClickBuyItem(event, customData) {
        if (!this.currentWallet) {
            this.connectWallet();
            return;
        }
        let index = parseInt(customData);
        this.fetchPaymentData(index, this.currentWallet)
    }
}
