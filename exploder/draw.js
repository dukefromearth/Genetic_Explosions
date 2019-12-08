const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;
context.fillStyle = 'black';
context.fillRect(0,0,canvas.width,canvas.height);

function myCanvas(){
    this.value = 0;
    this.draw = function(elements, color){
        for (let id in elements){
            let e = elements[id];
            context.fillStyle = color;
            context.fillRect(e.x*10 - 1, e.y*10 - 1, 9,9);
        }
    }
    this.clear = function() {
        context.fillStyle = 'black';
        context.fillRect(0,0,canvas.width,canvas.height);
    }
    this.update_val = function() {
        this.val
    }
}