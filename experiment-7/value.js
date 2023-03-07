// Values such as size should be clamped
// They can vary according to any pattern, but will need to be given a delta
// Maximum and minimum levels should be set

import { two_pi } from "./constants.js";

class ClampedValue {
    constructor({value, min, max}) {
        this.value = value;
        this.min = min;
        this.max = max;
    }

    update(delta) {
        this.value += delta;
        this.value = Math.min(Math.max(this.value, this.min), this.max);
    }
}

// Random walks can increase and decrease at a rate which is a random walk.
// Periods of growth should be balanced by shrinkage.

export class RandomWalk extends ClampedValue {
    constructor({value, min, max}) {
        super({value, min, max});
        this.delta = new ClampedValue({value: 0, min: -1, max: 1});
    }

    update() {
        this.delta.update((Math.random() - 0.5) * 2);
        super.update(this.delta.value);
    }
}


export class DoubleRandomWalk extends RandomWalk {
    constructor({value, min, max, min2, max2}) {
        super({value, min, max});
        this.delta = new RandomWalk({value: 0, min: min2, max: max2});
    }

    update() {
        this.delta.update();
        super.update(this.delta.value);
    }

    set min2(value) {
        this.delta.min = value;
    }
    set max2(value) {
        this.delta.max = value;
    }
}

export class Sinusoid {
    constructor(wavelength) {
        this.wavelength = wavelength;
        this._value = 0;
    }

    update(delta) {
        this._value += delta;
        this._value %= this.wavelength * 10;
    }

    value(phase) {
        const angle = (this._value + phase) * two_pi;
        return (Math.sin(angle)/2) + 0.5;
    }
}