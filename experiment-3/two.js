"use strict";

import { two_pi } from './constants.js';
import { Point } from './coordinates.js';

export class Pair {
    constructor(m, f) {
        this.m = m;
        this.f = f;
        this.centroid = new Point((this.m.coordinates[5].x + this.f.x) / 2, (this.m.coordinates[5].y + this.f.y) / 2)
        this.m.color = "hsla(200, 100%, 50%, 0.25)";
        this.f.color = "hsla(0, 100%, 50%, 0.25)";
    }

    update(elapsed) {
        this.previous = this.centroid;
        // this.centroid = new Coordinates((this.m.coordinates[5].x + this.f.x) / 2, (this.m.coordinates[5].y + this.f.y) / 2)
        this.centroid = new Point((this.m.x + this.f.x) / 2, (this.m.y + this.f.y) / 2)

        for (const spouse of [this.m, this.f]) {
            const diff = spouse.loc.distBetween(this.centroid) - spouse.loc.distBetween(this.previous);
            if(diff < 0) {
                // spouse.color = "hsla(0, 100%, 50%, 0.25)";
                spouse.speed += 0.02;
                spouse.speed = Math.min(spouse.speed, 0.5);
            } else {
                // spouse.color = "hsla(200, 100%, 50%, 0.25)";
                spouse.speed -= 0.01;
                spouse.speed = Math.max(spouse.speed, 0.01);
            }                
        }
        // const mdiff = distBetween(this.m, this.centroid) - distBetween(this.m, this.previous);
        // const fdiff = distBetween(this.f, this.centroid) - distBetween(this.f, this.previous);
        
        // if(fdiff > 0) {
        //     this.f.speed += 0.01;
        //     this.f.speed = Math.min(this.f.speed, 0.5);
        // } else {
        //     this.f.speed -= 0.01;
        //     this.f.speed = Math.max(this.f.speed, 0.01);
        // }
        // if(mdiff > 0) {
        //     this.m.speed += 0.01;
        //     this.m.speed = Math.min(this.m.speed, 0.5);
        // } else {
        //     this.m.speed -= 0.01;
        //     this.m.speed = Math.max(this.m.speed, 0.01);
        // }
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


