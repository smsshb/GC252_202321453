let animal;
let mouse;
const showFlags = [
  false,
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];

function setup() {
  createCanvas(600, 800);

  animal = new Animal(
    width / 2,
    height / 4,
    25,
    [radians(160), radians(210)],
    // [40, 60, 30, 60, 30, 60, 30, 60, 30, 15, 7.5, 3]
    // [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64]
    // [
    //   30, 45, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35,
    //   35, 35, 35, 35, 30, 25, 20, 15,
    // ]
    [68, 82, 86, 85, 76, 60, 40, 28, 20, 15]
  );

  mouse = createVector(width / 2, height / 4);
}

function draw() {
  background(0);

  if (mouseIsPressed) {
    mouse.set(mouseX, mouseY);
  }

  animal.setHeadPos(mouse);
  animal.update();
  if (showFlags[0]) animal.showSpine();
  if (showFlags[1]) animal.showDistConstraint();
  if (showFlags[2]) animal.showThickness();
  if (showFlags[3]) {
    animal.showPtOnThicknessCW();
    animal.showPtOnThicknessCCW();
  }
  if (showFlags[4]) {
    animal.showBodyShape();
    animal.showEyes();
  }
}

function keyPressed() {
  const num = parseInt(key);
  if (!isNaN(num)) {
    showFlags[num] = !showFlags[num];
  }
}
