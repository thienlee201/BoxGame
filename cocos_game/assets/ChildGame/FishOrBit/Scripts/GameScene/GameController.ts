// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import SceneController from "../../../../Scripts/BOXGame/SceneController";
import LocalStorage from "../../../../Scripts/Utilities/LocalStorage";
import Utils from "../../../../Scripts/Utilities/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    static instance: GameController;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node) homeScene: cc.Node = null;
    @property(cc.Node) gameScene: cc.Node = null;
    @property(cc.Node) gameOverScene: cc.Node = null;
    @property(cc.Node) blackView: cc.Node = null;
    @property(cc.Node) mc: cc.Node = null;
    @property(cc.Node) mcHead: cc.Node = null;
    @property(cc.Node) gameRegion: cc.Node = null;
    @property(cc.Graphics) graphics: cc.Graphics = null;
    @property(cc.Label) scoreInfo: cc.Label = null;
    @property(cc.Label) highScoreInfo: cc.Label = null;

    @property(cc.Node) spawner1: cc.Node = null;
    @property(cc.Node) spawner2: cc.Node = null;
    @property(cc.Node) spawner3: cc.Node = null;
    @property(cc.Node) spawner4: cc.Node = null;
    @property(cc.Node) fishLayer: cc.Node = null;
    @property(cc.Sprite) energyProgress: cc.Sprite = null;
    @property(cc.Sprite) timeProgress: cc.Sprite = null;
    @property(cc.Label) fishCatchInfo: cc.Label = null;
    @property(cc.Camera) cam: cc.Camera = null;


    fishCatch: number = 0;



    catching: boolean = false;
    mcHit: boolean = false;
    mcFull: boolean = false;
    @property(Array(cc.Prefab)) listFishPref: Array<cc.Prefab> = Array<cc.Prefab>();
    initMcPos: cc.Vec3;
    currentScore: number = 0;
    timeLimit: number = 60;
    currentTime: number = 60;
    energyLimit: number = 30;
    currentEnergy: number = 0;
    strongMc: boolean = false;
    isGameOver: boolean = false;
    onLoad() {
        GameController.instance = this;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.initMcPos = this.mc.position;
        this.gameRegion.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this)
        this.currentTime = this.timeLimit;
    }

    start() {
        // this.updateSound();
        for (let i = 0; i < 25; i++) {
            if(i>10){
                this.spawnFish(true);
            }else{
                this.spawnFish();
            }
        }

        this.schedule(this.spawnTimeFish, 10);


        this.schedule(()=>{
            if(this.isGameOver) return;
            this.currentTime -=1;
            if(this.currentTime < 1){
                this.currentTime = 0;
                this.showOverView();
            }
            this.updateTime();
        }, 1);
    }   

    update(dt){
        this.drawLine();
        this.afterCatch();
    }

    updateTime(){
        this.timeProgress.fillRange =  this.currentTime /this.timeLimit;
    }

    spawnFish(hard?){
        let f = cc.instantiate(this.listFishPref[hard? Utils.random(4, this.listFishPref.length-1):Utils.random(0, 3)]);
        this.fishLayer.addChild(f);
        f.setPosition(cc.v3(
            Utils.random(0, 1) == 1? this.spawner1.position.x: this.spawner2.position.x,
            hard? Utils.random(this.spawner3.position.y, this.spawner4.position.y):Utils.random(this.spawner1.position.y, this.spawner2.position.y),
            0
        ))
    }

    spawnTimeFish(){
        let f = cc.instantiate(this.listFishPref[4]);
        this.fishLayer.addChild(f);
        f.setPosition(cc.v3(
            Utils.random(0, 1) == 1? this.spawner1.position.x: this.spawner2.position.x,
            Utils.random(this.spawner1.position.y, this.spawner2.position.y),
            0
        ))
    }



    afterCatch(){
        if(this.catching){
            if(this.mc.position.sub(this.mcHead.position).len() <= 100){
                let rigid = this.mc.getComponent(cc.RigidBody);
                rigid.gravityScale = 1;
                rigid.linearVelocity = cc.v2(0,0);
                this.mc.setPosition(this.initMcPos);
                this.mcHead.getComponent(cc.RopeJoint).enabled = true;
                if(this.mcFull){
                    this.spawnFish();
                }
                this.force = 200;
                this.strongMc = false;
                this.catching = false;
                this.mcHit = false;
                this.mcFull = false;
                this.calcPoint();
            }
        }
    }

    updateFishCatchInfo(){
        this.fishCatchInfo.string = this.currentScore.toString();
    }

    updateEnergyInfo(){
        let e = (this.currentEnergy / this.energyLimit);
        if(e >=1){
            this.strongMc = true;
            this.force = 300;
            this.cam.node.children[0].active = true;
        }
        this.energyProgress.fillRange = e > 1? 1: e;
    }

    calcPoint(){
        if(this.mc.children.length>0){
            // SoundPlayer.instance.play("coin4");
        }else{
            // SoundPlayer.instance.play("error");
        }
        if(this.mc.children.length>0){
            this.mc.children.map((fish)=>{
                if(!isNaN(parseInt(fish.name))){
                    if(parseInt(fish.name) == 5){
                        this.currentTime +=10;
                    }
                    if(this.mc.children.length == 1){
                        this.currentEnergy += parseInt(fish.name);
                        this.updateEnergyInfo();
                    }
                    this.currentScore += parseInt(fish.name);
                    this.fishCatch+=1;
                    this.updateFishCatchInfo();
                }
            })
            this.mc.removeAllChildren();
        }
    }

    cameraCineme(){
        if(this.mcHit) return;
        // SoundPlayer.instance.play("shootandfish_sfx_powerhook_02");
        this.currentEnergy = 0;
        let fakeNode =  new cc.Node();
        fakeNode.angle = 1;
        cc.tween(fakeNode).to(1, {angle: 0.6}, {onUpdate: ()=>{
            this.cam.zoomRatio = fakeNode.angle;
        }}).start()
        cc.tween(this.cam.node).by(1, {position: cc.v3(0, -833)}).call(()=>{
            this.energyProgress.fillRange = 0;
        }).start();
    }


    force: number = 200;
    onTouchStart(){
        if(this.catching) return;
        this.mcHead.getComponent(cc.RopeJoint).enabled = false;
        this.catching = true;
        let rigid = this.mc.getComponent(cc.RigidBody);
        rigid.gravityScale = 0;
        console.log(cc.v3(0,0).angle(this.mcHead.position.sub(this.mc.position)) * 180 / Math.PI);
        
        rigid.linearVelocity = cc.v2(
            Math.cos(cc.v3(1,0).angle(this.mcHead.position.sub(this.mc.position))) * this.force * -1,
            Math.sin(cc.v3(1,0).angle(this.mcHead.position.sub(this.mc.position))) * this.force * -1
        );
    }

    mcBack(){
        if(this.mcHit || this.strongMc) return;
        this.mcHit = true;
        let rigid = this.mc.getComponent(cc.RigidBody);
        rigid.linearVelocity = rigid.linearVelocity.negSelf();
    }

    strongBack(){
        this.mcHit = true;
        let rigid = this.mc.getComponent(cc.RigidBody);
        rigid.linearVelocity = rigid.linearVelocity.negSelf();
        this.scheduleOnce(()=>{
            let fakeNode =  new cc.Node();
            fakeNode.angle = 0.6;
            cc.tween(fakeNode).to(2, {angle: 1}, {onUpdate: ()=>{
                this.cam.zoomRatio = fakeNode.angle;
            }}).start()
            cc.tween(this.cam.node).by(2, {position: cc.v3(0, +833)}).call(()=>{
                this.cam.node.children[0].active = false;
            }).start();
        }, 1.5);
    }

    drawLine(){
        this.graphics.clear();
        this.graphics.moveTo(this.mcHead.position.x, this.mcHead.position.y);
        this.graphics.lineTo(this.mc.position.x, this.mc.position.y);
        this.graphics.stroke();
    }


    onClickPlay(){
        cc.tween(this.blackView).to(0.5, {opacity: 255})
        .call(()=>{
            this.homeScene.active = false;
            this.gameScene.active = true;
            cc.tween(this.blackView).to(1, {opacity: 0})
            .call(()=>{

            })
            .start();
        })
        .start();
    }


    prepareGame(){
       
    }



    onClickClaimAndGoHome() {

    }

    onClickGoHome() {
        cc.tween(this.blackView).to(1, {opacity: 255})
        .call(()=>{
            SceneController.instance.summitData("GameHubScene")
        })
        .start();
    }


    showOverView(){
        if (this.gameOverScene.active == true) return;
        this.scoreInfo.string = this.currentScore.toString();
        if(LocalStorage.getHighScore() < this.currentScore){
            LocalStorage.setHighScore(this.currentScore);
            // SoundPlayer.instance.play("newhighscore");
        }
        this.highScoreInfo.string = "Best: " + LocalStorage.getHighScore().toString();
        this.isGameOver = true;
        this.gameOverScene.setScale(0);
        this.gameOverScene.active = true;
        cc.tween(this.gameOverScene).to(0.25, { scale: 1 }).start();
    }
}
