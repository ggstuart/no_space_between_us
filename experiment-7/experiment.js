export class Experiment {
    constructor(canvas, thing) {
        this.thing = thing;
        this.w = canvas.width;
        this.h = canvas.height;
        this.ctx = canvas.getContext("2d");
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
        this.thing.update(this.elapsed / 1000);
    }
}