import SoundPlayer from "../System/SoundPlayer";

const { ccclass, property } = cc._decorator;
enum ANIM_TYPE {//chi dinh kieu anim
   NONE,
   SCALE,
   MOVE_LEFT,
   MOVE_RIGHT,
   MOVE_UP,
   MOVE_DOWN,
   MOVE_TO,
   MOVE_TO_OFFSET,
   OPACITY
}

enum EASING_TYPE {
   none,
   quadIn,
   quadOut,
   quadInOut,
   cubicIn,
   cubicOut,
   cubicInOut,
   quartIn,
   quartInOut,
   quintIn,
   quintOut,
   quintInOut,
   sineIn,
   sineOut,
   sineInOut,
   expoIn,
   expoOu,
   expoInOut,
   circIn,
   circOut,
   circInOut,
   elasticIn,
   elasticOut,
   elasticInOut,
   backIn,
   backOut,
   backInOut,
   bounceIn,
   bounceOut,
   bounceInOut,
   smooth,
   fade
}
const tween = cc.tween
@ccclass
export default class AnimationObject extends cc.Component {
   // @property
   // startScale = 0
   // @property
   // delta = 0.1
   @property({ type: cc.Enum(ANIM_TYPE) })
   anim_type: ANIM_TYPE = ANIM_TYPE.NONE

   @property({ type: cc.Enum(EASING_TYPE) })
   easing_type: EASING_TYPE = EASING_TYPE.none


