class Satellite {
    constructor(spiral) {
        this.spiral = spiral;
        this.distance = spiral.startDistance;
        this.angle = Math.random() * 2 * Math.PI;
        this.elapsed = 0;
    }

    get location() {
        return this.spiral.location(this.elapsed);
    }

    update(elapsed) {
        this.elapsed += elapsed;
        this.distance *= this.spiral.collapse;
        this.distance = Math.max(5, this.distance);
        this.angle += this.spiral.rotationSpeed * elapsed;
    }

    draw(ctx) {
        const {x, y} = this.location;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.spiral.angle);
        ctx.scale(this.spiral.squashX, this.spiral.squashY);
        ctx.rotate(this.angle);
        // ctx.scale(1/this.spiral.squashX, 1/this.spiral.squashY);
        ctx.beginPath();
        ctx.arc(this.distance, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}



// A spiral is basically a point, moving on a line
// It spawns satellites which follow the point
export default class Spiral {
    constructor(start, end, n) {
        this.start = start;
        this.end = end;
        this.rotationSpeed = Math.PI/2 + Math.random() * Math.PI/2;
        this.squashX = 0.2 + Math.random() * 0.5;
        this.squashY = 1;//Math.random();
        this.startDistance = 100 + Math.random() * 100;
        this.collapse = 0.99 + Math.random() * 0.005;
        this.duration = 5 + Math.random() * 20; // seconds
        this.satellites = [];
        this.count = 0;
        this.max = 1;// + Math.floor(Math.random() * 5);
    }

    get angle() {
        return Math.atan2(
            this.end.y - this.start.y, 
            this.end.x - this.start.x
        );
    }

    get distance() {
        return Math.hypot(
            this.start.x - this.end.x, 
            this.start.y - this.end.y
        );
    }

    get speed() {
        return this.distance / this.duration;
    }
    
    location(elapsed) {
        if(elapsed > this.duration) {
            return this.end;
        }
        return {
            x: this.start.x + Math.cos(this.angle) * elapsed * this.speed,
            y: this.start.y + Math.sin(this.angle) * elapsed * this.speed
        }
    }

    update(elapsed) {
        if(this.satellites.length < this.max) {
            this.satellites.push(new Satellite(this));
            // this.count ++;
        }
        for(const s of this.satellites){
            s.update(elapsed);
        };
        this.satellites = this.satellites.filter(s => s.elapsed < this.duration)
    }

    draw(ctx, paper, devMode) {
        if(devMode) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "red"
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.stroke();
            ctx.restore();
        }
        for(const s of this.satellites) {
            if(devMode) {
                s.draw(ctx);
            }
            s.draw(paper);
        }
    }
}

