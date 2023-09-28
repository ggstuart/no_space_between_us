function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}


export default class Region {
    constructor(ImageData) {
        this.pixels = Array.from({ length: ImageData.width }, (_, col) => {
            return Array.from({ length: ImageData.height }, (_, row) => {
                const index = 0 + row * 4 + col * 12;
                return ImageData.data[index];
            })
        })
    }
    get value() {
        return mean(this.pixels.map(mean)) / 255;
    }
}