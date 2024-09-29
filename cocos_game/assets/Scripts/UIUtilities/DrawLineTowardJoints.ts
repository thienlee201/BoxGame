// const { ccclass, property } = cc._decorator;

// @ccclass
// export default class DrawLineTowardJoints extends cc.Component {

//     @property(cc.Node) exclude: cc.Node = null;
//     targets: Array<cc.Node> = new Array<cc.Node>;

//     onLoad() {

//         var joinComponents = this.getComponents(cc.Joint);

//         joinComponents.forEach(element => {
//             if (element.connectedBody.node != this.exclude && this.exclude != null)
//                 this.targets.push(element.connectedBody.node);
//             else if (this.exclude == null)
//                 this.targets.push(element.connectedBody.node);
//         });
//     }

//     protected update(dt: number): void {
//         this.targets.forEach(target => {
//             var a = cc.v2(this.node.position);
//             var b = cc.v2(target.position);

//             if (target.parent != this.node.parent) {
//                 b = cc.v2(this.node.parent.convertToNodeSpaceAR(target.convertToWorldSpaceAR(cc.Vec2.ZERO)));
//             }

//         });
//     }
// }
