import { two_pi } from './constants.js';
import { Point } from './coordinates.js';
import { RandomWalk, DoubleRandomWalk } from './value.js';

export class Creature {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        
        // pixels per second
        // The creature takes 10 seconds to cross the canvas
        this.speed = Math.max(w, h) / 10; 
        
        // It's located at a random point on the canvas
        this.next_move = new Point(Math.random() * w, Math.random() * h);

        // It's pointing in a random direction
        this.angle = Math.random() * two_pi;

        // It steers itself with a DoubleRandomWalk
        this.rotation = new DoubleRandomWalk({
            value: Math.random() * two_pi, 
            min: -10,    // actual minimum 
            max: 10,     // actual maximum
            min2: -1,     // rate minimum
            max2: 1       // rate maximum
        });

        this.coherence = new DoubleRandomWalk({
            value: 0.1, 
            min: 0.0,    // actual minimum 
            max: 0.2,     // actual maximum
            min2: -0.001,     // rate minimum
            max2: 0.001       // rate maximum
        });

        this.attractors = [];

        // An array to hold its coordinates
        this.length = 100
        this.body = [];
        Array(this.length).fill().map((_, i) => {
            this.update(0.016);
        });

        // Some attractors to visualise
        this.attractors = Array(1000).fill().map((_, i) => {
            return new Attractor(this, w, h)
        });
    }

    step(elapsed) {
        // Taking a step means moving and adding a coordinate to the body
        this.next_move.movePolar(this.angle, elapsed * this.speed);
        this.next_move.wrap(this.w, this.h);
        if (this.body.unshift(this.next_move.clone()) > this.length) {
            this.body = this.body.slice(0, this.length);
        }
    }
    
    update(elapsed) {
        this.rotation.update(); // DoubleRandomWalk
        this.coherence.update(); // DoubleRandomWalk
        this.angle += this.rotation.value * elapsed;
        this.step(elapsed)
        for (const att of this.attractors) {
            att.update(elapsed);
        }
    }
    draw(ctx) {
        for (const point of this.body) {
            point.draw(ctx, "hsla(0, 50%, 50%, 0.05)");
        }
        for (const att of this.attractors) {
            att.draw(ctx);
        }
    }

    random_point() {
        return this.body[Math.floor(Math.random() * this.body.length)];
    }
    random_index() {
        return Math.floor(Math.random() * this.body.length);
    }
    point_at_index(i) {
        return this.body[i];
    }
}



// A thing that gradually gets closer to the point
// It never quite reaches
class Attractor extends Point {
    constructor(target, w, h) {
        super(Math.random() * w, Math.random() * h)
        this.target = target;
        this.index = target.random_index();
        this.radius = 10 + Math.random() * 10;
        this.noise = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `hsla(0, 50%, 100%, 0.04)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, two_pi);
        ctx.fill();
        ctx.restore();
    }

    update(elapsed) {
        const point = this.target.point_at_index(this.index);
        this.noise = this.distBetween(point) * this.target.coherence.value;
        this.brownian(this.noise);
        this.moveTowards(point, 150 * elapsed);
        // this.reduceDistanceBy(this.target.point_at_index(this.index), 0.01);
    }
}


