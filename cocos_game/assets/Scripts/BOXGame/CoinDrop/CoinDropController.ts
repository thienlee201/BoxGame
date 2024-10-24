// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../Utilities/Utils";
import SceneController from "../SceneController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinDropController extends cc.Component {

    static instance: CoinDropController;
    @property(cc.Prefab) coinPref: cc.Prefab = null;
    @property(cc.Prefab) boomPref: cc.Prefab = null;
    @property(cc.Prefab) icePref: cc.Prefab = null;
    @property(cc.Node) initPos: cc.Node = null;
    @property(cc.Node) coinGroup: cc.Node = null;
    @property(cc.Node) IceAnim: cc.Node = null;
    @property(cc.Node) endGameAnim: cc.Node = null;
    @property(cc.Node) endGameMask: cc.Node = null;
    @property(cc.Node) submitBTN: cc.Node = null;
    @property(cc.Label) myScore: cc.Label = null;
    @property(Array(cc.Node)) listPointNode: Array<cc.Node> = Array<cc.Node>();
    @property(Array(cc.Node)) listPointFinalNode: Array<cc.Node> = Array<cc.Node>();


    dropSpeed: number = 3;
    currentState: number = 0;

    nextTimeSpawn:number = 0;
    // onLoad () {}

    arrPoint = [
        0,0,0,0,0
    ]

    start () {
        CoinDropController.instance = this;
        this.scheduleOnce(()=>{
            this.currentState = 1;
        }, 1)

        this.scheduleOnce(()=>{
            this.endGame();
        }, 40)
    }

    addPoint(index: number){
        this.arrPoint[index]++;
        for (let i = 0; i < this.listPointNode.length; i++) {
            this.listPointNode[i].getChildByName('lb').getComponent(cc.Label).string = this.arrPoint[i].toString();
        }
    }

    hitBoom(){

    }

    hitIce(){
        this.currentState = 2;
        this.IceAnim.getComponent(cc.Animation).play('IceOn')
        this.scheduleOnce(()=>{
            this.currentState=1;
            this.IceAnim.getComponent(cc.Animation).play('IceOff')
        }, 5)
    }

    endGame(){
        cc.tween(this.endGameAnim).to(4, {position: cc.v3(0, -1300)}, {easing: 'smooth'}).start();
        this.scheduleOnce(()=>{
            cc.tween(this.endGameMask).to(1.1, {anchorY: 0.5}).call(()=>{
                this.currentState = 2;
                this.coinGroup.destroy();
                this.updatePointEndGame();
            }).start();
        },1.1)
    }

    updatePointEndGame(){
        for (let i = 0; i < this.listPointFinalNode.length; i++) {
            this.scheduleOnce(()=>{
                let lb = this.listPointFinalNode[i].getChildByName('lb').getComponent(cc.Label);
                let fakeNode = new cc.Node();
                fakeNode.angle =0;
                cc.tween(fakeNode).to(0.5, {angle: this.arrPoint[i]}, {onUpdate: ()=>{
                    lb.string = "x"+ Math.floor(fakeNode.angle);
                }}).start()
            }, i*.15)
        }
        this.scheduleOnce(()=>{
            let totalScore = 
            this.arrPoint[0]*10 +
            this.arrPoint[1]*8 +
            this.arrPoint[2]*6 +
            this.arrPoint[3]*4 +
            this.arrPoint[4]*2;
            let fakeNode = new cc.Node();
                fakeNode.angle =0;
                cc.tween(fakeNode).to(2, {angle: totalScore}, {onUpdate: ()=>{
                    this.myScore.string = "Your Score: "+Math.floor(fakeNode.angle);
                }})
                .call(()=>{
                    this.submitBTN.active = true;
                })
                .start()
        }, this.listPointFinalNode.length*0.16)
    }

    update (dt) {
        if(this.currentState==1){
            if(this.nextTimeSpawn<=0){
                let newCoin;
                if(Utils.random(1,6)==5){
                    if(Utils.random(1,3)==3){
                        newCoin = cc.instantiate(this.icePref);
                    }else{
                        newCoin = cc.instantiate(this.boomPref);
                    }
                }else{
                    newCoin = cc.instantiate(this.coinPref);
                }
                this.coinGroup.addChild(newCoin);
                newCoin.setPosition(cc.v2(Utils.random(-210,210), this.initPos.y));
                this.nextTimeSpawn = Utils.random(5, 50) / 100;
            }
            this.nextTimeSpawn-=dt;
        }
    }

    onSubmit(){
        SceneController.instance.summitData("GameHubScene")
    }
}
