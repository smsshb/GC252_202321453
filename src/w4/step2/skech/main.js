// let x, y;
let pos;
const diameter = 100;
const speed = 5;
// let velX, velY;
let vel;
const gravity = 0.1;
const restitution = 0.8;

function setup() {
  createCanvas(600, 700);
  init();
}

function init() {
  // x = width / 2;
  // y = height / 2;
  pos = createVector(width / 2, height / 2);
  console.log("pos", pos);
  console.log("pos.x, pos.y", pos.x, pos.y);
  const randomAngle = Math.random() * 360;
  // velX = speed * cos(radians(randomAngle));
  // velY = speed * sin(radians(randomAngle));
  vel = p5.Vector.fromAngle(radians(randomAngle), speed);
  console.log("vel", vel);
  console.log("vel.x, vel.y", vel.x, vel.y);
}

function draw() {
  background(0);

  // 중력 적용 = 속도+가속도(중력)
  // velY += gravity;
  vel.y += gravity;

  // 원 위치 업데이트
  // x += velX;
  // y += velY;
  pos.add(vel);

  // 벽 충돌처리
  // if (x < diameter / 2 || x > width - diameter / 2) {
  //   x = x < diameter / 2 ? diameter / 2 : width - diameter / 2;
  //   velX *= -1;
  // }
  // if (y < diameter / 2 || y > height - diameter / 2) {
  //   y = y < diameter / 2 ? diameter / 2 : height - diameter / 2;
  //   velY *= -restitution;
  // }
  if (pos.x < diameter / 2 || pos.x > width - diameter / 2) {
    pos.x = pos.x < diameter / 2 ? diameter / 2 : width - diameter / 2;
    vel.x *= -restitution;
  }
  if (pos.y < diameter / 2 || pos.y > height - diameter / 2) {
    pos.y = pos.y < diameter / 2 ? diameter / 2 : height - diameter / 2;
    vel.y *= -restitution;
  }

  // 원 그리기
  noStroke();
  fill("skyblue");
  // circle(x, y, diameter);
  circle(pos.x, pos.y, diameter);

  // vel 표현 (원 위에)
  stroke("white");
  line(pos.x, pos.y, pos.x + vel.x * 10, pos.y + vel.y * 10);
  stroke("red");
  line(pos.x, pos.y, pos.x + vel.x * 10, pos.y);
  stroke("green");
  line(pos.x, pos.y, pos.x, pos.y + vel.y * 10);
}

function mousePressed() {
  init();
}
