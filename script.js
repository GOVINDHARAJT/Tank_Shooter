var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
///////////////////////////////////////////////////////////////////////
var tank_width = 130;
var tank_height = 130;
var tank_speed = 8;

var tank = new Map();
tank.set("X", canvas.width - 335);
tank.set("Y", canvas.height - 250);
tank.set("width", tank_width);
tank.set("height", tank_height);

var balls = [];
var ball_speed = 10;
var since_last_fire = performance.now();

var blocks = [];
var block_width = 140;
var block_height = 140;
var block_speed = 1;
var block_count = 3;

var lives = 3;
var level = 1;
var score = 0;

var right_pressed = false;
var left_pressed = false;
var up_pressed = false;
var down_pressed = false;
var space_pressed = false;

document.addEventListener("keydown", KeyDownFunc, false);
document.addEventListener("keyup", KeyUpFunc, false);

///////////////////////////////////////////////////////////////////////
//functions for keys
function KeyDownFunc(e) {
  if (e.keyCode == 39) {
    right_pressed = true;
  } else if (e.keyCode == 37) {
    left_pressed = true;
  }  else if (e.keyCode == 38) {
    up_pressed = true;
  } else if (e.keyCode == 40) {
    down_pressed = true;
  }  else if (e.keyCode == 32) {
    space_pressed = true;
  }
}

function KeyUpFunc(e) {
  if (e.keyCode == 39) {
    right_pressed = false;
  } else if (e.keyCode == 37) {
    left_pressed = false;
  } else if (e.keyCode == 38) {
    up_pressed = false;
  } else if (e.keyCode == 40) {
    down_pressed = false;
  } else if (e.keyCode == 32) {
    space_pressed = false;
  }
}
////////////////////////////////////////////////////////////////////////
//functions for button images 
function buttonsload(){
  ctx.beginPath();
  var up = new Image();
  up.src = 'images/up.png';
  ctx.drawImage(up, canvas.width - 110,canvas.height - 160, 60, 60);
  var right = new Image();
  right.src = 'images/right.png';
  ctx.drawImage(right, canvas.width - 60,canvas.height - 110, 60, 60);
  var left = new Image();
  left.src = 'images/left.png';
  ctx.drawImage(left, canvas.width - 160,canvas.height - 110, 60, 60);
  var down = new Image();
  down.src = 'images/down.png';
  ctx.drawImage(down, canvas.width - 110,canvas.height - 60, 60, 60);
  var space = new Image();
  space.src = 'images/space.png';
  ctx.drawImage(space, canvas.width - 1780,canvas.height - 100, 200, 60);
  ctx.closePath();
}
/////////////////////////////////////////////////////////////////////////
//function for draw tank
function drawTank() {
  ctx.beginPath();
  var img = new Image();
  img.src = 'images/tank.png';
  ctx.drawImage(img, tank.get("X"), tank.get("Y"), tank_width, tank_height);
  ctx.closePath();
}
///////////////////////////////////////////////////////////////////////
//function for generate the X and Y coordinates randomly to the blocks
function generateCoords() {
  do {
    var X = Math.random() * (canvas.width - 80) + 80;
  } while (X + 120 > canvas.width);

  var Y = Math.random() * (-260 - 60) - 60;
  return [X, Y];
}
///////////////////////////////////////////////////////////////////////
//function for check the space between randomly created blocks X and Y coordinates
function distanceCheck(X1, Y1, X2, Y2) {
  var distance = Math.sqrt(Math.pow(X1 - X2, 2) + Math.pow(Y1 - Y2, 2));
  if (distance > 140 && Math.abs(Y1 - Y2) > 40) {
    return true;
  } else {
    return false;
  }
}

function blockDistanceChecker(X, Y) {
  if (blocks.length == 0) {
    return false;
  }

  var check = false;
  for (i = 0; i < blocks.length; i++) {
    if (distanceCheck(X, Y, blocks[i].get("X"), blocks[i].get("Y"))) {
      check = check || false;
    } else {
      check = check || true;
    }
  }

  if (!check) {
    return false;
  } else {
    return true;
  }
}
/////////////////////////////////////////////////////////////////////////
//function for draw the new blocks
function drawNewBlock() {
  
 do {
    var coords = generateCoords();
    var X = coords[0];
    var Y = coords[1];
  } while (blockDistanceChecker(X, Y));

  var block = new Map();
  block.set("X", X);
  block.set("Y", Y);
  block.set("width", block_width);
  block.set("height", block_height);

  blocks.push(block);
}

function drawBlocks() {
  for (var i = 0; i < blocks.length; i++) {
    ctx.beginPath();
    var img = new Image();
    img.src = 'images/blocks.png';
    ctx.drawImage(img, blocks[i].get("X"), blocks[i].get("Y"), blocks[i].get("width"), blocks[i].get("height"));
    ctx.closePath();
  }
}

//function for to move the blocks through Y-axis
function moverFunc() {
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].set("Y", blocks[i].get("Y") + block_speed);
  if (blocks[i].get("Y") > canvas.height) {
    blocks.splice(i, 1);
    }
  }
}

