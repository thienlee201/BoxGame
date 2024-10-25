// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SplashController extends cc.Component {

    @property(cc.Node) logo: cc.Node = null;
    @property(cc.Node) anim: cc.Node = null;


    start () {
        cc.tween(this.logo).to(3, {scale: 1.1,opacity: 255}, {easing: 'smooth'}).call(()=>{
            this.anim.getComponent(cc.Animation).play();
            this.scheduleOnce(()=>{
                cc.director.loadScene("MainScene");
            }, 3)
        }).start()
    }



    // update (dt) {}
}
