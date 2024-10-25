// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import SceneController from "../../../../Scripts/BOXGame/SceneController";
import LocalStorage from "../../../../Scripts/Utilities/LocalStorage";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TokenChampionController extends cc.Component {

    static instance: TokenChampionController;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node) goal: cc.Node = null;
    @property(cc.Label) myScore: cc.Label = null;
    @property(cc.Label) enemyScore: cc.Label = null;
    @property(cc.Node) resultView: cc.Node = null;
    // @property(cc.Node) audioBtn: cc.Node = null;
    // @property(cc.Node) musicBtn: cc.Node = null;
    // @property(cc.Node) pauseView: cc.Node = null;


    currentSelectedStadium: number = 0;

    colorActive: cc.Color = new cc.Color().fromHEX("#FFFFFF");
    colorInActive: cc.Color = new cc.Color().fromHEX("#7B7B7B");


    onLoad () {
        TokenChampionController.instance = this;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start () {
        this.updateSound();
    }
    onClickClaimAndGoHome(){
        LocalStorage.setPlayerPower(parseInt(LocalStorage.getPlayerPower())+(parseInt(this.myScore.string)*20))
        SceneController.instance.summitData("GameHubScene")
    }

    onClickGoHome(){
        SceneController.instance.openScene("GameHubScene")
    }

    turnAudio(){
        LocalStorage.setAudio(!LocalStorage.getAudio())
        this.updateSound();
    }

    turnMusic(){
        LocalStorage.setMusic(!LocalStorage.getMusic())
        this.updateSound();
    }

    updateSound(){
        // if(LocalStorage.getAudio()){
        //     this.audioBtn.color = this.colorActive;
        // }else{
        //     this.audioBtn.color = this.colorInActive;
        // }

        // if(LocalStorage.getMusic()){
        //     this.musicBtn.color = this.colorActive;
        // }else{
        //     this.musicBtn.color = this.colorInActive;
        // }
    }

    // showPauseView(){
    //     if(this.pauseView.active == true) return;
    //     this.pauseView.setScale(0);
    //     this.pauseView.active = true;
    //     cc.tween(this.pauseView).to(0.25, {scale: 1}).start();

    // }
    // hidePauseView(){
    //     if(this.pauseView.active == false) return;
    //     cc.tween(this.pauseView).to(0.25, {scale: 0}).call(()=>{
    //         this.pauseView.active = false;
    //         this.pauseView.setScale(1);
    //     }).start();
    // }


    // update (dt) {}
}
