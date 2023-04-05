import { Scene } from "./classes/scene.js";

let devMode = false;
window.addEventListener('keydown', ev => {
    if(ev.key == "d") {
        devMode = !devMode;
    }
});

const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
for(const canvas of [canvas1, canvas2]) {
    canvas.width = 800;
    canvas.height = 600;
}

const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

const scene = new Scene(ctx1, ctx2);
window.requestAnimationFrame(scene.frame.bind(scene));
