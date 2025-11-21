var oSize = 25;
var maxspeed = 5;
var width = 800;
var height = 600;
var plantPop = 40; //40로 개수 고정
var preyPop = 10; //초기 노랑 개수
var predPop = 2; //초기 빨강 개수
var vision = 5 * oSize; //시야
var calPerSec = 0.5;
var fPS = 30;

// Rank in the ecosystem, diameter, vision radius, maxspeed, starting diet

plantStats = {
  //초록이
  rank: 0,
  diameter: 3, //초록크기
  visionRadius: 3, //초록 시야
  maxspeed: maxspeed * 0.1,
  startingDiet: 1,
  calorieBurnRate: calPerSec,
};

preyStats = {
  //노랑이
  rank: 1,
  diameter: oSize * 0.6,
  visionRadius: vision * 0.6,
  maxspeed: maxspeed * 0.6,
  startingDiet: 5,
  calorieBurnRate: calPerSec,
};

predStats = {
  //빨강이
  rank: 2,
  diameter: oSize,
  visionRadius: vision,
  maxspeed: maxspeed,
  startingDiet: 25,
  calorieBurnRate: calPerSec,
};

ecoStats = [plantStats, preyStats, predStats];

function setup() {
  createCanvas(windowWidth, windowHeight);
  ecosystem = new Ecosystem();
  for (var i = 0; i < plantPop; i++) {
    ecosystem.addOrganism(new Organism(ecoStats[0]));
  }
  for (var i = plantPop; i < preyPop + plantPop; i++) {
    ecosystem.addOrganism(new Organism(ecoStats[1]));
  }
  for (var i = plantPop + preyPop; i < predPop + plantPop + preyPop; i++) {
    ecosystem.addOrganism(new Organism(ecoStats[2]));
  }
  noStroke();
  smooth();
  frameRate(fPS);
}

function draw() {
  background(50);
  ecosystem.run();
}

function mousePressed() {
  var mouseVector = new p5.Vector(mouseX, mouseY);
  ecosystem.spawn(1, mouseVector);
}

function randomVector(x) {
  var tempVector = new p5.Vector(random(-x, x), random(-x, x));
  return tempVector;
}
