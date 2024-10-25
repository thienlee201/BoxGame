// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import LocalStorage from "../../Utilities/LocalStorage";
import SceneController from "../SceneController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) mainView: cc.Node = null;
    @property(cc.Node) learnView: cc.Node = null;
    @property(cc.Node) iconLesson: cc.Node = null;
    @property(cc.Node) doneBtn: cc.Node = null;
    @property(cc.Node) nextBtn: cc.Node = null;
    @property(cc.Node) pevBtn: cc.Node = null;
    @property(cc.Label) titleLesson: cc.Label = null;
    @property(cc.Label) decsLesson: cc.Label = null;
    @property(cc.JsonAsset) lessonJsonData: cc.JsonAsset = null;
    @property(Array(cc.SpriteFrame)) listSpCoin: Array<cc.SpriteFrame> = Array<cc.SpriteFrame>();


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    indexLesson: number = 0;
    currentTextIndex: number = 0;
    isBusy: boolean = true;
    start() {
    }


    showLearnView(event, customData) {
        let indexLesson = parseInt(customData)
        this.indexLesson = indexLesson;
        this.currentTextIndex = 0;
        this.decsLesson.string = ""
        this.titleLesson.string = ""
        this.iconLesson.getChildByName('sp').getComponent(cc.Sprite).spriteFrame = this.listSpCoin[this.indexLesson]
        this.iconLesson.opacity = 0;
        this.learnView.active = true;
        cc.tween(this.iconLesson).to(1.5, { opacity: 255 }).call(() => {
            this.iconLesson.getComponent(cc.Animation).play();
            this.scheduleOnce(() => {
                let titleText = this.lessonJsonData.json[indexLesson].title;
                let decTextText = this.lessonJsonData.json[indexLesson].content;
                for (let i = 0; i < titleText[0].length; i++) {
                    this.scheduleOnce(() => {
                        this.titleLesson.string = titleText[0].slice(0, i + 1);
                    }, i * 0.1)
                }
                this.scheduleOnce(() => {
                    for (let i = 0; i < decTextText[0].length; i++) {
                        this.scheduleOnce(() => {
                            this.decsLesson.string = decTextText[0].slice(0, i + 1);
                        }, i * (5 / decTextText[0].length))
                    }
                    this.scheduleOnce(() => {
                        this.isBusy = false;
                        if (decTextText.length > this.currentTextIndex + 1) {
                            this.doneBtn.active = false;
                            this.nextBtn.active = true;
                        } else {
                            this.doneBtn.active = true;
                            this.nextBtn.active = false;
                        }
                    }, 5.1)
                }, titleText[0].length * 0.11)
            }, 0.5)
        }).start()
    }

    nextText() {
        if (this.isBusy) return;
        this.isBusy = true;
        this.currentTextIndex++;
        let titleText = this.lessonJsonData.json[this.indexLesson].title;
        this.titleLesson.string = ""
        for (let i = 0; i < titleText[this.currentTextIndex].length; i++) {
            this.scheduleOnce(() => {
                this.titleLesson.string = titleText[this.currentTextIndex].slice(0, i + 1);
            }, i * 0.1)
        }
        let decTextText = this.lessonJsonData.json[this.indexLesson].content;
        for (let i = decTextText[this.currentTextIndex - 1].length - 1; i >= 0; i--) {
            this.scheduleOnce(() => {
                this.decsLesson.string = decTextText[this.currentTextIndex - 1].slice(0, i + 1);
            }, ((decTextText[this.currentTextIndex - 1].length - i) * (1 / decTextText[this.currentTextIndex - 1].length)))
        }
        this.scheduleOnce(() => {
            for (let i = 0; i < decTextText[this.currentTextIndex].length; i++) {
                this.scheduleOnce(() => {
                    this.decsLesson.string = decTextText[this.currentTextIndex].slice(0, i + 1);
                }, i * (5 / decTextText[this.currentTextIndex].length))
            }
            this.scheduleOnce(() => {
                if (decTextText.length > this.currentTextIndex + 1) {
                    this.doneBtn.active = false;
                    this.nextBtn.active = true;
                } else {
                    this.doneBtn.active = true;
                    this.nextBtn.active = false;
                }
                if (this.currentTextIndex > 0) {
                    this.pevBtn.active = true;
                } else {
                    this.pevBtn.active = false;
                }
                this.isBusy = false;
            }, 5.1)
        }, 1.1)
    }

    pevText() {
        if (this.isBusy) return;
        this.isBusy = true;
        this.currentTextIndex--;
        let titleText = this.lessonJsonData.json[this.indexLesson].title;
        this.titleLesson.string = ""
        for (let i = 0; i < titleText[this.currentTextIndex].length; i++) {
            this.scheduleOnce(() => {
                this.titleLesson.string = titleText[this.currentTextIndex].slice(0, i + 1);
            }, i * 0.1)
        }
        let decTextText = this.lessonJsonData.json[this.indexLesson].content;
        for (let i = decTextText[this.currentTextIndex + 1].length - 1; i >= 0; i--) {
            this.scheduleOnce(() => {
                this.decsLesson.string = decTextText[this.currentTextIndex + 1].slice(0, i + 1);
            }, ((decTextText[this.currentTextIndex + 1].length - i) * (1 / decTextText[this.currentTextIndex + 1].length)))
        }
        this.scheduleOnce(() => {
            for (let i = 0; i < decTextText[this.currentTextIndex].length; i++) {
                this.scheduleOnce(() => {
                    this.decsLesson.string = decTextText[this.currentTextIndex].slice(0, i + 1);
                }, i * (5 / decTextText[this.currentTextIndex].length))
            }
            this.scheduleOnce(() => {
                if (decTextText.length > this.currentTextIndex + 1) {
                    this.doneBtn.active = false;
                    this.nextBtn.active = true;
                } else {
                    this.doneBtn.active = true;
                    this.nextBtn.active = false;
                }
                if (this.currentTextIndex > 0) {
                    this.pevBtn.active = true;
                } else {
                    this.pevBtn.active = false;
                }
                this.isBusy = false;
            }, 5.1)
        }, 1.1)
    }

    comingSoon(){
        SceneController.instance.CMS();
    }

    doneLesson(){
        LocalStorage.setPlayerKnown(parseInt(LocalStorage.getPlayerKnown())+5)
        SceneController.instance.summitData("LearnScene")
    }

    onGoHome(){
        SceneController.instance.openScene("MainScene")
    }


    // update (dt) {}
}
