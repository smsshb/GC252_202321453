const sketchContainer = document.querySelector(".sketch-container");
console.log(sketchContainer);

const tileImgs = [];

const tiles = [];
const tilePerRow = 15;
let tileSize;
let tilePerCol;

function preload() {
  for (let n = 0; n < 16; n++) {
    const urlString = `./assets/${String(n).padStart(2, "0")}.svg`;
    tileImgs.push(loadImage(urlString));
  }
  //   const img = loadImage("./assets/00.svg");
  //   tileImgs.push(img);
}

function tileIdx(col, row) {
  return row * tilePerRow + col;
}

function setup() {
  const renderer = createCanvas(1200, 800);
  renderer.parent(sketchContainer);

  tileSize = width / tilePerRow;
  tilePerCol = Math.floor(height / tileSize);

  for (let r = 0; r < tilePerCol; r++) {
    for (let c = 0; c < tilePerRow; c++) {
      const x = c * tileSize;
      const y = r * tileSize;
      const randomState = random() < 0.5;
      const newTile = new Tile(x, y, tileSize, tileSize, randomState);
      tiles.push(newTile);
    }
  }

  tiles.forEach((aTile, idx) => {
    const col = idx % tilePerRow;
    const row = Math.floor(idx / tilePerRow);

    const t = row > 0 ? tiles[tileIdx(col, row - 1)] : null;
    const l = col > 0 ? tiles[tileIdx(col - 1, row)] : null;
    const b = row < tilePerCol - 1 ? tiles[tileIdx(col, row + 1)] : null;
    const r = col < tilePerRow - 1 ? tiles[tileIdx(col + 1, row)] : null;

    aTile.setNeighbor(t, l, b, r);
  });

  tiles.forEach((aTile) => {
    aTile.computeStates();
  });
}
function draw() {
  background(230);
  tiles.forEach((aTile) => {
    aTile.render(tileImgs);
  });

  // circle(mouseX, mouseY, 50);
  // image(tileImgs[0], mouseX, mouseY, 50, 50);
}
