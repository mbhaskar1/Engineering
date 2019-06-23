var tbl = null;
var board;
var size = 5;
var width = 75;
var deltaTime = 10;
var gameOver = false;
var minMoves = 0;
var level = 0;
var movesMade = 0;
var score = 0;
var clickAllowed = true;

function init(){
    clickAllowed = true;
    if(tbl != null){
        tbl.parentNode.removeChild(tbl);
    }
    tbl = document.createElement("table");
    tbl.style.width = size * width + "px";
    tbl.style.height = size * width + "px";

    board = new Array();

    for(var i = 0; i < size; i++){
        var tr = document.createElement("tr");
        board[i] = [];
        for(var j = 0; j < size; j++){
            var td = document.createElement("td");
            td.className = "white"
            td.id = i + ", " + j;
            td.onclick = function(){if(clickAllowed)click(parseInt(this.id.charAt(0)), parseInt(this.id.charAt(3)), true, false)};
            tr.appendChild(td);
            board[i][j] = 0;
        }
        tbl.appendChild(tr);
    }
    document.body.insertBefore(tbl, document.body.childNodes[8])
    for(var i = 0; i < 100; i++){
        click(Math.floor(Math.random() * size), Math.floor(Math.random() * size), false);
    }
    updateBoard();
    solution(false)
    minMoves = 0;
    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            if(sol[i][j] == 1){
                minMoves++;
            }
        }
    }
    min.innerHTML = "Min Moves: " + minMoves;

    level++;
    lvl.innerHTML = "Level " + level;
    movesMade = 0;
    moves.innerHTML = "Moves: 0";
    s.innerHTML = "Score: " +  score;
}

function updateBoard(){
    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            document.getElementById(i + ", " + j).className = board[i][j] == 0 ? "white" : "green";
        }
    }
    moves.innerHTML = "Moves: " + movesMade;
}

function click(i, j, update, bot=true){
    board[i][j] = toggle(board[i][j]);
    if(i - 1 >= 0)
        board[i - 1][j] = toggle(board[i - 1][j]);
    if(i + 1 < size)
        board[i + 1][j] = toggle(board[i + 1][j]);
    if(j - 1 >= 0)
        board[i][j - 1] = toggle(board[i][j - 1]);
    if(j + 1 < size)
        board[i][j + 1] = toggle(board[i][j + 1]);
    if(!bot){
        movesMade++;
    }
    if(update){
        updateBoard();
        if(checkWin()){
            win();
        }
    }
}

function toggle(light){
    return 1 - light;
}

function checkWin(){
    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            if(board[i][j] == 0){
                return false;
            }
        }
    }
    return true;
}

function win(){
    clickAllowed = false;
    if(!gameOver){
        var btn = document.createElement("button")
        btn.innerHTML = "Next";
        btn.onclick = function(){
            btn.parentNode.removeChild(btn);
            init();
        }
        document.body.appendChild(btn);
        score += 10 - (movesMade - minMoves)
        console.log(score);
    }else{
        var btn = document.createElement("button")
        btn.innerHTML = "Post Score";
        btn.onclick = function(){
            btn.parentNode.removeChild(btn);
            postScore()
        }
        var btn2 = document.createElement("button")
        btn2.innerHTML = "Restart";
        btn2.onclick = function(){
            btn2.parentNode.removeChild(btn2);
            restart()
            if(btn.parentNode!=null){
                btn.parentNode.removeChild(btn);
            }
            if(solTbl!=null){
                solTbl.parentNode.removeChild(solTbl);
            }
        }
        document.body.appendChild(btn);
        document.body.appendChild(btn2)
    }
}

leaderboard = []
function postScore(){
    var name = prompt("Enter your name (Max 10 characters): ").substring(0,10)
    leaderboard.push([name, score])
    leaderboard.sort(function(a,b){return b[1]-a[1]})
}

var shown = false
var lbTable = null
function showLeaderboard(){
    if(!shown){
        lbTable = document.createElement("table");
        var tr = document.createElement("tr")
        var th = document.createElement("th")
        th.innerHTML = "Name"
        var th2 = document.createElement("th")
        th2.innerHTML = "Score"
        tr.appendChild(th)
        tr.appendChild(th2)
        lbTable.appendChild(tr)
        for(var i = 0; i < leaderboard.length; i++){
            var row = document.createElement("tr")
            var td = document.createElement("td")
            td.innerHTML = leaderboard[i][0]
            var td2 = document.createElement("td")
            td2.innerHTML = "" + leaderboard[i][1]
            row.appendChild(td)
            row.appendChild(td2)
            lbTable.appendChild(row)
        }
        document.body.appendChild(lbTable)
        shown = true
        lbtn.innerHTML = "Hide Leaderboard"
    }else{
        lbTable.parentNode.removeChild(lbTable)
        shown = false
        lbtn.innerHTML = "Show Leaderboard"
    }
}

function restart(){
    level = 0
    score = 0
    gameOver = false
    init()
}

