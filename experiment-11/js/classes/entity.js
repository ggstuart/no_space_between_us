import Region from "./region.js";

export default class Entity {
    constructor({ x, y }, space, { speed, rotation, radius, buffer }) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.space = space;
        this.angle = Math.PI * 2 * Math.random();

        this.rotation = rotation;
        this.buffer = (Math.random() > Math.random()) ? buffer : -buffer;// * (Math.random() - 0.5);
        this.radius = radius;
        this.count = this.buffer * Math.random();
        this.flipped = Math.random() > 0.5;
    }

    get xSpeed() {
        return Math.cos(this.angle) * this.speed;
    }
    get ySpeed() {
        return Math.sin(this.angle) * this.speed;
    }

    local(paper, size) { 
        const region = new Region(paper.getImageData(this.x - size/2, this.y - size/2, size, size));
        return region.value;
    }

    forwards(elapsed) {
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
    }

    accelerate(elapsed, value) {
        this.speed += (1-value) * elapsed;
    }

    turn(elapsed, value) {
        this.angle += this.rotation * (value - 0.5) * elapsed;
    }

    wrap() {
        this.x += this.space.x;
        this.y += this.space.y;
        this.x %= this.space.x;
        this.y %= this.space.y;
    }

    update(elapsed, paper) {
        const sensed = this.local(paper, 3);
        this.forwards(elapsed);
        this.turn(elapsed, sensed);
        this.accelerate(elapsed, sensed);            
        this.wrap()
        this.count += sensed - 0.5;
        if (this.flipped) {
            if (this.count < -this.buffer) {
                this.flipped = false;
            }            
        } else {
            if (this.count > this.buffer) {
                this.flipped = true;
            }
        }

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.flipped ? "red" : "blue"
        ctx.fillStyle = this.flipped ? "red" : "blue"
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    do_drawing(paper) {
        paper.save();
        paper.translate(this.x, this.y);
        // paper.rotate(this.angle);
        paper.beginPath();
        paper.arc(0, 0, this.radius, 0, Math.PI * 2);
        paper.fillStyle = this.flipped ? "black" : "white";
        paper.fill();
        paper.restore();
    }
}