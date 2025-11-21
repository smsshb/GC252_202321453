// ===== Main.js =====

let fishes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 물고기 여러 마리 생성
  for (let i = 0; i < 12; i++) {
    let pos = createVector(
      random(width / 0.5),
      random(height / 0.5)
    );
    fishes.push(new Fish(pos));
  }
}

function draw() {
  background(40, 44, 52);

  for (let fish of fishes) {
    fish.resolve(fishes);
    fish.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