   @property({ visible: function (this: AnimationObject) { return this.anim_type != ANIM_TYPE.NONE } })
   time_run: number = 0.2

   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.SCALE } })
   start_scale: number = 1
   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.SCALE } })
   delta: number = 0.1

   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.OPACITY } })
   start_opacity: number = 0

   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.OPACITY } })
   opacity_to: number = 255

   // @property({ visible: function (this: AnimationObject) { return this.anim_type != ANIM_TYPE.NONE && this.anim_type != ANIM_TYPE.SCALE } })
   // is_origin: boolean = true

   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.MOVE_TO } })
   position_to: cc.Vec2 = cc.Vec2.ZERO

   @property({ visible: function (this: AnimationObject) { return this.anim_type == ANIM_TYPE.MOVE_TO_OFFSET } })
   offset: cc.Vec2 = cc.Vec2.ZERO

   @property
   delay_at_start: number = 0

   @property
   loop: number = -1//forever

   @property
   play_on_load: boolean = true

   @property soundOnComplete = ''

   posAtStart = cc.Vec3.ZERO

   onLoad() {
      // console.log(this.name);
      // if (this.startScale == 0)
      //     this.startScale = this.node.scale

      // ///acction lặp vô tận 1 vc gìđó
      // //.repeat lap lai theo so lan
      //
      this.posAtStart = this.node.position

      // if (this.is_origin) {
      //     this.position_to = new cc.Vec2(this.node.x, this.node.y)
      // }
      if (this.play_on_load) {
         this.execute()
      }
   }

   execute() {

      switch (this.anim_type) {
         case ANIM_TYPE.NONE: {
            break
         }
         case ANIM_TYPE.SCALE: {
            this.node.scale = this.start_scale
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().to(this.time_run, { scale: this.start_scale + this.delta }, { easing: this.gEasingType() }).to(this.time_run, { scale: this.start_scale }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } if (this.loop == 1) {
               tween(this.node).delay(this.delay_at_start).to(this.time_run, { scale: this.start_scale + this.delta }, { easing: this.gEasingType() }).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().to(this.time_run, { scale: this.start_scale + this.delta }, { easing: this.gEasingType() }).to(this.time_run, { scale: this.start_scale }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break
         }
         case ANIM_TYPE.MOVE_LEFT: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ x: -cc.winSize.width }).to(this.time_run, { x: this.position_to.x }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ x: -cc.winSize.width }).to(this.time_run, { x: this.position_to.x }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.MOVE_RIGHT: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ x: cc.winSize.width }).to(this.time_run, { x: this.position_to.x }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ x: cc.winSize.width }).to(this.time_run, { x: this.position_to.x }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.MOVE_UP: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ y: cc.winSize.height }).to(this.time_run, { y: this.position_to.y }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ y: cc.winSize.height }).to(this.time_run, { y: this.position_to.y }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.MOVE_DOWN: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ y: -cc.winSize.height }).to(this.time_run, { y: this.position_to.y }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ y: -cc.winSize.height }).to(this.time_run, { y: this.position_to.y }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.MOVE_TO: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ position: this.posAtStart }).to(this.time_run, { position: this.position_to }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ position: this.posAtStart }).to(this.time_run, { position: this.position_to }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.MOVE_TO_OFFSET: {
            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ position: this.posAtStart }).to(this.time_run, { position: this.posAtStart.add(cc.v3(this.offset)) }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ position: this.posAtStart }).to(this.time_run, { position: this.posAtStart.add(cc.v3(this.offset)) }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
         case ANIM_TYPE.OPACITY: {
            this.node.opacity = this.start_opacity

            if (this.loop == -1) {
               tween(this.node).delay(this.delay_at_start).repeatForever(tween().set({ opacity: this.start_opacity }).to(this.time_run, { opacity: this.opacity_to }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            } else {
               tween(this.node).delay(this.delay_at_start).repeat(this.loop, tween().set({ opacity: this.start_opacity }).to(this.time_run, { opacity: this.opacity_to }, { easing: this.gEasingType() })).call(() => {
                  SoundPlayer.ins.play(this.soundOnComplete)
               }).start()
            }
            break;
         }
      }
   }

   gEasingType() {
      switch (this.easing_type) {
         case EASING_TYPE.none:
            return ''
            break
         case EASING_TYPE.quadIn:
            return cc.easing.quadIn;
            break
         case EASING_TYPE.quadOut:
            return cc.easing.quadOut
            break
         case EASING_TYPE.quadInOut:
            return cc.easing.quadInOut
            break
         case EASING_TYPE.cubicIn:
            return cc.easing.cubicIn
            break
         case EASING_TYPE.cubicOut:
            return cc.easing.cubicOut
            break
         case EASING_TYPE.cubicInOut:
            return cc.easing.cubicInOut
            break
         case EASING_TYPE.quartIn:
            return cc.easing.quartIn
            break
         case EASING_TYPE.quartInOut:
            return cc.easing.quartInOut
            break
         case EASING_TYPE.quintIn:
            return cc.easing.quintIn
            break
         case EASING_TYPE.quintOut:
            return cc.easing.quintOut
            break
         case EASING_TYPE.quintInOut:
            return cc.easing.quintInOut
            break
         case EASING_TYPE.sineIn:
            return cc.easing.sineIn
            break
         case EASING_TYPE.sineOut:
            return cc.easing.sineOut
            break
         case EASING_TYPE.sineInOut:
            return cc.easing.sineInOut
            break
         case EASING_TYPE.expoIn:
            return cc.easing.expoIn
            break
         case EASING_TYPE.expoOu:
            return cc.easing.expoOut
            break
         case EASING_TYPE.expoInOut:
            return cc.easing.expoInOut
            break
         case EASING_TYPE.circIn:
            return cc.easing.circIn
            break
         case EASING_TYPE.circOut:
            return cc.easing.circOut
            break
         case EASING_TYPE.circInOut:
            return cc.easing.circInOut
            break
         case EASING_TYPE.elasticIn:
            return cc.easing.elasticIn
            break
         case EASING_TYPE.elasticOut:
            return cc.easing.elasticOut
            break
         case EASING_TYPE.elasticInOut:
            return cc.easing.elasticInOut
            break
         case EASING_TYPE.backIn:
            return cc.easing.backIn
            break
         case EASING_TYPE.backOut:
            return cc.easing.backOut
            break
         case EASING_TYPE.backInOut:
            return cc.easing.backInOut
            break
         case EASING_TYPE.bounceIn:
            return cc.easing.bounceIn
            break
         case EASING_TYPE.bounceOut:
            return cc.easing.bounceOut
            break
         case EASING_TYPE.bounceInOut:
            return cc.easing.bounceInOut
            break
         case EASING_TYPE.smooth:
            return cc.easing.smooth
            break
         case EASING_TYPE.fade:
            return cc.easing.fade
            break
      }

   }
}
