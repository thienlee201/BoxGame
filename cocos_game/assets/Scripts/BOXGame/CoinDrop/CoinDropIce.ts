// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../Utilities/Utils";
import CoinDropController from "./CoinDropController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinDropIce extends cc.Component {

    @property(cc.Sprite) mySp: cc.Sprite = null;
    // @property(Array(cc.SpriteFrame)) listSp: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    speedMul: number =1;
    dead: boolean = false;
    index: number = 0;
    start () {
        // this.index=Utils.random(0,this.listSp.length-1);
        // this.mySp.spriteFrame = this.listSp[this.index];
        this.speedMul = Utils.random(90,110)/100;
        this.node.once(cc.Node.EventType.TOUCH_START, this.onClicked, this);
    }

    onClicked(){
        CoinDropController.instance.hitIce();
        cc.tween(this.node).to(0.4, {opacity: 0}).call(()=>{
            this.node.destroy();
        }).start();
    }



    update (dt) {
        if(CoinDropController.instance&&CoinDropController.instance.currentState!=0){
            if(CoinDropController.instance.currentState==1 && !this.dead){
                this.node.setPosition(cc.v2(this.node.position.x, this.node.position.y- CoinDropController.instance.dropSpeed * this.speedMul));
            }
        }

        if(this.node.y<-500){
            this.node.destroy();
        }
    }
}
