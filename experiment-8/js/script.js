let devMode = false;


class RandomWalk{
    constructor(rate, a=-1, b=1) {
        // varies between a and b which default to -1 and 1
        this.a = a;
        this.b = b;
        this.rate = rate; // rate is per second (s-1)
        this.value = 0;
    }
    update(elapsed) {
        const delta = (Math.random() - 0.5) * 2 * elapsed * this.rate;
        this.value += delta;
        this.value = Math.max(this.value, this.a);
        this.value = Math.min(this.value, this.b);
    }
}

class SteeringWheel {
    constructor(size) {
        this.size = size;
        const limit = Math.random() * 0.2;
        this.steering = new RandomWalk(Math.PI, -limit, limit);
        this.angle = Math.random() * 2 * Math.PI;
    }
    update(elapsed) {
        this.steering.update(elapsed);
        this.angle += this.steering.value;
        this.angle %= (2 * Math.PI);
    }
    draw(ctx) {
        ctx.save();
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    } 
}

class Ball {
    constructor(x, y, size, xSpeed, ySpeed, lifespan, hue) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.lifespan = lifespan;
        this.remainingLifespan = lifespan;
        this.hue = hue;
    }

    get alive() {
        return this.remainingLifespan > 0;
    }
    get lifePercent() {
        return this.remainingLifespan / this.lifespan;
    }
    get boundary() {
        return this.lifePercent * (1 - this.lifePercent);
    }

    update(elapsed) {
        this.remainingLifespan -= elapsed;
        this.remainingLifespan = Math.max(0, this.remainingLifespan);
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
    }

    draw(ctx) {
        if(this.boundary < 0) {
            console.log(this.lifePercent);
        }
        ctx.save();
        ctx.fillStyle = `hsla(${this.hue}, 40%, 95%, ${this.boundary*0.5})`;
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.arc(0, 0, this.size * this.boundary, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

class BallSpitter {
    constructor(x, y, size, wheel, wait) {
        this.x = x;
        this.y = y;
        this.wheel = wheel;
        this.balls = [];
        this.wait = wait;
        this.max_wait = wait;
        this.hue = Math.floor(Math.random() * 360);
        this.size = size;
        console.log(this.size);
    }
    nextBall() {
        return new Ball(this.x, this.y, this.size, this.xSpeed/10, this.ySpeed/10, this.lifespan, this.hue)
    }
    get lifespan() {
        return 3;// Math.random() * 1;
    }
    get xSpeed() {
        return Math.cos(this.wheel.angle) * 80;
    }
    get ySpeed() {
        return Math.sin(this.wheel.angle) * 80;
    }

    update(elapsed) {
        this.wait -= elapsed;
        this.wheel.update(elapsed);
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
        this.balls.forEach(ball => ball.update(elapsed));
        if (this.wait <= 0) {
            this.wait = this.max_wait;
            this.balls.push(this.nextBall());
            this.balls = this.balls.filter(b => b.alive);
        }
    } 

    draw(ctx) {
        ctx.save();
        if(devMode) {
            ctx.save();
            ctx.translate(this.x, this.y);
            this.wheel.draw(ctx);
            ctx.restore();
        }
        this.balls.forEach(ball => ball.draw(ctx));
        ctx.restore();
    }
}

class Scene{
    constructor(nSpitters) {
        this.spitters = Array.from({length: nSpitters}, createSpitter);
    }

    update(elapsed) {
        this.spitters.forEach(spitter => {
            spitter.update(elapsed);
            if(spitter.x < 0) { spitter.x = 800; }
            if(spitter.x > 800) { spitter.x = 0; }
            if(spitter.y < 0) { spitter.y = 600; }
            if(spitter.y > 600) { spitter.y = 0; }
        });
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.spitters.forEach(spitter => {
            spitter.draw(ctx);
        });
    }
}

const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext('2d');
ctx.fillStyle="white";



function createSpitter() {
    const wheel = new SteeringWheel(10);
    const size = 10 + Math.random()**2 * 30;
    return new BallSpitter(Math.random() * 800, Math.random() * 600, size, wheel, 0.01);
}
const scene = new Scene(10);

let p;
function frame(ts) {
    const elapsed = (ts - p || 0) / 1000;
    p = ts;
    scene.update(elapsed);
    scene.draw(ctx);
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

