// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GlobalVariables } from "../../../../Scripts/GlobalVariables/GlobalVariables";
import Utils from "../../../../Scripts/Utilities/Utils";
import Punk from "./Punk";
import TokenChampionController from "./TokenChampionController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayController extends cc.Component {
    static instance: PlayController;
    onLoad () {
        PlayController.instance = this;
    }
    @property(cc.Node) gameRegion: cc.Node = null;
    @property(cc.Node) listPunk: cc.Node = null;
    @property(cc.Node) listPunkEnemy: cc.Node = null;
    @property(cc.Node) Ball: cc.Node = null;
    @property(Array(cc.Prefab)) listEmoji: Array<cc.Prefab> = Array<cc.Prefab>();





    initBallPosition: cc.Vec3;
    isAllowShoot: boolean = true;
    initTouchLocation: cc.Vec2 = null;
    isAiming: boolean = false;
    currentTouchLocation: cc.Vec2 = null;
    currentDirection: number = null;
    speed: number = 1000;
    onTouch: boolean = false;
    currentPunk: Punk = null;
    currentForceMulti: number = 0;

    isPause: boolean = false;

    currentMyScore: number = 0;
    currentEnemyScore: number = 0;

    start () {
        this.gameRegion.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.gameRegion.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.gameRegion.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.initBallPosition = this.Ball.position;
        this.sortTeam();
    }

    onTouchStart(e){
        if (!this.isAllowShoot || this.isPause) return;
        this.onTouch  = true;
        this.initTouchLocation = e.getLocation();
        let tocLoc = this.node.convertToNodeSpaceAR(this.initTouchLocation);
        
        this.isAiming = true;
        for (let i = 0; i < this.listPunk.children.length; i++) {
            if(tocLoc.sub(cc.v2(this.listPunk.children[i].position.x, this.listPunk.children[i].position.y)).len() < this.listPunk.children[i].width){
                this.currentPunk = this.listPunk.children[i].getComponent(Punk);
                this.currentPunk.thisSelected.active = true;
                break;
            }
        }
    }
    onTouchMove(e){
        if(!this.currentPunk || this.isPause) return;
        this.currentTouchLocation = e.getLocation();
        let Vec_dir = new cc.Vec2(this.initTouchLocation.x - this.currentTouchLocation.x, this.initTouchLocation.y - this.currentTouchLocation.y);
        let dir = Utils.Vec2ToAngle(Vec_dir) - 90;
        this.currentForceMulti = (((Vec_dir.len() > 50)? 50 :Vec_dir.len())  / 50)
        this.currentPunk.thisArrow.setScale(this.currentForceMulti);
        this.currentPunk.thisForce.setScale(this.currentForceMulti + 1);
        this.currentDirection = dir; 
        this.currentPunk.thisArrow.angle  = dir;
    }
    onTouchEnd(e){
        if(!this.currentPunk || this.isPause) return;
        this.currentPunk.thisArrow.setScale(0);
        this.currentPunk.thisForce.setScale(1);
        this.currentPunk.thisSelected.active = false;
        this.onTouch  = false;
        this.initTouchLocation = null;
        this.isAiming = false;
        this.shotPunk();
        this.currentPunk = null;
    }

    shotPunk() {
        if(this.isPause) return;

        this.isAllowShoot = false;
        let euler = this.currentDirection + 90;
        let rigidbody = this.currentPunk.node.getComponent(cc.RigidBody);
        rigidbody.type = cc.RigidBodyType.Dynamic;
        this.currentPunk.triggerFirstTime = true;
        rigidbody.linearVelocity = (new cc.Vec2(
            Math.cos((euler) * Math.PI / 180) * this.speed * this.currentForceMulti,
            Math.sin((euler) * Math.PI / 180) * this.speed  * this.currentForceMulti));
        this.currentDirection = null;
        this.initTouchLocation = null;
        this.currentDirection = null;
        this.currentPunk = null;
        this.currentForceMulti = 0;
        this.scheduleOnce(()=>{
            this.enemyTurn();
        }, 0.5);
    }
    enemyTurn(){

        if(this.isPause) return;
        let randomAPunk = Utils.random(0, this.listPunkEnemy.children.length-1);
        let currentEnemySelectedPunk = this.listPunkEnemy.children[randomAPunk].getComponent(Punk);
        currentEnemySelectedPunk.thisSelected.active = true;
        let Vec_dir = new cc.Vec2(
            this.Ball.position.x - currentEnemySelectedPunk.node.position.x,
            this.Ball.position.y - currentEnemySelectedPunk.node.position.y);
        let dir = Utils.Vec2ToAngle(Vec_dir) - 90;
        let fakeDir1 = dir + Utils.random(-50, 50);
        let fakeDir2 = dir + Utils.random(-30, 30);
        let randomForce = Utils.random(4, 10) / 10;
        let fakeForce = Utils.random(4, 10) / 10;
        currentEnemySelectedPunk.thisArrow.angle = dir;
        cc.tween(currentEnemySelectedPunk.thisForce).to(2, {scale: 1 + randomForce}).call(()=>{
            let rigidbody = currentEnemySelectedPunk.node.getComponent(cc.RigidBody);
            currentEnemySelectedPunk.triggerFirstTime = true;
            rigidbody.type = cc.RigidBodyType.Dynamic;
            rigidbody.linearVelocity = (new cc.Vec2(
                Math.cos((dir +90) * Math.PI / 180) * this.speed * randomForce,
                Math.sin((dir +90) * Math.PI / 180) * this.speed  * randomForce));
            this.scheduleOnce(()=>{
                this.isAllowShoot = true;
            }, 0.5)
            currentEnemySelectedPunk.thisForce.setScale(1);
            currentEnemySelectedPunk.thisSelected.active = false;
        }).start();
        cc.tween(currentEnemySelectedPunk.thisArrow).to(1.2, {scale: fakeForce}).call(()=>{
            cc.tween(currentEnemySelectedPunk.thisArrow).to(0.8, {scale: randomForce}).call(()=>{
                currentEnemySelectedPunk.thisArrow.setScale(0);
            }).start();
        }).start();
        cc.tween(currentEnemySelectedPunk.thisArrow).to(0.6, {angle: fakeDir1}).call(()=>{
            cc.tween(currentEnemySelectedPunk.thisArrow).to(0.4, {angle: fakeDir2}).call(()=>{
                cc.tween(currentEnemySelectedPunk.thisArrow).to(1, {angle: dir}).call(()=>{
                    currentEnemySelectedPunk.thisArrow.setScale(0);
                }).start();
            }).start();
        }).start();
        

        
        // this.currentDirection = null;
        // this.initTouchLocation = null;
        // this.currentDirection = null;
        // this.currentPunk = null;
        // this.currentForceMulti = 0;
    }

    sortTeam(){
        let canvas = cc.find("Canvas");
        this.listPunk.children.map((children, index)=>{
            let pos = GlobalVariables.coatInfo.offensive[0][index];
            children.setScale(0);
            children.setPosition(cc.v2((pos[0] * 0.5 - canvas.position.x * 0.6) , (pos[1] * 0.5- canvas.position.y * 0.7) ))
            this.scheduleOnce(()=>{
                cc.tween(children).to(1, {scale: 1}, {easing: cc.easing.backInOut}).start();
            }, index * 0.1)
        })
        this.listPunkEnemy.children.map((children, index)=>{
            let pos = GlobalVariables.coatInfo.defensive[0][index];
            children.setScale(0);
            children.setPosition(cc.v2((pos[0] * 0.5 - canvas.position.x * 0.6) , (pos[1] * 0.5- canvas.position.y * 0.55) * -1))
            this.scheduleOnce(()=>{
                cc.tween(children).to(1, {scale: 1}, {easing: cc.easing.backInOut}).start();
            }, index * 0.1)
        })
        this.Ball.setPosition(this.initBallPosition);
        this.scheduleOnce(()=>{
            this.isAllowShoot = true;
            this.isPause = false;
        })
    }


    myGoat(){
        if(this.isPause) return;
        this.currentMyScore+=1;
        if(this.currentMyScore >=3){
            this.showResultView();
        }
        TokenChampionController.instance.myScore.string = this.currentMyScore.toString();
        this.isPause = true;
        TokenChampionController.instance.goal.getComponent(cc.Animation).play("GoalBlue");
        this.isAllowShoot = false;
        this.isPause = true;
        this.scheduleOnce(()=>{
            this.sortTeam();
            return;
        }, 2)
    }

    enemyGoat(){
        if(this.isPause) return;
        this.currentEnemyScore+=1;
        if(this.currentEnemyScore >=3){
            this.showResultView();
            return;
        }
        TokenChampionController.instance.enemyScore.string = this.currentEnemyScore.toString();
        this.isPause = true;
        TokenChampionController.instance.goal.getComponent(cc.Animation).play("GoalRed");
        this.isAllowShoot = false;
        this.isPause = true;
        this.scheduleOnce(()=>{
            this.sortTeam();
        }, 2)
    }

    showResultView(){
        if(this.currentEnemyScore > this.currentMyScore){
            let resultView = TokenChampionController.instance.resultView;
            resultView.active = true;
            let content = resultView.getChildByName("Lose");
            content.setScale(0);
            content.active  = true;
            cc.tween(content).to(0.5, {scale: 1}).start();
        }else{
            let resultView = TokenChampionController.instance.resultView;
            resultView.active = true;
            let content = resultView.getChildByName("Win");
            content.setScale(0);
            content.active  = true;
            cc.tween(content).to(0.5, {scale: 1}).start();
        }
    }

    // update (dt) {}
}
