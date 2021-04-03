const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = 600;

let done;
let result;

let board;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = ['','','','','','','','',''];
init();

var interval;

function init() {
    done = false;
    ctx.fillStyle = 'GhostWhite';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'Black';
    ctx.beginPath();
    ctx.moveTo(canvas.width/3, 0);
    ctx.lineTo(canvas.width/3, canvas.height);
    ctx.moveTo(2*canvas.width/3, 0);
    ctx.lineTo(2*canvas.width/3, canvas.height);
    ctx.moveTo(0, canvas.height/3);
    ctx.lineTo(canvas.width, canvas.height/3);
    ctx.moveTo(0, 2*canvas.height/3);
    ctx.lineTo(canvas.width, 2*canvas.height/3);
    ctx.stroke();
    board = [];
    for(let i = 0; i < 9; i++) {
        board.push(i);
    }
    
    interval = setInterval(function(){
        if(done) {
            clearInterval(interval);
            setTimeout(function(){
                ctx.fillStyle = 'GhostWhite';
                ctx.fillRect(0,0,canvas.width, canvas.height);
                ctx.font = "100px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(result, canvas.width/2, canvas.height/2);
            }, 250);
        }
        requestAnimationFrame(draw);
    }, 1000/10); 
}

canvas.addEventListener('click', getClickPosition, false);

function getClickPosition(e) {
    if(done) return;
    
    let x = e.pageX - this.offsetLeft; 
    let y = e.pageY - this.offsetTop; 
    let square = -1;

    if(x >= 0 && x < canvas.width/3 && y >= 0 && y < canvas.height/3) {
        square = 0;
    } else if(x >= canvas.width/3 && x < 2*canvas.width/3 && y >= 0 && y < canvas.height/3) {
        square = 1;
    } else if(x >= 2*canvas.width/3 && x < canvas.width && y >= 0 && y < canvas.height/3) {
        square = 2;
    } 
    else if(x >= 0 && x < canvas.width/3 && y >= canvas.height/3 && y < 2*canvas.height/3) {
        square = 3;
    } else if(x >= canvas.width/3 && x < 2*canvas.width/3 && y >= canvas.height/3 && y < 2*canvas.height/3) {
        square = 4;
    } else if(x >= 2*canvas.width/3 && x < canvas.width && y >= canvas.height/3 && y < 2*canvas.height/3) {
        square = 5;
    } 
    else if(x >= 0 && x < canvas.width/3 && y >= 2*canvas.height/3 && y < canvas.height) {
        square = 6;
    } else if(x >= canvas.width/3 && x < 2*canvas.width/3 && y >= 2*canvas.height/3 && y < canvas.height) {
        square = 7;
    } else if(x >= 2*canvas.width/3 && x < canvas.width && y >= 2*canvas.height/3 && y < canvas.height) {
        square = 8;
    }
    turnClick(square);
}

function draw() {
    for(let i = 0; i < 9; i++) {
        let x, y;
            switch(i+1) {
                case 1: {
                    x = 1;
                    y = 1;
                    break;
                }
                case 2: {
                    x = 3;
                    y = 1;
                    break;
                }
                case 3: {
                    x = 5;
                    y = 1;
                    break;
                }
                case 4: {
                    x = 1;
                    y = 3;
                    break;
                }
                case 5: {
                    x = 3;
                    y = 3;
                    break;
                }
                case 6: {
                    x = 5;
                    y = 3;
                    break;
                }
                case 7: {
                    x = 1;
                    y = 5;
                    break;
                }
                case 8: {
                    x = 3;
                    y = 5;
                    break;
                }
                case 9: {
                    x = 5;
                    y = 5;
                    break;
                }
            }
        if(board[i] === huPlayer) {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x * canvas.width/6, y * canvas.height/6, canvas.width/8, 0, 2 * Math.PI, false);
            ctx.stroke();
        }
        if(board[i] === aiPlayer) {

            
            ctx.beginPath();
            ctx.moveTo(x * canvas.width/6, y * canvas.height/6);
            ctx.lineTo(x * canvas.width/6 + canvas.width/6 - canvas.width/18, y * canvas.height/6 + canvas.height/6  - canvas.width/18) ;

            ctx.moveTo(x * canvas.width/6, y * canvas.height/6);
            ctx.lineTo(x * canvas.width/6 - canvas.width/6 + canvas.width/18, y * canvas.height/6 + canvas.height/6 - canvas.width/18);
            
            ctx.moveTo(x * canvas.width/6, y * canvas.height/6);
            ctx.lineTo(x * canvas.width/6 + canvas.width/6 - canvas.width/18, y * canvas.height/6 - canvas.height/6 + canvas.width/18);

            ctx.moveTo(x * canvas.width/6, y * canvas.height/6);
            ctx.lineTo(x * canvas.width/6 - canvas.width/6 + canvas.width/18, y * canvas.height/6 - canvas.height/6 + canvas.width/18);
            ctx.stroke();

        }
    }
    if(done) return;
}

function turnClick(square) {
    if(typeof board[square] != 'number')
        return;
    play(square, huPlayer);
    setTimeout(function(){
        if(!checkWin(board, huPlayer) && !checkTie()) {
            play(nextMove(), aiPlayer);
        }
    }, 100);
    
}

function nextMove() {
    let index = Math.floor(Math.random() * 9);
    while(board[index] === huPlayer || board[index] == aiPlayer) {
        index = Math.floor(Math.random() * 9);
    }
    return index;
}

function play(squareID, player) {
    console.log(squareID);
    console.log(player);
    board[squareID] = player;
    let won = checkWin(board, player);
    if(won) gameOver(player);
}

function checkWin(board, player) {
    for(let i = 0; i < winCombos.length; i++) {
        let won = true;
        for(let j = 0; j < 3; j++) {
            if(board[winCombos[i][j]] != player) {
                won = false;
            }
        }
        if(won) return won;
    }
    return false;
}

function gameOver(player) {
    requestAnimationFrame(draw);
    done = true;
    result = player === huPlayer ? "You win!" : "You lose.";
}


function checkTie() {
    let tie = true;
    for(let i = 0; i < 9; i++) {
        if(typeof board[i] == 'number')
            return false;
    }
    result = 'Tie!';
    done = true;
    return true;
}