import { One } from './one.js';
import { Pair } from './two.js';

const clamp = (min, max) => (value) => {
    return value < min ? min : value > max ? max : value;
}

const wrap = (min, max) => (value) => {
    const span = max - min;
    return value < min ? value + span : value > max ? (value - min) % span : value;
}

export class Experiment {
    constructor(c, nThings, sight) {
        this.w = c.width;
        this.h = c.height;
        this.clampX = clamp(0, this.w);
        this.clampY = clamp(0, this.h);
        this.wrapX = wrap(0, this.w);
        this.wrapY = wrap(0, this.h);
        this.ctx = c.getContext("2d");
        this.things = Array(nThings).fill().map(() => {
            return new One(
                Math.random() * c.width, 
                Math.random() * c.height,
                Math.random() * Math.random() * Math.PI,
                10 + Math.floor(Math.random() * 50),
                0.1 + Math.random() * Math.random(),
                Math.random() * 5
            );
        });
        this.sight = sight;
        this.pairs = {};
        this.paused = true;
        // this.step();
        this.play();
    }

    pause() {
        this.paused = true;
    }

    play() {
        this.paused = false;
        window.requestAnimationFrame(this.frame.bind(this));
    }

    step() {
        window.requestAnimationFrame(this.frame.bind(this));
    }

    frame(timestamp) {
        this.elapsed = timestamp - (this.previous || timestamp);
        this.previous = timestamp;
        this.update();
        this.draw();
        if (!this.paused) window.requestAnimationFrame(this.frame.bind(this));
    }
    draw() {
        // this.ctx.save();
        this.ctx.clearRect(0, 0, this.w, this.h);
        // this.ctx.translate(this.w / 2, this.h / 2);

        for (const thing of this.things) { thing.draw(this.ctx) }

        // for (const [key, pair] of Object.entries(this.pairs)) {
        //     pair.draw(this.ctx) 
        // }

        // this.ctx.restore();
    }
    update() {
        for (const me of this.things) {
            me.update(this.elapsed);
            // me.loc.x = this.clampX(me.loc.x);
            // me.loc.y = this.clampY(me.loc.y);
            me.loc.x = this.wrapX(me.loc.x);
            me.loc.y = this.wrapY(me.loc.y);
            // me.x = ((me.x + this.w * 1.5) % this.w) - this.w / 2;
            // me.y = ((me.y + this.h * 1.5) % this.h) - this.h / 2;

            // if(me.paired) continue
            // for (const you of this.things) {
            //     if(you.paired) continue
            //     if(me === you) continue;
            //     const dist = me.loc.distBetween(you.loc);
            //     const key = `${me.id}-${you.id}`;
            //     if(this.pairs.hasOwnProperty(key)) continue
            //     if (dist < this.sight) {
            //         me.paired = true;
            //         you.paired = true;
            //         this.pairs[key] = new Pair(me, you);
            //     }
            // }
        }

        // for (const [key, pair] of Object.entries(this.pairs)) {
        //     pair.update(this.elapsed);
        // }
    }
}