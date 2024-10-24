// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import SceneController from "../SceneController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameHubController extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onSelectGame(event, customData) {
        let index = parseInt(customData)
        switch (index) {
            case 0:
                SceneController.instance.openScene("CoinDrop", 1)
                break;
            case 1:
                SceneController.instance.openScene("FishOrBit", 1)
                break;
            case 2:
                SceneController.instance.openScene("TokenChampionScene", 1)
                break;
            default:
                break;
        }
    }

    onGoHome() {
        SceneController.instance.openScene("MainScene")
    }

    // update (dt) {}
}
