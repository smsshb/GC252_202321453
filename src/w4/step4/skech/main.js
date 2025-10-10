const ballNum = 5;
const balls = [];
const diameter = 100;
const speed = 5;
const gravity = 0.1;
const restitution = 0.9;

function setup() {
  createCanvas(700, 800);

  for (let n = 0; n < ballNum; n++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(0);

  balls.forEach((aBall) => {
    aBall.applyGravity();
    aBall.update();
    aBall.resoveWallCollision();
    aBall.show();
    aBall.showDebug();
  });
}

function mousePressed() {
  balls.forEach((aBall) => {
    aBall.init();
  });
}
