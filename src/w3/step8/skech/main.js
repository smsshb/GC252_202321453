let pallete = ["#EF7722", "#FAA533", "#EBEBEB", "#0BA6DF"];

let balls = [];
let gravity;

function setup() {
  createCanvas(600, 400);
  for (let n = 0; n < 100; n++) {
    createBall(0.5 * width, 0.5 * height, pallete[n % pallete.length], [1, 5]);
  }

  gravity = createVector(0, 0.1);
}

function createBall(x, y, colour, speed) {
  balls.push(new Ball(x, y, 10, colour, speed, 30));
}

function draw() {
  background(0);

  for (let n = 0; n < 5; n++) {
    createBall(
      0.5 * width,
      0.5 * height,
      pallete[floor(random(pallete.length))],
      [1, 5]
    );
  }

  balls.forEach((aBall) => {
    aBall.applyGravity(gravity);
    aBall.update();
  });

  for (let idx = balls.length - 1; idx >= 0; idx--) {
    if (!balls[idx].isInsideCanvas()) {
      balls.splice(idx, 1);
    }
  }

  balls.forEach((aBall) => {
    aBall.show();
  });

  fill("white");
  noStroke();
  circle(mouseX, mouseY, 50);
}

function mousePressed() {
  console.log(balls.length);
}
