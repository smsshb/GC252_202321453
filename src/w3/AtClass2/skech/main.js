const palette = ["#B7C4CF", "#EEE3CB", "#D7C0AE", "#967E76"];

let ps = [];

function setup() {
  createCanvas(500, 400);

  for (let n = 0; n < 2000; n++) {}

  ps.push(new Particle(random(width), random(height), 20));
}

function draw() {
  background(127);
  ps.drawRect();
  // for (let idx = 0; idx < ps.length; idx++) {
  //   const aParticle = ps[idx];
  //   aParticle.drawRect();
  // }
  for (const aParticle of ps) {
    aParticle.drawRect();
  }
  ps.forEach((aParticle, idx) => {
    aParticle.drawRect();
  });
}
