const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoMovePingPong extends cc.Component {
    @property(cc.Integer)
    public offset_x: number = 0;

    @property(cc.Integer)
    public offset_y: number = 0;

    @property(cc.Integer)
    public cycle_duration: number = 0;

    @property(cc.Boolean)
    public is_start_direction_random: boolean = true;

    @property(cc.Vec2)
    public start_direction: cc.Vec2 = new cc.Vec2(0, 0)

    private _current_direction: cc.Vec2 = new cc.Vec2();
    private _start_position: cc.Vec3 = new cc.Vec3();

    protected start(): void {
        this._current_direction = this.start_direction.normalize()
        this._start_position = this.node.position;

        if (this.is_start_direction_random) {
            this._current_direction.x = (Math.round(Math.random()) == 1) ? this._current_direction.x : -this._current_direction.x
            this._current_direction.y = (Math.round(Math.random()) == 1) ? this._current_direction.y : -this._current_direction.y
        }
    }

    protected update(dt) {
        if (this.node.x < this._start_position.x - this.offset_x || this.node.x > this._start_position.x + this.offset_x)
            this._current_direction.x *= -1
        if (this.node.y < this._start_position.y - this.offset_y || this.node.y > this._start_position.y + this.offset_y)
            this._current_direction.y *= -1

        this.node.x += this.offset_x * dt / this.cycle_duration * this._current_direction.x;
        this.node.y += this.offset_y * dt / this.cycle_duration * this._current_direction.y;
    }

}