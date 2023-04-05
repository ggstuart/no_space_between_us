const G = 100;

function distance(obj1, obj2) {
    return Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
}

function gravitationalForce(obj1, obj2) {
    return G * (obj1.mass * obj2.mass) / distance(obj1, obj2)**2 
}

function angle(obj1, obj2) {
    return Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
}

export default class Satellite {
    constructor({x, y}, spiral) {
        this.x = x;
        this.y = y;
        this.mass = 1;
        this.spiral = spiral;
        this.xSpeed = (Math.random() - 0.5) * 20;
        this.ySpeed = (Math.random() - 0.5) * 20;
    }

    update(elapsed) {
        const a = angle(this.spiral, this);
        let g = gravitationalForce(this, this.spiral);
        g = Math.min(g, 5);
        this.xSpeed += Math.cos(a) * g;
        this.ySpeed += Math.sin(a) * g;
        // this.xSpeed *= 0.8;
        // this.ySpeed *= 0.8;

        this.x += elapsed * this.xSpeed;
        this.y += elapsed * this.ySpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}