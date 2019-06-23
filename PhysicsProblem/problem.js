var canvas;
var ctx;
var update;

var pressed = [false, false, false];
var mouseX;
var mouseY;

var box;
var gun;
var fire;
var shot;

var distScale = 100;

var length = 3;
var g = 9.81;
var dt = 0.02;
var M = 10;
var m = 5;
var v = 10;
var energyLoss = 0.8;

var totalTime = 0;
var begun = false;

var canvasRect;

function init(){
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    canvasRect = canvas.getBoundingClientRect();

    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("click", mouseClick, false);

    box = new boxObject();
    gun = new image(50, 100 + length*distScale, 320, 198, "gluegun.png");
    fire = new image(295, 100 + length*distScale - 93, 250, 250, "fire.png");
    fire.visible = false;
    shot = new Audio("shot.mp3");

    update = setInterval(draw, 10);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Top Locked Box
    ctx.fillStyle = "#009933"
    ctx.fillRect(570, 50, 140, 50)

    //Swinging Box
    box.update();

    //Ropes
    ctx.fillStyle = "#000000";

    ctx.beginPath();
    ctx.moveTo(620, 100)
    ctx.lineTo(box.x + 20, box.y)
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(660, 100)
    ctx.lineTo(box.x + 60, box.y)
    ctx.closePath();
    ctx.stroke();

    //Glue Gun
    gun.update();
    fire.update();

    //Words
    ctx.font = "25px Arial"
    ctx.fillText("Variables", 1000, 40)
    
    ctx.beginPath();
    ctx.moveTo(1000, 42)
    ctx.lineTo(1200, 42)
    ctx.closePath();
    ctx.stroke();

    ctx.font = "20px Arial"
    ctx.fillText("X Displacement: " + (Math.round((box.x - 600)/distScale*10)/10) + " m", 1000, 67);
    ctx.fillText("Y Displacement: " + (Math.round((100 + length*distScale - box.y)/distScale*100)/100) + " m", 1000, 90);
    ctx.fillText("Theta: " + (Math.round(box.theta*180/Math.PI*10)/10) + "°", 1000, 113);
    ctx.fillText("Time: " + (Math.round(totalTime*10)/10) + " s", 1000, 136)
    ctx.fillText("Velocity: " + (Math.round(box.v*10)/10) + " m/s", 1000, 159)
    ctx.fillText("Acceleration: " + (Math.round(box.a*10)/10) + " m/s^2", 1000, 182)
    ctx.fillText("Kinetic Energy: " + (Math.round(box.KE*10)/10) + " J", 1000, 205)
    ctx.fillText("Potential Energy: " + (Math.round(box.PE*10)/10) + " J", 1000, 227)
    ctx.fillText("Total Energy: " + (Math.round(box.TE*10)/10) + " J", 1000, 250)
    ctx.fillText("Oscillations: " + (Math.floor(box.periods/2)), 1000, 273)
}

function mouseDown(e){
    pressed[e.which-1] = true;
    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
}

function mouseUp(e){
    pressed[e.which-1] = false;
    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
}

function mouseMove(e){
    mouseX = e.clientX - canvasRect.left;
    mouseY = e.clientY - canvasRect.top;
}

function mouseClick(e){
    console.log("Mouse click")
}

function boxObject(){
    this.x = 600;
    this.y = 100 + length*distScale;
    this.width = 80;
    this.height = 50;
    this.color = "#00ccff"
    this.angVelocity = 0;
    this.theta = 0;
    this.periods = 0;
    this.toggle = 0;
    this.freq = 1;
    this.time = 0;

    this.v = 0;
    this.a = 0;
    this.yd = 0;
    this.PE = 0;
    this.KE = 0;
    this.TE = 0;

    this.update = function(){
        if(this.theta > 0 && this.toggle == 1){
            this.periods++;
            this.toggle = 1 - this.toggle;
            console.log(this.periods);
            if(this.periods % 6 == 0){
                this.shoot(m, v);
            }
        }
        if(this.theta < 0 && this.toggle == 0){
            this.periods++;
            this.toggle = 1 - this.toggle;
            console.log(this.periods);
        }

        this.theta = this.angVelocity/this.freq * Math.sin(this.freq * this.time);

        this.v = this.angVelocity * Math.cos(this.freq * this.time) * length;
        this.a = -this.angVelocity * this.freq * Math.sin(this.freq * this.time) * length;

        this.time += dt;
        if(begun){
            totalTime += dt;
        }

        this.x = 600 + length*distScale*Math.sin(this.theta);
        this.y = 100 + length*distScale*Math.cos(this.theta);

        this.yd = (100 + length*distScale - box.y)/distScale
        this.PE = M*g*this.yd;
        this.KE = 0.5*M*this.v*this.v;
        this.TE = this.PE + this.KE;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height)

        this.angVelocity -= (1 - Math.sqrt(energyLoss))*2*this.freq*this.angVelocity*dt/Math.PI;
    }

    this.shoot = function(m, v){
        begun = true;
        fire.visible = true;
        setTimeout(function(){
            fire.visible = false;
        }, 100)
        shot.play();
        this.angVelocity = (m*v + M*this.angVelocity*length)/((m+M)*length);
        this.freq = Math.sqrt(g/length);
        this.time = 0;
        this.M += m
    }
}

function image(x, y, width, height, src){
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.src = src;
    this.visible = true;
    this.update = function(){
        this.image.src = this.src;
        if(this.visible)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

function keyDown(e){
    switch(e.keyCode){
        case 32: // Space
            box.shoot(m, v);
            break;
        case 27: // Escape
            break;
    }
}