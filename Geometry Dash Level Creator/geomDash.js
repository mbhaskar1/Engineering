var canvas;
var ctx;

var canvasLeft;
var canvasTop;

var x;

var mapCodes=[]
for(var i = 0; i < 720/80; i++){
    mapCodes[i] = new Array();
    for(var j = 0; j < 1280/80; j++){
        mapCodes[i][j] = 0;
    }
}
var map = [] //[row][column]

var update;

var EMPTY = 0;
var GROUND = 1;
var GROUNDLEFT = 2;
var GROUDNCENTER = 3;
var GROUNDRIGHT = 4;
var SPIKE = 5;

var imgSize = 80;

var shift = 0;

function init(){
    canvas = document.getElementById("mainCanvas")    
    ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect()
    canvasLeft = rect.left;
    canvasTop = rect.top;
    x = 0;
    for(var i = 0; i < mapCodes.length; i++){
        map[i] = new Array();
        for(var j = 0; j < mapCodes[i].length; j++){
            var x = j * imgSize;
            var y = i * imgSize;
            map[i][j] = new image(x, y, imgSize, imgSize, mapCodes[i][j]);
        }
    }
    document.addEventListener("click", change, false);
    document.addEventListener("keydown", keyPress, false);
    update = setInterval(draw, 10);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Set Background Image
    background = new Image()
    background.src = "Sprites/Background.png";
    ctx.fillStyle = ctx.createPattern(background, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){
            map[i][j].update();
        }
    }
}

function change(e){
    x = Math.floor((e.clientX - canvasLeft + shift)/imgSize);
    y = Math.floor((e.clientY - canvasTop)/imgSize);
    mapCodes[y][x] = num;
    map[y][x].type = num;
}

var num = 0;

function keyPress(e){
    if(e.keyCode == 37){ //Left
        shift -= imgSize;
        if(shift < 0){
            shift = 0;
        }
    }else if(e.keyCode == 39){ //Right
        if(mapCodes[0].length <= (1280+shift)/imgSize){
            for(var i = 0; i < mapCodes.length; i++){
                mapCodes[i][mapCodes[i].length] = 0;
                map[i][map[i].length] = new image(map[i].length * imgSize, i * imgSize, imgSize, imgSize, mapCodes[i][map[i].length])
            }
        }
        shift += imgSize;
    }else if(e.keyCode >= 49 && e.keyCode <= 57){ //1-9
        num = e.keyCode - 48;
    }else if(e.keyCode == 13){
        printMapCodes();
    }
}

function printMapCodes(){
    var str = "[\n"
    for(var i = 0; i < mapCodes.length; i++){
        str+="["
        for(var j = 0; j < mapCodes[i].length; j++){
            str+=mapCodes[i][j]+","
        }
        str+="],\n"
    }
    str+="]"
    console.log(str);
}

function image(x, y, width, height, type){
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.update = function(){
        switch(this.type){
            case GROUND:
                this.image.src = "Sprites/Ground.png"
                break;
            case GROUNDLEFT:
                this.image.src = "Sprites/GroundLeft.png"
                break;
            case GROUDNCENTER:
                this.image.src = "Sprites/GroundCenter.png"
                break;
            case GROUNDRIGHT:
                this.image.src = "Sprites/GroundRight.png"
                break;
            case SPIKE:
                this.image.src = "Sprites/Spike.png"
                break;
            default:
                this.image.src = "";
                break; 
        }
        ctx.drawImage(this.image, this.x - shift, this.y, this.width, this.height)
    }
}