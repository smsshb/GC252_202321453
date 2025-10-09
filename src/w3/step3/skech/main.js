let ballPosX;
let ballPosY;
let ballDiameter = 100;
let speed = 5;
let ballVelX = 4;
let ballVelY = -3;

function setup() {
  createCanvas(600, 400);
  ballPosX = width * 0.5;
  ballPosY = height * 0.5;
}

function draw() {
  background(127);

  fill("blue");
  circle(ballPosX, ballPosY, ballDiameter);

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
}

function mousePressed() {
  // ballPosX = mouseX;
  // ballPosY = mouseY;
  ballPosX = width * 0.5;
  ballPosY = height * 0.5;
  let randomAngle = random(360);
  ballVelX = speed * cos(radians(randomAngle));
  ballVelY = speed * sin(radians(randomAngle));
}
