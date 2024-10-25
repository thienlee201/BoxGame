const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneController extends cc.Component {
    // onLoad () {}
    static instance: SceneController;

    @property(cc.Prefab) cmsPref: cc.Prefab = null;
    start () {
        cc.game.addPersistRootNode(this.node);
        SceneController.instance = this;
    }


    openScene(sceneName: string, delay: number = 2){
        cc.director.loadScene('LoadingScene');
        this.scheduleOnce(()=>{
            cc.director.loadScene(sceneName);
        }, delay)
    }

    summitData(sceneName: string, delay: number = 2){
        cc.director.loadScene('SubmitScene');
        this.scheduleOnce(()=>{
            cc.director.loadScene(sceneName);
        }, delay)
    }

    CMS(){
        let newCMS = cc.instantiate(this.cmsPref);
        let canvas = cc.find('Canvas');
        canvas.addChild(newCMS);
        this.scheduleOnce(()=>{
            newCMS.destroy();
        },2)
    }


    // update (dt) {}
}
