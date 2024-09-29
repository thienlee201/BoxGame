// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class EditScript extends cc.Component {

    @property(Boolean) execute = false;
    @property(Number) jointFrequency = 0;
    @property(Number) gravityScale = 0;

    protected update(dt: number): void {
        if (this.execute) {
            this.execute = false;

        }
    }
}
