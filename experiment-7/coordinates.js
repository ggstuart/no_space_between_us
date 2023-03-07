
export const two_pi = Math.PI * 2;

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    angleBetween(you) {
        const dx = this.x - you.x;
        const dy = this.y - you.y;
        return Math.atan2(dy, dx);
    }

    distBetween(you) {
        return ((this.x - you.x) ** 2 + (this.y - you.y) ** 2) ** 0.5;
    }

    movePolar(angle, distance) {
        this.x += Math.cos(angle) * distance;
        this.y += Math.sin(angle) * distance;
    }

    brownian(distance) {
        this.movePolar(Math.random() * two_pi, Math.random() * distance);
    }

    moveTowards(you, distance) {
        const angle = this.angleBetween(you) + Math.PI;
        this.movePolar(angle, distance);
    }

    reduceDistanceBy(you, proportion_of_distance) {
        const angle = this.angleBetween(you) + Math.PI;
        const distance = this.distBetween(you);
        this.movePolar(angle, distance * proportion_of_distance);
    }

    static fromPolar(angle, distance) {
        return new Point(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance
        );
    }

    wrap (width, height) {
        this.x = this.x < 0 ? this.x + width : this.x > width ? this.x % width : this.x;
        this.y = this.y < 0 ? this.y + height : this.y > height ? this.y % height : this.y;
    }    

    clone() {
        return new Point(this.x, this.y);
    }

    draw(ctx, color="hsla(0, 50%, 50%, 0.1)") {
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, two_pi);
        ctx.fill();
        ctx.restore();
    }

}
export class PhasedPoint extends Point {
    constructor(x, y, sinusoid, x_distance, y_distance) {
        super(x, y);
        this.sinusoid = sinusoid;
        this.x_distance = x_distance;
        this.y_distance = y_distance;
    }

    draw(ctx, color="hsla(0, 50%, 50%, 0.2)", phase) {
        ctx.save();
        const d = this.sinusoid.value(phase)
        ctx.translate(d * this.x_distance, d * this.y_distance);
        super.draw(ctx, color);
        ctx.restore();
    }

    clone(elapsed) {
        return new PhasedPoint(this.x, this.y, this.sinusoid, this.distance);
    }

}