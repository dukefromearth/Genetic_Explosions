const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

function myCanvas() {
    this.value = 0;
    this.draw = function (elements, image, size) {
        for (let id in elements) {
            let e = elements[id];
            let img = document.getElementById(image);
            context.drawImage(img, e.x * 10 - size / 2, e.y * 10 - size / 2, size, size);
        }
        console.log('fuck you');
    }
    this.clear = function () {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.update_val = function () {
        this.val
    }
}