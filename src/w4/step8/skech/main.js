const palette = ["#134686", "#ED3F27", "#FEB21A", "#FDF4E3"];

const ballNum = 5;
const balls = [];
const diameter = 100;
const speed = 5;
// const gravity = 0.1;
let gravity;
const restitution = 0.5;

let hoveredBall = null;
let grabbedBall = null;

let lastVx = 0;
let lastVy = 0;
const sampleNum = 10;
let mouseDeltas = [];

let wind;

function setup() {
  createCanvas(700, 800);

  for (let n = 0; n < ballNum; n++) {
    const randomDiameter = Math.random() * 150 + 50;
    const randomSpeed = Math.random() * 9 + 1;
    const randomPaletteIdx = Math.floor(Math.random() * palette.length);
    const randomColour = palette[randomPaletteIdx];
    balls.push(new Ball(randomDiameter, randomSpeed, randomColour));
  }

  gravity = createVector(0, 0.1);
  wind = createVector(0, 0);
}

function draw() {
  background(0);

  wind.set(0, 0);
  if (grabbedBall) {
    grabbedBall.drag(mouseX, mouseY);
    mouseDeltas.push(createVector(mouseX - pmouseX, mouseY - pmouseY));
    if (mouseDeltas.length > sampleNum) {
      mouseDeltas.shift();
    }
  } else if (mouseIsPressed) {
    //바람계산
    wind.set(mouseX, mouseY); //마우스 위치가
    wind.sub(width / 2, height / 2); //중앙으로부터 얼마나 떨어져 있는 지
    const windMag = wind.mag();
    const normalizedWindMag = windMag / (0.5 * width);
    wind.setMag(1000 * normalizedWindMag); //바람 세기
  }

  balls.forEach((aBall) => {
    aBall.applyForce(wind);
    aBall.applyGravity(gravity);
    aBall.update();
    aBall.resoveWallCollision();
  });

  if (!grabbedBall) {
    hoveredBall = null;
    for (let idx = balls.length - 1; idx >= 0; idx--) {
      const aBall = balls[idx];
      if (aBall.isMouseInside(mouseX, mouseY)) {
        hoveredBall = aBall;
        break;
      }
    }
  }

  balls.forEach((aBall) => {
    aBall.show(aBall === hoveredBall);
    aBall.showDebug();
  });

  stroke("white"); //바람 방향 시각화
  line(0.5 * width, 0.5 * height, 0.5 * width + wind.x, 0.5 * height + wind.y);
}

function mousePressed() {
  if (keyIsPressed && key === "Shift") {
    balls.forEach((aBall) => {
      const randomSpeed = Math.random() * 9 + 1;
      aBall.init(mouseX, mouseY, randomSpeed);
    });
  } else {
    if (hoveredBall) {
      grabbedBall = hoveredBall;
      grabbedBall.grab(mouseX, mouseY);
      mouseDeltas = [];
    }
  }
}

function mouseReleased() {
  if (grabbedBall) {
    // const vx = mouseX - pmouseX;
    // const vy = mouseY - pmouseY;
    // lastVx = vx;
    // lastVy = vy;
    // grabbedBall.ungrab(vx, vy);
    if (mouseDeltas.length > 0) {
      const averageMouseDelta = createVector(0, 0);
      mouseDeltas.forEach((aMousePos) => {
        averageMouseDelta.add(aMousePos);
      });
      averageMouseDelta.div(mouseDeltas.length);
      grabbedBall.ungrab(averageMouseDelta.x, averageMouseDelta.y);
      lastVx = averageMouseDelta.x;
      lastVy = averageMouseDelta.y;
    } else {
      grabbedBall.ungrab(0, 0);
      lastVx = 0;
      lastVy = 0;
    }
    grabbedBall = null;
  }
}
