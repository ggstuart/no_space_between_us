class Satellite {
    constructor(angle, distance) {
        this.angle = angle;
        this.distance = distance;
    }

    update(speed, rotationSpeed, elapsed) {
        this.distance *= speed;
        this.distance = Math.max(0, this.distance);
        this.angle += rotationSpeed * elapsed;

    }

    draw(ctx) {
        ctx.save();
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(this.distance, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

export default class Spiral {
    constructor({x, y}, angle, width, speed, yspeed, n=4) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.ySpeed = yspeed;
        this.speed = speed;
        this.rotationSpeed = 2;
        this.squash = 0.25
        this.satellites = Array.from({length: n}, () => {
            return new Satellite(Math.random() * 2 * Math.PI, width);    
        })
    }

    update(elapsed) {
        this.y += this.ySpeed * elapsed;
        for(const s of this.satellites) {
            s.update(this.speed, this.rotationSpeed, elapsed);
        }
    }

    draw(ctx, paper) {
        for(const c of [ctx, paper]) {
            c.save();
            c.translate(this.x, 0);
            c.rotate(this.angle);
            c.translate(0, this.y);
            c.scale(1, this.squash)
        }
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, 2 * Math.PI)
        ctx.stroke();
        
        
        // paper.save();
        // paper.translate(this.x, 0);
        // paper.rotate(this.angle);
        // paper.translate(0, this.y);
        // paper.scale(1, 0.25)
        for(const s of this.satellites) {
            s.draw(ctx);
            s.draw(paper);
        }
        ctx.restore();
        paper.restore();
    }
}

