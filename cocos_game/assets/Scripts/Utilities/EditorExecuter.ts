const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class EditorExecuter extends cc.Component {
    @property execute = false
    @property(cc.Node) target: cc.Node = null
    onLoad() {
        console.log(this.getComponentsInChildren(cc.Button));

        // this.onExecute()
    }
    update(dt) {
        if (this.execute) {
            this.execute = false
            this.onExecute()
        }
    }

    onExecute() {
        console.log(this.getComponent(cc.Button));
        Editor.log(this.getComponent(cc.Button));

        let btns = this.getComponentsInChildren(cc.Button)

        btns.forEach(b => {
            b.enabled = true
            b.interactable = true
            b.clickEvents = []
            if (b.clickEvents.length < 1) b.clickEvents.push(new cc.Component.EventHandler())
            b.clickEvents[0].target = this.target
            b.clickEvents[0].component = ""
            //@ts-ignore
            b.clickEvents[0]._componentId = "34388tCprxKjJOE10HiBneE"
            //@ts-ignore
            b.clickEvents[0]._componentName = "ShopController"
            b.clickEvents[0].handler = "onClickNone"
        });

        this.destroy()
    }
}
