//States
EMPTY = 0;
SNAKE = 1;
WALL = 2;
FOOD = 3;

//Directions
UP = 0;
RIGHT = 1;
DOWN = 2;
LEFT = 3;

//Colors
colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

var board = [];
var snake = [];
var food = [];
var dir = UP;
var nextDir = UP;
var score = 0;

var size = [];

function createBoard(x, y){
    size[0] = x;
    size[1] = y;

    tbl = document.createElement("table");
    tbl.style.width = x * 20 + "px";
    tbl.style.height = y * 20 + "px";
    board = [];
    for(var i = 0; i < x; i++){
        tr = document.createElement("tr");
        board[i] = [];
        for(var j = 0; j < y; j++){
            td = document.createElement("td");
            td.className = "white";
            td.id = i + ", " + j;
            tr.appendChild(td);
            board[i][j] = EMPTY;
        }
        tbl.appendChild(tr);
    }
    document.body.appendChild(tbl);
}

function initBoard(){
    //Create Walls
    for(var i = 0; i < size[0]; i++){
        board[i][0] = WALL;
        board[i][size[1] - 1] = WALL;
    }
    for(var i = 0; i < size[1]; i++){
        board[0][i] = WALL;
        board[size[0] - 1][i] = WALL;
    }

    //Create Snake
    snake = [];
    for(var i = 0; i < 5; i++){
        snake[i] = [Math.floor(size[0]/2) + i, Math.floor(size[1]/2)]
        board[snake[i][0]][snake[i][1]] = SNAKE;
    }

    food = newFood();
    board[food[0]][food[1]] = FOOD;
}

var interval = null;

function startGame(){
    interval = setInterval(function(){
        nextStep();
        updateBoard();
    }, 100);
}

function updateBoard(){
    for(var i = 0; i < size[0]; i++){
        for(var j = 0; j < size[1]; j++){
            switch(board[i][j]){
                case EMPTY:
                    document.getElementById(i + ", " + j).className = "white";
                    break;
                case WALL:
                    document.getElementById(i + ", " + j).className = "blue";
                    break;
                case FOOD:
                    document.getElementById(i + ", " + j).className = "red";
                    break;
                default:
                    document.getElementById(i + ", " + j).className = "yellow";
            }
        }
    }

    for(var i = 0; i < snake.length; i++){
        document.getElementById(snake[i][0] + ", " + snake[i][1]).className = colors[i % 7];
    }
}

function updateSnake(){
    for(var i = 1; i < size[0] - 1; i++){
        for(var j = 1; j < size[1] - 1; j++){
            board[i][j] = EMPTY;
        }
    }
    board[food[0]][food[1]] = FOOD;
    for(var i = 0; i < snake.length; i++){
        board[snake[i][0]][snake[i][1]] = SNAKE;
    }
}

var extended = false;

function nextStep(){
    dir = nextDir;
    var temp = snake[0];
    snake[0] = stepInDir(snake[0]);
    for(var i = 1; i < snake.length; i++){
        var a = snake[i];
        snake[i] = temp;
        temp = a;
    }
    if(extended){
        snake.push(temp);
        extended = false;
    }

    //Check for Food
    if(board[snake[0][0]][snake[0][1]] == FOOD){
        score++;
        document.getElementById("score").innerHTML = "Score: " + score;
        extended = true;
    }

    //Check for Game Over
    if(board[snake[0][0]][snake[0][1]] == WALL){
        gameOver();
    }
    for(var i = 1; i < snake.length; i++){
        if(snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]){
            gameOver();
        }
    }

    updateSnake();

    if(extended){
        food = newFood();
        board[food[0]][food[1]] = FOOD;
    }
}

function newFood(){
    poss = [];
    for(var i = 1; i < size[0] - 1; i++){
        for(var j = 1; j < size[1] - 1; j++){
            if(board[i][j] == EMPTY){
                poss.push([i, j]);
            }
        }
    }

    return poss[Math.floor(Math.random() * poss.length)];
}

function stepInDir(coord){
    switch(dir){
        case UP:
            return [coord[0] - 1, coord[1]]
        case RIGHT:
            return [coord[0], coord[1] + 1]
        case DOWN:
            return [coord[0] + 1, coord[1]]
        case LEFT:
            return [coord[0], coord[1] - 1]
    }
}

function changeDir(event){
    if(event.keyCode == 65 && dir != RIGHT){
        nextDir = LEFT;
    }else if(event.keyCode == 87 && dir != DOWN){
        nextDir = UP;
    }else if(event.keyCode == 68 && dir != LEFT){
        nextDir = RIGHT;
    }else if(event.keyCode == 83 && dir != UP){
        nextDir = DOWN;
    }
}

function gameOver(){
    clearInterval(interval);
}