// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PlayController from "./PlayController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }


    onBeginContact(contact, self, other){
        if(other.tag == 7 ){
            console.log("");
            
            PlayController.instance.enemyGoat();
        }
        if(other.tag == 8){
            PlayController.instance.myGoat();
        }
    }
    // update (dt) {}
}
