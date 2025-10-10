const ballNum = 5;
let pos = [];
const diameter = 100;
const speed = 5;
let vel = [];
const gravity = 0.1;
const restitution = 0.9;

function setup() {
  createCanvas(700, 800);

  for (let n = 0; n < ballNum; n++) {
    pos.push(createVector(0, 0));
    vel.push(createVector(0, 1));
  }

  init();
}

function init() {
  // pos = createVector(width / 2, height / 2);
  for (let idx = 0; idx < pos.length; idx++) {
    pos[idx].set(width / 2, height / 2);
  }
  console.log("pos", pos);
  // const randomAngle = Math.random() * 360;
  // vel = p5.Vector.fromAngle(radians(randomAngle), speed);
  vel.forEach((aVel) => {
    const randomAngle = Math.random() * 360;
    aVel.setHeading(radians(randomAngle));
    aVel.setMag(speed);
  });
  console.log("vel", vel);
}

function draw() {
  background(0);

  // 중력 적용 = 속도에 가속도(중력) 더하기
  // vel.y += gravity;
  vel.forEach((aVel) => {
    aVel.y += gravity;
  });

  // 원 위치 업데이트
  // pos.add(vel);
  for (let idx = 0; idx < ballNum; idx++) {
    const aPos = pos[idx];
    const aVel = vel[idx];
    aPos.add(aVel);
  }

  // 벽 충돌 처리
  // if (pos.x < diameter / 2 || pos.x > width - diameter / 2) {
  //   pos.x = pos.x < diameter / 2 ? diameter / 2 : width - diameter / 2;
  //   vel.x *= -restitution;
  // }
  // if (pos.y < diameter / 2 || pos.y > height - diameter / 2) {
  //   pos.y = pos.y < diameter / 2 ? diameter / 2 : height - diameter / 2;
  //   vel.y *= -restitution;
  // }
  for (let idx = 0; idx < ballNum; idx++) {
    const aPos = pos[idx];
    const aVel = vel[idx];
    if (aPos.x < diameter / 2 || aPos.x > width - diameter / 2) {
      aPos.x = aPos.x < diameter / 2 ? diameter / 2 : width - diameter / 2;
      aVel.x *= -restitution;
    }
    if (aPos.y < diameter / 2 || aPos.y > height - diameter / 2) {
      aPos.y = aPos.y < diameter / 2 ? diameter / 2 : height - diameter / 2;
      aVel.y *= -restitution;
    }
  }

  // 원 그리기
  pos.forEach((aPos) => {
    noStroke();
    fill("skyblue");
    circle(aPos.x, aPos.y, diameter);
  });

  // vel 표현
  // stroke("white");
  // line(pos.x, pos.y, pos.x + vel.x * 10, pos.y + vel.y * 10);
  // stroke("red");
  // line(pos.x, pos.y, pos.x + vel.x * 10, pos.y);
  // stroke("green");
  // line(pos.x, pos.y, pos.x, pos.y + vel.y * 10);
  for (let idx = 0; idx < ballNum; idx++) {
    const aPos = pos[idx];
    const aVel = vel[idx];
    stroke("white");
    line(aPos.x, aPos.y, aPos.x + aVel.x * 10, aPos.y + aVel.y * 10);
    stroke("red");
    line(aPos.x, aPos.y, aPos.x + aVel.x * 10, aPos.y);
    stroke("green");
    line(aPos.x, aPos.y, aPos.x, aPos.y + aVel.y * 10);
  }
}

function mousePressed() {
  init();
}
