const palette = ["#B7C4CF", "#EEE3CB", "#D7C0AE", "#967E76"];
let x, y;
let w, h;
let angle;
let colour;
const area = 30;

function setup() {
  createCanvas(500, 400);
}

function drawRect() {
  fill(colour);
  noStroke();
  push();
  translate(x, y);
  rotate(radians(angle));
  rect(-0.5 * w, -0.5 * h, w, h);
  pop();
}

function draw() {
  randomSeed(0);
  background(127);
  for (let n = 0; n < 500; n++) {
    x = random(width);
    y = random(height);
    w = random(2, area);
    h = area / w;
    angle = random(360);
    let paletteIdx = floor(random(palette.length));
    colour = palette[paletteIdx];
    drawRect();
  }
}
