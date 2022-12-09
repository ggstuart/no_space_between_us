"use strict";

import { Experiment } from './experiment.js';
import { Creature } from './creature.js';
// import { Controls } from './controls.js';

const thing = new Creature(canvas.width, canvas.height);
// const controls = new Controls(panel, thing)

window.experiment = new Experiment(canvas, thing);
