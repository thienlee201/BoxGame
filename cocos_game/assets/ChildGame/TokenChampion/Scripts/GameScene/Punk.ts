// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../Utilities/Utils";
import PlayController from "./PlayController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Punk extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    @property(cc.Node) gameRegion: cc.Node = null;

    thisForce: cc.Node = null;
    thisSprite: cc.Node = null;
    thisSelected: cc.Node = null;
    thisArrow: cc.Node = null;
    triggerFirstTime: boolean = false;
    
    start () {
        this.thisForce = this.node.getChildByName("force");
        this.thisSprite = this.node.getChildByName("sprite");
        this.thisSelected = this.node.getChildByName("selected");
        this.thisArrow = this.node.getChildByName("arrow");

    }

    onBeginContact(contact, self, other){
        if(other.tag == 4 || other.tag == 1){
            if(other.tag != self.tag && this.triggerFirstTime == true){
                this.triggerFirstTime = false;
                let em = cc.instantiate(PlayController.instance.listEmoji[0]);
                // em.setScale(0);
                em.setPosition(cc.v2(0,30))
                em.parent = other.node;
                console.log(em);
                
                cc.tween(em).to(0.2, {scale: 1}).start();
                this.scheduleOnce(()=>{
                    em.destroy();
                }, 2);
            }
        }
        if(other.tag == 4 || other.tag == 1){
            this.triggerFirstTime = false;
        }
    }



}
