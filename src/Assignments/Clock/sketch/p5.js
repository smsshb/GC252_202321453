let secondslength;
let minuteslength;
let hourslength;
let ampm = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  const length = min(width, height) / 2;
  secondslength = length * 0.75;
  minuteslength = length * 0.6;
  hourslength = length * 0.3;

  initMatter();

  createClocks(secondslength, minuteslength, hourslength);
}

function draw() {
  const am = ampm === null ? hour() < 12 : ampm;
  background(am ? 255 : 0);

  digitalClock(am);

  const s = second();
  const m = minute() + s / 60;
  const h = (hour() % 12) + m / 60;

  const secondAngle = map(s, 0, 60, 0, 360);
  const minuteAngle = map(m, 0, 60, 0, 360);
  const hourAngle = map(h, 0, 12, 0, 360);

  updateclock(clockSecond, secondslength, radians(secondAngle), mouseX, mouseY);
  updateclock(clockMinute, minuteslength, radians(minuteAngle), mouseX, mouseY);
  updateclock(clockHour, hourslength, radians(hourAngle), mouseX, mouseY);

  createAttractMouse(mouseX, mouseY);
  stepMatter();

  noStroke();
  fill(am ? 0 : 255);
  for (const o of balls) {
    circle(o.body.position.x, o.body.position.y, o.drawR * 2);
  }

  // push();
  // translate(mouseX, mouseY);

  // push();
  // rotate(secondAngle);
  // strokeWeight(10);
  // line(0, 0, 0, -secondslength);
  // pop();

  // push();
  // rotate(minuteAngle);
  // strokeWeight(15);
  // line(0, 0, 0, -minuteslength);
  // pop();

  // push();
  // rotate(hourAngle);
  // strokeWeight(25);
  // line(0, 0, 0, -hourslength);
  // pop();

  // pop();
}

function digitalClock(am) {
  const H = hour();
  const hh = H % 12 == 0 ? 12 : H % 12;
  const timeStr = nf(hh, 2) + ":" + nf(minute(), 2);

  push();
  textAlign(CENTER, CENTER);

  let ts = width;
  ts = min(ts, height * 0.55);
  textSize(ts);

  if (am) fill(240);
  else fill(25);

  noStroke();

  text(timeStr, width / 2, height / 2);
  pop();
}

function mousePressed() {
  explodeBall(mouseX, mouseY);
}

function keyPressed() {
  if (key === " ") {
    if (ampm === null) {
      ampm = !(hour() < 12);
    } else {
      ampm = !ampm;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  const length = min(width, height) / 2;
  secondslength = length * 0.6;
  minuteslength = length * 0.4;
  hourslength = length * 0.25;

  buildWalls();
}
