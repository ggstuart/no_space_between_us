import Entity from "./entity.js";

export class Scene{
    constructor(ctx1, paper, n_entities, alpha, params) {
        ctx1.fillStyle = "white";
        ctx1.strokeStyle = "white";
        // paper.fillStyle = "rgb(128, 128, 128)";
        // paper.fillStyle = "white";
        // ctx2.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx1.globalAlpha = 0.7;
        // paper.globalAlpha = 0.5;
        
        this.ctx = ctx1;
        this.paper = paper;
        
        // this.paper.fillRect(0, 0, this.width, this.height);
        // // this.paper.fillRect(this.width / 2, 0, this.width / 2, this.height);
        paper.globalAlpha = alpha;
        this.devMode = false;

        //2000
        this.entities = Array(n_entities).fill().map(() => {
            return new Entity(
                this.randomLocation(), this.bottomRight,
                params,
            );
        });

        // this.entities = Array(2000).fill().map(() => {
        //     return new Entity(
        //         this.randomLocation(), this.bottomRight,
        //         test,
        //     );
        // });

    }

    get width() {
        return this.ctx.canvas.width;
    }
    get height() {
        return this.ctx.canvas.height;
    }
    get top() {
        return 0;
    }
    get bottom() {
        return this.height;
    }
    get left() {
        return 0;
    }
    get right() {
        return this.width;
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
        for(const entity of this.entities) {
            entity.update(1/60, this.paper);
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (const entity of this.entities) {
            if (this.devMode) {
                entity.draw(ctx);
            }
            entity.do_drawing(this.paper);
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

