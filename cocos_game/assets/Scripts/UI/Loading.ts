const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
   lb: cc.Label = null
   protected onLoad(): void {
      this.lb = this.getComponent(cc.Label)
   }

   t = 0
   protected update(dt: number): void {
      this.t += dt * 2
      if (this.t >= 5) this.t = 0

      let s = 'Loading'
      for (let i = 1; i < Math.floor(this.t); i++) {
         s += '.'
      }
      this.lb.string = s
      // console.log(s);
   }
}
