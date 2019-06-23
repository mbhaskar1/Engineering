var canvas;
var ctx;
var update;

var background;
var block;
var wall;
var spring;
var timer;
var ruler;
var whiteboard;

var equiX = 192; //WallXi - BlockXi
var A = 0
var maxA = 150

var dt = 10
var time = 0
var dist = 0

var pressed = [false, false, false]
var mouseX;
var mouseY;

var canvasRect;

// Initialization Function
function init(){
    // Get Canvas
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    canvasRect = canvas.getBoundingClientRect();

    // Create all sprite objects
    background = new image(0, 0, canvas.width, canvas.height, 1, 1, "Sprites/Background.png");
    wall = new image(118, 329, 66, 156, 1, 1, "Sprites/Wall.png")
    spring = new image(156, 387, 167, 46, 1, 1, "Sprites/Spring.png")
    block = new image(310, 373, 72, 72, 1, 1, "Sprites/Cube.png")
    timer = new stopwatch(412, 72)
    ruler = new stopwatch(412, 192)
    whiteboard = new image(62, 15, 295, 305, 1, 1, "Sprites/Whiteboard.png")

    // Add Event Listeners for relevant events
    document.addEventListener("mousedown", mouseDown, false)
    document.addEventListener("mouseup", mouseUp, false)
    document.addEventListener("mousemove", mouseMove, false)
    document.addEventListener("keydown", keyDown, false)
    
    // Start Update Interval
    update = setInterval(draw, dt)
}

// Draw Function - Runs every 10 ms
function draw(){
    // Clear Screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update Time and Block Pos
    time += dt/200
    block.x = A*Math.cos(time) + equiX + wall.x

    spring.scaleX = (block.x - wall.x)/equiX

    // If middle mouse button is pressed, move block based on mouse x position
    if(pressed[1]){
        block.x = mouseX - block.width / 2
        if(Math.abs(block.x - equiX - wall.x) > maxA){
            block.x = block.x - equiX - wall.x > 0 ? maxA + equiX + wall.x : -maxA + equiX + wall.x
        }
        A = block.x - equiX - wall.x
        time = 0
    }

    // Do not measure time if block is not moving
    if(A == 0){
        time = 0
    }

    dist = block.x - equiX - wall.x

    // Update timer
    for(var i = 0; i < 4; i++){
        timer.setNum(i, Math.floor((time/5*Math.pow(10, i-1))%10))
    }

    // Update displacement measure
    ruler.setNum(0, dist >= 0 ? "E" : "N")
    for(var i = 1; i < 4; i++){
        ruler.setNum(i, Math.floor(Math.abs((dist/75*Math.pow(10, i-1))%10)))
    }

    // Update all sprites
    background.update() 
    wall.update()
    spring.update()
    block.update()
    timer.update()
    ruler.update()
    whiteboard.update()

    // Write titles of tools
    ctx.font = "20px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Time (s)", 460, 60)
    ctx.fillText("Displacement (m)", 420, 180)
}

// Mouse down event
function mouseDown(e){
    pressed[e.which-1] = true
    mouseX = e.clientX - canvasRect.left
    mouseY = e.clientY - canvasRect.top
}

// Mouse up event
function mouseUp(e){
    pressed[e.which-1] = false
    mouseX = e.clientX - canvasRect.left
    mouseY = e.clientY - canvasRect.top
}

// Mouse move event
function mouseMove(e){
    mouseX = e.clientX - canvasRect.left
    mouseY = e.clientY - canvasRect.top
}

// Key down event
function keyDown(e){
    switch(e.keyCode){
        case 32:
            A = 0
    }
}

// Image object that allows for image rendering functionality
function image(x, y, width, height, scaleX, scaleY, src){
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.src = src;
    this.update = function(){
        this.image.src = this.src;
        ctx.save()
        ctx.scale(this.scaleX, this.scaleY)
        ctx.drawImage(this.image, this.x/this.scaleX, this.y/this.scaleY, this.width, this.height)
        ctx.restore()
    }
}

// Stopwatch object that combines 5 images into one easy to access class
function stopwatch(x, y){
    this.bg = new image(x, y, 172, 62, 1, 1, "Sprites/StopwatchBG.png");
    this.num1 = new image(x + 13, y + 9, 49/2, 87/2, 1, 1, "Sprites/Num8.png");
    this.num2 = new image(x + 49, y + 9, 49/2, 87/2, 1, 1, "Sprites/Num8.png");
    this.num3 = new image(x + 95, y + 9, 49/2, 87/2, 1, 1, "Sprites/Num8.png");
    this.num4 = new image(x + 134, y + 9, 49/2, 87/2, 1, 1, "Sprites/Num8.png");
    this.nums = [this.num1, this.num2, this.num3, this.num4]
    this.update = function(){
        this.bg.update();
        for(var i = 0; i < this.nums.length; i++){
            this.nums[i].update();
        }
    }
    this.setNum = function(index, num){
        this.nums[index].src = "Sprites/Num" + num + ".png";
    }
}