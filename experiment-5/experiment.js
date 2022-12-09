import { One } from './one.js';

const clamp = (min, max) => (value) => {
    return value < min ? min : value > max ? max : value;
}

const wrap = (min, max) => (value) => {
    const span = max - min;
    return value < min ? value + span : value > max ? (value - min) % span : value;
}

function newMinMaxPair(id, label, min, max, step, obj, property) {
    const minInput = document.createElement('input');
    const maxInput = document.createElement('input');
    const myLabel = document.createElement('label');
    minInput.id = `min_${id}`;
    maxInput.id = `max_${id}`;
    myLabel.htmlFor = minInput.id;
    myLabel.textContent = `min ${label} max`
    minInput.type = "range";
    maxInput.type = "range";
    minInput.min = min;
    maxInput.min = min;
    minInput.max = max;
    maxInput.max = max;
    minInput.step = step;
    maxInput.step = step;
    minInput.value = obj[`${property}_min`];
    maxInput.value = obj[`${property}_max`];
    console.log(minInput.value, maxInput.value);
    minInput.addEventListener('input', ev => {
        const value = parseFloat(ev.target.value);
        obj[`${property}_min`] = value;
        if(value > maxInput.value) {
            maxInput.value = value;
            obj[`${property}_max`] = value;
        }
        console.log(minInput.value, maxInput.value);

    });
    maxInput.addEventListener('input', ev => {
        const value = parseFloat(ev.target.value);
        obj[`${property}_max`] = value;
        if(value < minInput.value) {
            minInput.value = value;
            obj[`${property}_min`] = value;
        }
        console.log(minInput.value, maxInput.value);

    });
    // const div = document.createElement('div');
    panel.appendChild(minInput);
    panel.appendChild(myLabel);
    panel.appendChild(maxInput);
    // panel.appendChild(div);

}

export class Experiment {
    constructor(canvas, panel) {
        this.panel = panel;
        this.w = canvas.width;
        this.h = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.clampX = clamp(0, this.w);
        this.clampY = clamp(0, this.h);
        this.wrapX = wrap(0, this.w);
        this.wrapY = wrap(0, this.h);
        this.thing = new One(
            Math.random() * this.w, 
            Math.random() * this.h,
            0.1 + Math.random() * Math.random(),
        );

        newMinMaxPair("opacityInput", "OPACITY", 0, 1, 0.01, this.thing, "opacity")
        newMinMaxPair("radiusInput", "RADIUS", 0, 300, 0.01, this.thing, "radius")
        newMinMaxPair("countInput", "COUNT", 0, 50, 1, this.thing, "count")

        this.play();
    }

    pause() {
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.step();
        // window.requestAnimationFrame(this.frame.bind(this));
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
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.thing.draw(this.ctx);
    }
    update() {
        this.thing.update(this.elapsed);
        this.thing.loc.x = this.wrapX(this.thing.loc.x);
        this.thing.loc.y = this.wrapY(this.thing.loc.y);
    }
}