import Spiral from "./spiral.js";

export class Scene{
    constructor(ctx1, ctx2) {
        ctx1.fillStyle = "white";
        ctx2.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx1.strokeStyle = "white";
        ctx2.strokeStyle = "white";
        this.ctx = ctx1;
        this.paper = ctx2;
        this.devMode = true;
        const coords = [
            [this.topLeft, this.bottomLeft],
            [this.topMiddle, this.bottomMiddle],
            [this.topRight, this.bottomRight],
        ];

        this.spirals = Array.from(coords, (pair) => {
            return new Spiral(...pair)
        });
    }

    get width() {
        return this.ctx.canvas.width;
    }
    get height() {
        return this.ctx.canvas.height;
    }
    get top() {
        return this.height / 5;
    }
    get bottom() {
        return 4 * this.height / 5;
    }
    get left() {
        return this.width / 5;
    }
    get right() {
        return 4 * this.width / 5;
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
            y: this.top
        }
    }
    get topLeft() {
        return {
            x: this.left,
            y: this.top
        }
    }
    get topRight() {
        return {
            x: this.right,
            y: this.top
        }
    }
    get bottomMiddle() {
        return {
            x: this.width / 2,
            y: this.bottom
        }
    }
    get bottomLeft() {
        return {
            x: this.left,
            y: this.bottom
        }
    }
    get bottomRight() {
        return {
            x: this.right,
            y: this.bottom
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
            spiral.draw(ctx, this.paper, this.devMode);
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

