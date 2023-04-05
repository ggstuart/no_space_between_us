import Spiral from "./spiral.js";
// import Satellite from "./satellite.js";
// import {Seeker as Satellite} from "./seeker.js";

export class Scene{
    constructor(ctx1, ctx2) {
        ctx1.fillStyle = "white";
        ctx2.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx1.strokeStyle = "white";
        ctx2.strokeStyle = "white";
        this.ctx = ctx1;
        this.paper = ctx2;
        this.spirals = Array.from([this.topLeft, this.topMiddle, this.topRight], (loc) => {
            return new Spiral(loc, (Math.random() - 0.5) * 0.1, 100, 0.995, 35, 6)
        });
    }

    get width() {
        return this.ctx.canvas.width;
    }
    get height() {
        return this.ctx.canvas.height;
    }

    randomLocation() {
        return {
            x: this.width * Math.random(),
            y: this.height * Math.random()
        }
    }
    get center() {
        return {
            x: this.width / 2,
            y: this.height / 2
        }
    }
    get topMiddle() {
        return {
            x: this.width / 2,
            y: this.height / 6
        }
    }
    get topLeft() {
        return {
            x: this.width / 5,
            y: this.height / 6
        }
    }
    get topRight() {
        return {
            x: 4 * this.width / 5,
            y: this.height / 6
        }
    }

    update(elapsed) {
        for(const spiral of this.spirals) {
            spiral.update(elapsed);
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for(const spiral of this.spirals) {
            spiral.draw(ctx, this.paper);
        }
    }

    frame(ts) {
        this.elapsed = (ts - this._p || 0) / 1000;
        this._p = ts;
        this.update(this.elapsed);
        this.draw(this.ctx);
        window.requestAnimationFrame(this.frame.bind(this));
    }        
}

