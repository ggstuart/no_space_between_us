import { two_pi } from './constants.js';
import { Point } from './coordinates.js';

let thing_id = 0;

export class One {
    constructor(x, y, jitter, nSegments, speed) {
        this.id = thing_id++;
        this.loc = new Point(x, y);
        this.size = 1 + Math.random() * 9;
        this.angle = Math.random() * two_pi;
        this.speed = speed;
        this.color = "hsla(0, 100%, 100%, 1)";
        this.jitter = jitter
        this.coordinates = [];
        this.nSegments = nSegments;
        this.paired = false;
        this.type = ['m', 'f'][Math.floor(Math.random() * 2)]
        this.rotation = 0;
        // call update to generate segments
        // Array(this.nSegments).fill().map((_, i) => this.update(16))
    }

    addSegment() {
        this.coordinates.unshift(this.loc.clone());
        if (this.coordinates.length > this.nSegments) {
            this.coordinates = this.coordinates.slice(1, this.nSegments);
        }
    }

    update(elapsed) {
        const dist = elapsed * this.speed;
        this.addSegment()
        this.rotation += (Math.random() - 0.5) * this.jitter;
        this.rotation = Math.max(Math.min(this.rotation, 0.1), -0.1)
        this.angle += this.rotation;
        this.loc.movePolar(this.angle, dist);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.lineWidth = this.size;
        let prev = this.loc;
        ctx.moveTo(this.loc.x, this.loc.y);
        for (const c of this.coordinates) {
            if (prev.distBetween(c) > 200) {
                ctx.moveTo(c.x, c.y);
            } else {
                ctx.lineTo(c.x, c.y);
            }
            prev = c;
        }
        ctx.stroke();
        ctx.restore();
    }
}
