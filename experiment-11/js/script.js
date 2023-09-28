import { Scene } from "./classes/scene.js";

const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const w = 200 + 1000 * Math.random();
const h = w * 3 / 4;
for(const canvas of [canvas1, canvas2]) {
    canvas.width = w;
    canvas.height = h;
}

const ctx1 = canvas1.getContext('2d');
const paper = canvas2.getContext('2d', {
    alpha: false,
    willReadFrequently: true
});

const n = parseInt(150 + 950 * Math.random());
const alpha = 0.02// + 0.2 * Math.pow(Math.random(), 2);
const grey = 255 * Math.pow(Math.random(), 2);

const random = {
    speed: 50 + 1550 * Math.pow(Math.random(), 2),
    rotation: Math.PI * 200 * Math.pow(Math.random(), 2),
    radius: 1 + 9 * Math.random(),
    buffer: 10 + 150 * (Math.random())
};

console.log(JSON.stringify({h, w, n, alpha, ...random}));

// this.paper.fillRect(this.width / 2, 0, this.width / 2, this.height);

paper.fillStyle = `rgb(${grey}, ${grey}, ${grey})`;
paper.fillRect(0, 0, canvas2.width, canvas2.height);

// const scene = new Scene(ctx1, paper, 2000, 0.05, emergent);
// const scene = new Scene(ctx1, paper, 200, 0.5, emergent);
// const scene = new Scene(ctx1, paper, 100, 0.5, emergent);
// const scene = new Scene(ctx1, paper, 100, 0.25, slow);

const scene = new Scene(ctx1, paper, n, alpha, random);
window.scene = scene;
window.requestAnimationFrame(scene.frame.bind(scene));

window.addEventListener('keydown', ev => {
    if(ev.key == "d") {
        scene.devMode = !scene.devMode;
    }
});
