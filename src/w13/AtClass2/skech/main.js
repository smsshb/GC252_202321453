const sketchContainer = document.querySelector(".sketch-container");

function blendLines(
  blendNums = [1],
  lineBegins = [0, 0, 0, height],
  lineEnds = [width, 0, width, height]
  colors = ["black"]
) {
  for (let c = 0; c < blendNums.length; c++) {
    const blendNum = blendNums[c];
    const cBegin = 4 * c;
    const lineBegin = [
      lineBegins[cBegin],
      lineBegins[cBegin + 1],
      lineBegins[cBegin + 2],
      lineBegins[cBegin + 3],
    ];
    const lineEnd = [
      lineEnds[cEnd],
      lineEnds[cEnd + 1],
      lineEnds[cEnd + 2],
      lineEnds[cEnd + 3],
    ];

    const 
  }

  const [bx1, by1, bx2, by2] = lineBegin;
  const [ex1, ey1, ex2, ey2] = lineEnd;
  for (let n = 0; n < blendNum + 2; n++) {
    const t = n / (blendNum + 1);
    // 시작 + (끝 - 시작) * t  0을 넣으면 시작값, 1을 넣으면 끝값이 나옴
    const x1 = bx1 + (ex1 - bx1) * t;
    const y1 = by1 + (ey1 - by1) * t;
    const x2 = bx2 + (ex2 - bx2) * t;
    const y2 = by2 + (ey2 - by2) * t;
    line(x1, y1, x2, y2);
  }
}

function setup() {
  const renderer = createCanvas(600, 600);
  renderer.parent(sketchContainer);
}

let bx1offset = 0;
let bx2offset = 0;
let ex1offset = 0;
let ex2offset = 0;
const offsetRange = 20;
let seed = 0;

function draw() {
  randomSeed(seed);
  bx1offset = random(-offsetRange, offsetRange);
  bx2offset = random(-offsetRange, offsetRange);
  ex1offset = random(-offsetRange, offsetRange);
  ex2offset = random(-offsetRange, offsetRange);

  background(255);
  strokeWeight(5);
  blendLines(
    [50,51], 
    [0+bx1offset, 0,0+bx2offset, height,0,0,0,height],
  [width+ex1offset,0,width+ex2offset,height, width,0,width,height],["#7bdbd3","#362c1e"]);
  // stroke("#7bdbd3");
  // // blendLines(50, [0, 0, -10, height], [width, height, width, 0]);
  // blendLines(
  //   50,
  //   [0, 0 + bx1offset, 0, 0 + bx2offset],
  //   [width + ex1offset, 0, width + ex2offset, height]
  // );
  // stroke("#362c1e");
  // blendLines(51);
}

function mousePressed() {
  seed++;
}
