// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PCController extends cc.Component {

    @property(Array(cc.SpriteFrame)) listSpPC1: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();
    @property(Array(cc.SpriteFrame)) listSpPC2: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();
    @property(Array(cc.SpriteFrame)) listSpPC3: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();
    @property(Array(cc.SpriteFrame)) listSpPC4: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();


    currentLevel: number = 0;
    currentSpIndex: number = 0;

    arrSp = [
        
    ]

    mySp: cc.Sprite = null;

    // onLoad () {}

    start () {
        this.arrSp[0] = this.listSpPC1;
        this.arrSp[1] = this.listSpPC2;
        this.arrSp[2] = this.listSpPC3;
        this.arrSp[3] = this.listSpPC4;

        this.mySp = this.node.getComponent(cc.Sprite)
        this.schedule(()=>{
            try {
                this.mySp.spriteFrame = this.arrSp[this.currentLevel][this.currentSpIndex];
            } catch (error) {
                console.log(error);
            }
            this.currentSpIndex++;
            if(this.currentSpIndex>=this.arrSp[this.currentLevel].length){
                this.currentSpIndex=0;
            }
        },.5)
    }

    // update (dt) {}
}
