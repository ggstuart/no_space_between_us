import { two_pi } from './constants.js';
import { Point, PhasedPoint } from './coordinates.js';
import { DoubleRandomWalk, Sinusoid } from './value.js';

export class Creature {
    constructor(w, h) {
        this.w = w;
        this.h = h;

        // It's pointing in a random direction
        this.angle = Math.random() * two_pi;

        // It steers itself with a DoubleRandomWalk
        this.rotation = new DoubleRandomWalk({
            value: Math.random() * two_pi, 
            min: -10,    // actual minimum 
            max: 10,     // actual maximum
            min2: -1.0,     // rate minimum
            max2: 1.0       // rate maximum
        });

        // pixels per second
        // The creature takes 5 seconds to cross the canvas
        this.speed = Math.max(w, h) / 15; 
        
        // experiments
        this.opacity = new Sinusoid(1)  // seconds wavelength
        this.spiral = new Sinusoid(0.1)  // seconds wavelength

        // An array to hold the body points
        this.length = 100
        this.body = [];

        // initialise attractors
        this.attractors = [];


        // It's located at a random point on the canvas
        this.next_move = new PhasedPoint(Math.random() * w, Math.random() * h, this.spiral, 20, 20);
        // this.next_move = new Point(Math.random() * w, Math.random() * h);

        this.coherence = new DoubleRandomWalk({
            value: 0.1, 
            min: 0.0,    // actual minimum 
            max: 0.2,     // actual maximum
            min2: -0.0005,     // rate minimum
            max2: 0.0005       // rate maximum
        });

        // fill the body with data
        Array(this.length).fill().map((_, i) => {
            this.update(1 / 60);
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
        this.next_move.phase += 1;
        if (this.body.unshift(this.next_move.clone()) > this.length) {
            this.body = this.body.slice(0, this.length);
        }
    }
    
    update(elapsed) {
        this.rotation.update(); // DoubleRandomWalk
        this.coherence.update(); // DoubleRandomWalk
        this.opacity.update(elapsed); // Sinusoid
        this.spiral.update(elapsed); // Sinusoid
        this.angle += this.rotation.value * elapsed;
        this.step(elapsed)
        for (const att of this.attractors) {
            att.update(elapsed);
        }
    }

    draw(ctx) {
        for (const i in this.body) {
            const point = this.body[i];
            const phase = (i / this.body.length) * two_pi;
            point.draw(ctx, `hsla(0, 50%, 50%, ${this.opacity.value(phase)})`, phase);
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
        this.radius = 1 + Math.random() * 10;
        this.noise = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `hsla(0, 50%, 100%, 0.1)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, two_pi);
        ctx.fill();
        ctx.restore();
    }

    update(elapsed) {
        const point = this.target.point_at_index(this.index);
        this.noise = this.distBetween(point) * this.target.coherence.value;
        this.brownian(this.noise);
        this.moveTowards(point, 200 * elapsed);
        // this.reduceDistanceBy(this.target.point_at_index(this.index), 0.01);
    }
}


