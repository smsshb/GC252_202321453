let vehicle;
let target;
const seed = 0;

function setup() {
  createCanvas(800, 600);

  randomSeed(seed);

  vehicle = new Vehicle(random(width), random(height));
  target = createVector(width * 0.5, height * 0.5);
}

function draw() {
  if (mouseIsPressed) {
    target.set(mouseX, mouseY);
  }
  background(0);
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 16);
  vehicle.flee(target);
  vehicle.update();
  vehicle.wrapCoordinates();
  vehicle.show();
}
