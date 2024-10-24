// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../../../Scripts/Utilities/Utils";
import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SimpleFish extends cc.Component {


    @property(cc.Float) speed: number = 0;

    firstMove: boolean = true;
    currentDir: number = 1;
    currentRange: number = 0;
    catch: boolean = false;
    // onLoad () {}

    start () {
        this.currentDir = Utils.random(1, 2) == 1? 1 : -1;
        this.currentRange = Utils.random(200, 400);
        this.speed = this.speed * (Utils.random(8, 12) * 0.1);
        this.simpleMove();
    }

    simpleMove(){
        if(this.catch) return;
        if(this.node.position.x>0){
            this.node.scaleX = 1;
        }else{
            this.node.scaleX = -1;
        }
        let duration = ((this.currentRange - Math.abs(this.node.position.x)) / this.currentRange) * this.speed;
        cc.tween(this.node)
        .to(this.speed, {position: cc.v3(this.currentDir * this.currentRange, this.node.position.y)})
        .union()
        .call(()=>{
            this.firstMove = false;
            this.currentDir = this.currentDir * -1;
            this.simpleMove();
        })
        .start()
    }


    onCollisionEnter(other, self){
        if(other.tag == 2 && GameController.instance.mcFull == false){
            cc.Tween.stopAllByTarget(this.node);
            this.node.parent = other.node;
            this.catch = true;
            if(this.node.position.x > 0){
                this.node.angle = this.node.scaleX < 0? 85 : -85;
            }else{
                this.node.angle = this.node.scaleX < 0? 105 : -105;
            }
            this.shake(this.node.angle);
            this.node.position = cc.v3(0,0,0);
            if(!GameController.instance.strongMc){
                GameController.instance.mcFull = true;
            }
        }
    }

    shake(myAngle){
        cc.tween(this.node)
        .to(0.1, {angle: myAngle + Utils.random(-15, 15)})
        .union()
        .call(()=>{
            this.shake(myAngle);
        })
        .start();
    }

    // update (dt) {}
}
