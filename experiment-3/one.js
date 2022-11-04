import { two_pi } from './constants.js';
import { Point } from './coordinates.js';

let thing_id = 0;

export class One {
    constructor(x, y, jitter, nSegments, speed, chunkSize) {
        this.id = thing_id++;
        this.loc = new Point(x, y);

        this.size = 1;
        this.angle = Math.random() * two_pi;
        this.speed = speed;
        this.color = "hsla(0, 100%, 100%, 1)";
        this.jitter = jitter
        this.bias = Math.random() - 0.5;

        this.coordinates = [];
        this.nSegments = nSegments;
        this.segment = chunkSize * this.size;
        this.dist = 0;

        // call update to generate segments
        Array(this.nSegments).fill().map((_, i) => this.update(16))

        this.paired = false;
    }

    addSegment() {
        // this.coordinates.push(new Point(this.x, this.y));
        this.coordinates.push(this.loc.clone());
        if (this.coordinates.length > this.nSegments) {
            this.coordinates = this.coordinates.slice(1);
        }
    }

    update(elapsed) {
        const dist = elapsed * this.speed;
        this.dist += dist;
        if (this.dist > this.segment) {
            this.addSegment()
            this.angle += (Math.random() - 0.5 + this.bias) * this.jitter;
            this.dist = 0;
            // this.speed += (Math.random() - 0.5) * 0.01;
        }
        this.loc.movePolar(this.angle, dist);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size / 2;

        // The head
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.loc.x, this.loc.y)
        ctx.rotate(this.angle);
        ctx.arc(0, 0, this.size * 3, 0.75, -0.75);
        ctx.fill();

        // Neck
        // ctx.beginPath();
        // ctx.moveTo(this.size, 0);
        // ctx.lineTo(0, 0);
        // ctx.stroke();
        ctx.restore();

        // Body
        ctx.beginPath();
        ctx.lineWidth = this.size * 1.5;
        let prev = this.loc;
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
