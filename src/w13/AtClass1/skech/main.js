const sketchContainer = document.querySelector(".sketch-container");

function setup() {
  const renderer = createCanvas(600, 600);
  renderer.parent(sketchContainer);

  strokeWidth = (0.5 * width) / (strokeNum - 1);
}

let strokeNum = 50;
let strokeWidth;
let seed = 500;

function draw() {
  randomSeed(seed);
  background(255);
  stroke("#7bdbd3ff");
  strokeWeight(strokeWidth);
  drawPattern(strokeNum);
  stroke("#362c1eff");
  drawPattern(strokeNum, [random(strokeWidth), 0]);
}

function drawPattern(strokeNum = 2, begin = [0, 0], size = [width, height]) {
  if (strokeNum <= 1) return;
  const [bx, by] = begin;
  const [w, h] = size;
  for (let n = 0; n < strokeNum; n++) {
    const t = n / (strokeNum - 1);
    const x1 = w * t + bx;
    const x2 = x1;
    const y1 = 0 + by;
    const y2 = h + by;
    line(x1, y1, x2, y2);
  }
}
