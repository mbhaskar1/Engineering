var canvas;
var ctx;

var mapCodes=
[
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,5,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,0,0,6,0,0,0,],
    [0,2,3,3,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
]
var map = [] //[row][column]
var player;
var name;

var update;

var EMPTY = 0;
var GROUND = 1;
var GROUNDLEFT = 2;
var GROUNDCENTER = 3;
var GROUNDRIGHT = 4;
var SPIKE = 5;
var GOAL = 6;

var imgSize = 80;
var charSize = 60;

var dx = 2;
var playerX = 200;
var jumpVelocity = 7;
var angularVelocity = 2;
var gravity = 0.1
var v = 0;
var a = gravity;
var dist = 0;
var grounded = false;
var goalX = 3600
var percent = 0;

function init(){
    canvas = document.getElementById("mainCanvas")    
    ctx = canvas.getContext("2d");
    for(var i = 0; i < mapCodes.length; i++){
        map[i] = new Array();
        for(var j = 0; j < mapCodes[i].length; j++){
            var x = j * imgSize;
            var y = i * imgSize;
            map[i][j] = new image(x, y, imgSize, imgSize, mapCodes[i][j]);
        }
    }
    player = new character(playerX, 100, charSize, charSize, 0);
    document.addEventListener("keydown", keyPress, false);
    alert("Press Enter to start")
    update = setInterval(draw, 10)
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Set Background Image
    background = new Image()
    background.src = "Sprites/Background.png";
    ctx.fillStyle = ctx.createPattern(background, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Update Map
    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){
            map[i][j].x -= dx;
            map[i][j].update();
            if(map[i][j].isSpike()){
                var scoords = map[i][j].getCoords();
                ctx.beginPath();
                ctx.strokeStyle = "FF0000"
                ctx.arc(scoords[0][0], scoords[0][1], 10, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "00FF00"
                ctx.arc(scoords[1][0], scoords[1][1], 10, 0, Math.PI*2);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "0000FF"
                ctx.arc(scoords[2][0], scoords[2][1], 10, 0, Math.PI*2);
                ctx.stroke();
            }
        }
    }
    dist += dx;

    percent = 100*dist/goalX

    //Move Player
    v += a;
    player.y += v;

    //Check For Collisions
    grounded = false;
    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){
            if(map[i][j].isGround() && map[i][j].collision(player)){
                player.y = map[i][j].y - player.width/2;
                v = 0;
                a = 0;
                player.angle = Math.round(player.angle / 90)*90
                grounded = true;
            }
            if(map[i][j].isSpike() && map[i][j].collision(player)){
                clearInterval(update)
                alert("You Lost")
                if(percent > 100){
                    percent = 99.9;
                }
                name = prompt("Enter your name:")
                reset()
            }
            if(map[i][j].isGoal() && map[i][j].collision(player)){
                clearInterval(update)
                alert("You Win")
                percent = 100
                name = prompt("Enter your name:")
                reset()
            }
        }
    }

    if(player.y > canvas.height){
        clearInterval(update)
        alert("You Lost")
        if(percent > 100){
            percent = 99.9;
        }
        name = prompt("Enter your name:")
        reset()
    }

    if(!grounded){
        a = gravity;
        player.angle += angularVelocity;
    }

    //Update Player
    player.update();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "black"
    ctx.fillText((Math.round(percent*10)/10) + "%", 10, 30)

    coords = player.getCoords()
    ctx.beginPath();
    ctx.strokeStyle = "FF0000"
    ctx.arc(coords[0][0], coords[0][1], 10, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "00FF00"
    ctx.arc(coords[1][0], coords[1][1], 10, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "0000FF"
    ctx.arc(coords[2][0], coords[2][1], 10, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "FF0000"
    ctx.arc(coords[3][0], coords[3][1], 10, 0, Math.PI*2);
    ctx.stroke();
    //console.log(player.angle);
}

function reset(){
    clearInterval(update);

    percent = Math.round(percent * 10)/10

    var tr = document.createElement("tr")
    var td1 = document.createElement("td")
    td1.innerHTML = name
    var td2 = document.createElement("td")
    td2.innerHTML = percent + "%"
    tr.appendChild(td1)
    tr.appendChild(td2)
    leaderboard.appendChild(tr)

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            map[i][j].x += dist
        }
    }
    dist = 0
    player.y = 100
    v = 0
    update = setInterval(draw, 10)
}

function keyPress(e){
    switch(e.keyCode){
        case 32:
            e.preventDefault()
            if(grounded){
                jump();
            }
            break;
        case 13:
            reset();
    }
}

