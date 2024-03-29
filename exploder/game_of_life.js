/*jshint esversion: 6 */

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


function Game_of_life(posx, posy) {
    this.alive = false;
    this.pos = { x: posx, y: posy };
    this.max_gens = 70;
    this.gen_count = 0;
    this.update_interval = 1000 / 120;
    this.last_update = 0;
    this.size = 100;
    this.last_state = [];
    this.next_state = [];
    this.bomb_locations = [];
    this.running = false;

    this.run = function (starting_state) {
        this.last_state = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.next_state = Array(this.size).fill().map(() => Array(this.size).fill(0));
        for (let id in starting_state) {
            let state = starting_state[id];
            this.last_state[state.x][state.y] = 1;
        }
        for (let i = 0; i < this.max_gens; i++) {
            this.update();
            if(this.bomb_locations.length < 1) break;
        }
        return this.bomb_locations;
    }
    this.update = function () {
        this.bomb_locations.length = 0;
        this.next_state = Array(this.size).fill().map(() => Array(this.size).fill(0));
        for (let j = 1; j < this.last_state.length - 1; j++) {
            for (let i = 1; i < this.last_state.length - 1; i++) {
                let bomb = { x: i, y: j };
                //count neighbors
                let neighbors = 0;
                if (this.last_state[i - 1][j - 1] === 1) ++neighbors;//top left
                if (this.last_state[i - 1][j] === 1) ++neighbors;//top
                if (this.last_state[i - 1][j + 1] === 1) ++neighbors;//top right
                if (this.last_state[i][j - 1] === 1) ++neighbors;//left
                if (this.last_state[i][j + 1] === 1) ++neighbors;//right
                if (this.last_state[i + 1][j - 1] === 1) ++neighbors;//bottom left
                if (this.last_state[i + 1][j] === 1) ++neighbors;//bottom
                if (this.last_state[i + 1][j + 1] === 1) ++neighbors;//bottom right
                if (this.last_state[i][j] === 0) {
                    if (neighbors === 3) {
                        this.next_state[i][j] = 1;
                        this.bomb_locations.push(bomb);
                    }
                } else {
                    if (neighbors <= 1 || neighbors >= 4){
                        this.next_state[i][j] = 0;
                    }
                    else {
                        this.next_state[i][j] = 1;
                        this.bomb_locations.push(bomb);
                    }
                }
            }
        }
        this.last_state = this.next_state;
        this.gen_count++;
        if (this.gen_count > this.max_gens) this.is_alive = false;
    }

    this.init = function (starting_state) {
        this.last_state = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.next_state = Array(this.size).fill().map(() => Array(this.size).fill(0));
        for (let id in starting_state) {
            let state = starting_state[id];
            this.last_state[state.x][state.y] = 1;
        }
    }
    this.zero_out = function () {
        for (let i in this.last_state) {
            for (let j in this.last_state[i]) {
                this.last_state[i][j] = 0;
            }
        }
    }
    this.randInit = function () {
        for (var i = this.size / 2 - 3; i < this.size / 2 + 3; i++) {
            for (var j = this.size / 2 - 3; j < this.size / 2 + 3; j++) {
                var rawRandom = Math.random(); //get a raw random number
                var improvedNum = (rawRandom * 2); //convert it to an int
                var randomBinary = Math.floor(improvedNum);
                if (randomBinary === 1) {
                    this.last_state[i][j] = 1;
                } else {
                    this.last_state[i][j] = 0;
                }
            }
        }
    }
}

