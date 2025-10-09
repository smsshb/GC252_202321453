let aBall;
let bBall;
let cBall;
let dBall;

function setup() {
  createCanvas(600, 400);
  aBall = new Ball(0.5 * width, 0.5 * height, 100, 7, "red");
  bBall = new Ball(0.5 * width, 0.5 * height, 50, 10, "blue");
  cBall = new Ball(0.5 * width, 0.5 * height, 200, 3, "yellow");
  dBall = new Ball(0.5 * width, 0.5 * height, 150, 2, "pink");
}

function draw() {
  background(127);

  aBall.update();
  aBall.resolveWallCollision();
  aBall.show();
  bBall.update();
  bBall.resolveWallCollision();
  bBall.show();
  cBall.update();
  cBall.resolveWallCollision();
  cBall.show();
  dBall.update();
  dBall.resolveWallCollision();
  dBall.show();

  fill("black");
  noStroke();
  circle(mouseX, mouseY, 50);
}

function mousePressed() {
  // aBall.reset(mouseX, mouseY);
  aBall.reset(0.5 * width, 0.5 * height);
  bBall.reset(0.5 * width, 0.5 * height);
  cBall.reset(0.5 * width, 0.5 * height);
  dBall.reset(0.5 * width, 0.5 * height);
}
