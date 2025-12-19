const canvasContainer = document.getElementById("canvas-container");
let renderer;

const INITIAL_W = 800;
const INITIAL_H = 600;
const INITIAL_RATIO = INITIAL_W / INITIAL_H;

const cellsPerRow = 80; //한 줄에 몇개의 칸
let cellsPerColumn;
const cells = [];
let cellSize;

let hoveredCell = null;

function getIdx(r, c) {
  return r * cellsPerRow + c;
}

let lastTime = 0;
const interval = 250;

function setup() {
  renderer = createCanvas(INITIAL_W, INITIAL_H);
  renderer.parent(canvasContainer);
  renderer.elt.style.aspectRatio = `${INITIAL_W} / ${INITIAL_H}`;

  new ResizeObserver(() => {
    const { width: containerWidth, height: containerHeight } =
      canvasContainer.getBoundingClientRect();
    renderer.elt.style.width = `${containerWidth}px`;
    renderer.elt.style.height = `${containerWidth / INITIAL_RATIO}px`;
  }).observe(canvasContainer);

  cellSize = width / cellsPerRow;
  cellsPerColumn = Math.floor(height / cellSize);

  for (let r = 0; r < cellsPerColumn; r++) {
    for (let c = 0; c < cellsPerRow; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const randomState = random() < 0.1;
      const newCell = new Cell(x, y, cellSize, cellSize, randomState);
      cells.push(newCell);
    }
  }

  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / cellsPerRow);
    const col = idx % cellsPerRow;
    const tl = row > 0 && col > 0 ? cells[getIdx(row - 1, col - 1)] : null;
    const t = row > 0 ? cells[getIdx(row - 1, col)] : null;
    const tr =
      row > 0 && col < cellsPerRow - 1 ? cells[getIdx(row - 1, col + 1)] : null;
    const r = col < cellsPerRow - 1 ? cells[getIdx(row, col + 1)] : null;
    const br =
      row < cellsPerColumn - 1 && col < cellsPerRow - 1
        ? cells[getIdx(row + 1, col + 1)]
        : null;
    const b = row < cellsPerColumn - 1 ? cells[getIdx(row + 1, col)] : null;
    const bl =
      row < cellsPerColumn - 1 && col > 0
        ? cells[getIdx(row + 1, col - 1)]
        : null;
    const l = col > 0 ? cells[getIdx(row, col - 1)] : null;
    cell.setNeighbors(tl, t, tr, r, br, b, bl, l);
  });
}

function draw() {
  background(250);
  cells.forEach((aCell) => {
    aCell.computeNextState();
  });

  if (millis() - lastTime > interval) {
    cells.forEach((aCell) => {
      aCell.updateState();
    });
    lastTime = millis();
  }

  cells.forEach((cell) => cell.render(cell === hoveredCell));
}

function mouseMoved() {
  hoveredCell = null;
  for (let idx = 0; idx < cells.length; idx++) {
    if (cells[idx].isHovered(mouseX, mouseY)) {
      hoveredCell = cells[idx];
      break;
    }
  }
  // console.log(hoveredCell);
}

function mousePressed() {
  hoveredCell?.toggleState();
}
