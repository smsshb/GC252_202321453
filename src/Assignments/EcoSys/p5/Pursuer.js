class Pursuer {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.r = options?.r || random(35, 45);
    this.colour = options?.colour || "#172a54";

    this.maxSpeed = options?.maxSpeed || 2.2;
    this.maxForce = options?.maxForce || 0.05;

    this.shape = new Fish(this.r, this.colour, {
      bodyWidthMultiplier: 6, // 길이
      bodyHeightMultiplier: 0.25, // 두께
      bodyHeightOffset: 0.5, // 두께
      tailWidthMultiplier: 0.3, // 꼬리 폭
      tailHeightMultiplier: 0.5, // 꼬리 높이
      bodyFinWidthMultiplier: 0.4,
      bodyFinHeightMultiplier: 1.5,
      tailFinWidthMultiplier: 0.8,
      tailFinHeightMultiplier: 0.1,
      eyeSizeMultiplier: 0.1, //눈
      hasDorsalFin: true,
      dorsalColor: "#233b6eff",
      dorsalWidthMultiplier: 0.9,
      dorsalHeightMultiplier: 0.3,
    });
  }

  findClosestEvader(evaders) {
    let closest = null;
    let minDist = Infinity;
    for (const e of evaders) {
      const d = this.pos.dist(e.pos);
      if (d < minDist) {
        minDist = d;
        closest = e;
      }
    }
    return closest;
  }

  // 상어끼리 가까우면 멀어지도록
  separate(others) {
    for (const e of others) {
      if (e !== this) {
        const d = this.pos.dist(e.pos);
        const sum = createVector(0, 0);
        if (d > 0 && d < this.r * 2.5) {
          const towardMe = p5.Vector.sub(this.pos, e.pos);
          towardMe.div(d);
          sum.add(towardMe);
        }
        if (sum.mag() > 0) {
          sum.setMag(this.maxSpeed);
          sum.add(this.pos);
          this.seek(sum);
        }
      }
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  // 중간 물고기 추격
  pursue(evaders, prediction = 30) {
    const closest = this.findClosestEvader(evaders);
    if (!closest) return;
    const predictedVel = p5.Vector.mult(closest.vel, prediction);
    const futurePos = p5.Vector.add(closest.pos, predictedVel);
    this.seek(futurePos);
  }

  // 중간 물고기를 먹기
  eatEvaders(evaders) {
    for (let i = evaders.length - 1; i >= 0; i--) {
      const e = evaders[i];
      const d = this.pos.dist(e.pos);
      if (d < e.r * 0.8) {
        evaders.splice(i, 1);
      }
    }
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    this.shape.update(this.vel);
    this.shape.render(this.pos);
  }
}
