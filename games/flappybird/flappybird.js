// SELECT CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const background = new Image();
background.src = "img/background.png";

const birdUp = new Image();
birdUp.src = "img/birdUp.png";

const birdMid = new Image();
birdMid.src = "img/birdMid.png";

const birdDown = new Image();
birdDown.src = "img/birdDown.png";

const pipeTop = new Image();
pipeTop.src = "img/pipeTop.png";

const pipeBottom = new Image();
pipeBottom.src = "img/pipeBottom.png";

const gameOver = new Image();
gameOver.src = "img/gameOver.png";

const start = new Image();
start.src = "img/start.png";

const base = new Image();
base.src = "img/base.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

// CONTROL THE GAME
cvs.addEventListener("click", click);
document.addEventListener("keydown", keydown);

function click(e) {
    switch(state.current){
        case state.getReady:
          state.current = state.game;
          SWOOSHING.play();
          break;
        case state.game:
          if(bird.y - bird.radius <= 0) return;
          bird.flap();
          FLAP.play();
          break;
        case state.over:
          pipes.reset();
          bird.speedReset();
          //score.reset();
          state.current = state.getReady;
          break;
    }
}

function keydown(e) {
  if(e.keycode || e.which != 32) return;
  switch(state.current){
      case state.getReady:
        pipes.reset();
        bird.speedReset();
        score.reset();
        state.current = state.game;
        SWOOSHING.play();
        break;
      case state.game:
        if(bird.y - bird.radius <= 0) return;
        bird.flap();
        FLAP.play();
        break;
      case state.over:
        pipes.reset();
        bird.speedReset();
        score.reset();
        state.current = state.getReady;
        break;
  }
}


// BACKGROUND
const bg = {
  x : 0,
  y : 0,
    
  draw : function(){
    ctx.drawImage(background, this.x, this.y);
  }    
}

// FOREGROUND
const fg = {
  x : 0,
  y : cvs.height - 112,

  velX : 1,
  w : 336,

  draw : function(){
    ctx.drawImage(base, this.x, this.y);
    ctx.drawImage(base, this.w + this.x, this.y);
  },

  update : function(){
    if(state.current == state.game){
        this.x = (this.x - this.velX)%(this.w/2);
    }
  }
}

// GET READY SCREEN
const ready = {
  x : cvs.width/2 - 184/2,
  y : 20,

  draw : function() {
    if(state.current === state.getReady)
      ctx.drawImage(start, this.x, this.y);
  }
}

// GAME OVER SCREEN
const over = {
  x : cvs.width/2 - 192/2,
  y : 100,

  draw : function() {
    if(state.current === state.over)
      ctx.drawImage(gameOver, this.x, this.y);
  }
}

// BIRD
const bird = {
  states : [birdUp, birdMid, birdDown, birdMid],
  x : 70,
  y : 210,
  frame : 0,
  jump : 3,
  gravity : 0.05,
  speed : 0,
  period : 0,

  draw : function() {
    ctx.drawImage(this.states[this.frame], this.x, this.y);
  },

  flap : function() {
    this.speed = -this.jump;
  },

  update : function() {
    this.period = state.current === state.getReady ? 10 : state.current === state.game ? 5 : 30;
    this.frame += currentFrame % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.states.length;

    if(state.current === state.getReady) {
      this.x = 70;
      this.y = 210;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if(this.y + 12 >= fg.y) {
        this.y = fg.y - 12;
        if(state.current === state.game) {
          state.current = state.over;
          DIE.play();
        }
      }
    }

  },

  speedReset : function() {
    this.speed = 0;
  }
}

// PIPES
const pipes = {
  positions : [],

  infront : [],

  top : pipeTop,

  bottom : pipeBottom,

  velX : 1,

  gap : 100,

  draw : function() {
    for(let i = 0; i < this.positions.length; i++) {
      let pos = this.positions[i];
      ctx.drawImage(this.top, pos.x, pos.y, 50, 400);
      ctx.drawImage(this.bottom, pos.x, pos.y + 400 + this.gap, 50, 400);
    }
    
  },

  update : function() {
    if(state.current !== state.game) return;

    if(currentFrame % 250 == 0) {
      this.positions.push({
        x : cvs.width,
        y : -150 * (Math.random() + 1)
      });
      this.infront.push({
        x : cvs.width,
        y : -150 * (Math.random() + 1)
      });
    }

    for(let i = 0; i < this.positions.length; i++) {
      let pos = this.positions[i];
      let bottomY = pos.y + 400 + this.gap;
      
      
      if(bird.x + 34 > pos.x && bird.x < pos.x + 50 && bird.y + 24 > pos.y && bird.y < pos.y + 400) {
        state.current = state.over;
        HIT.play();
      }

    
      if(bird.x + 34 > pos.x && bird.x < pos.x + 50 && bird.y + 24 > bottomY && bird.y < bottomY + 400) {
        state.current = state.over;
        HIT.play();
      }

      pos.x -= this.velX;
      if(pos.x + 50 <= 0) {
        this.positions.shift();
      }
    }

    for(let i = 0; i < this.infront.length; i++) {
      let pos = this.infront[i];

      if(bird.x > pos.x + 50) {
        this.infront.shift();
        score.score++;
      }

      pos.x -= this.velX;
      if(pos.x + 50 <= 0) {
        this.infront.shift();
      }
    }
    console.log(this.infront);
  },

  reset : function() {
    this.positions = [];
    this.infront = [];
  }
}

// SCORE
const score = {
  score : 0,

  draw : function() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "000";

    if(state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "40px Teko";
      ctx.fillText(this.score, cvs.width/2 - 13, 50);
      ctx.strokeText(this.score, cvs.width/2 - 13, 50);
      console.log('draw');
    } else if(state.current == state.over) {
      ctx.lineWidth = 2;
      ctx.font = "40px Teko";
      ctx.fillText(this.score, cvs.width/2 - 13, 250);
      ctx.strokeText(this.score, cvs.width/2 - 13, 250);
    }
  },

  reset : function() {
    this.score = 0;
  }

}
let frameRate = 175;
let currentFrame = 0;

function draw() {
  bg.draw();
  pipes.draw();
  fg.draw();
  score.draw();
  bird.draw();
  ready.draw();
  over.draw();
  
}

function update() {
  fg.update();
  bird.update();
  pipes.update();
}

setInterval(() => {
  requestAnimationFrame(loop);
}, 1000/frameRate);

function loop(){
  if(state.current == state.getReady) {
    pipes.reset();
    bird.speedReset();
    score.reset();
  }
  currentFrame++;
  draw();
  update();
}