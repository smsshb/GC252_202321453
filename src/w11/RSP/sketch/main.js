const canvasContainer = document.getElementById("canvas-container");

let cellSize;
const cellsPerRow = 50;
let cellsPerColumn;
const cells = [];
let hoveredCell = null;

let flagStop = false;
const interval = 50;
let lastMs = 0;

let gen = 0;

const seed = 1;

function setup() {
  const renderer = createCanvas(600, 700);
  renderer.parent(canvasContainer);

  randomSeed(seed);

  cellSize = width / cellsPerRow;
  cellsPerColumn = cellsPerRow;
  for (let idx = 0; idx < cellsPerRow * cellsPerColumn; idx++) {
    const col = idx % cellsPerRow;
    const row = Math.floor(idx / cellsPerRow);
    const x = col * cellSize + 0.5 * width - 0.5 * cellsPerRow * cellSize;
    const y = row * cellSize;
    const rand = random();
    const state = rand < 1 / 3 ? "R" : rand < 2 / 3 ? "P" : "S";
    cells.push(new Cell([x, y], [cellSize, cellSize], state));
  }

  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / cellsPerRow);
    const col = idx % cellsPerRow;

    const t = row > 0 ? cells[idx - cellsPerRow] : null;
    const l = col > 0 ? cells[idx - 1] : null;
    const r = col < cellsPerRow - 1 ? cells[idx + 1] : null;
    const b = row < cellsPerColumn - 1 ? cells[idx + cellsPerRow] : null;

    const neighbors = [t, l, r, b];

    cell.setNeighbors(neighbors);
  });
  console.log(cells);
}

function draw() {
  if (millis() - lastMs > interval && !flagStop) {
    lastMs = millis();
    cells.forEach((cell) => cell.computeNextState());
    cells.forEach((cell) => cell.updateState());
    gen++;
  }
  background(220);

  cells.forEach((cell) => cell.render(hoveredCell === cell));

  fill("black");
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Generation: ${gen}`, 10, 10);

  const rockCnt = cells.filter((cell) => cell.state === "R").length;
  const paperCnt = cells.filter((cell) => cell.state === "P").length;
  const scissorsCnt = cells.length - rockCnt - paperCnt;
  noStroke();
  fill("#04ffee");
  rect(0, width, (width * rockCnt) / cells.length, 100);
  fill("#f2aad3");
  rect(
    (width * rockCnt) / cells.length,
    width,
    (width * paperCnt) / cells.length,
    100
  );
  fill("#4e360f");
  rect(
    (width * (rockCnt + paperCnt)) / cells.length,
    width,
    (width * scissorsCnt) / cells.length,
    100
  );

  fill("black");
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text(
    `${((rockCnt / cells.length) * 100).toFixed(2)}%`,
    ((width * rockCnt) / cells.length) * 0.5,
    width + 50
  );
  text(
    `${((paperCnt / cells.length) * 100).toFixed(2)}%`,
    ((width * paperCnt) / cells.length) * 0.5 +
      (width * rockCnt) / cells.length,
    width + 50
  );
  text(
    `${((scissorsCnt / cells.length) * 100).toFixed(2)}%`,
    ((width * scissorsCnt) / cells.length) * 0.5 +
      (width * (rockCnt + paperCnt)) / cells.length,
    width + 50
  );
}

function mouseMoved() {
  hoveredCell = null;
  for (let idx = 0; idx < cells.length; idx++) {
    if (cells[idx].isHovered(mouseX, mouseY)) {
      hoveredCell = cells[idx];
      break;
    }
  }
}

function mousePressed() {
  if (hoveredCell) {
    hoveredCell.toggleState();
  }
}

function keyPressed() {
  if (key === " ") {
    flagStop = !flagStop;
    lastMs = millis();
  } else if (key === "ArrowRight") {
    if (!flagStop) return;
    cells.forEach((cell) => cell.computeNextState());
    cells.forEach((cell) => cell.updateState());
    gen++;
    lastMs = millis();
  } else if (key === "ArrowLeft") {
    randomSeed(seed);
    for (let idx = 0; idx < cellsPerRow * cellsPerColumn; idx++) {
      const col = idx % cellsPerRow;
      const state = random(["R", "P", "S"]);
      cells[idx].state = state;
    }
    gen = 0;
  }
}
