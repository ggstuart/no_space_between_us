import { two_pi } from './constants.js';
import { Point } from './coordinates.js';


export class Segment extends Point {
    constructor(x, y, count, opacity, radius) {
        super(x, y);
        this.count = count || 5 + Math.ceil(Math.random() * 20);
        this.opacity = opacity || Math.random() * 0.01;
        this.radius = radius || 25 + Math.random() * Math.random() * 75;
    }

    update(elapsed) {
        this.count += (Math.random() > 0.5) - (Math.random() > 0.5);
        this.count = Math.max(this.count, 1);
        this.opacity += (Math.random() - 0.5) * elapsed * 0.01;
        this.opacity = Math.max(this.opacity, 0);
        this.opacity = Math.min(this.opacity, 1);
        this.radius += Math.random() - 0.5;
        this.radius = Math.max(this.radius, 0);
        this.radius = Math.min(this.radius, 200);
    }

    draw(ctx, size) {
        ctx.fillStyle = `hsla(0, 50%, 100%, ${this.opacity})`;
        const iRadius = this.radius / this.count;
        for(let i = 0; i < this.count; i++) {
            const delta = Point.fromPolar(
                Math.random() * 2 * Math.PI,
                Math.pow(this.radius, Math.random())
            );
            ctx.beginPath();
            ctx.arc(this.x + delta.x, this.y + delta.y, iRadius * (Math.random() + 0.5), 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    clone() {
        return new Segment(this.x, this.y, this.dispersion, this.opacity, this.radius);
    }

}

export class One {
    constructor(x, y, jitter, nSegments, speed) {
        this.loc = new Segment(x, y);
        this.size = 1 + Math.random() * 9;
        this.angle = Math.random() * two_pi;
        this.speed = speed;
        this.color = "hsla(0, 100%, 100%, 1)";
        this.jitter = jitter
        this.coordinates = [];
        this.nSegments = nSegments;
        this.paired = false;
        this.rotation = 0;
        Array(this.nSegments).fill().map((_, i) => this.update(16))
    }

    update(elapsed) {
        this.coordinates.unshift(this.loc.clone());
        if (this.coordinates.length > this.nSegments) {
            this.coordinates = this.coordinates.slice(1, this.nSegments);
        }
        this.loc.update(elapsed);
        this.rotation += (Math.random() - 0.5) * this.jitter;
        this.rotation = Math.max(Math.min(this.rotation, 0.1), -0.1)
        this.angle += this.rotation;
        this.loc.movePolar(this.angle, elapsed * this.speed);
    }

    draw(ctx) {
        ctx.save();
        for (const c of this.coordinates) {
            c.draw(ctx, this.size);
        }
        ctx.restore();
    }
}
