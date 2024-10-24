// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import GameController from "./GameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mc extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}


    onCollisionEnter(other, self){
        if(other.tag == 2){
           
        }
        if(other.tag == 8 && GameController.instance.strongMc){
            GameController.instance.cameraCineme();
        }
        if(other.tag == 9){
            GameController.instance.strongBack();
        }
        GameController.instance.mcBack();
    }
}
