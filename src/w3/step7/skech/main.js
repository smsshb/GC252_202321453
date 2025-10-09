let pallete = ["#01161e", "#124559", "#598392", "#aec3b0"];

let balls = [];

function setup() {
  createCanvas(600, 400);

  balls.push(new Ball(0.5 * width, 0.5 * height, 100, 7, pallete[0]));
  balls.push(new Ball(0.5 * width, 0.5 * height, 50, 10, pallete[1]));
  balls.push(new Ball(0.5 * width, 0.5 * height, 200, 3, pallete[2]));
  balls.push(new Ball(0.5 * width, 0.5 * height, 150, 2, pallete[3]));
  for (let n = 0; n < 20; n++) {
    balls.push(
      new Ball(0.5 * width, 0.5 * height, 50, 3, pallete[n % pallete.length])
    );
  }
}

function draw() {
  background(127);

  // if (mouseIsPressed) {
  //   createBall();
  // }

  balls.forEach((aBall) => {
    aBall.update();
    aBall.resolveWallCollision();

    aBall.show();
  });

  fill("black");
  noStroke();
  circle(mouseX, mouseY, 50);
}

function mousePressed() {
  // createBall();
  for (let idx = balls.length - 1; idx >= 0; idx--) {
    if (balls[idx].isHovered()) {
      balls.splice(idx, 1);
    }
  }
}

function createBall() {
  let dist = [mouseX, width - mouseX, mouseY, height - mouseY];
  let minDist = min(dist);
  let randomDiameter = random(2 * minDist);
  if (randomDiameter > 100) randomDiameter = 100;
  let randomSpeed = random(3, 10);
  balls.push(
    new Ball(
      mouseX,
      mouseY,
      randomDiameter,
      randomSpeed,
      pallete[balls.length % pallete.length]
    )
  );
}
