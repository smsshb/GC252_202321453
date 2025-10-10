const palette = ["#134686", "#ED3F27", "#FEB21A", "#FDF4E3"];

const ballNum = 5;
const balls = [];
const diameter = 100;
const speed = 5;
const gravity = 0.1;
const restitution = 0.5;

let hoveredBall = null;
let grabbedBall = null;

// step7 new 변수들
let lastVx = 0; //마지막 던졌을 때의 속도
let lastVy = 0; //마지막 던졌을 때의 속도
const sampleNum = 10; // 저장할 표본 개수 (최근 10프레임)
let mouseDeltas = []; // 최근 마우스 이동 거리(=속도 벡터)를 저장하는 array

function setup() {
  createCanvas(700, 800);

  for (let n = 0; n < ballNum; n++) {
    const randomDiameter = Math.random() * 150 + 50;
    const randomSpeed = Math.random() * 9 + 1;
    const randomPaletteIdx = Math.floor(Math.random() * palette.length);
    const randomColour = palette[randomPaletteIdx];
    balls.push(new Ball(randomDiameter, randomSpeed, randomColour));
  }
}

function draw() {
  background(0);

  if (grabbedBall) {
    grabbedBall.drag(mouseX, mouseY);
    mouseDeltas.push(createVector(mouseX - pmouseX, mouseY - pmouseY));
    if (mouseDeltas.length > sampleNum) {
      mouseDeltas.shift();
    }
  }

  balls.forEach((aBall) => {
    aBall.applyGravity();
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

  strokeWeight(1);
  stroke("white");
  line(width * 0.5, height * 0.5, width * 0.5 + lastVx, height * 0.5 + lastVy);
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
  //던지는 기능!!
  if (grabbedBall) {
    if (mouseDeltas.length > 0) {
      const averageMouseDelta = createVector(0, 0);
      mouseDeltas.forEach((aMousePos) => {
        averageMouseDelta.add(aMousePos);
      }); // mouseDeltas에 저장된 최근 마우스 이동값들을 모두 더함
      averageMouseDelta.div(mouseDeltas.length); // 평균을 내 최근 움직임의 평균 속도를 구함
      grabbedBall.ungrab(averageMouseDelta.x, averageMouseDelta.y); // 그 평균값을 ungrab(vx, vy)에 전달 → 공의 속도로 적용
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