///////////////////////////////////////////////////////////////////////////
//function for to find the collision between tank and blocks
function block_collision() {
  
  for (i = 0; i < blocks.length; i++) {
    var conflict_X = false;
    var conflict_Y = false;

    if (tank.get("X") + tank_width > blocks[i].get("X") && tank.get("X") < blocks[i].get("X") + 40) {
      conflict_X = conflict_X || true;
    }
    if (tank.get("Y") < blocks[i].get("Y") + 70 && tank.get("Y") > blocks[i].get("Y")) {
      conflict_Y = conflict_Y || true;
    }
    if (conflict_X && conflict_Y) {
      one = new Audio('audio/explosion.mp3');
      one.play();
      if(lives === 1) {
        one = new Audio('audio/explosion.mp3');
        one.play();
        swal('Game Over !', "Click the button play again", "images/game2.png",{ button: "Play Again!!!" });
        for (i = 0; i < blocks.length; i++)
        blocks.splice(i, block_count);
        tank.set("X", canvas.width - 335);
        tank.set("Y", canvas.height - 250);
        level = 1;
        lives = 4;
        block_speed = 1.5;
        block_count = 1;
        score = 0;
      }

      if(lives>=0) {
        if(lives===3)
        swal('Two More Lives!', "Click the button play again", "images/red2.png",{ button: "Play Again!!!" });
        if(lives===2)
        swal('One More Life!', "Click the button play again", "images/red1.jpg",{ button: "Play Again!!!" });
        lives -= 1;
      }

      
      blocks.splice(i, block_count);
      
      tank.set("X", canvas.width - 335);
      tank.set("Y", canvas.height - 250);
      
    }
  }
}
/////////////////////////////////////////////////////////////////////////////
//function for to detect the collision between ball and blocks
function collision_detector(first, second) {
  var x1 = first.get("X");
  var y1 = first.get("Y");
  var width1 = first.get("width");
  var height1 = first.get("height");
  var x2 = second.get("X");
  var y2 = second.get("Y");
  var width2 = second.get("width");
  var height2 = second.get("height");

  if (x2 > x1 && x2 < x1 + width1 || x1 > x2 && x1 < x2 + width2) {
    if (y2 > y1 && y2 < y1 + height1 || y1 > y2 && y1 < y2 + height2) {
      return true;
    }
  } else {
    return false;
  }
}

function ball_block_collision() {
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    for (var j = 0; j < balls.length; j++) {
      var ball = balls[j];
      if (collision_detector(block, ball)) {
        one = new Audio('audio/explosion.mp3');
        one.play();
        var img = new Image();
        img.src = 'images/explosion1.png';
        ctx.drawImage(img, blocks[i].get("X"), blocks[i].get("Y"), blocks[i].get("width"), blocks[i].get("height"));
        balls.splice(j, 1);
        blocks.splice (i, 1);
        score += 1;
        if(score==10){
        level += 1;
        block_speed += 0.2;
        block_count += 2;
      }
      //level 2
      if(score==20){
        level += 1;
        block_speed += 0.3;
        block_count += 2;
      }
      //level 3
      if(score==50){
        level += 1;
        block_speed += 0.5;
        block_count += 2;
      }
      //level 4
      if(score==100){
        level += 1;
        block_speed += 0.8;
        block_count += 2;
      }
      //level 5
      if(score==200){
        level += 1;
        block_speed += 1;
        block_count += 5;
      }

      }
    } 
  }
}

///////////////////////////////////////////////////////////////////////////
//function for draw balls
function drawNewBall(ball_X, ball_Y) {
  ctx.beginPath();
  ctx.arc(ball_X, ball_Y, 15, 0, Math.PI * 2);

  var ball = new Map();
  ball.set("X", ball_X);
  ball.set("Y", ball_Y);
  ball.set("width", 3);
  ball.set("height", 3);
  balls.push(ball);
  since_last_fire = performance.now();
}

function drawBalls() {
  for (var i = 0; i < balls.length; i++) {
    ctx.beginPath();
    ctx.arc(balls[i].get("X"), balls[i].get("Y"), 15, 0, Math.PI * 2);
    ctx.fillStyle = "#e25822";
    ctx.fill();
    ctx.closePath();
  }
}
//function for to move the balls throw Y-axis
function moveBalls() {
  for (var i = 0; i < balls.length; i++) {
    balls[i].set("Y", balls[i].get("Y") - ball_speed);
  if (balls[i].get("Y") < 0) {
      balls.splice(i, 1);
    }
  }
}
///////////////////////////////////////////////////////////////////////
function drawInfo() {
  ctx.font = "bold 25px Bungee Shade";
  ctx.fillStyle = "Yellow";
  ctx.fillText("Lives: " + lives, 13, 75);
  ctx.fillText("Score: " + score, 13, 30);
  ctx.fillText("Level: " + level, canvas.width-180, 60);
  ctx.font = "bold 50px Bungee Shade";
  ctx.fillStyle = "lightgrey";
  ctx.fillText("TANK SHOOTER",700,300);
  
}
function moveaudio()
{
  one = new Audio('audio/move.mp3');
  one.play();
}

///////////////////////////////////////////////////////////////////////
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawInfo();
  drawTank();
  drawBalls();
  drawBlocks();
  moveBalls();
  block_collision();
  ball_block_collision();
  moverFunc();
  buttonsload();

  if (right_pressed && tank.get("X") + tank_width < canvas.width) {
    tank.set("X", tank.get("X") + tank_speed);
    moveaudio();
  }
  if (left_pressed && tank.get("X") > 0) {
    tank.set("X", tank.get("X") - tank_speed);
    moveaudio();
  }
  if (up_pressed && tank.get("Y") > 0) {
    tank.set("Y", tank.get("Y") - tank_speed);
    moveaudio();
  }
  if (down_pressed && tank.get("Y") + tank_height < canvas.height) {
    tank.set("Y", tank.get("Y") + tank_speed);
    moveaudio();
  }
  if (space_pressed && balls.length < 30 && performance.now() - since_last_fire > 600) {
    one = new Audio('audio/cannon.mp3');
    one.play();
    drawNewBall(tank.get("X") + 45, tank.get("Y") );
  }
  if (blocks.length < block_count) {
    drawNewBlock();
  }
  requestAnimationFrame(draw);
}

draw();   
