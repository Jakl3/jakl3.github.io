const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = 600;

const FR = 10;
const tile_size = 20;
const screen_size = canvas.width / tile_size;

let pos, vel, food, snake;

function init() {
    pos = {x: 10, y: 10};
    vel = {x: 0, y: 0};
    snake = [
        {x: 8, y: 10},
        {x: 9, y: 10},
        {x: 10, y: 10}
    ]

    randomFood();
}

init();

function randomFood() {
    food = {
        x: Math.floor(Math.random() * tile_size),
        y: Math.floor(Math.random() * tile_size)
    }
    for(let tile of snake) {
        if(tile.x === food.x && tile.y === food.y) {
            console.log('food');
            return randomFood();
        }
    }
}

document.addEventListener('keydown', keydown);

function keydown(e) {
    let k = e.which || e.keyCode;
    console.log(k);
    switch(k) {
        case 37: {
            vel.x = -1;
            vel.y = 0;
            return;
        }
        case 38: {
            vel.x = 0;
            vel.y = -1;
            return;
        }
        case 39: {
            vel.x = 1;
            vel.y = 0;
            return;
        }
        case 40: {
            vel.x = 0;
            vel.y = 1;
            return;
        }
    }
}

setInterval(() => {
    requestAnimationFrame(gameLoop);
}, 1000/FR);

gameLoop();

function gameLoop() {

    ctx.fillStyle = 'Black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'Lime';
    for(let tile of snake) {
        ctx.fillRect(tile.x * tile_size, tile.y * tile_size, tile_size, tile_size);
    }

    ctx.fillStyle = 'Red';
    ctx.fillRect(food.x * tile_size, food.y * tile_size, tile_size, tile_size);

    pos.x += vel.x;
    pos.y += vel.y;

    if(pos.x < 0 || pos.x > screen_size || pos.y < 0 || pos.y > screen_size) {
        return init();
    }

    if(food.x === pos.x && food.y === pos.y) {
        snake.push({...pos});
        pos.x += vel.x;
        pos.y += vel.y;
        randomFood();
    }

    if(vel.x != 0 || vel.y != 0) {
        for(let tile of snake) {
            if(tile.x === pos.x && tile.y === pos.y) {
                return init();
            }
        }
        snake.push({...pos});
        snake.shift();
    }
    
}