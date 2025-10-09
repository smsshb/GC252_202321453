let ballPosX;
let ballPosY;
let ballDiameter = 50;
let speed = 5;
let ballVelX = 4;
let ballVelY = -3;

let ballPosX2;
let ballPosY2;
let ballDiameter2 = 80;
let speed2 = 3;
let ballVelX2 = 3;
let ballVelY2 = 4;

function setup() {
  createCanvas(600, 400);
  ballPosX = width * 0.5;
  ballPosY = height * 0.5;

  ballPosX2 = width * 0.5;
  ballPosY2 = height * 0.5;
}

function draw() {
  background(127);

  fill("blue");
  circle(ballPosX, ballPosY, ballDiameter);

  fill("red");
  circle(ballPosX2, ballPosY2, ballDiameter2);

  fill("black");
  noStroke();
  circle(mouseX, mouseY, 50);

  ballPosX += ballVelX;
  if (ballPosX > width - 0.5 * ballDiameter) {
    ballVelX *= -1;
  } else if (ballPosX < 0.5 * ballDiameter) {
    ballVelX *= -1;
  }
  ballPosY += ballVelY;
  if (ballPosY > height - 0.5 * ballDiameter) {
    ballVelY *= -1;
  } else if (ballPosY < 0.5 * ballDiameter) {
    ballVelY *= -1;
  }

  ballPosX2 += ballVelX2;
  if (ballPosX2 > width - 0.5 * ballDiameter2) {
    ballVelX2 *= -1;
  } else if (ballPosX2 < 0.5 * ballDiameter2) {
    ballVelX2 *= -1;
  }
  ballPosY2 += ballVelY2;
  if (ballPosY2 > height - 0.5 * ballDiameter2) {
    ballVelY2 *= -1;
  } else if (ballPosY2 < 0.5 * ballDiameter2) {
    ballVelY2 *= -1;
  }
}

function mousePressed() {
  // ballPosX = mouseX;
  // ballPosY = mouseY;
  ballPosX = width * 0.5;
  ballPosY = height * 0.5;
  let randomAngle = random(360);
  ballVelX = speed * cos(radians(randomAngle));
  ballVelY = speed * sin(radians(randomAngle));

  ballPosX2 = width * 0.5;
  ballPosY2 = height * 0.5;
  randomAngle = random(360);
  ballVelX2 = speed2 * cos(radians(randomAngle));
  ballVelY2 = speed2 * sin(radians(randomAngle));
}
