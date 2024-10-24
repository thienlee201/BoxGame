// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DeadFish extends cc.Component {


    @property(cc.Float) speed: number = 0;

    firstMove: boolean = true;
    currentDir: number = 1;
    currentRange: number = 0;
    catch: boolean = false;
    // onLoad () {}

    start () {
        this.currentDir = 1;
        this.currentRange = 200;
        this.speed = this.speed;
        this.simpleMove();
    }

    simpleMove(){
        if(this.catch) return;
        if(this.currentDir>0){
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
        if(other.tag == 3){
            if(GameController.instance.strongMc) return;
            let otherNode = other.node;
            if(otherNode){
                // SoundPlayer.instance.play("eating");
                
                cc.Tween.stopAllByTarget(otherNode);
                otherNode.parent = this.node.parent;
                otherNode.angle = 0;
                otherNode.getComponent(cc.Sprite).enabled = false;
                otherNode.getChildByName("bone").active = true;
                otherNode.getComponent(cc.BoxCollider).destroy();
                cc.tween(otherNode).by(1, {position: cc.v3(0, -50), opacity: 20}).call(()=>{
                    otherNode.destroy();
                }).start()
            }
        }
    }

    // update (dt) {}
}
