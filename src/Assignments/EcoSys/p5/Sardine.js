// p5/Sardine.js
class Sardine {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.r = random(6, 12);
    this.maxSpeed = 3;
    this.maxForce = 0.05;
    this.visionRadius = 200;

    this.colour = "#84a1deff";
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  flee(target) {
    const desired = p5.Vector.sub(this.pos, target);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  // 정어리끼리 군집
  flock(others) {
    const sep = this.separation(others).mult(1.5);
    const ali = this.alignment(others).mult(1.0);
    const coh = this.cohesion(others).mult(0.8);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  separation(others) {
    const desiredSeparation = this.r * 2.5;
    const steer = createVector(0, 0);
    let count = 0;

    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < desiredSeparation) {
        const diff = p5.Vector.sub(this.pos, o.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  alignment(others) {
    const neighbordist = this.r * 6;
    const sum = createVector(0, 0);
    let count = 0;
    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < neighbordist) {
        sum.add(o.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(others) {
    const neighbordist = this.r * 6;
    const sum = createVector(0, 0);
    let count = 0;
    for (const o of others) {
      const d = this.pos.dist(o.pos);
      if (o !== this && d > 0 && d < neighbordist) {
        sum.add(o.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // 평균 위치
      return this.steerTo(sum);
    }
    return createVector(0, 0);
  }

  steerTo(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // 큰 물고기만 피함
  evadeBigFish(bigFishArray, prediction = 20) {
    let closest = null;
    let minDist = Infinity;
    for (const b of bigFishArray) {
      const d = this.pos.dist(b.pos);
      if (d < minDist && d < this.visionRadius) {
        minDist = d;
        closest = b;
      }
    }
    if (!closest) return;
    const predictedVel = p5.Vector.mult(closest.vel, prediction);
    const futurePos = p5.Vector.add(closest.pos, predictedVel);
    this.flee(futurePos);
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noStroke();
    fill(this.colour);

    // 길쭉한 몸통
    ellipse(0, 0, this.r * 2.4, this.r * 0.8);

    // 작은 꼬리
    beginShape();
    vertex(-this.r * 1.2, 0);
    vertex(-this.r * 1.8, this.r * 0.4);
    vertex(-this.r * 1.8, -this.r * 0.4);
    endShape(CLOSE);

    // 눈
    fill(0, 80);
    circle(this.r * 0.9, -this.r * 0.1, this.r * 0.25);

    pop();
  }
}
