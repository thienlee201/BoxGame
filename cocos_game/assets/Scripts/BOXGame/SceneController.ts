const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneController extends cc.Component {
    // onLoad () {}
    static instance: SceneController;

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


    // update (dt) {}
}
