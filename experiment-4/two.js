"use strict";

import { two_pi } from './constants.js';
import { Point } from './coordinates.js';

export class Pair {
    constructor(m, f) {
        this.m = m;
        this.f = f;
        this.m.nSegments *= 2;
        this.f.nSegments *= 2;
        this.f.speed = this.m.speed;
        this.f.nSegments = this.m.nSegments;
        this.m.jitter = this.f.jitter;
        this.m.color = "hsla(200, 100%, 50%, 0.75)";
        this.f.color = "hsla(0, 100%, 50%, 0.75)";
    }

    update(elapsed) {
        // this.centroid = new Point(
        //     (this.m.coordinates[0].x + this.f.coordinates[0].x) / 2, 
        //     (this.m.coordinates[0].y + this.f.coordinates[0].y) / 2
        // )
        this.centroid = new Point(
            (this.m.head.x + this.f.head.x) / 2, 
            (this.m.head.y + this.f.head.y) / 2
        )
        this.m.angle = this.m.loc.angleBetween(this.centroid) + (Math.PI/2) + 0.01;
        this.f.angle = this.f.loc.angleBetween(this.centroid) + (Math.PI/2) + 0.01;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.centroid.x, this.centroid.y, 5, 0, two_pi);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = 'hsla(100, 50%, 50%, 0.5)';
        ctx.lineWidth = 2;
        ctx.moveTo(this.centroid.x, this.centroid.y);
        ctx.lineTo(this.f.x, this.f.y);
        ctx.moveTo(this.centroid.x, this.centroid.y);
        ctx.lineTo(this.m.x, this.m.y);
        ctx.stroke();
        ctx.restore();        
    }
}


