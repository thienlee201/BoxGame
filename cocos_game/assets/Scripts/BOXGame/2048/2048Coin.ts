// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class _2048Coin extends cc.Component {

    @property(cc.Sprite) mySp: cc.Sprite = null;
    @property(Array(cc.SpriteFrame)) listSp: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();

    currentLevel: number = 0;

    // onLoad () {}

    start () {

    }

    setup(){
        this.mySp.spriteFrame = this.listSp[this.currentLevel];
        cc.tween(this.mySp.node).to(0.3, {scale: 1}).call(()=>{

        }).start();
    }

    // update (dt) {}
}
