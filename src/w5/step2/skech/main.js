let vehicle;
let target;

function setup() {
  createCanvas(800, 600);

  vehicle = new Vehicle(width / 2, height / 2, 3, 0.1);
  target = createVector(width / 2, height / 2);
}

function draw() {
  if (mouseIsPressed) {
    target.set(mouseX, mouseY);
  }

  background(0);

  noStroke();
  fill("red");
  circle(target.x, target.y, 16);

  // vehicle.seek(target); //목표를 향해 일정속도 직진
  vehicle.arrive(target); //가까워질수록 서서히 감속
  vehicle.update();
  vehicle.show();
  vehicle.showVel();
  vehicle.showDecRad();
}
