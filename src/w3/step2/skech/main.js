// 옛방식
// var ballPosX;
// 선언과 초기화 분리된 방식
// let ballPosX;
// ballPosX = 100;
// 선언과 초기화 통합된 방식
let ballPosX = 100;
let ballPosY = 200;

let ballDiameter = 100;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(127);
  // fill(255, 0, 0);
  // fill("red");
  fill("#ff0000");
  noStroke();
  circle(0, 0, 100);
  fill("skyblue");
  stroke("orange");
  strokeWeight(4);
  circle(width, height, 100);
  fill("green");
  stroke("pink");
  circle(0.5 * width, 0.5 * height, 100);
  fill("black");
  noStroke();
  circle(mouseX, mouseY, 100);
  fill("white");
  circle(mouseY, mouseX, 100);
  fill("blue");
  circle(ballPosX, ballPosY, ballDiameter);

  //ballPosX = ballPosX + 1;
  //ballPosX += 1;
  //ballPosX++;

  ballPosX += 4;
  if (ballPosX > width + 0.5 * ballDiameter) {
    ballPosX -= width + ballDiameter;
  } else if (ballPosX < -0.5 * ballDiameter) {
    ballPosX += width + ballDiameter;
  }

  ballPosY += 2;
  if (ballPosY > height + 0.5 * ballDiameter) {
    ballPosY -= height + ballDiameter;
  } else if (ballPosX < -0.5 * ballDiameter) {
    ballPosY += height + ballDiameter;
  }
}
