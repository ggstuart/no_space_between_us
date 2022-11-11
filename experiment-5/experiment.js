import { One } from './one.js';

const clamp = (min, max) => (value) => {
    return value < min ? min : value > max ? max : value;
}

const wrap = (min, max) => (value) => {
    const span = max - min;
    return value < min ? value + span : value > max ? (value - min) % span : value;
}

function newInput(id, label, min, step, max, obj, property) {
    const myInput = document.createElement('input');
    const myLabel = document.createElement('label');
    myInput.id = id;
    myLabel.htmlFor = myInput.id;
    myLabel.textContent = label
    myInput.type = "range";
    myInput.min = min;
    myInput.step = step;
    myInput.max = max;
    myInput.value = obj[property];
    myInput.addEventListener('input', ev => {
        obj[property] = ev.target.value;
    });
    // const div = document.createElement('div');
    panel.appendChild(myLabel);
    panel.appendChild(myInput);
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
            Math.random() * Math.random() * Math.PI,
            10 + Math.floor(Math.random() * 50),
            0.1 + Math.random() * Math.random(),
            Math.random() * 5
        );

        newInput("jitterInput", "Jitter", 0, 0.01, Math.PI, this.thing, "jitter");
        newInput("nSegmentsInput", "Segments", 0, 1, 200, this.thing, "nSegments");
        newInput("speedInput", "Speed", 0, 0.01, 1, this.thing, "speed");
        newInput("sizeInput", "Size", 1, 0.1, 10, this.thing, "size");
        
        this.paused = true;
        // this.step();
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