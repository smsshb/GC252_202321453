const palette = ["#134686", "#ED3F27", "#FEB21A", "#FDF4E3"];

const ballNum = 5;
const balls = [];
const diameter = 100;
const speed = 5;
const gravity = 0.1;
const restitution = 0.9;

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

  balls.forEach((aBall) => {
    aBall.applyGravity();
    aBall.update();
    aBall.resoveWallCollision();
    aBall.setMouseInside(mouseX, mouseY);
    aBall.show();
    aBall.showDebug();
  });
}

function mousePressed() {
  balls.forEach((aBall) => {
    const randomSpeed = Math.random() * 9 + 1;
    aBall.init(mouseX, mouseY, randomSpeed);
  });
}
