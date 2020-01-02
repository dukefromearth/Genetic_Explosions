var genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Minimize;
genetic.select1 = Genetic.Select1.Random;
genetic.select2 = Genetic.Select2.Random;
genetic.fittestAlwaysSurvives = true;
var best = {};
var gen = 0;
var t = Date.now();

genetic.seed = function () {
    const size = 100;
    const min = size / 2 - 10;
    const max = size / 2 + 10;
    const quantity = 40;//Math.pow((max - min) / 2, 2);//Math.pow(size / 40, 2);
    var seed = {};
    var num_cells = quantity;
    for (let i = 0; i < num_cells; i++) {
        let x = Math.floor((Math.random() * (max - min)) + min);
        let y = Math.floor((Math.random() * (max - min)) + min);
        let key = "x" + x.toString() + "y" + y.toString();
        // if (seed[key]) i--;
        seed[key] = { x: x, y: y };
    }
    return seed;
};

genetic.mutate = function (entity) {
    console.log("mutate");
    const size = 100;
    const min = size / 2 - 4;
    const max = size / 2 + 4;
    for (let id in entity) {
        if (Math.random() > 0.05) entity[id].x = Math.floor((Math.random() * (max - min)) + min);
        if (Math.random() > 0.05) entity[id].y = Math.floor((Math.random() * (max - min)) + min);
    }
    return entity;
};

genetic.crossover = function (mother, father) {
    let child1 = {};
    let child2 = {};
    let new_mother = Object.values(mother);
    let new_father = Object.values(father);
    // if (new_mother.length != new_father.length) return [mother, father];
    // let looper = (new_mother.length < new_father.length) ? new_mother : new_father;
    // for (let id in looper) {
    //     let egg = new_mother[id];
    //     let sperm = new_father[id];
    //     if (Math.random() < 0.33) child1["x" + egg.x.toString() + "y" + egg.y.toString()] = egg;
    //     else if (Math.random() < 0.66) child1["x" + sperm.x.toString() + "y" + sperm.y.toString()] = sperm;
    //     else child1["x" + sperm.x.toString() + "y" + egg.y.toString()] = egg;
    //     if (Math.random() < 0.33) child2["x" + egg.x.toString() + "y" + egg.y.toString()] = egg;
    //     else if (Math.random() < 0.66) child2["x" + sperm.x.toString() + "y" + sperm.y.toString()] = sperm;
    //     else child2["x" + sperm.x.toString() + "y" + egg.y.toString()] = egg;
    // }

    function split_to_quarters(arr) {
        let obj = { q1: [], q2: [], q3: [], q4: [] };
        for (let id in arr) {
            let cell = arr[id];
            //left side
            if (cell.x < 50) {
                //top
                if (cell.y < 50) obj.q1.push(cell);
                //bottom
                else obj.q3.push(cell);
            }
            //right side
            else {
                //top
                if (cell.y < 50) obj.q2.push(cell);
                //bottom
                else obj.q4.push(cell);
            }
        }
        return obj;
    }

    function mirror(arr, dir) {
        switch (dir) {
            case "up":
                for (let i in arr) {
                    arr[i].y = 50 - (arr[i].y - 50);
                }
                break;
            case "left":
                for (let i in arr) {
                    arr[i].x = 50 - (arr[i].x - 50);
                }
                break;
            case "down":
                for (let i in arr) {
                    arr[i].y = 50 + (50 - arr[i].y);
                }
                break;
            case "right":
                for (let i in arr) {
                    arr[i].x = 50 + (50 - arr[i].x);
                }
                break;
        }
        return arr;
    }

    function combine_quarters(pre_obj) {
        let obj = {};
        function combine_arr(arr) {
            for (let i in arr) {
                let cell = arr[i];
                obj["x" + cell.x.toString() + "y" + cell.y.toString()] = cell;
            }
        }
        combine_arr(pre_obj.q1);
        combine_arr(pre_obj.q2);
        combine_arr(pre_obj.q3);
        combine_arr(pre_obj.q4);
        return obj;
    }
    let mother_split = split_to_quarters(new_mother);
    let father_split = split_to_quarters(new_father);

    let rand = Math.random();
    if(Math.random() < 1/4) mother_split.q1 = father_split.q1;
    if(Math.random() < 1/4) mother_split.q2 = father_split.q2;
    if(Math.random() < 1/4) mother_split.q3 = father_split.q3;
    if(Math.random() < 1/4) mother_split.q4 = father_split.q4;
    if(Math.random() < 1/4) father_split.q1 = mother_split.q1;
    if(Math.random() < 1/4) father_split.q2 = mother_split.q2;
    if(Math.random() < 1/4) father_split.q3 = mother_split.q3;
    if(Math.random() < 1/4) father_split.q4 = mother_split.q4;

    child1 = combine_quarters(mother_split);
    child2 = combine_quarters(father_split);
    return [child1, child2];
};

genetic.fitness = function (entity) {
    var target = this.userData["target"];
    let gol = this.userData["gol"];
    let ending_locs = gol.run(entity);
    let fitness = 0;
    if (ending_locs.length < target.length * 5) return 10000;
    for (let e in ending_locs) {
        let ent = ending_locs[e];
        let closest = 1000;
        for (let i in target) {
            let t = target[i];
            let distX = ent.x - t.x;
            let distY = ent.y - t.y;
            let dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist < closest) closest = dist;
            if (closest <= 5) fitness -= 10;
        }
        fitness += closest;
    }
    return (fitness === 0) ? 10000 : fitness / ending_locs.length;
};

genetic.generation = function (pop, generation, stats) {
    // // stop running once we've reached the solution
    // return pop[0].entity != this.userData["solution"];
};

genetic.notification = function (pop, generation, stats, isFinished) {
    function lerp(a, b, p) {
        return a + (b - a) * p;
    }

    var value = pop[0].entity;
    this.last = this.last || value;

    if (pop != 0 && value == this.last)
        return;

    // var solution = [];
    // var i;
    // for (i = 0; i < value.length; ++i) {
    // 	var diff = value.charCodeAt(i) - this.last.charCodeAt(i);
    // 	var style = "background: transparent;";
    // 	if (diff > 0) {
    // 		style = "background: rgb(0,200,50); color: #fff;";
    // 	} else if (diff < 0) {
    // 		style = "background: rgb(0,100,50); color: #fff;";
    // 	}

    // 	solution.push("<span style=\"" + style + "\">" + value[i] + "</span>");
    // }
    let canvas = this.userData["canvas"];
    // canvas.clear();
    // canvas.draw(value, 'atom', 14);
    let scores = "";
    for (let i = 0; i < pop.length; i++) {
        scores += pop[i].fitness.toPrecision(5) + ' '
    }
    var buf = "";
    buf += "<tr>";
    buf += "<td>" + generation + "</td>";
    buf += "<td>" + (Date.now() - t) + "</td>";
    buf += "<td>" + pop[0].fitness.toPrecision(5) + "</td>";
    buf += "<td>" + JSON.stringify(value) + "</td>";
    buf += "<td>" + scores + "</td>";
    buf += "</tr>";
    $("#results tbody").prepend(buf);
    this.last = value;
    best = value;
    gen = generation;
    t = Date.now();
};