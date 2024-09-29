// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../Utilities/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinDropController extends cc.Component {

    static instance: CoinDropController;
    @property(cc.Prefab) coinPref: cc.Prefab = null;
    @property(cc.Node) initPos: cc.Node = null;
    @property(cc.Node) coinGroup: cc.Node = null;
    @property(Array(cc.Node)) listPointNode: Array<cc.Node> = Array<cc.Node>();


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
    }

    addPoint(index: number){
        this.arrPoint[index]++;
        for (let i = 0; i < this.listPointNode.length; i++) {
            this.listPointNode[i].getChildByName('lb').getComponent(cc.Label).string = this.arrPoint[i].toString();
        }
    }

    update (dt) {
        if(this.currentState==1){
            if(this.nextTimeSpawn<=0){
                let newCoin = cc.instantiate(this.coinPref);
                this.coinGroup.addChild(newCoin);
                newCoin.setPosition(cc.v2(Utils.random(-210,210), this.initPos.y));
                this.nextTimeSpawn = Utils.random(5, 50) / 100;
            }
            this.nextTimeSpawn-=dt;
        }
    }
}
