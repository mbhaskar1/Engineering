var canvas = null;
var ctx = null;
var interval = null;

var FPS = 30;
var SIZE = [10, 10]; //[rows, columns]
var START_POS = [36, 36];
var WIDTH = 50;

var sqrtWidth = WIDTH * Math.SQRT2 / 2

var EMPTY = ""
var EDGE = "Edge.png"
var LIGHT = "DoubleArc.png"
var HEAVY = "SingleArc.png"

var LINES = 0
var BOXES = 1

var hBorders = []; //[row][column]
var vBorders = []; //[row][column]
var activated = []; //[row][column]
var mode = LINES;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    for (var i = 0; i < SIZE[0] + 1; i++) {
        hBorders[i] = new Array();
        for (var j = 0; j < SIZE[1]; j++) {
            var x = START_POS[0] + (2 * j + 1) * sqrtWidth
            var y = START_POS[1] + 2 * i * sqrtWidth
            hBorders[i][j] = new component(x, y, WIDTH, WIDTH, 45, EDGE);
        }
    }
    for (var i = 0; i < SIZE[0]; i++) {
        vBorders[i] = new Array();
        for (var j = 0; j < SIZE[1] + 1; j++) {
            var x = START_POS[0] + 2 * j * sqrtWidth
            var y = START_POS[1] + (2 * i + 1) * sqrtWidth
            vBorders[i][j] = new component(x, y, WIDTH, WIDTH, -45, EDGE);
        }
    }
    for (var i = 0; i < SIZE[0]; i++) {
        vBorders[i][0].type = HEAVY;
        vBorders[i][0].angle = -45;
        vBorders[i][SIZE[1]].type = HEAVY;
        vBorders[i][SIZE[1]].angle = 135;
    }
    for (var i = 0; i < SIZE[1]; i++) {
        hBorders[0][i].type = HEAVY;
        hBorders[0][i].angle = 45;
        hBorders[SIZE[0]][i].type = HEAVY;
        hBorders[SIZE[0]][i].angle = -135;
    }
    for (var i = 0; i < SIZE[0]; i++) {
        activated[i] = new Array();
        for (var j = 0; j < SIZE[1]; j++) {
            activated[i][j] = true;
        }
    }

    interval = setInterval(update, Math.round(1000 / FPS));
    canvas.addEventListener("click", onClick, false);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < hBorders.length; i++) {
        for (var j = 0; j < hBorders[i].length; j++) {
            hBorders[i][j].update();
        }
    }
    for (var i = 0; i < vBorders.length; i++) {
        for (var j = 0; j < vBorders[i].length; j++) {
            vBorders[i][j].update();
        }
    }
}

function onClick(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left - START_POS[0];
    var y = e.clientY - rect.top - START_POS[1];
    if (mode == LINES) {
        //Woah it's Linear Algebra
        var x_r = Math.round((Math.SQRT1_2 * (x + y) - WIDTH / 2) / WIDTH);
        var y_r = Math.round((Math.SQRT1_2 * (x - y) - WIDTH / 2) / WIDTH);
        x = x_r - y_r
        y = x_r + y_r
        if (x % 2 == 0) {
            var type = hBorders[x / 2][y / 2].type
            if (type != HEAVY) {
                hBorders[x / 2][y / 2].type = type == EDGE ? LIGHT : EDGE;
            }
        } else {
            var type = vBorders[(x - 1) / 2][(y + 1) / 2].type
            if (type != HEAVY) {
                vBorders[(x - 1) / 2][(y + 1) / 2].type = type == EDGE ? LIGHT : EDGE;
            }
        }
    } else if (mode == BOXES) {
        x = Math.floor(x / (WIDTH * Math.SQRT2))
        y = Math.floor(y / (WIDTH * Math.SQRT2))
        if (activated[y][x]) {
            hBorders[y][x].type = hBorders[y][x].type == HEAVY ? EMPTY : HEAVY;
            hBorders[y][x].angle = 225;
            hBorders[y + 1][x].type = hBorders[y + 1][x].type == HEAVY ? EMPTY : HEAVY;
            hBorders[y + 1][x].angle = 45;
            vBorders[y][x].type = vBorders[y][x].type == HEAVY ? EMPTY : HEAVY;
            vBorders[y][x].angle = -225;
            vBorders[y][x + 1].type = vBorders[y][x + 1].type == HEAVY ? EMPTY : HEAVY;
            vBorders[y][x + 1].angle = -45;
            activated[y][x] = false;
        } else {
            if (y == 0 || hBorders[y][x].type == EMPTY) {
                hBorders[y][x].type = HEAVY;
                hBorders[y][x].angle = 45;
            } else {
                hBorders[y][x].type = EDGE;
            }
            if (y == SIZE[0] - 1 || hBorders[y + 1][x].type == EMPTY) {
                hBorders[y + 1][x].type = HEAVY;
                hBorders[y + 1][x].angle = 225;
            } else {
                hBorders[y + 1][x].type = EDGE;
            }
            if (x == 0 || vBorders[y][x].type == EMPTY) {
                vBorders[y][x].type = HEAVY;
                vBorders[y][x].angle = -45;
            }else{
                vBorders[y][x].type = EDGE;
            }
            if (x == SIZE[1] - 1 || vBorders[y][x + 1].type == EMPTY) {
                vBorders[y][x + 1].type = HEAVY;
                vBorders[y][x + 1].angle = -225;
            }else{
                vBorders[y][x + 1].type = EDGE;
            }
            activated[y][x] = true;
        }
    }
}

function onKeyDown(e){
    if(e.keyCode == 76){
        mode = LINES;
    }else if(e.keyCode == 66){
        mode = BOXES;
    }
}

function component(x, y, width, height, angle, type) {
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.type = type;
    this.update = function () {
        if (this.type == EDGE) {
            this.image.src = "Edge.png";
        } else if (this.type == LIGHT) {
            this.image.src = "DoubleArc.png";
        } else if (this.type == HEAVY) {
            this.image.src = "SingleArc.png";
        } else if (this.type == EMPTY) {
            this.image.src = "";
        }
        ctx.save();
        ctx.translate(x, y)
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}