
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

    clone() {
        return new Point(this.x, this.y);
    }

}
