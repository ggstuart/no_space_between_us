import { two_pi } from './constants.js';
import { Point } from './coordinates.js';
import { RandomWalk, DoubleRandomWalk } from './value.js';


export class Segment extends Point {
    constructor(x, y, count, opacity, radius) {
        super(x, y);
        this.count = new DoubleRandomWalk({
            value: count || 5 + Math.ceil(Math.random() * 20), 
            min: 10, 
            max: 30,
            min2: -2,
            max2: 2
        })

        this.radius = new DoubleRandomWalk({
            value: radius || 25 + Math.random() * Math.random() * 75, 
            min: 10, 
            max: 100,
            min2: -1,
            max2: 1
        });

        this.opacity = new DoubleRandomWalk({
            value: opacity || Math.random() * 0.01, 
            min: 0.05, 
            max: 0.7,
            min2: -0.1,
            max2: 0.1
        });

    }

    update(elapsed) {
        // this.count += (Math.random() > 0.5) - (Math.random() > 0.5);
        // this.count = Math.max(this.count, 1);

        this.count.update();
        this.opacity.update();
        this.radius.update();
    }

    draw(ctx, size) {
        ctx.fillStyle = `hsla(0, 50%, 100%, ${this.opacity.value})`;
        const iRadius = this.radius.value / this.count.value;
        for(let i = 0; i < this.count.value; i++) {
            const delta = Point.fromPolar(
                Math.random() * 2 * Math.PI,
                // this.radius.value * Math.random()
                Math.pow(this.radius.value, Math.random())
            );
            ctx.beginPath();
            ctx.arc(this.x + delta.x, this.y + delta.y, iRadius * (Math.random() + 0.5), 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    clone() {
        return new Segment(this.x, this.y, this.count.value, this.opacity.value, this.radius.value);
    }

}

export class One {
    constructor(x, y, speed) {
        this.loc = new Segment(x, y);
        this.size = 1 + Math.random() * 9;
        this.angle = Math.random() * two_pi;
        this.speed = 1;
        this.color = "hsla(0, 100%, 100%, 1)";
        this.coordinates = [];
        this.nSegments = 50;
        this.paired = false;
        this.rotation = new DoubleRandomWalk({
            value: Math.random() * two_pi, 
            min: -0.05,    // actual minimum 
            max: 0.05,     // actual maximum
            min2: -0.01,     // rate minimum
            max2: 0.01       // rate maximum
        });
        Array(this.nSegments).fill().map((_, i) => this.update(16))
    }

    update(elapsed) {
        this.coordinates.unshift(this.loc.clone());
        if (this.coordinates.length > this.nSegments) {
            this.coordinates = this.coordinates.slice(1, this.nSegments);
        }
        this.loc.update(elapsed);
        this.rotation.update(); // randomwalk
        this.angle += this.rotation.value;
        this.loc.movePolar(this.angle, elapsed * this.speed);
    }

    draw(ctx) {
        ctx.save();
        for (const c of this.coordinates) {
            c.draw(ctx, this.size);
        }
        ctx.restore();
    }

    get opacity_min() {
        return this.loc.opacity.min;
    }
    get opacity_max() {
        return this.loc.opacity.max;
    }
    set opacity_min(value) {
        this.loc.opacity.min = value;
    }
    set opacity_max(value) {
        this.loc.opacity.max = value;
    }

    get radius_min() {
        return this.loc.radius.min;
    }
    get radius_max() {
        return this.loc.radius.max;
    }
    set radius_min(value) {
        this.loc.radius.min = value;
    }
    set radius_max(value) {
        this.loc.radius.max = value;
    }

    get count_min() {
        return this.loc.count.min;
    }
    get count_max() {
        return this.loc.count.max;
    }
    set count_min(value) {
        this.loc.count.min = value;
    }
    set count_max(value) {
        this.loc.count.max = value;
    }
}