function jump(){
    v = -jumpVelocity;
    a = gravity;
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
            case GROUNDCENTER:
                this.image.src = "Sprites/GroundCenter.png"
                break;
            case GROUNDRIGHT:
                this.image.src = "Sprites/GroundRight.png"
                break;
            case SPIKE:
                this.image.src = "Sprites/Spike.png"
                break;
            case GOAL:
                this.image.src = "Sprites/Goal.png"
                break;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    this.isGround = function(){
        if(type == GROUND || type == GROUNDLEFT || type == GROUNDCENTER || type == GROUNDRIGHT){
            return true;
        }else{
            return false;
        }
    }
    this.isSpike = function(){
        if(type == SPIKE){
            return true;
        }else{
            return false;
        }
    }
    this.isGoal = function(){
        if(type == GOAL){
            return true;
        }else{
            return false;
        }
    }
    this.collision = function(char){
        if(this.isGround()){
            var charRect = char.rect();
            if((charRect.right > this.x && charRect.right < this.x + this.width) || (charRect.left > this.x && charRect.left < this.x + this.width)){
                if(charRect.bottom + 0.01 > this.y && charRect.top + 0.01 < this.y){
                    return true;
                }
                return false;
            }
            return false;
        }else if(this.isSpike()){
            var charCoords = char.getCoords();
            var spikeCoords = this.getCoords();
            var charRect = char.rect();
            if(checkCollision(charCoords, spikeCoords) && ((charRect.bottom > this.y && charRect.bottom < this.y + this.height) || (charRect.top > this.y && charRect.top < this.y + this.height))){
                //alert(charCoords)
                //alert(spikeCoords)
                return true;
            }
            return false;
        }else if(this.isGoal()){
            var charRect = char.rect();
            if((charRect.right > this.x && charRect.right < this.x + this.width) || (charRect.left > this.x && charRect.left < this.x + this.width)){
                if((charRect.bottom > this.y && charRect.bottom < this.y + this.height) || (charRect.top > this.y && charRect.top < this.y + this.height)){
                    return true;
                }
                return false;
            }
            return false;
        }
    }
    this.getCoords = function(){
        if(this.isSpike()){
            return [[this.x, this.y + this.height], [this.x + this.width, this.y + this.height], [this.x + this.width / 2, this.y]]
        }else{
            alert("Not implemented")
        }
    }
}

function character(x, y, width, height, angle){
    this.image = new Image();
    this.image.src = "Sprites/Character.png";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.update = function(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
    this.rect = function(){
        return {right: this.x + this.width/2, left: this.x - this.width/2, top: this.y - this.height/2, bottom: this.y + this.height/2}
    }
    this.getCoords = function(){
        charRect = this.rect();
        pos1 = rotateCoordinates(this.x, this.y, charRect.right, charRect.bottom, this.angle * (Math.PI / 180))
        pos2 = rotateCoordinates(this.x, this.y, charRect.right, charRect.top, this.angle * (Math.PI / 180))
        pos3 = rotateCoordinates(this.x, this.y, charRect.left, charRect.top, this.angle * (Math.PI / 180))
        pos4 = rotateCoordinates(this.x, this.y, charRect.left, charRect.bottom, this.angle * (Math.PI / 180))
        return [pos1, pos2, pos3, pos4]
    }
}

//Intense Linear Algebra
function rotateCoordinates(x0, y0, x, y, angle){
    return [x0 + (x-x0)*Math.cos(angle) + (y0-y)*Math.sin(angle), y0 + (x-x0)*Math.sin(angle) - (y0-y)*Math.cos(angle)]
}

function checkCollision(coords1, coords2){
    for(var i = 0; i < coords1.length; i++){
        for(var j = 0; j < coords2.length; j++){
            coord11 = (coords1[i][0] > coords1[(i+1)%coords1.length][0]) ? coords1[(i+1)%coords1.length] : coords1[i];
            coord12 = (coords1[i][0] <= coords1[(i+1)%coords1.length][0]) ? coords1[(i+1)%coords1.length] : coords1[i];
            coord21 = (coords2[j][0] > coords2[(j+1)%coords2.length][0]) ? coords2[(j+1)%coords2.length] : coords2[j];
            coord22 = (coords2[j][0] <= coords2[(j+1)%coords2.length][0]) ? coords2[(j+1)%coords2.length] : coords2[j];

            if(checkEdgeCollision(coord11, coord12, coord21, coord22)){
                return true;
            }
        }
    }
    return false;
}

function checkEdgeCollision(coord11, coord12, coord21, coord22){
    var x11 = coord11[0]
    var y11 = coord11[1]
    var x12 = coord12[0]
    var y12 = coord12[1]
    var x21 = coord21[0]
    var y21 = coord21[1]
    var x22 = coord22[0]
    var y22 = coord22[1]

    if(x11*y22+x12*y21+y12*x22+x21*y11==x11*y21+x12*y22+y12*x21+x22*y11 || (x11-x12)*(x21-x22)==0){
        return false;
    }

    var x = (x11*(y12*(x21-x22)-x21*y22+y21*x22)+x12*(x21*y22-x21*y11-y21*x22+x22*y11))/(x11*(y21-y22)-x12*y21+x12*y22+y12*(x21-x22)-x21*y11+x22*y11)
    var y = (x-x11)*(y12-y11)/(x12-x11)+y11

    if(x > x11 && x < x12 && x > x21 && x < x22){
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.stroke();
        return true;
    }else{
        return false;
    }
}