//Woah it's a 8x5x2 Array
var lctable5 = [
    [[1, 1 ,1, 1, 1],[1, 1, 1, 1, 1]],
    [[0, 1, 1, 1, 0],[0, 0, 1, 1, 1]],
    [[1, 0, 1, 0, 1],[0, 1, 1, 0, 1]],
    [[0, 0, 0, 1, 1],[1, 0, 1, 1, 1]],
    [[1, 1, 0, 0, 0],[1, 1, 1, 0, 1]],
    [[0, 1, 0, 0, 1],[1, 1, 1, 1, 0]],
    [[1, 0, 0, 1, 0],[0, 1, 1, 1, 1]],
    [[0, 0, 1, 0, 0],[1, 1, 0, 1, 1]]
]

function solve(){
    clickAllowed = false;
    gameOver = true;
    if(size == 4){
        initialPropagation(function(){});
    }else if(size == 5){
        initialPropagation(function(){
            var row = getBottomRow();
            var index;
            for(var i = 0; i < lctable5.length; i++){
                if(equalArrays(row, lctable5[i][0])){
                    index = i;
                    break;
                }
            }
            console.log(index)
            clickTopRow(lctable5[index][1], function(){
                initialPropagation(function(){});
            });
        });
    }
}

function getBottomRow(){
    var row = [];
    for(var i = 0; i < size; i++){
        row[i] = board[size - 1][i];
    }
    return row;
}

function clickTopRow(row, callback){
    var i = 0;
    var interval = setInterval(function(){
        if(row[i] == 0){
            click(0, i, true, true);
        }
        i++
        if(i == size){
            window.clearInterval(interval);
            callback();
        }
    }, deltaTime);
}

//Checks if two arrays are equal
//Assumes equal length
function equalArrays(arr1, arr2){
    for(var i = 0; i < arr1.length; i++){
        if(arr1[i] != arr2[i]){
            return false;
        }
    }
    return true;
}

function initialPropagation(callback){
    var i = 0;
    var j = 0;
    var interval = setInterval(function(){
        if(board[i][j] == 0){
            click(i + 1, j, true, true);
        }
        j++;
        if(j == size){
            j = 0;
            i++;
        }
        if(i == size - 1){
            window.clearInterval(interval);
            callback();
        }
    }, deltaTime);
}

////////////////////////////
// Solution Board Creator //
////////////////////////////

var sol;
var solTbl = null;
var testBoard;
function solution(user){
    if(user){
        gameOver = true;
        if(solTbl != null && solTbl.parentNode != null){
            solTbl.parentNode.removeChild(solTbl);
        }
    }
    sol = [];
    for(var i = 0; i < size; i++){
        sol[i] = [];
        for(var j = 0; j < size; j++){
            sol[i][j] = 0;
        }
    }
    testBoard = [];
    for(var i = 0; i < size; i++){
        testBoard[i] = board[i].slice();
    }
    if(size == 4){
        initialPropagationCalc();
    }else if(size == 5){
        initialPropagationCalc()
        var row = getBottomRowCalc();
        var index;
        for(var i = 0; i < lctable5.length; i++){
            if(equalArrays(row, lctable5[i][0])){
                index = i;
                break;
            }
        }
        clickTopRowCalc(lctable5[index][1]);
        initialPropagationCalc();
    }

    if(user){
        solTbl = document.createElement("table");
        solTbl.style.width = size * width + "px";
        solTbl.style.height = size * width + "px";

        for(var i = 0; i < size; i++){
            var tr = document.createElement("tr");
            for(var j = 0; j < size; j++){
                var td = document.createElement("td");
                td.className = sol[i][j] == 0 ? "white" : "red";
                tr.appendChild(td);
            }
            solTbl.appendChild(tr);
        }
        document.body.appendChild(solTbl)
    }
}

function initialPropagationCalc(){
    for(var i = 0; i < size - 1; i++){
        for(var j = 0; j < size; j++){
            if(testBoard[i][j] == 0){
                clickCalc(i + 1, j);
            }
        }
    }
}

function getBottomRowCalc(){
    var row = [];
    for(var i = 0; i < size; i++){
        row[i] = testBoard[size - 1][i];
    }
    return row;
}

function clickTopRowCalc(row){
    for(var i = 0; i < size; i++){
        if(row[i] == 0){
            clickCalc(0, i);
        }
    }
}

function clickCalc(i, j){
    testBoard[i][j] = toggle(testBoard[i][j]);
    if(i - 1 >= 0)
        testBoard[i - 1][j] = toggle(testBoard[i - 1][j]);
    if(i + 1 < size)
        testBoard[i + 1][j] = toggle(testBoard[i + 1][j]);
    if(j - 1 >= 0)
        testBoard[i][j - 1] = toggle(testBoard[i][j - 1]);
    if(j + 1 < size)
        testBoard[i][j + 1] = toggle(testBoard[i][j + 1]);
    sol[i][j] = toggle(sol[i][j]);
}
