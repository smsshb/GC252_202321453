let mosses = [];
let midFish = []; // 중간물고기
let bigFish = []; // 상어
let sardines = []; // 정어리

function setup() {
  const seed = random();
  let pondWidth = window.innerWidth;
  let pondHeight = window.innerHeight;

  createCanvas(pondWidth, pondHeight);

  // 상어
  const numBigFish = int(2);
  for (let i = 0; i < numBigFish; i++) {
    bigFish.push(
      new Pursuer(random(width), random(height), {
        r: random(90, 100), // 크기
        maxSpeed: 5,
        maxForce: 0.05,
        colour: "#172a54",
      })
    );
  }

  // 중간 물고기
  const numMidFish = int(random(4, 5)); //4-5마리
  for (let i = 0; i < numMidFish; i++) {
    midFish.push(
      new Evader(random(width), random(height), {
        r: random(20, 35), //크기
        maxSpeed: 5,
        maxForce: 0.2,
      })
    );
  }

  // 정어리 떼
  const numSardines = int(random(100, 140));
  for (let i = 0; i < numSardines; i++) {
    sardines.push(new Sardine(random(width), random(height)));
  }

  // 이끼
  const numMosses = int(random(80, 100));
  for (let i = 0; i < numMosses; i++) {
    mosses.push(new Moss(random(width), random(height)));
  }
}

function draw() {
  background("#2d4985");

  // 중간 물고기
  for (const f of midFish) {
    // 상어 먼저 피하기
    f.evade(bigFish);

    // 이끼 먹기 & 이끼 쪽으로 이동
    f.eatMoss(mosses, bigFish);

    // 같은 중간 물고기끼리 뭉치기 + 너무 가까우면 떨어지기
    f.cohesion(midFish);
    f.separate(midFish);

    // 랜덤 움직임
    f.wander();

    f.update();
    f.wrapCoordinates();
    f.show();
  }

  // 정어리
  for (const s of sardines) {
    // 자기들끼리 군집
    s.flock(sardines);
    // 상어 피하기
    s.evadeBigFish(bigFish);
    s.update();
    s.wrapCoordinates();
    s.show();
  }

  // 이끼
  for (const s of mosses) {
    // 자기들끼리 군집
    s.flock(mosses);
    s.update();
    s.wrapCoordinates();
    s.show();
  }

  // 상어
  for (const b of bigFish) {
    // 중간 물고기 쫓기
    b.pursue(midFish);
    // 상어끼리 거리 유지 (여러마리 일 때)
    b.separate(bigFish);
    // 중간 물고기 먹기
    b.eatEvaders(midFish);
    b.update();
    b.wrapCoordinates();
    b.show();
  }
}
