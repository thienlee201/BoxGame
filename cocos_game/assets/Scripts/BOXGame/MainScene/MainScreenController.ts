// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import SceneController from "../SceneController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScreenController extends cc.Component {

    @property(cc.Node) pcView: cc.Node = null;
    @property(cc.Node) backBTN: cc.Node = null;
    @property(cc.Node) goBTN: cc.Node = null;
    @property(cc.Node) hint1: cc.Node = null;
    @property(cc.Label) pcViewTitle: cc.Label = null;
    @property(cc.Label) pcViewDecs: cc.Label = null;
    @property(cc.JsonAsset) lessonJsonData: cc.JsonAsset = null;


    pcScreenActive: boolean = false;
    currentIndexSelection: number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.pcView.opacity = 0;
        this.backBTN.opacity = 0;
        this.goBTN.opacity = 0;
    }


    showPCView() {
        if (this.pcScreenActive) return;
        this.hint1.active = false;
        this.pcScreenActive = true;
        this.pcViewTitle.string = "";
        this.pcViewDecs.string = "";
        this.currentIndexSelection = 0;
        cc.tween(this.pcView).to(1, { position: cc.v3(0, 0), opacity: 255 })
            .call(() => {
                cc.tween(this.backBTN).to(1, { opacity: 255 })
                    .start()
            })
            .start()
    }

    hidePCView() {
        cc.tween(this.pcView).to(1, { position: cc.v3(0, -600), opacity: 0 })
            .call(() => {
                this.backBTN.opacity = 0;
                this.goBTN.opacity = 0;
                this.pcScreenActive = false;
                this.hint1.active = true;
            })
            .start()
    }

    onSelectMode(event, customData) {
        if (this.goBTN.opacity == 0) {
            cc.tween(this.goBTN).to(0.5, { opacity: 255 })
                .start()
        }

        let index = parseInt(customData);
        this.currentIndexSelection = index;
        this.pcViewTitle.string = "";
        this.pcViewDecs.string = "";
        let titleText = this.lessonJsonData.json[index].title;
        let decTextText = this.lessonJsonData.json[index].content;
        for (let i = 0; i < titleText.length; i++) {
            this.scheduleOnce(() => {
                this.pcViewTitle.string = titleText.slice(0, i + 1);
            }, i * 0.1)
        }
        for (let i = 0; i < decTextText.length; i++) {
            this.scheduleOnce(() => {
                this.pcViewDecs.string = decTextText.slice(0, i + 1);
            }, i * 0.05)
        }
    }

    onGo() {
        switch (this.currentIndexSelection) {
            case 0:
                SceneController.instance.openScene("GameHubScene")
                break;
            case 1:
                SceneController.instance.openScene("LearnScene")
                break;
            case 2:
                // SceneController.instance.openScene("GameHubScene")
                break;
            case 3:
                // SceneController.instance.openScene("GameHubScene")
                break;
            default:
                break;
        }
    }

    // update (dt) {}
}
