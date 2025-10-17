const evaders = [];
const numEvaders = 5;
const pursuers = [];
const numPursuers = 2;
const seed = 0;

function setup() {
  createCanvas(800, 600);

  //랜덤 위치에 evaders와 pursuers를 생성
  randomSeed(seed);

  for (let n = 0; n < numEvaders; n++) {
    evaders.push(new Evader(random(width), random(height)));
  }
  for (let n = 0; n < numPursuers; n++) {
    pursuers.push(new Pursuer(random(width), random(height)));
  }
}

function draw() {
  background(0);

  for (const evader of evaders) {
    evader.update();
    evader.evade(pursuers); //입력되는 pursuers에 맞춰 피하기
    evader.separate(evaders); //evaders생성
    evader.wrapCoordinates(); //캔버스 밖으로 나가면 반대로 나오게
    evader.show();
  }

  for (const pursuer of pursuers) {
    pursuer.update();
    pursuer.pursue(evaders);
    pursuer.separate(pursuers);
    pursuer.wrapCoordinates();
    pursuer.show();
    pursuer.showTarget();
  }
}
